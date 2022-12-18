async function sendTransactionDanke(_fromAddress, _toAddress, _amount) {
    const Tx = require('ethereumjs-tx').Transaction;
    var Web3 = require('web3');
    const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/vlYolnH8xOcJ_nq6M0Edtj_KmkEGZTnw');
    const contractABI = require('./constants').contractABI;
    const private_key = require('./constants').private_key;
    const contractAddress = require('./constants').contract_address;

    let toAddress = _toAddress;
    let fromAddress = _fromAddress;

    var amount = web3.utils.toHex(_amount * (10**18));
    // get transaction count, later will used as nonce
    const count = await web3.eth.getTransactionCount(fromAddress);

    // set your private key here, we'll sign the transaction below
    var privateKey = Buffer.from(private_key, 'hex');

    var contract = new web3.eth.Contract(contractABI, contractAddress, {from: fromAddress});

    var rawTransaction = {
        "from":fromAddress,
        "gasLimit": 210000,
        "gasPrice": web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        "to":contractAddress,
        "value": "0x0",
        "data":contract.methods.transfer(toAddress, amount).encodeABI(),
        "nonce":web3.utils.toHex(count)
    };
    var transaction = new Tx(rawTransaction, {chain: 'goerli'});
    transaction.sign(privateKey);

    web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))

    // // check the balance
    contract.methods.balanceOf(fromAddress).call().then(function(balance){console.log(balance)})
}

// sendTransactionDanke("0xcdA366B154b91F55Cd187995F2b5D0B7390f03c6", "0x960718cedFB87b56D86FBDa00a11DEa00bf74be3", 10);
module.exports = sendTransactionDanke;