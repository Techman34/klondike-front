import React, { useCallback, useMemo } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useBasisCash from '../../hooks/useBasisCash';
import useBondOraclePriceInLastTWAP from '../../hooks/useBondOraclePriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../basis-cash/constants';

const Bond: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const basisCash = useBasisCash();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const cashPrice = useBondOraclePriceInLastTWAP();

  const bondBalance = useTokenBalance(basisCash?.KBond);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await basisCash.buyKbonds(amount);
      const bondAmount = Number(amount) / Number(getDisplayBalance(cashPrice, 8));
      addTransaction(tx, {
        summary: `Buy ${bondAmount.toFixed(2)} KBond with ${amount} KBTC`,
      });
    },
    [basisCash, addTransaction, cashPrice],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await basisCash.redeemKbonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} KBond` });
    },
    [basisCash, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.priceInDAI) < 1.0, [bondStat]);

  const isLaunched = Date.now() >= config.bondLaunchesAt.getTime();
  if (!isLaunched) {
    return (
      <Switch>
        <Page>
          <PageHeader
            icon={'🏦'}
            title="Buy & Redeem KBonds"
            subtitle="Earn premiums upon redemption"
          />
          <LaunchCountdown
            deadline={config.bondLaunchesAt}
            description="How does KBond work?"
            descriptionLink="https://docs.basis.cash/mechanisms/stabilization-mechanism"
          />
        </Page>
      </Switch>
    );
  }

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader
                icon={'🏦'}
                title="Buy & Redeem KBonds"
                subtitle="Earn premiums upon redemption"
              />
            </Route>
            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={basisCash.KBTC}
                  fromTokenName="KBTC"
                  toToken={basisCash.KBond}
                  toTokenName="KBond"
                  priceDesc={
                    !isBondPurchasable
                      ? 'KBTC is over ₿1'
                      : `${Math.floor(
                        100 / Number(bondStat.priceInDAI) - 100,
                      )}% return when KBTC > ₿1`
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="KBTC"
                  description="Last-Hour TWAP Price"
                  price={getDisplayBalance(cashPrice, 8, 2)}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="KBond"
                  description="Current Price: (KBTC)^2"
                  price={bondStat?.priceInDAI || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={basisCash.KBond}
                  fromTokenName="KBond"
                  toToken={basisCash.KBTC}
                  toTokenName="KBTC"
                  priceDesc={`${getDisplayBalance(bondBalance)} KBond Available`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when KBTC > ₿${BOND_REDEEM_PRICE}` : null}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Button onClick={() => connect('injected')} text="Unlock Wallet" />
            </div>
          )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;
