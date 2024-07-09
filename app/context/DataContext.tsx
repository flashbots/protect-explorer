import React, { createContext, useReducer, useContext, ReactNode } from 'react';

type State = {
  data: any[];
  ethPrices: { [date: string]: number };
  loading: boolean;
  error: string | null;
  clickhouseData: { columns: any[]; rows: any[] };
  latestDateFetched: string | null;
};

type Action =
  | { type: 'FETCH_DATA_START' }
  | { type: 'FETCH_DATA_SUCCESS'; payload: any[] }
  | { type: 'FETCH_DATA_FAILURE'; payload: string }
  | { type: 'SET_ETH_PRICE'; payload: { date: string; price: number } }
  | { type: 'FETCH_CLICKHOUSE_DATA_SUCCESS'; payload: { columns: any[]; rows: any[] } }
  | { type: 'FETCH_CLICKHOUSE_DATA_FAILURE'; payload: string }
  | { type: 'SET_LATEST_DATE_FETCHED'; payload: string };

const initialState: State = {
  data: [],
  ethPrices: {},
  loading: false,
  error: null,
  clickhouseData: { columns: [], rows: [] },
  latestDateFetched: null,
};

const dataReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_DATA_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_DATA_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_DATA_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'SET_ETH_PRICE':
      return { ...state, ethPrices: { ...state.ethPrices, [action.payload.date]: action.payload.price } };
    case 'FETCH_CLICKHOUSE_DATA_SUCCESS':
      return { ...state, loading: false, clickhouseData: action.payload };
    case 'FETCH_CLICKHOUSE_DATA_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'SET_LATEST_DATE_FETCHED':
      return { ...state, latestDateFetched: action.payload };
    default:
      return state;
  }
};

const DataContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
};

const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

export { DataProvider, useDataContext };
