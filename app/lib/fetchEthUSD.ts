// src/lib/fetchEthUSD.tsx
import axios from 'axios';
import { useDataContext } from '../context/DataContext';

const startingPrices: { [date: string]: number } = {
  '2024-05-29': 3840.69,
  '2024-05-28': 3893.39,
  '2024-05-27': 3825.28,
  '2024-05-26': 3750.08,
  '2024-05-25': 3727.07,
  '2024-05-24': 3766.40,
  '2024-05-23': 3741.90,
  '2024-05-22': 3792.49,
  '2024-05-21': 3656.39,
  '2024-05-20': 3071.32,
  '2024-05-19': 3120.55,
  '2024-05-18': 3096.00,
  '2024-05-17': 2943.59,
  '2024-05-16': 3035.76,
  '2024-05-15': 2881.80,
  '2024-05-14': 2948.30,
  '2024-05-13': 2931.31,
  '2024-05-12': 2908.98,
  '2024-05-11': 2910.68,
  '2024-05-10': 3038.34,
  '2024-05-09': 2975.73,
  '2024-05-08': 3015.16,
  '2024-05-07': 3064.59,
  '2024-05-06': 3136.58,
  '2024-05-05': 3115.02,
  '2024-05-04': 3102.15,
  '2024-05-03': 2988.55,
  '2024-05-02': 2976.09,
  '2024-05-01': 3018.55,
};

export const useFetchEthUSD = () => {
  const { state, dispatch } = useDataContext();

  const fetchEthUSD = async (date: string): Promise<number | undefined> => {
    if (state.ethPrices[date]) {
      return state.ethPrices[date];
    }

    if (startingPrices[date]) {
      dispatch({ type: 'SET_ETH_PRICE', payload: { date, price: startingPrices[date] } });
      return startingPrices[date];
    }

    try {
      const [year, month, day] = date.split('-');
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/history`, {
        params: {
          date: `${day}-${month}-${year}`,
        },
      });
      const price = response.data.market_data.current_price.usd;
      dispatch({ type: 'SET_ETH_PRICE', payload: { date, price } });
      return price;
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      return undefined;
    }
  };

  return fetchEthUSD;
};
