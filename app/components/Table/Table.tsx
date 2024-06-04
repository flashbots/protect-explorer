// src/components/Table.tsx
import React, { useEffect, useState } from 'react';
import { useFetchCSV } from '../../lib/fetchCSV';
import { useFetchEthUSD } from '../../lib/fetchEthUSD';
import { useDataContext } from '../../context/DataContext';
import DatePicker from '../DatePicker';
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
  const { state } = useDataContext();
  const fetchCSV = useFetchCSV();
  const fetchEthUSD = useFetchEthUSD();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'transactions'>('transactions');
  const [dateRange, setDateRange] = useState<'today' | 'this_week' | 'this_month'>('this_month');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsPerPage = 25;

  useEffect(() => {
    const dates = getDateRange(dateRange);
    fetchCSV(dates);
  }, [dateRange]);

  const handleTabChange = (tab: 'leaderboard' | 'transactions') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getDateRange = (range: 'today' | 'this_week' | 'this_month'): string[] => {
    const dates: string[] = [];
    const today = new Date();
    today.setDate(today.getDate() - 2);
    if (range === 'today') {
      dates.push(formatDate(today));
    } else if (range === 'this_week') {
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(formatDate(date));
      }
    } else if (range === 'this_month') {
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(formatDate(date));
      }
    }
    return dates;
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const sortedData = [...state.data].sort((a, b) => parseFloat(b.refund_value_eth) - parseFloat(a.refund_value_eth));
  const paginatedData = sortedData.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
  const totalPages = Math.ceil(sortedData.length / resultsPerPage);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.nav}>
        <button className={`${styles.navLink} ${activeTab === 'transactions' ? styles.active : ''}`} onClick={() => handleTabChange('transactions')}>
          Recent Transactions
        </button>
        <button className={`${styles.navLink} ${activeTab === 'leaderboard' ? styles.active : ''}`} onClick={() => handleTabChange('leaderboard')}>
          Leaderboard
        </button>
      </div>
      <DatePicker onDateChange={setDateRange} />
      <div className={styles.tableContent}>
        {state.loading ? (
          <div>Loading...</div>
        ) : activeTab === 'leaderboard' ? (
          <LeaderboardTable />
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
