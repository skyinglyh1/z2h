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
    const user1 = signers[1];
    if (
        network.name == 'local' /*local node*/
        || network.name == 'hardhat'
    ) {
        console.log('Deploying account:', await deployer.getAddress());
        console.log(
            'Deploying account balance:',
            (await deployer.getBalance()).toString(),
            '\n'
        );

        // We get the contract to deploy
        const MySimpleToken = await ethers.getContractFactory('MySimpleToken');
        

        if (
            !config[network.name].deployed.week1.hasOwnProperty('mst') ||
            config[network.name].deployed.week1.mst == ''
        ) {
            const mst = await MySimpleToken.deploy(
                config[network.name].deploy.week1.mst.name,
                config[network.name].deploy.week1.mst.symbol
            );
            console.log('txHash: ', mst.deployTransaction.hash);
            console.log('gas: ', mst.deployTransaction.gasLimit.toString());
            console.log('deploy mst: ', mst.address);
            config[network.name].deployed.week1.mst = mst.address;
            utils.setConfig(config);
        }
        

        const mst = await MySimpleToken.attach(
            config[network.name].deployed.week1.mst
        );

        // log supply, name, symbol
        {
            let supply = await mst.totalSupply();
            let name = await mst.name();
            let symbol = await mst.symbol();
            console.log('supply: ', supply)
            console.log('name: ', name);
            console.log('symbol: ', symbol);
        }
        // mint
        {
           let tx = await mst.connect(admin).mint(admin.address, 0)
           let receipt = await tx.wait();
            console.log('txHash: ', receipt.transactionHash);
            console.log(
                'gas: ',
                receipt.gasUsed.toString()
            );
        }
        // transfer
        {
            let tx = await mst.connect(admin).transfer(admin.address, 1000);
            let receipt = await tx.wait();
            console.log('txHash: ', receipt.transactionHash);
            console.log('gas: ', receipt.gasUsed.toString());
        }
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
