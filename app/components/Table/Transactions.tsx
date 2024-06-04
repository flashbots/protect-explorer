// src/components/Transactions.tsx
import React, { useEffect } from 'react';
import styles from './Table.module.css';
import EthPrice from '../EthPrice';

interface TransactionsProps {
  data: any[];
  colors: string[];
  state: any;
  fetchEthUSD: (date: string) => Promise<number | undefined>;
}

const Transactions: React.FC<TransactionsProps> = ({ data, colors, state, fetchEthUSD }) => {
  const formatBuilderName = (name: string) => {
    if (name.includes('beaverbuild.org')) return 'Beaver';
    if (name.includes('Illuminate Dmocratize Dstribute') || name.includes('Illuminate Dmocrtz Dstrib Prtct')) return 'Flashbots';
    if (name.includes('Titan') || name.includes('titanbuilder.xyz')) return 'Titan';
    if (name.includes('@rsyncbuilder') || name.includes('rsync-builder.xyz')) return 'rsync';
    return name;
  };

  const getEthPrice = async (date: string) => {
    if (!state.ethPrices[date]) {
      const price = await fetchEthUSD(date);
      return price;
    }
    return state.ethPrices[date];
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 text-[10px] md:text-sm border border-2 border-white">
      <thead className="bg-durple">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            Tx
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            Builder
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            Refund (ETH)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
            Refund ($)
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((transaction, index) => {
          const date = transaction.block_time.split(' ')[0].replace(/\//g, '-');
          
          return (
            <tr key={index}>
              <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                <a href={`https://etherscan.io/tx/${transaction.user_tx_hash}`} target="_blank" rel="noopener noreferrer">
                  {transaction.user_tx_hash.slice(0, 5)}...{transaction.user_tx_hash.slice(-3)}
                </a>
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                {formatBuilderName(transaction.extra_data)}
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                {transaction.refund_value_eth.slice(0, 7)}
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell" style={{ color: `var(${colors[index % colors.length]})` }}>
                <EthPrice date={date} ethAmount={transaction.refund_value_eth} getEthPrice={getEthPrice} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Transactions;