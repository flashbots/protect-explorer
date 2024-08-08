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
    return parsedData.data.map((entry: any) => ({ ...entry, date }));
  };

  const findLatestAvailableDate = async (): Promise<string | null> => {
    const today = new Date();
    for (let i = 2; i <= 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = formatDate(date);
      try {
        await fetchCSVForDate(formattedDate);
        return formattedDate;
      } catch (error) {
        console.log(`No data available for ${formattedDate}`);
      }
    }
    return null;
  };

  const fetchCSV = async (daysToFetch: number = 90): Promise<void> => {
    dispatch({ type: 'FETCH_DATA_START' });
    try {
      const latestDate = await findLatestAvailableDate();
      if (!latestDate) {
        throw new Error('No data available for the last 7 days');
      }
      dispatch({ type: 'SET_LATEST_DATE_FETCHED', payload: latestDate });
  
      const dates = getDatesArray(latestDate, daysToFetch);
      const results = await Promise.all(
        dates.map(async (date) => {
          try {
            const data = await fetchCSVForDate(date);
            return { date, data, success: true };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.log(`Failed to fetch data for ${date}: ${errorMessage}`);
            return { date, data: null, success: false };
          }
        })
      );
  
      const successfulData = results
        .filter((result) => result.success)
        .map((result) => result.data)
        .flat();
  
      dispatch({ type: 'FETCH_DATA_SUCCESS', payload: successfulData });
  
      const failedDates = results
        .filter((result) => !result.success)
        .map((result) => result.date);
  
      if (failedDates.length > 0) {
        console.log(`Failed to fetch data for the following dates: ${failedDates.join(', ')}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'FETCH_DATA_FAILURE', payload: errorMessage });
    }
  };

  return fetchCSV;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getDatesArray = (startDate: string, daysToFetch: number): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < daysToFetch; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
};