import React from 'react';

interface TransformedData {
  project: string;
  totalTxns: string;
  refundsEth: number;
}

interface LeaderboardProps {
  colors: string[];
  data: { columns: any[]; rows: any[] };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ colors, data }) => {
  const transformedData = transformAndSortData(data);

  return (
    <table className="min-w-full divide-y divide-gray-200 text-[10px] md:text-sm border border-2 border-white mb-4">
      <thead className="bg-durple">
        <tr>
          <th className="px-1 sm:px-6 py-3 text-left text-xxs sm:text-xs font-medium text-white uppercase tracking-wider">
            Project
          </th>
          <th className="px-1 sm:px-6 py-3 text-left text-xxs sm:text-xs font-medium text-white uppercase tracking-wider">
            Total Txns
          </th>
          <th className="px-1 sm:px-6 py-3 text-left text-xxs sm:text-xs font-medium text-white uppercase tracking-wider">
            Refunds (ETH)
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {transformedData.map((item, index) => (
          <tr key={index}>
            <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
              {item.project}
            </td>
            <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
              {item.totalTxns}
            </td>
            <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap" style={{ color: `var(${colors[index % colors.length]})` }}>
              {item.refundsEth.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const transformAndSortData = (data: { columns: any[]; rows: any[] }): TransformedData[] => {
  const excludedProjects = ['eth_sendBundle:stage', 'vitaliy'];

  const transformedData: TransformedData[] = data.rows
    .filter((row: any) => !excludedProjects.includes(row[0]))
    .map((row: any): TransformedData => ({
      project: row[0],
      totalTxns: row[1],
      refundsEth: parseFloat(row[2]),
    }));

  transformedData.sort((a: TransformedData, b: TransformedData) => b.refundsEth - a.refundsEth);

  return transformedData;
};

export default Leaderboard;