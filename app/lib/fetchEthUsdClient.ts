import { useDataContext } from '../context/DataContext';

export const useFetchEthUSD = () => {
  const { state, dispatch } = useDataContext();

  const fetchEthUSD = async (date: string): Promise<number | undefined> => {
    if (state.ethPrices[date]) {
      return state.ethPrices[date];
    }

    try {
      const response = await fetch(`/api/fetch-eth-usd?date=${date}`);
      const result = await response.json();

      const price = result.price;
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