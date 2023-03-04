const sendNotification = require('../firebase/sendNotification');
const User = require('../model/User');
const sendTransactionDanke = require('../web3/sendTransactionDanke');
const router = require('express').Router();
require('dotenv').config();

// TODO: call util function for calculation of reward based on respective user vitals stored in db
// TODO: add reward object to database + send notification to respective user
router.post('/rewardUser', async (req, res) => {
    
    try {
        // const user = await User.findOne({email: req.body.email});
        // // if not, register user.
        // if(!user) {
        //     return res.status(404).send('User not found for reward route!');
        // }
        if(!req.body.fcmRegistrationToken) {
            return res.status(400).send('No fcm registration token! Cannot push notification!');
        }
        var fcmRegistrationTokens = [];
        fcmRegistrationTokens.push(req.body.fcmRegistrationToken);
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
        sendNotification(fcmRegistrationTokens, 'DAnke daily reward','Killing it as always! Here\'s your reward!');
        return res.status(200).send('Reward sent successfully!');
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