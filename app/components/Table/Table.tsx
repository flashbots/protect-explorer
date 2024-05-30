import React, { useState } from 'react';
import styles from './Table.module.css';

const colors = [
  '--hero-4',
  '--hero-5',
  '--hero-6',
  '--hero-7',
  '--hero-8',
  '--hero-9',
  '--hero-10',
  '--hero-11',
  '--hero-12',
  '--hero-13',
  '--hero-14',
  '--hero-15',
];

const Table: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'transactions'>('leaderboard');

  const handleTabChange = (tab: 'leaderboard' | 'transactions') => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.nav}>
        <button
          className={`${styles.navLink} ${activeTab === 'leaderboard' ? styles.active : ''}`}
          onClick={() => handleTabChange('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          className={`${styles.navLink} ${activeTab === 'transactions' ? styles.active : ''}`}
          onClick={() => handleTabChange('transactions')}
        >
          Recent Transactions
        </button>
      </div>
      <div className={styles.tableContent}>
        {activeTab === 'leaderboard' ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={styles.tableHeading}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total Txns
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Refunds (ETH)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                  Refunds ($)
                </th>
              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gray-200">
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell" style={{ color: `var(${colors[index % colors.length]})` }}>
                    Project Name
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                    <img src="/path/to/logo.png" alt="Logo" className="h-10 w-10"/>
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                    123
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                    1.23
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell" style={{ color: `var(${colors[index % colors.length]})` }}>
                    $456
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
            <table className="min-w-full divide-y divide-gray-200">
            <thead className={styles.tableHeading}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tx
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
                  Tags
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
            <tbody className="bg-black divide-y divide-gray-200">
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                    Tx ID
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell" style={{ color: `var(${colors[index % colors.length]})` }}>
                    <img src="/path/to/logo.png" alt="Logo" className="h-10 w-10"/>
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell" style={{ color: `var(${colors[index % colors.length]})` }}>
                    Tag
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                    Name
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
                    1.23
                  </td>
                  <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell" style={{ color: `var(${colors[index % colors.length]})` }}>
                    $456
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Table;
