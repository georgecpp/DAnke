const sendNotification = require('../firebase/sendNotification');
const User = require('../model/User');
const Vitals = require('../model/Vitals');

const morningGreet = async () => {
    try {
        const users = await User.find({});
        if(!users) {
            console.log('no one to greet! no users found in db!');
            return;
        }
        var fcmRegistrationTokens = users.map((user) => {return user.fcmRegistrationToken});
        sendNotification(fcmRegistrationTokens, 'DAnke daily', 'Good morning! Time\'s up for an active day 🔥!', 'https://w0.peakpx.com/wallpaper/446/783/HD-wallpaper-jake-the-dog-adventure-time-cartoon.jpg');
        console.log('greeted all users with success!');
    }
    catch(err) {
        console.log(err);
        return;
    }
}

const afternoonRemind = async () => {
    try {
        const users = await User.find({});
        if(!users) {
            console.log('no one to remind! no users found in db!');
            return;
        }
        var fcmRegistrationTokens = users.map((user) => {return user.fcmRegistrationToken});
        sendNotification(fcmRegistrationTokens, 'DAnke daily', 'Me again! At 20:00 I will calculate your reward ₿!', 'https://download.logo.wine/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.png');
        console.log('afternoon reminded all users with success!');
    }
    catch(err) {
        console.log(err);
        return;
    }
}

const rewardUsers = async () => {
    // go for each user, check if it has vitals stored for today.
    try {
        const users = await User.find({});
        if(!users) {
            console.log('no one to reward! no users found in db!');
            return;
        }
        var startToday = new Date();
        startToday.setHours(0,0,0,0);
        var endToday = new Date();
        endToday.setHours(23,59,59,999);

        users.forEach(async (user) => {
            var fcmRegistrationTokens = [user.fcmRegistrationToken];
            var vitalsTodayForUser = await Vitals.findOne({userId: user._id, savedAtDate: {$lt: endToday, $gte: startToday}});
            if(vitalsTodayForUser) {
                sendNotification(fcmRegistrationTokens, 'DAnke daily reward',`What a day, ${user.name.split(' ')[0]}! Your reward for today: 21 DAC ⚡`, 'https://download.logo.wine/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.png');
            }
            else {
                sendNotification(fcmRegistrationTokens, 'DAnke daily reward','You didn\'t open DAnke today, come back tomorrow!', 'https://i.kym-cdn.com/entries/icons/original/000/027/880/jake.jpg');
            }
        })

        console.log('rewarded all users for today with success!');
    }
    catch(err) {
        console.log(err);
        return;
    }
}

module.exports.morningGreet = morningGreet;
module.exports.afternoonRemind = afternoonRemind;
module.exports.rewardUsers = rewardUsers;