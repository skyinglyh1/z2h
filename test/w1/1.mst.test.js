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
describe('deploy mysimpletoken ', function () {
    before(async () => {
        this.signers = await ethers.getSigners();
        this.admin = this.signers[0];
        this.user1 = this.signers[1];
        this.MST = await ethers.getContractFactory('MySimpleToken');
        const config = utils.getConfig();
        this.c = config.local;
    });
    beforeEach(async () => {
        this.mst = await this.MST.deploy(
            this.c.deploy.week1.mst.name,
            this.c.deploy.week1.mst.symbol
        );
        
    });
    it('mst:supply and name and symbol', async () => {
        let supply = await this.mst.totalSupply();
        expect(supply).to.be.equal(toWei('1000', 'ether'));
        let bal = await this.mst.balanceOf(this.admin.address);
        expect(bal).to.be.equal(toWei('1000', 'ether'));

        let name = await this.mst.name();
        expect(name).to.be.equal(this.c.deploy.week1.mst.name);

        let symbol = await this.mst.symbol();
        expect(symbol).to.be.equal(this.c.deploy.week1.mst.symbol);

    });
    it('mst:mint should success', async () => {
        await this.mst.connect(this.admin).mint(this.user1.address, 1)
        let bal = await this.mst.balanceOf(this.user1.address);
        expect(bal.toString()).to.be.equal('1');
       
    });
    
    it('mst:transfer should success', async () => {
        await this.mst.connect(this.admin).transfer(this.user1.address, 100);
        let bal = await this.mst.balanceOf(this.user1.address);
        expect(bal.toString()).to.be.equal('100');
    });
});
