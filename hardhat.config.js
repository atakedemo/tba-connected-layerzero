require("dotenv").config();

require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-waffle");
require(`@nomiclabs/hardhat-etherscan`);
require("solidity-coverage");
require('hardhat-gas-reporter');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('@openzeppelin/hardhat-upgrades');
require('./tasks');

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_URL_MUMBAI = process.env.API_URL_MUMBAI;
const API_URL_SHIBUYA = process.env.API_URL_SHIBUYA;
const API_URL_SEPOLIA = process.env.API_URL_SEPOLIA;
const API_KEY_MUMBAI = process.env.API_KEY_MUMBAI;
const API_KEY_SHIBUYA = process.env.API_KEY_SHIBUYA;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {

  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]


  },

  // solidity: "0.8.4",
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  namedAccounts: {
    deployer: {
      default: 0,    // wallet address 0, of the mnemonic in .env
    },
    proxyOwner: {
      default: 1,
    },
  },

  mocha: {
    timeout: 100000000
  },

  networks: {
    ethereum: {
      url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public infura endpoint
      chainId: 1,
      accounts: [ PRIVATE_KEY ],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [ PRIVATE_KEY ],
    },
    polygon: {
      url: "https://rpc-mainnet.maticvigil.com",
      chainId: 137,
      accounts: [ PRIVATE_KEY ],
    },

    sepolia: {
      url: API_URL_SEPOLIA,
      chainId: 11155111,
      accounts: [ PRIVATE_KEY ],
    },
    mumbai: {
      url: API_URL_MUMBAI,
      chainId: 80001,
      accounts: [ PRIVATE_KEY ],
    },
    shibuya: {
      url: API_URL_SHIBUYA,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {  // copy the Etherscan object from the verify Contracts secion on Dashboard 
    apiKey: {
      mch: 'abc',
      polygonMumbai: API_KEY_MUMBAI
    },
    customChains: [
      {
        network: 'mch',
        chainId: 420,
        urls: {
        // Blockscout
        apiURL: 'https://explorer.oasys.sand.mchdfgh.xyz/api',
        browserURL: 'https://explorer.oasys.sand.mchdfgh.xyz'
        }
       },
    ],
  }
};