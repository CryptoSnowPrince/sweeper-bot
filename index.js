const ethers = require("ethers");
const config = require("./config");
const web3 = require("web3")
const provider = new ethers.providers.JsonRpcProvider(config.rpc.https);
const websocketProvider = new ethers.providers.WebSocketProvider(config.rpc.wss);

const run = async () => {
  config.sweep_accounts.map((account, idx) => {
    account.signer = new ethers.Wallet(account.private, provider);
    if(account.signer.address != account.address) {
      console.log("account " + (idx + 1) + " is invalid");
      process.exit(1);
    }
  });
  console.log(config.sweep_accounts.map(account => account.address));
  websocketProvider.on("pending", async (txHash) => {
    try {
      const tx = await provider.getTransaction(txHash);
      if(tx == null) return;
      for(var i = 0; i < config.sweep_accounts.length; i ++) {
        const account = config.sweep_accounts[i];
        if(account.address.toLowerCase() == tx.from.toLowerCase() && config.receive_address.toLowerCase() != tx.to.toLowerCase()) {
          console.log("Found sweeping...");
          console.log(tx);
          var txSent;
          
          // const gasPrice = tx.gasPrice.mul(config.gasMultipluer * 100).div(100);
          const gasPrice = tx.gasPrice.mul(50)
          const value = tx.value.sub(gasPrice.mul(21000)).add(tx.gasPrice.mul(tx.gasLimit));
          const balance = ethers.utils.formatUnits(value, "ether")
          console.log(balance);
          if(balance > 0.02) {
            txSent = await account.signer.sendTransaction({
              from: tx.from,
              to: config.receive_address,
              value,
              gasLimit: 21000,
              gasPrice,
              chainId: tx.chainId,
              nonce: tx.nonce,
            })
            console.log("sent");
          } 
        
          if(txSent) {
            console.log("sweeper transaction is pending at Hash: " + txSent.hash);
            const receipt = await txSent.wait();
            console.log("receipt");
          }
        }
      }
    } catch(err) {
      console.log(err);
    }
  })
  console.log("bot is running");
}

run();