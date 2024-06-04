import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';
import Stars from '../Stars/Stars';
import { Alchemy, Network } from 'alchemy-sdk';

interface StarProps {
    top: number;
    left: number;
    duration: number;
    size: number;
    color: string;
} 

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const colors = [
    'color(display-p3 0.1889 0.0624 0.4576)',
    'color(display-p3 0.2802 0.062 0.558)',
    'color(display-p3 0.37 0.1073 0.6327)',
    'color(display-p3 0.4853 0.1469 0.6927)',
    'color(display-p3 0.5891 0.232 0.808)',
    'color(display-p3 0.888 0.312 0.648)',
    'color(display-p3 0.9569 0.4505 0.3725)',
    'color(display-p3 0.9765 0.5686 0.3647)',
    'color(display-p3 0.9843 0.651 0.451)',
    'color(display-p3 0.9922 0.7804 0.5765)',
    'color(display-p3 1 0.9095 0.6766)',
    'color(display-p3 1 0.9567 0.74)',
    'color(display-p3 1 0.9961 0.898)',
    'color(display-p3 1 0.9922 0.8196)',
    'color(display-p3 1 0.9961 0.898)'
];
  
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const AddressChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [address, setAddress] = useState('');
  const [checked, setChecked] = useState(false);
  const [totalRefund, setTotalRefund] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [newStars, setNewStars] = useState<StarProps[]>([]);
  const { state } = useDataContext();

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

    const matchingTransactions = state.data.filter(transaction => transaction.user_tx_from === resolvedAddress);
    const totalRefundValue = matchingTransactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.refund_value_eth);
    }, 0);

    setChecked(true);
    setTotalRefund(totalRefundValue || 0);

    const newStarsArray = [];
    for (let i = 0; i < 100; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = Math.random() * 2 + 1;
      const color = getRandomColor();
      newStarsArray.push({ top, left, duration, size: 3, color });
    }
    setNewStars(newStarsArray);
  };

  return (
    <div className="absolute top-[120px] md:top-[120px] w-4/5 md:w-full h-[330px] md:h-[300px] left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-spurple border-2 border-white rounded-lg p-5" style={{ zIndex: '1', maxWidth: '800px' }}>
      {checked && (<Stars count={0} newStars={newStars} />)}
      <div className="mt-2 text-white text-xl mb-5">
        <p>See what you&apos;ve saved with Protect</p>
      </div>
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
      <div className="flex flex-col items-center justify-center w-full h-full">
        {checked && (
          <>
            <div className="my-2 text-white">
              <p>Total Refund: {totalRefund} ETH</p>
            </div>
            <div className="my-2 text-white" style={{ visibility: totalRefund === 0 ? 'visible' : 'hidden' }}>
              <p>No transactions found for this address in the last 30 days.</p>
            </div>
            <div className="mt-6">
              <a
                href="https://protect.flashbots.net"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded text-durple border-durple cursor-pointer no-underline hover:bg-opacity-75 disabled:bg-gray-300 disabled:cursor-not-allowed bg-white"
              >
                Get Protected!
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressChecker;