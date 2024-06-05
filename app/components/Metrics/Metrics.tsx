import React, { useEffect, useState } from 'react';

const Metrics: React.FC = () => {
  const [metrics, setMetrics] = useState<{ 
    totalProtectedTxes: number | null, 
    totalProtectedUsers: number | null,
    totalProtectedDexVolume: number | null }>
  ({ totalProtectedTxes: null, totalProtectedUsers: null, totalProtectedDexVolume: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (queryId: number) => {
    try {
      const response = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results`, {
        headers: {
          'X-Dune-API-Key': process.env.NEXT_PUBLIC_DUNE_API_KEY || '',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result.result.rows[0];
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Failed to fetch metrics');
      return null;
    }
  };

  useEffect(() => {
    const fetchAllMetrics = async () => {
      setLoading(true);
      const result1 = await fetchMetrics(3396976); 
      const result2 = await fetchMetrics(3397208);

      if (result1 && result2) {
        setMetrics({
          totalProtectedTxes: result1.num_protect_tx_hash,
          totalProtectedUsers: result1.num_protect_user,
          totalProtectedDexVolume: result2.total_volume,
        });
      }
      setLoading(false);
    };

    fetchAllMetrics();
  }, []);

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
        <p className="text-sm md:text-2xl font-bold text-spurple">{loading ? 'Loading...' : formatCurrency(metrics.totalProtectedDexVolume)}</p>
      </div>
    </div>
  );
};

export default Metrics;