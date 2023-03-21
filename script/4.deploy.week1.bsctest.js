/** @format */

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades, network } = require('hardhat');
const utils = require('./utils');
const Web3 = require('web3');
const toBN = Web3.utils.toBN;
const toWei = Web3.utils.toWei;
const {
    BN,
    constants,
    expectEvent,
    expectRevert,
} = require('@openzeppelin/test-helpers');
async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');
    let config = utils.getConfig();

    const signers = await ethers.getSigners();
    const deployer = signers[0];
    console.log('network is ', network.name);
    const admin = signers[0];
    if (network.name == 'bsctest') {
        console.log('Deploying account:', await deployer.getAddress());
        console.log(
            'Deploying account balance:',
            (await deployer.getBalance()).toString(),
            '\n'
        );

        // We get the contract to deploy
        const StakingRewards = await ethers.getContractFactory(
            'StakingRewards'
        );

        if (
            !config[network.name].deployed.week1.hasOwnProperty('sr') ||
            config[network.name].deployed.week1.sr == ''
        ) {
            const sr = await StakingRewards.deploy(
                admin.address,
                admin.address,
                config[network.name].deployed.week1.mst,
                config[network.name].deployed.week1.mst
            );
            console.log('txHash: ', sr.deployTransaction.hash);
            console.log('gas: ', sr.deployTransaction.gasLimit.toString());
            console.log('deploy StakingRewards: ', sr.address);
            config[network.name].deployed.week1.sr = sr.address;
            utils.setConfig(config);
        }

        const sr = await StakingRewards.attach(
            config[network.name].deployed.week1.sr
        );
        // do nothing here temporary

    } else {
        throw 'not deployed due to wrong network';
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => {
        console.log('\nDeployment completed successfully ✓');
        process.exit(0);
    })
    .catch((error) => {
        console.log('\nDeployment failed ✗');
        console.error(error);
        process.exit(1);
    });
