/** @format */

require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-gas-reporter');

const utils = require('./script/utils');
const config = utils.getConfig();
const fs = require('fs');
const path = require('path');


module.exports = {
    networks: {
        hardhat: {
            mining: {
                auto: true,
            },
            // forking: {
            //     url: 'https://rpc.ankr.com/bsc',
            // },
            timeout: 2800000,
        },

        local: {
            // need to run local node manually
            url: 'http://localhost:8545',
            allowUnlimitedContractSize: true,
            timeout: 2800000,
        },
        bsctest: {
            url: `${config.bsctest.rpc}`,
            accounts: [
                `0x${config.bsctest.privateKeys[0]}`,
                `0x${config.bsctest.privateKeys[1]}`,
            ],
            // gasPrice: 1.1 * 1000000000, // 1.1 gwei
            gasLimit: 6000000, //
            gas: 5000000,
            gasPrice: 15 * 1000000000, // 10 gwei
            timeout: 28000000,
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: `${config.scanApiKey}`,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer.
        },
        feeCollector: {
            default: 1,
        },
    },
    solidity: {
        compilers: [
            {
                version: '0.8.10',
                settings: {
                    optimizer: {
                        enabled: true, // true for release, false is default for debug and test
                        runs: 200,
                    },
                },
            },
            {
                version: '0.5.16',
            },
        ],
    },
    mocha: {
        timeout: 100000000,
    },

    gasReporter: {
        // enabled: `${config.etherScanApiKey}` ? true : false,
        showMethodSig: true,
        rst: true,
        onlyCalledMethods: true,
        src: './contracts',
        // proxyResolver: "implementation()",
        // coinmarketcap: `${config.etherScanApiKey}`,
        currency: 'USD',
        outputFile: `${config.gasReporterFilePath}`,
        // remoteContracts: remoteContracts,
    },
};
