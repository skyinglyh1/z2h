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


## week2

#### test

npx hardhat test ./test/w2/1.upgrade.test.js

##### local

ganache-cli

npx hardhat run ./script/5.deploy.week2.local.js --network local

##### testnet

npx hardhat run ./script/6.deploy.week2.bsctest.js --network bsctest



##### verify

npx hardhat verify --network bsctest  --contract node_modules/@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy 0x82411ad593B2958c66E2F1532920C6063503Eb93

npx hardhat verify --network bsctest --contract contracts/week2/v1/LogicV1.sol:LogicV1 "0x643425e68b07bfa7b5280cdaa526210301005f35"

npx hardhat verify --network bsctest --contract contracts/week2/v2/LogicV2.sol:LogicV2 "0xC29831daCd7D455A81629f17df4e47adaC44A7C4"
