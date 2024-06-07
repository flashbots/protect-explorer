import { useDataContext } from '../context/DataContext';

export const useFetchEthUSD = () => {
  const { state, dispatch } = useDataContext();

  const fetchEthUSD = async (date: string): Promise<number | undefined> => {
    if (state.ethPrices[date]) {
      return state.ethPrices[date];
    }

    try {
      const timestamp = new Date(date).getTime() / 1000;

      const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow' as RequestRedirect,
        headers: {
          'Authorization': `Apikey ${process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY}`,
        }
      };

      const response = await fetch(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=${timestamp}`, requestOptions);
      const result = await response.json();

      const price = result.ETH.USD;
      if (price) {
        dispatch({ type: 'SET_ETH_PRICE', payload: { date, price } });
        return price;
      } else {
        throw new Error('No price data found for the specified date');
      }
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      return undefined;
    }
  };

  return fetchEthUSD;
};
