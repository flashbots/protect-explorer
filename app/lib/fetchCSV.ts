import axios from 'axios';
import Papa from 'papaparse';
import { useDataContext } from '../context/DataContext';

const baseURL = 'https://flashbots-data.s3.us-east-2.amazonaws.com/protect/mevshare';

export const useFetchCSV = () => {
  const { dispatch } = useDataContext();

  const fetchCSVForDate = async (date: string): Promise<any[]> => {
    const url = `${baseURL}/${date.slice(0, 7)}/${date}.csv`;
    const response = await axios.get(url);
    const parsedData = Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
    });
    return parsedData.data;
  };

  const fetchCSV = async (dates: string[]): Promise<void> => {
    dispatch({ type: 'FETCH_DATA_START' });
    try {
      const data = await Promise.all(dates.map(date => fetchCSVForDate(date)));
      dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data.flat() });
    } catch (error) {
      dispatch({ type: 'FETCH_DATA_FAILURE', payload: 'Error fetching data' });
    }
  };

  return fetchCSV;
};