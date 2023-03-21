## compile

npx hardhat compile

## week1

#### test

npx hardhat test ./test/w1/1.mst.test.js


#### deploy

##### local

ganache-cli

npx hardhat run ./script/1.deploy.week1.local.js --network local

##### testnet

npx hardhat run ./script/2.deploy.week1.bsctest.js --network bsctest

##### verify

npx hardhat verify --network bsctest --contract contracts/week1/MySimpleToken.sol:MySimpleToken --constructor-args ./config/week1/mst.js "0xd81BD5Dbc37A6E68585b1b6eC2659B4Fe728A7E3"

npx hardhat verify --network bsctest --contract contracts/week1/StakingRewards.sol:StakingRewards --constructor-args ./config/week1/sr.js "0x85D3Bb50C293FF1c60aB3e3bF60cd5D73959Eea7"