const sendNotification = require('../firebase/sendNotification');
const Reward = require('../model/Reward');
const sendTransactionDanke = require('../web3/sendTransactionDanke');
require('dotenv').config();

// // Collect the relevant data for each vital sign
// const steps = 7919;
// const heartRateAvg = 76;
// const sleep = "05 h 04m";

const getRewardDAC = (heartRateAvg, steps, sleep) => {
    // Define the weights for each vital sign
    const HEART_RATE_WEIGHT = 0.3;
    const STEPS_WEIGHT = 0.4;
    const SLEEP_WEIGHT = 0.3;

    // Define the target ranges and goals for each vital sign
    const HEART_RATE_TARGET_RANGE = { min: 60, max: 80 };
    const STEPS_GOAL = 10000;
    const SLEEP_TARGET_DURATION = { min: 7, max: 8 };
    
    // Calculate the score for each vital sign
    let heartRateScore = 0;
    if (heartRateAvg >= HEART_RATE_TARGET_RANGE.min && heartRateAvg <= HEART_RATE_TARGET_RANGE.max) {
    heartRateScore = 1;
    } else if (heartRateAvg < HEART_RATE_TARGET_RANGE.min) {
    heartRateScore = heartRateAvg / HEART_RATE_TARGET_RANGE.min;
    } else {
    heartRateScore = HEART_RATE_TARGET_RANGE.max / heartRateAvg;
    }

    let stepsScore = 0;
    if (steps >= STEPS_GOAL) {
    stepsScore = 1;
    } else {
    stepsScore = steps / STEPS_GOAL;
    }

    let sleepScore = 0;
    const sleepDuration = parseFloat(sleep.split(' ')[0]);
    if (sleepDuration >= SLEEP_TARGET_DURATION.min && sleepDuration <= SLEEP_TARGET_DURATION.max) {
    sleepScore = 1;
    } else if (sleepDuration < SLEEP_TARGET_DURATION.min) {
    sleepScore = sleepDuration / SLEEP_TARGET_DURATION.min;
    } else {
    sleepScore = SLEEP_TARGET_DURATION.max / sleepDuration;
    }
    const sleepQualityScore = 0.6; // Assuming poor sleep quality reduces score by 40%
    sleepScore *= sleepQualityScore;

    // Calculate the overall score
    const overallScore = (heartRateScore * HEART_RATE_WEIGHT) + (stepsScore * STEPS_WEIGHT) + (sleepScore * SLEEP_WEIGHT);

    // Assign a reward based on the overall score
    let reward = overallScore * 100;

    return reward;
} 

module.exports = async function(user, heartRateAvg, steps, sleep) {
    try {
        var fcmRegistrationTokens = [user.fcmRegistrationToken];
        const myAddress = process.env.SERVER_WALLET_ADDRESS;
        if(!user.walletAddress) {
            sendNotification(fcmRegistrationTokens, 'DAnke daily reward',`Hey, ${user.name.split(' ')[0]}! No reward since you have no wallet connected!`, 'https://i.kym-cdn.com/entries/icons/original/000/027/880/jake.jpg');
            return;
        }  
        var amountDAC = getRewardDAC(heartRateAvg,steps, sleep);
        // send transaction on blockchain
        await sendTransactionDanke(myAddress, user.walletAddress, amountDAC);
        
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
        sendNotification(fcmRegistrationTokens, 'DAnke daily reward',`What a day, ${user.name.split(' ')[0]}! Your reward for today: ${amountDAC} DAC ⚡`, 'https://download.logo.wine/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.png');
    }
    catch(err) {
        console.log(err);
        return;
    }
}