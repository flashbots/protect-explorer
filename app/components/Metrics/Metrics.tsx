import React, { useEffect, useState } from 'react';
import { useDataContext } from '../../context/DataContext';
import { useFetchEthUSD } from '../../lib/fetchEthUSD';

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
    totalProtectedDexVolume: number | null }>
  ({ totalProtectedTxes: null, totalProtectedUsers: null, totalProtectedDexVolume: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dynamicVolume, setDynamicVolume] = useState<number>(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const result1 = await fetch(`https://api.dune.com/api/v1/query/3396976/results`, {
          headers: {
            'X-Dune-API-Key': process.env.NEXT_PUBLIC_DUNE_API_KEY || '',
          },
        }).then(res => res.json());

        const result2 = await fetch(`https://api.dune.com/api/v1/query/3397208/results`, {
          headers: {
            'X-Dune-API-Key': process.env.NEXT_PUBLIC_DUNE_API_KEY || '',
          },
        }).then(res => res.json());

        if (result1 && result2) {
          setMetrics({
            totalProtectedTxes: result1.result.rows[0].num_protect_tx_hash,
            totalProtectedUsers: result1.result.rows[0].num_protect_user,
            totalProtectedDexVolume: result2.result.rows[0].total_volume,
          });
          setDynamicVolume(result2.result.rows[0].total_volume); 
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
      if (state.data.length > 0) {
        const refundValues = state.data.map((d: any) => parseFloat(d.refund_value_eth)).filter((v: any) => !isNaN(v));
        const medianRefundValueEth = calculateMedian(refundValues);

        const today = new Date().toISOString().split('T')[0];
        const ethUsdPriceToday = await fetchEthUSD(today);

        if (!medianRefundValueEth || !ethUsdPriceToday) {
          console.error('Missing values for dynamic volume calculation.');
          return;
        }

        const medianRefundValueUsd = medianRefundValueEth * ethUsdPriceToday;

        const interval = setInterval(() => {
          setDynamicVolume((prevVolume) => prevVolume + medianRefundValueUsd / 3600);
        }, 1000);

        return () => clearInterval(interval);
      }
    };

    calculateDynamicVolume();
  }, [state.data, fetchEthUSD]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'Loading...';
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="absolute top-[460px] left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row justify-around w-4/5 md:w-full max-w-[1200px]" style={{ zIndex: '1' }}>
      <div className="bg-brink border-2 border-durple rounded-lg p-2 md:p-5 text-center w-full md:w-1/3 mx-2 mb-4 md:mb-0">
        <h3 className="mb-2 text-sm md:text-lg font-semibold text-durple">Total Txes Protected</h3>
        <p className="text-md md:text-2xl font-bold text-spurple">{loading ? 'Loading...' : metrics.totalProtectedTxes?.toLocaleString('en-US')}</p>
      </div>
      <div className="bg-brink border-2 border-durple rounded-lg p-2 md:p-5 text-center w-full md:w-1/3 mx-2 mb-4 md:mb-0">
        <h3 className="mb-2 text-sm md:text-lg font-semibold text-durple">Total Users Protected</h3>
        <p className="text-md md:text-2xl font-bold text-spurple">{loading ? 'Loading...' : metrics.totalProtectedUsers?.toLocaleString('en-US')}</p>
      </div>
      <div className="bg-brink border-2 border-durple rounded-lg p-2 md:p-5 text-center w-full md:w-1/3 mx-2">
        <h3 className="mb-2 text-sm md:text-lg font-semibold text-durple">DEX Volume Protected</h3>
        <p className="text-sm md:text-2xl font-bold text-spurple">{loading ? 'Loading...' : formatCurrency(dynamicVolume)}</p>
      </div>
    </div>
  );
};

export default Metrics;
