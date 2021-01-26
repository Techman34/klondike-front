import React from 'react';

import bacLogo from '../../assets/img/kbtc-logo.png';
import basLogo from '../../assets/img/klon-logo.png';
import babLogo from '../../assets/img/kbond-logo.png';
import wbtcLogo from '../../assets/img/wbtc.png';

const logosBySymbol: { [title: string]: string } = {
  'KBTC': bacLogo,
  'KBond': babLogo,
  'Klon': basLogo,
  'WBTC': wbtcLogo,
  'BDIGG': wbtcLogo,
  'RenBTC': wbtcLogo,
  'KBTC_WBTC-LPv2': bacLogo,
  'Klon_WBTC-LPv2': basLogo,
};

type BasisLogoProps = {
  symbol: string;
  size?: number;
}

const TokenSymbol: React.FC<BasisLogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid BasisLogo symbol: ${symbol}`);
  }
  return (
    <img
      src={logosBySymbol[symbol]}
      alt={`${symbol} Logo`}
      height={size}
    />
  )
};

export default TokenSymbol;
