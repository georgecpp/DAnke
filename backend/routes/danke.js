const sendTransactionDanke = require('../web3/sendTransactionDanke');

const router = require('express').Router();
require('dotenv').config();

router.post('/rewardUser', (req, res) => {
    
    try {
        const myAddress = process.env.SERVER_WALLET_ADDRESS;
        const userAddress = req.body.userAddress;
        const amountDAC = req.body.amountDAC;
        
        if(!userAddress) {
            return res.status(400).send('No User Wallet Address provided!');
        }
    
        if(!amountDAC || amountDAC < 0) {
            return res.status(400).send('No Danke Coin Amount provided!');
        }
    
        sendTransactionDanke(myAddress, userAddress, amountDAC);
    
        return res.status(200).send('Transaction sent successfully!');
    }
    catch(err) {
        return res.status(404).send(err);
    }
});

module.exports = router;