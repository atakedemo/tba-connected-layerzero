const CHAIN_ID = require("../constants/chainIds.json")
const ENDPOINTS = require("../constants/layerzeroEndpoints.json");

module.exports = async function (taskArgs, hre) {
    const remoteChainId = CHAIN_ID[taskArgs.targetNetwork]
    const xchaintba = await ethers.getContract("XChainTba")

    // quote fee with default adapterParams
    let adapterParams = ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000]) // default adapterParams example

    const endpoint = await ethers.getContractAt("ILayerZeroEndpoint", ENDPOINTS[hre.network.name])
    let fees = await endpoint.estimateFees(remoteChainId, xchaintba.address, "0x", false, adapterParams)
    console.log(`fees[0] (wei): ${fees[0]} / (eth): ${ethers.utils.formatEther(fees[0])}`)

    let tx = await (
        await xchaintba.sendRequestGetTbaInfo(
            remoteChainId, 
            '0xDc5b8F3971F5c4B60FB13d39cE65Bea7Dee8aEA7', 
            0,
            '0x7b718d4ce6ca83536660a314639559f3d3f6e9e3',
            2,
            { value: ethers.utils.parseEther("0.1") }
        )
    ).wait()
    console.log(`✅ Message Sent [${hre.network.name}] incrementCounter on destination OmniCounter @ [${remoteChainId}]`)
    console.log(`tx: ${tx.transactionHash}`)

    console.log(``)
    console.log(`Note: to poll/wait for the message to arrive on the destination use the command:`)
    console.log(`       (it may take a minute to arrive, be patient!)`)
    console.log("")
    console.log(`    $ npx hardhat --network ${taskArgs.targetNetwork} ocPoll`)
}
