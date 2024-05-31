import React, { useEffect, useState } from 'react';
import { fetchCSV } from '../../lib/fetchCSV';
import { fetchEthUSD } from '../../lib/fetchEthUSD';
import DatePicker from '../DatePicker';
import Pagination from '../Pagination/Pagination';
import TransactionsTable from './Transactions';
import LeaderboardTable from './Leaderboard';
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
  const [data, setData] = useState<any[]>([]);
  const [ethPrices, setEthPrices] = useState<{ [date: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<'today' | 'this_week' | 'this_month'>('today');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsPerPage = 25;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dates = getDateRange(dateRange);
        const csvData = await fetchCSV(dates);
        setData(csvData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  useEffect(() => {
    setDateRange('today');
  }, []);

  const handleTabChange = (tab: 'leaderboard' | 'transactions') => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getDateRange = (range: 'today' | 'this_week' | 'this_month'): string[] => {
    const dates: string[] = [];
    const today = new Date();
    today.setDate(today.getDate() - 2); // Data is often two days behind
  
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

  const getEthPrice = async (date: string) => {
    if (!ethPrices[date]) {
      try {
        const price = await fetchEthUSD(date);
        setEthPrices(prevPrices => ({ ...prevPrices, [date]: price }));
      } catch (error) {
        console.error(`Error fetching ETH price for ${date}:`, error);
      }
    }
    return ethPrices[date];
  };

  const sortedData = [...data].sort((a, b) => parseFloat(b.refund_value_eth) - parseFloat(a.refund_value_eth));
  const paginatedData = sortedData.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  const totalPages = Math.ceil(sortedData.length / resultsPerPage);

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
      <DatePicker onDateChange={setDateRange} />
      <div className={styles.tableContent}>
        {loading ? (
          <div>Loading...</div>
        ) : activeTab === 'leaderboard' ? (
          <LeaderboardTable />
        ) : (
          <>
            <TransactionsTable data={paginatedData} colors={colors} getEthPrice={getEthPrice} />
            <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default Table;