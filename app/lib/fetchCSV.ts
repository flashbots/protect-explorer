import axios from 'axios';
import Papa from 'papaparse';

const baseURL = 'https://flashbots-data.s3.us-east-2.amazonaws.com/protect/mevshare';

const fetchCSVForDate = async (date: string): Promise<any[]> => {
  const url = `${baseURL}/${date.slice(0, 7)}/${date}.csv`;
  const response = await axios.get(url);
  const parsedData = Papa.parse(response.data, {
    header: true,
    skipEmptyLines: true,
  });
  console.log(parsedData.data)
  return parsedData.data;
};

export const fetchCSV = async (dates: string[]): Promise<any[]> => {
  try {
    const data = await Promise.all(dates.map(date => fetchCSVForDate(date)));
    return data.flat();
  } catch (error) {
    console.error('Error fetching CSV files:', error);
    throw error;
  }
};