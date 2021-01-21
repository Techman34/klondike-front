import { BigNumber } from 'ethers';

export const getDisplayBalance = (balance: BigNumber, decimals = 18, fractionDigits = 3) => {
  const number = getBalance(balance, decimals - fractionDigits);
  return (number / 10 ** fractionDigits).toFixed(fractionDigits);
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return getDisplayBalance(balance, decimals);
};

export function getBalance(balance: BigNumber, decimals = 18) : number {
  const result = balance.div(BigNumber.from(10).pow(decimals));
  if (result.gt(Number.MAX_SAFE_INTEGER - 1 )) { return Number.MAX_SAFE_INTEGER - 1 }  
  return result.toNumber();
}
