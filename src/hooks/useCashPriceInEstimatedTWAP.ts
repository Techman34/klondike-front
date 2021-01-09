import { useCallback, useEffect, useState } from 'react';
import useBasisCash from './useBasisCash';
import { TokenStat } from '../basis-cash/types';
import config from '../config';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const basisCash = useBasisCash();

  const fetchCashPrice = useCallback(async () => {
    const stat = await basisCash.getCashStatInEstimatedTWAP();
    setStat(stat);
  }, [basisCash]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch KBTC price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setStat, basisCash]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
