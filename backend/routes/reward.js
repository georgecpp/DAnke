const sendNotification = require('../firebase/sendNotification');
const Reward = require('../model/Reward');
const User = require('../model/User');
const sendTransactionDanke = require('../web3/sendTransactionDanke');
const router = require('express').Router();
require('dotenv').config();

// TODO: call util function for calculation of reward based on respective user vitals stored in db
// TODO: add reward object to database + send notification to respective user
router.post('/rewardUser', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId});
        if(!user) {
            return res.status(404).send('User not found! Can\'t send reward!');
        }
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

        // send transaction on blockchain
        await sendTransactionDanke(myAddress, userAddress, amountDAC);
        
        // get current date for saving reward.
        const rewardSavedAtDate = new Date();
        var rewardSavedAtDateDay = new Date(rewardSavedAtDate); rewardSavedAtDateDay.setHours(0,0,0,0);
        
        // check if already saved for today, if so, update it, else just save it.
        var rewardTodayForUser = await Reward.findOne({userId: user._id, savedAtDate: {$gte: rewardSavedAtDateDay}});
        if(rewardTodayForUser) {
            await Reward.updateOne({userId: user._id, savedAtDate: {$gte: rewardSavedAtDateDay}}, {
                rewardDAC: rewardTodayForUser.rewardDAC + amountDAC,
                savedAtDate: rewardSavedAtDate,
            });
        }
        else {
            rewardTodayForUser = new Reward({
                userId: user._id,
                rewardDAC: amountDAC,
                savedAtDate: rewardSavedAtDate,
            })
            await rewardTodayForUser.save();
        }

        sendNotification(fcmRegistrationTokens, 'DAnke daily reward','Killing it as always! Here\'s your reward!');
        return res.status(200).send('Reward sent successfully!');
    }
    catch(err) {
        return res.status(404).send(err);
    }
});

// TODO: get all reward objects registered today for all users to retrieve in the leaderboard screen
router.get('/todayRewards', async (req, res) => {
    var today = new Date(); today.setHours(0,0,0,0);
    var todayRewardsResponse = [];
    const todayRewards = await Reward.find({savedAtDate: {$gte: today}});
    const users = await User.find({});

    // basically no reward today for no user.
    // so return all registered users with reward 0
    if(todayRewards.length === 0) {
        todayRewardsResponse = users.map((user) => {
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                photo: user.photo,
                phoneNumber: user.phoneNumber,
                rewardToday: 0
            }
        });
        return res.status(200).send(todayRewardsResponse);
    }
    
    todayRewardsResponse = users.map((user) => {
        var rewardTodayForThatUser = 0;
        for(i=0;i<todayRewards.length;i++) {
            if(todayRewards[i].userId.equals(user._id)) {
                rewardTodayForThatUser = todayRewards[i].rewardDAC;
            }
        }
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phoneNumber: user.phoneNumber,
            rewardToday: rewardTodayForThatUser
        }
    });

    return res.status(200).send(todayRewardsResponse);
});

// TODO: get all user specific rewards with period specified in req.query (lastNdays=7)
router.get('/userRewards/:userId', async (req, res) => {
    const userId = req.params.userId;
    var {lastNdays} = req.query;
    const user = User.findOne({_id: userId});
    if(!user) {
        return res.status(404).send('Cannot find user!');
    }
    if(lastNdays < 0 || lastNdays > 7 || typeof(lastNdays) !== "number") {
        lastNdays = 7;
    }

    const userRewards = await Reward.find({
        userId: userId,
        savedAtDate: {
            $gte: new Date((new Date().getTime() - (lastNdays * 24 * 60 * 60 * 1000)))
        }
    })
    .sort({savedAtDate: -1});

    return res.status(200).send(userRewards);
});

module.exports = router;