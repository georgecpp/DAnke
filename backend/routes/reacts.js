const sendNotification = require('../firebase/sendNotification');
const User = require('../model/User');
const React = require('../model/React');
const router = require('express').Router();
require('dotenv').config();

router.post('/sendReact', async (req, res) => {
    try {
        const userTo = await User.findOne({_id: req.body.userTo});
        if(!userTo) {
            return res.status(404).send('User To not found! Can\'t send react!');
        }
        const userFrom = await User.findOne({_id: req.body.userFrom});
        if(!userFrom) {
            return res.status(404).send('User From found! Can\'t send reward!');
        }
        const reactType = req.body.reactType;
        const reactSavedAtDate = new Date();
        const reactSaved = new React({
            userTo: userTo,
            userFromId: userFrom,
            userFromName: userFrom.name,
            userFromImage: userFrom.photo,
            reactType: reactType,
            savedAtDate: reactSavedAtDate
        });
        await reactSaved.save();
        var fcmRegistrationTokens = [userTo.fcmRegistrationToken];
        if(reactType === 'like') {
            sendNotification(fcmRegistrationTokens, 'You received a like!',`${userFrom.name} sent you a like 👍`, userFrom.photo);
        }
        else if(reactType === 'congrats') {
            sendNotification(fcmRegistrationTokens, 'Keep it up, champ!',`${userFrom.name} sent you congratulations 🏆`, userFrom.photo);
        }
        else {
            sendNotification(fcmRegistrationTokens, 'You have been roasted!',`${userFrom.name} roasted you 🔥 Get back stronger!`, userFrom.photo);
        }
        return res.status(200).send('React sent successfully!');
    }
    catch(err) {
        return res.status(404).send(err);
    }
});

// TODO: get all user specific reacts with period specified in req.query (lastNdays=7)
router.get('/userReacts/:userId', async (req, res) => {
    const userId = req.params.userId;
    var {lastNdays} = req.query;
    const user = User.findOne({_id: userId});
    if(!user) {
        return res.status(404).send('Cannot find user!');
    }
    if(lastNdays < 0 || lastNdays > 7) {
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