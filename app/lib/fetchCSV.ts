import axios from 'axios';
import Papa from 'papaparse';

const baseURL = 'https://datasets.flashbots.net/protect';

export const fetchCSV = async (date: string): Promise<any[]> => {
  try {
    const month = date.slice(0, 7);
    const url = `${baseURL}/${month}/${date}.csv`;
    const response = await axios.get(url);
    const parsedData = Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
    });
    console.log(parsedData)
    return parsedData.data;
  } catch (error) {
    console.error('Error fetching CSV file:', error);
    throw error;
  }
};
