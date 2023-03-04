const sendTransactionDanke = require('../web3/sendTransactionDanke');
const router = require('express').Router();
require('dotenv').config();

// TODO: call util function for calculation of reward based on respective user vitals stored in db
// TODO: add reward object to database + send notification to respective user
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

// TODO: get all reward objects registered today for all users to retrieve in the leaderboard screen
router.get('/todayRewards', async (req, res) => {

});

// TODO: get all user specific rewards with period specified in req.param (lastNdays=7)
router.get('/userRewards', async (req, res) => {

});

module.exports = router;