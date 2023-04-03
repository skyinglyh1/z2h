/** @format */
const { ethers, upgrades } = require('hardhat');
const { expect } = require('chai');
const {
    BN,
    constants,
    expectEvent,
    expectRevert,
} = require('@openzeppelin/test-helpers');
const utils = require('../../script/utils');
const { solidity } = require('ethereum-waffle');
const chai = require('chai');
const exp = require('constants');
chai.use(solidity);
const Web3 = require('web3');
const toWei = Web3.utils.toWei;
const toBN = Web3.utils.toBN;
describe('deploy, invoke, upgrade and invoking check ', function () {
    before(async () => {
        this.signers = await ethers.getSigners();
        this.admin = this.signers[0];
        this.user1 = this.signers[1];
        this.LogicV1 = await ethers.getContractFactory('LogicV1');
        this.LogicV2 = await ethers.getContractFactory('LogicV2');
        const config = utils.getConfig();
        this.c = config.local;
    });
    beforeEach(async () => {
        this.v1 = await upgrades.deployProxy(
            this.LogicV1,
            [this.admin.address],
            {
                initializer: 'LogicV1_init',
                kind: 'uups',
            }
        );

        
    });
    it('v1:version', async () => {
        let version = await this.v1.version();
        expect(version).to.be.equal("1.0");

    });

    it('v1:add & addAndStore', async () => {
        let z = await this.v1.connect(this.user1).add(1, 2);
        expect(z.toNumber()).to.be.equal(3);
        await this.v1.connect(this.user1).addAndStore(1, 3);
        let addResult = await this.v1.addResult();
        expect(addResult).to.be.equal(4);
    });
    
    it('upgrade from v1 to v2', async () => {
        expect(await this.v1.version()).to.be.eq('1.0');
        let v2 = await upgrades.upgradeProxy(
            this.v1.address,
            this.LogicV2
        );
        expect(await v2.version()).to.equal('2.0');
        expect(await this.v1.version()).to.equal('2.0');
    });

    it('after upgrade, addResult remain unchanged, const updated, addAndStore logic updated, new func works ', async () => {
        // check v1 logic and store
        {
            await this.v1.connect(this.user1).addAndStore(2, 3);
            let addResult = await this.v1.addResult();
            expect(addResult).to.be.equal(5);
            expect(await this.v1.const1()).to.be.equal(1);
        }
        // upgrade
        await upgrades.upgradeProxy(this.v1.address, this.LogicV2);
        const v2 = await this.LogicV2.attach(this.v1.address);

        // store remain unchanged
        // const changed 
        {
            let addResult = await v2.addResult();
            expect(addResult).to.be.equal(5);
            expect(await v2.const1()).to.be.equal(2);
        }
        // addAndStore logic changed
        {
            await this.v1.connect(this.user1).addAndStore(2, 3);
            let addResult = await this.v1.addResult();
            expect(addResult).to.be.equal(6);
        }

        // new funcs work
        {
            let z = await v2.connect(this.user1).sub(10, 2);
            expect(z.toNumber()).to.be.equal(8);
            await v2.connect(this.user1).subAndStore(10, 3);
            let subResult = await v2.subResult();
            expect(subResult).to.be.equal(7);
        }

    });

});
