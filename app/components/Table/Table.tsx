import React, { useEffect, useState } from 'react';
import fetchClickhouseClient from '../../lib/fetchClickhouseClient';
import { useFetchCSV } from '../../lib/fetchCSV';
import { useFetchEthUSD } from '../../lib/fetchEthUsdClient';
import { useDataContext } from '../../context/DataContext';
import Pagination from '../Pagination/Pagination';
import TransactionsTable from './Transactions';
import LeaderboardTable from './Leaderboard';
import styles from './Table.module.css';

const colors = [
  '--hero-6', '--hero-7', '--hero-8',
  '--hero-9', '--hero-10', '--hero-11', '--hero-12', '--hero-13',
  '--hero-14', '--hero-15',
];

const Table: React.FC = () => {
  const { state, dispatch } = useDataContext();
  const fetchCSV = useFetchCSV();
  const fetchEthUSD = useFetchEthUSD();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'recentTransactions' | 'topTransactions'>('recentTransactions');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsPerPage = 25;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_DATA_START' });
      try {
        // Fetch the latest data first
        await fetchCSV(getDateRange('latest'));

        // Fetch the last 30 days of data
        await fetchCSV(getDateRange('last_30_days'));

        // Fetch the Clickhouse data
        const clickhouseData = await fetchClickhouseClient();
        dispatch({ type: 'FETCH_CLICKHOUSE_DATA_SUCCESS', payload: clickhouseData });

        // Continue fetching up to 90 days of data for AddressChecker
        fetchCSV(getDateRange('last_90_days'));
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: 'FETCH_DATA_FAILURE', payload: error.message });
        } else {
          dispatch({ type: 'FETCH_DATA_FAILURE', payload: 'An unknown error occurred' });
        }
      }
    };

    fetchData();
  }, [dispatch]);

  const handleTabChange = (tab: 'leaderboard' | 'recentTransactions' | 'topTransactions') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getDateRange = (range: 'latest' | 'last_30_days' | 'last_90_days'): string[] => {
    const dates: string[] = [];
    const today = new Date();
    const days = range === 'latest' ? 6 : range === 'last_30_days' ? 30 : 90; 

    for (let i = 6; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i); // latest data is often two days old
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

  const getRecentTransactions = () => {
    return state.data
      .filter((transaction) => {
        const transactionDate = new Date(transaction.block_time);
        const today = new Date();
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 6);
        return transactionDate >= twoDaysAgo && transactionDate <= today;
      })
      .sort((a, b) => new Date(b.block_time).getTime() - new Date(a.block_time).getTime());
  };

  const getTopTransactions = () => {
    return state.data
      .slice()
      .sort((a, b) => parseFloat(b.refund_value_eth) - parseFloat(a.refund_value_eth))
      .slice(0, 200);
  };

  const sortedData = activeTab === 'recentTransactions' ? getRecentTransactions() : getTopTransactions();
  const paginatedData = sortedData.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
  const totalPages = Math.ceil(sortedData.length / resultsPerPage);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.nav}>
        <button className={`${styles.navTab} ${activeTab === 'recentTransactions' ? styles.active : ''}`} onClick={() => handleTabChange('recentTransactions')}>
          Recent Tx
        </button>
        <button className={`${styles.navTab} ${activeTab === 'topTransactions' ? styles.active : ''}`} onClick={() => handleTabChange('topTransactions')}>
          Top Tx
        </button>
        <button className={`${styles.navTab} ${activeTab === 'leaderboard' ? styles.active : ''}`} onClick={() => handleTabChange('leaderboard')}>
          Leaderboard
        </button>
      </div>
      <div>
        {activeTab === 'leaderboard' ? (
          <LeaderboardTable colors={colors} data={state.clickhouseData} />
        ) : (
          <>
            <TransactionsTable data={paginatedData} colors={colors} state={state} fetchEthUSD={fetchEthUSD} />
            <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default Table;