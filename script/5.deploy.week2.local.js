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
    if (network.name == 'local' /*local node*/ || network.name == 'hardhat') {
        console.log('Deploying account:', await deployer.getAddress());
        console.log(
            'Deploying account balance:',
            (await deployer.getBalance()).toString(),
            '\n'
        );

        // We get the contract to deploy
        const LogicV1 = await ethers.getContractFactory('LogicV1');
        const LogicV2 = await ethers.getContractFactory('LogicV2');

        if (
            !config[network.name].deployed.week2.hasOwnProperty('v1') ||
            config[network.name].deployed.week2.v1 == ''
        ) {
            const v1 = await upgrades.deployProxy(LogicV1, [admin.address], {
                initializer: 'LogicV1_init',
                kind: 'uups',
            });
            console.log('v1....', JSON.stringify(v1))
            console.log('txHash: ', v1.deployTransaction.hash);
            console.log('gas: ', v1.deployTransaction.gasLimit.toString());
            console.log('deploy v1: ', v1.address);
            config[network.name].deployed.week2.v1 = v1.address;
            utils.setConfig(config);
        }

        const v1 = await LogicV1.attach(config[network.name].deployed.week2.v1);

        // log version, invoke
        {
            let version = await v1.version();
            console.log('version: ', version);
        }
        // add & addStore
        {
            console.log(
                'before upgrade const = ',
                (await v1.const1()).toNumber()
            );
            let z = await v1.connect(user1).add(1, 2);
            console.log(' 1 + 2 = ', z.toNumber());
            await v1.connect(user1).addAndStore(1, 3);
            let addResult = await v1.addResult();
            console.log(' 1 + 3 = ', addResult.toNumber());
        }
        // upgrade
        {
            let v2 = await upgrades
                .upgradeProxy(v1.address, LogicV2, {from: admin.address});
            console.log('upgrade txHash: ', v2.deployTransaction.hash);
        }
        const v2 = await LogicV2.attach(config[network.name].deployed.week2.v1);
        // add & addStore sub & subStore
        {
            console.log('after upgrade const = ', (await v2.const1()).toNumber());
            let z = await v2.add(1, 2);
            console.log(' 1 + 2 = ', z.toNumber());
            await v2.connect(user1).addAndStore(1, 3);
            let addResult = await v2.addResult();
            console.log(' 1 + 3 (+1) = ', addResult.toNumber());

            z = await v2.sub(10, 2);
            console.log(' 10 - 2 = ', z.toNumber());
            await v2.connect(user1).subAndStore(10, 3);
            let subResult = await v2.subResult();
            console.log(' 10 - 3  = ', subResult.toNumber());
            
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
