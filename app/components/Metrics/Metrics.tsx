import React, { useEffect, useState, useRef } from 'react';
import { useDataContext } from '../../context/DataContext';
import { useFetchEthUSD } from '../../lib/fetchEthUsdClient';

const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};

const Metrics: React.FC = () => {
  const { state } = useDataContext();
  const fetchEthUSD = useFetchEthUSD();
  const [metrics, setMetrics] = useState<{ 
    totalProtectedTxes: number | null, 
    totalProtectedUsers: number | null,
    totalProtectedDexVolume: number | null }
  >({ totalProtectedTxes: null, totalProtectedUsers: null, totalProtectedDexVolume: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dynamicVolume, setDynamicVolume] = useState<number>(0);
  const [dynamicTxes, setDynamicTxes] = useState<number>(0);
  const [dynamicUsers, setDynamicUsers] = useState<number>(0);
  const [showTxOverlay, setTxShowOverlay] = useState<boolean>(false);
  const [showUserOverlay, setUserShowOverlay] = useState<boolean>(false);
  const [showDexOverlay, setDexShowOverlay] = useState<boolean>(false);

  const calculationDone = useRef(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/fetch-dune');
        const { result1, result2 } = await response.json();

        if (result1 && result2) {
          setMetrics({
            totalProtectedTxes: result1.result.rows[0].num_protect_tx_hash,
            totalProtectedUsers: result1.result.rows[0].num_protect_user,
            totalProtectedDexVolume: result2.result.rows[0].total_volume,
          });
          setDynamicVolume(result2.result.rows[0].total_volume);
          setDynamicTxes(result1.result.rows[0].num_protect_tx_hash);
          setDynamicUsers(result1.result.rows[0].num_protect_user);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    const calculateDynamicVolume = async () => {
      if (state.data.length > 0 && !calculationDone.current) {
        const dailySums: number[] = [];
        const dataByDate: { [key: string]: number[] } = {};

        state.data.forEach((d: any) => {
          const date = d.date;
          const value = parseFloat(d.refund_value_eth);
          if (!isNaN(value)) {
            if (!dataByDate[date]) {
              dataByDate[date] = [];
            }
            dataByDate[date].push(value);
          }
        });

        for (const date in dataByDate) {
          const dailySum = dataByDate[date].reduce((sum, value) => sum + value, 0);
          dailySums.push(dailySum);
        }

        const medianRefundValueEth = calculateMedian(dailySums);

        const today = new Date().toISOString().split('T')[0];
        const ethUsdPriceToday = await fetchEthUSD(today);

        if (!medianRefundValueEth || !ethUsdPriceToday) {
          console.error('Missing values for dynamic volume calculation.');
          return;
        }

        const medianRefundValueUsd = medianRefundValueEth * ethUsdPriceToday;

        // use latest data (as oppose to 30 day median) for txes + users
        const latestDate = new Date();
        latestDate.setDate(latestDate.getDate() - 2); // data from datasets is often 2 days old
        const latestDateString = latestDate.toISOString().split('T')[0];
        const latestData = state.data.filter((d: any) => d.date === latestDateString);
        
        const intervalTiming = 12 // for 12s slots
        const numTxes = latestData.length;
        const txesPerSlot = numTxes / 3600 * intervalTiming

        const uniqueUsers = new Set(latestData.map((d: any) => d.user_tx_from)).size;
        const usersPerSlot = uniqueUsers / 3600 * intervalTiming

        console.log("For the curious console hunter, our txes seen per slot are: ", txesPerSlot," and our unique users per slot are: ", usersPerSlot)
        
        // atm, we see ~1.14 txes per slot and 0.63 unique users. For now, then, we'll estimate this
        // and increase txes by 1 every slot and users by 1 every second slot. Check these numbers every so often.
        const interval = setInterval(() => {
          setDynamicVolume((prevVolume) => prevVolume + medianRefundValueUsd / 3600 * intervalTiming);
          setDynamicTxes((prevTxes) => prevTxes + 1)
        }, intervalTiming * 1000);

        // and increase num unique users separately
        const usersInterval = setInterval(() => {
          setDynamicUsers((prevUsers) => prevUsers + 1);
        }, intervalTiming * 2000);

        calculationDone.current = true;

        return () => {
          clearInterval(interval);
          clearInterval(usersInterval);
        };
      }
    };

    calculateDynamicVolume();
  }, [state.data]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'Loading...';
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="absolute top-[460px] left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row justify-around w-4/5 md:w-full max-w-[1200px]" style={{ zIndex: '1' }}>
      <div className="relative group bg-brink border-2 border-durple rounded-lg p-2 md:p-5 text-center w-full md:w-1/3 mx-2 mb-4 md:mb-0">
        <div className="absolute top-0 right-0 mt-1 mr-1">
          <button onClick={() => setTxShowOverlay(true)} className="text-white text-sm bg-durple rounded-full w-6 h-6 flex items-center justify-center">i</button>
        </div>
        {showTxOverlay && (
          <div className="absolute inset-0 bg-durple text-white text-xs flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ease-in-out">
            <p>Many txes are sent to multiple RPCs, so this does not necessarily represent transactions solely protected by Flashbots.</p>
            <button onClick={() => setTxShowOverlay(false)} className="absolute top-2 right-2 text-white">x</button>
          </div>
        )}
        <h3 className="mb-2 text-sm md:text-lg font-semibold text-durple">Total Transactions</h3>
        <p className="text-md md:text-2xl font-bold text-spurple">{loading ? 'Loading...' : dynamicTxes.toLocaleString('en-US')}</p>
      </div>
      <div className="relative group bg-brink border-2 border-durple rounded-lg p-2 md:p-5 text-center w-full md:w-1/3 mx-2 mb-4 md:mb-0">
        <div className="absolute top-0 right-0 mt-1 mr-1">
          <button onClick={() => setUserShowOverlay(true)} className="text-white text-sm bg-durple rounded-full w-6 h-6 flex items-center justify-center">i</button>
        </div>
        {showUserOverlay && (
          <div className="absolute inset-0 bg-durple text-white text-xs flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ease-in-out">
            <p>The same caveat applies as for txes. Check our methodology on <a className='text-brink underline' href="https://dune.com/flashbots/flashbots-protect-mevshare" target="_blank" rel="noopener noreferrer">Dune</a>.</p>
            <button onClick={() => setUserShowOverlay(false)} className="absolute top-2 right-2 text-white">x</button>
          </div>
        )}
        <h3 className="mb-2 text-sm md:text-lg font-semibold text-durple">Total Users</h3>
        <p className="text-md md:text-2xl font-bold text-spurple">{loading ? 'Loading...' : dynamicUsers.toLocaleString('en-US')}</p>
      </div>
      <div className="relative group bg-brink border-2 border-durple rounded-lg p-2 md:p-5 text-center w-full md:w-1/3 mx-2">
        <div className="absolute top-0 right-0 mt-1 mr-1">
          <button onClick={() => setDexShowOverlay(true)} className="text-white text-sm bg-durple rounded-full w-6 h-6 flex items-center justify-center">i</button>
        </div>
        {showDexOverlay && (
          <div className="absolute inset-0 bg-durple text-white text-xs flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ease-in-out">
            <p>Check our methodology on <a className='text-brink underline' href="https://dune.com/flashbots/flashbots-protect-mevshare" target="_blank" rel="noopener noreferrer">Dune</a>.</p>
            <button onClick={() => setDexShowOverlay(false)} className="absolute top-2 right-2 text-white">x</button>
          </div>
        )}
        <h3 className="mb-2 text-sm md:text-lg font-semibold text-durple">DEX Volume</h3>
        <p className="text-sm md:text-2xl font-bold text-spurple">{loading ? 'Loading...' : formatCurrency(dynamicVolume)}</p>
      </div>
    </div>
  );
};

export default Metrics;