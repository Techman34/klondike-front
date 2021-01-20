import React from 'react'
import styled from 'styled-components'
import config from '../../../config';

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href={buyKlon} target="_blank">Get Klon</StyledLink>
      <StyledLink href={buyKBTC} target="_blank">Get KBTC</StyledLink>
      <StyledLink href="https://github.com/klondike-finance" target="_blank">GitHub</StyledLink>
      <StyledLink href="https://twitter.com/KlondikeFinance" target="_blank">Twitter</StyledLink>
      <StyledLink href="https://discord.com/invite/67NXsuwZ8W" target="_blank">Discord</StyledLink>
      <StyledLink href="https://klondikefinance.medium.com/" target="_blank">Medium</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.grey[400]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
`
const buyKlon = `https://uniswap.exchange/swap?inputCurrency=${config.deployments["WBTC"].address}&outputCurrency=${config.deployments["Klon"].address}`;
const buyKBTC = `https://uniswap.exchange/swap?inputCurrency=${config.deployments["WBTC"].address}&outputCurrency=${config.deployments["KBTC"].address}`;
export default Nav