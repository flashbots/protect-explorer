import React from 'react';

interface TransformedData {
  project: string;
  totalTxns: number;
  refundsEth: number;
}

interface LeaderboardProps {
  colors: string[];
  data: { columns: any[]; rows: any[] };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ colors, data }) => {
  const transformedData = transformAndSortData(data);

  return (
    <table className="min-w-full table-fixed divide-y divide-gray-200 text-[8px] md:text-sm border border-2 border-white mb-4">
      <thead className="bg-durple">
        <tr>
          <th className="w-1/2 px-1 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider">
            Project
          </th>
          <th className="w-1/4 px-1 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider">
            Total Txns
          </th>
          <th className="w-1/4 px-1 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider">
            Refunds (ETH)
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {transformedData.map((item, index) => (
          <tr key={index}>
            <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap sm:text-xs" style={{ color: `var(${colors[index % colors.length]})` }}>
              {item.project}
            </td>
            <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap sm:text-xs" style={{ color: `var(${colors[index % colors.length]})` }}>
              {item.totalTxns}
            </td>
            <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap sm:text-xs" style={{ color: `var(${colors[index % colors.length]})` }}>
              {item.refundsEth.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const transformAndSortData = (data: { columns: any[]; rows: any[] }): TransformedData[] => {
  const excludedProjects = ['eth_sendBundle:stage', 'vitaliy', 'okxmevprotection690', 'rabby'];

  const transformProjectName = (project: string): string => {
    if (project === 'definitivefi-4CDB2F5C1622') {
      return 'definitivefi';
    }
    return project;
  };

  const projectData: { [key: string]: TransformedData } = {};

  data.rows.forEach((row: any) => {
    const projectName = transformProjectName(row[0]);
    const totalTxns = parseFloat(row[1]);
    const refundsEth = parseFloat(row[2]);

    if (projectName === 'okxmevprotection690') {
      if (projectData['okx']) {
        projectData['okx'].totalTxns += totalTxns;
        projectData['okx'].refundsEth += refundsEth;
      } else {
        projectData['okx'] = {
          project: 'okx',
          totalTxns,
          refundsEth,
        };
      }
    } else if (projectName === 'bulldog' || projectName === 'tokenlon') {
      if (projectData['tokenlon']) {
        projectData['tokenlon'].totalTxns += totalTxns;
        projectData['tokenlon'].refundsEth += refundsEth;
      } else {
        projectData['tokenlon'] = {
          project: 'tokenlon',
          totalTxns,
          refundsEth,
        };
      }
    } else if (!excludedProjects.includes(projectName)) {
      if (projectData[projectName]) {
        projectData[projectName].totalTxns += totalTxns;
        projectData[projectName].refundsEth += refundsEth;
      } else {
        projectData[projectName] = {
          project: projectName,
          totalTxns,
          refundsEth,
        };
      }
    }
  });

  const transformedData = Object.values(projectData);
  transformedData.sort((a, b) => b.refundsEth - a.refundsEth);

  return transformedData;
};


export default Leaderboard;