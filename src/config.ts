import { ChainId } from '@uniswap/sdk';
import { Configuration } from './basis-cash/config';
import { BankInfo } from './basis-cash';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const network = process.env.REACT_APP_NETWORK;
const defaultProvider = `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
const chainId = network === "mainnet" ? ChainId.MAINNET : ChainId.KOVAN
const deployments = require(`./basis-cash/deployments/deployments.${network}.json`);
const etherscanUrl = `https://${network}.etherscan.io`;
const devConfig: Configuration = {
  chainId,
  etherscanUrl,
  defaultProvider,
  deployments,
  externalTokens: {
    WBTC: [deployments["WBTC"].address, 8],
    RenBTC: [deployments["RenBTC"].address, 8],
    TBTC: [deployments["TBTC"].address, 18],
    'KBTC_WBTC-UNI-LPv2': ['0x262Fd20639Fd7749AfeB2277d76EB8715223f8c4', 18],
    'Klon_WBTC-UNI-LPv2': ['0xC82822893A1B6db8433369F2528AEA686A49701D', 18],
  },
  baseLaunchDate: new Date('2020-11-26T00:00:00Z'),
  bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
  boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
  refreshInterval: 10000,
  gasLimitMultiplier: 1.1,
};

const configurations: { [env: string]: Configuration } = {
  development: devConfig,
  production: {
    ...devConfig,
    baseLaunchDate: new Date('2020-11-29T23:00:00Z'),
    bondLaunchesAt: new Date('2020-12-05T00:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 30000,
    gasLimitMultiplier: 1.7,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  KBTCWBTCPool: {
    name: 'Earn KBTC by Wrapped BTC',
    contract: 'KBTCWBTCPool',
    depositTokenName: 'WBTC',
    earnTokenName: 'KBTC',
    finished: false,
    sort: 3,
  },
  KBTCRenBTCPool: {
    name: 'Earn KBTC by RenBTC',
    contract: 'KBTCRenBTCPool',
    depositTokenName: 'WBTC',
    earnTokenName: 'RenBTC',
    finished: false,
    sort: 4,
  },
  KBTCTBTCPool: {
    name: 'Earn KBTC by TBTC',
    contract: 'KBTCTBTCPool',
    depositTokenName: 'TBTC',
    earnTokenName: 'KBTC',
    finished: false,
    sort: 5,
  },

  WBTCKBTCLPTokenKlonPool: {
    name: 'Earn Klon by KBTC-WBTC-LP',
    contract: 'WBTCKBTCLPTokenKlonPool',
    depositTokenName: 'Klon_WBTC-UNI-LPv2',
    earnTokenName: 'Klon',
    finished: false,
    sort: 1,
  },
  WBTCKLONLPTokenKlonPool: {
    name: 'Earn Klon by Klon-WBTC-LP',
    contract: 'WBTCKLONLPTokenKlonPool',
    depositTokenName: 'Klon_WBTC-UNI-LPv2',
    earnTokenName: 'Klon',
    finished: false,
    sort: 2,
  },
};

export default configurations[process.env.NODE_ENV || "development"];
