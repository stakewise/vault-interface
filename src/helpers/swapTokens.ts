import { Network, configs } from 'sdk'


const swapTokens = {
  [Network.Mainnet]: {
    osETH: configs[Network.Mainnet].addresses.tokens.mintToken,
    SWISE: configs[Network.Mainnet].addresses.tokens.swise,
    stETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    wbETH: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
    rETH: '0xae78736Cd615f374D3085123A210448E74Fc6393',
    wBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDS: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    mETH: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
    ETHx: '0xA35b1B31Ce002FBF2058D22F30f95D405200A15b',
    cbETH: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
    lsETH: '0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549',
    frxETH: '0x5E8422345238F34275888049021821E8E08CAa1f',
    eETH: '0x35fA164735182de50811E8e2E824cFb9B6118ac2',
    rsETH: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
    ezETH: '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
    egETH: '0x18f313Fc6Afc9b5FD6f0908c1b3D476E3feA1DD9',
    cmETH: '0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA',
  },
  [Network.Gnosis]: {
    osGNO: configs[Network.Gnosis].addresses.tokens.mintToken,
    SWISE: configs[Network.Gnosis].addresses.tokens.swise,
    wBTC: '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252',
    USDT: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
    'USDC.e': '0x2a22f9c3b484c3629090FeED35F17Ff8F88f76F0',
    EURe: '0xcB444e90D8198415266c6a2724b7900fb12FC56E',
    sDAI: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
    wstETH: '0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6',
    wxDAI: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    WETH: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  },
  [Network.Hoodi]: {
    osETH: configs[Network.Hoodi].addresses.tokens.mintToken,
  },
}

const swapTokenTitles = {
  osETH: 'StakeWise Staked ETH',
  osGNO: 'StakeWise Staked GNO',
  SWISE: 'StakeWise',
  USDT: 'Tether USD',
  USDC: 'USD Coin',
  'USDC.e': 'USD Coin',
  USDS: 'USDS Stablecoin',
  WETH: 'Wrapped Ether',
  wBTC: 'Wrapped BTC',
  stETH: 'Staked ETH by LIDO',
  wstETH: 'Wrapped liquid staked Ether 2.0',
  wbETH: 'Wrapped Beacon ETH',
  rETH: 'Rocket Pool ETH',
  mETH: 'Mantle Staked Ether',
  ETHx: 'ETHx',
  cbETH: 'Coinbase Wrapped Staked ETH',
  lsETH: 'Liquid Staked ETH',
  frxETH: 'Frax Ether',
  eETH: 'ether.fi Staked ETH',
  rsETH: 'Kelp DAO Restaked ETH',
  ezETH: 'Renzo Restaked ETH',
  egETH: 'Eigenpie Restaked ETH',
  cmETH: 'Mantle Restaked ETH',
  sDAI: 'Savings xDAI',
  EURe: 'Monerium EUR emoney',
  wxDAI: 'Wrapped xDAI',
}

const swapTokenCustomUnits = {
  USDT: 6,
  USDC: 6,
  'USDC.e': 6,
  wBTC: 8,
}


export {
  swapTokens,
  swapTokenTitles,
  swapTokenCustomUnits,
}
