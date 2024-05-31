import React, { useEffect, useState } from 'react';

interface EthPriceProps {
  date: string;
  ethAmount: string;
  getEthPrice: (date: string) => Promise<number | undefined>;
}

const EthPrice: React.FC<EthPriceProps> = ({ date, ethAmount, getEthPrice }) => {
    const [usdValue, setUsdValue] = useState<number | null>(null);
  
    useEffect(() => {
      const fetchPrice = async () => {
        const price = await getEthPrice(date);
        if (price) {
          setUsdValue(parseFloat(ethAmount) * price);
        }
      };
  
      fetchPrice();
    }, [date, ethAmount, getEthPrice]);
  
    return usdValue ? <>${usdValue.toFixed(2)}</> : <>Loading...</>;
};

export default EthPrice;