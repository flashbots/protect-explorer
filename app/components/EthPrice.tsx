import React, { useEffect, useState } from 'react';

interface EthPriceProps {
  date: string;
  ethAmount: string;
  getEthPrice: (date: string) => Promise<number | undefined>;
}

const EthPrice: React.FC<EthPriceProps> = ({ date, ethAmount, getEthPrice }) => {
  const [usdPrice, setUsdPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getEthPrice(date);
      if (price !== undefined) {
        setUsdPrice(price * parseFloat(ethAmount));
      }
    };
    fetchPrice();
  }, [date, ethAmount, getEthPrice]);

  return <span>{usdPrice ? usdPrice.toFixed(2) : 'Loading...'}</span>;
};

export default EthPrice;