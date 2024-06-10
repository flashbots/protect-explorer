import axios from 'axios';

const fetchClickhouseClient = async () => {
  try {
    const response = await axios.get('/api/fetch-clickhouse');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from serverless function', error);
    throw error;
  }
};

export default fetchClickhouseClient;