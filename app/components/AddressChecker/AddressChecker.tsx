import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';
import { useFetchCSV } from '../../lib/fetchCSV';
import { Alchemy, Network } from 'alchemy-sdk';

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const AddressChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [address, setAddress] = useState('');
  const [checked, setChecked] = useState(false);
  const [totalRefund, setTotalRefund] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { state } = useDataContext();
  const fetchCSV = useFetchCSV();

  const getDateRange = (days: number): string[] => {
    const dates: string[] = [];
    const today = new Date();
    today.setDate(today.getDate() - 2); // Data is often two days behind

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(formatDate(date));
    }
    return dates;
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const resolveENS = async (name: string) => {
    try {
      const resolvedAddress = await alchemy.core.resolveName(name);
      if (resolvedAddress) {
        return resolvedAddress;
      }
    } catch (error) {
      console.error('Error resolving ENS name:', error);
    }
    return null;
  };

  const handleCheckAddress = async () => {
    let resolvedAddress = input;

    if (input.endsWith('.eth')) {
      const ensAddress = await resolveENS(input);
      if (ensAddress) {
        resolvedAddress = ensAddress;
      } else {
        alert('ENS name could not be resolved.');
        return;
      }
    }

    setAddress(resolvedAddress);
    console.log(resolvedAddress);

    const dates = getDateRange(90); // Fetch 90 days of data for completeness
    const missingDates = dates.filter(date => !state.data.some(transaction => transaction.block_time.startsWith(date)));

    if (missingDates.length > 0) {
      setLoading(true);
      await fetchCSV(missingDates);
      setLoading(false);
    }

    const matchingTransactions = state.data.filter(transaction => transaction.user_tx_from === resolvedAddress);
    const totalRefundValue = matchingTransactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.refund_value_eth);
    }, 0);

    setChecked(true);
    setTotalRefund(totalRefundValue || 0);
  };

  return (
    <div className="absolute top-[120px] md:top-[350px] w-4/5 md:w-full h-[330px] md:h-[250px] left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-black border-2 border-white rounded-lg p-5" style={{ zIndex: '1', maxWidth: '800px' }}>
      <div className="flex flex-col md:flex-row mb-2.5 w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Address or ENS name"
          className="border border-gray-300 p-2 rounded mb-2.5 md:mb-0 mr-0 md:mr-2.5 flex-grow"
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        />
        {loading ? (
          <div className="p-2 rounded text-white border-none cursor-not-allowed" style={{ backgroundColor: 'color(display-p3 0.37 0.1073 0.6327)' }}>Loading...</div>
        ) : (
          <button onClick={handleCheckAddress} className="p-2 rounded text-white border-none cursor-pointer no-underline hover:bg-opacity-75 disabled:bg-gray-300 disabled:cursor-not-allowed" style={{ backgroundColor: 'color(display-p3 0.37 0.1073 0.6327)' }}>
            Check
          </button>
        )}
      </div>
      {!checked ? (
        <div className="mt-2 md:mt-8 text-white text-2xl">
          <p>See what you've saved with Protect</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="my-2 text-white">
            <p>Total Refund: {totalRefund} ETH</p>
          </div>
          <div className="my-2 text-white" style={{ visibility: totalRefund === 0 ? 'visible' : 'hidden' }}>
            <p>No transactions found for this address in the last 3 months.</p>
          </div>
          <div className="mt-6">
            <a
              href="https://protect.flashbots.net"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded text-white border-none cursor-pointer no-underline hover:bg-opacity-75 disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'color(display-p3 0.37 0.1073 0.6327)' }}
            >
              Get Protected!
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressChecker;