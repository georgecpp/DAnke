const User = require('../model/User');
const Vitals = require('../model/Vitals');

const router = require('express').Router();
require('dotenv').config();

// save / update the vitals in db for current user
router.post('/saveVitals', async (req, res) => {

    // check if user exists
    const user = await User.findOne({_id: req.body.userId});
    if(!user) {
        return res.status(404).send('User not found! Can\'t save vitals!');
    }
    
    // get request date and check if already registered for today, if so, update, else just save
    const reqSavedAtDate = req.body.savedAtDate; if (!reqSavedAtDate) return res.status(400).send('No date was provided for saving vitals');
    var reqSavedAtDateDay = new Date(reqSavedAtDate); reqSavedAtDateDay.setHours(0,0,0,0);
    const steps = req.body.steps; if(!steps) return res.status(400).send('No steps were provided. can\'t continue!');
    const heartRateAvg = req.body.heartRateAvg; if(!heartRateAvg) return res.status(400).send('No heartRateAvg provided! Cannot continue!');
    const sleep = req.body.sleep; if(!sleep) return res.status(400).send('No sleep provided! Cannot continue!');
    
    var vitalsTodayForUser = await Vitals.findOne({userId: user._id, savedAtDate: {$lt: reqSavedAtDate, $gte: reqSavedAtDateDay}});
    if(vitalsTodayForUser) {
        await Vitals.updateOne({userId: user._id, savedAtDate: {$lt: reqSavedAtDate, $gte: reqSavedAtDateDay}}, {
            steps: steps,
            heartRateAvg: heartRateAvg,
            sleep: sleep,
            savedAtDate: reqSavedAtDate
        });
    }
    else {
        vitalsTodayForUser = new Vitals({
            userId: user._id,
            steps: steps,
            heartRateAvg: heartRateAvg,
            sleep: sleep,
            savedAtDate: reqSavedAtDate
        })

        await vitalsTodayForUser.save();
    }
    return res.status(200).send('Vitals saved successfully!');
    
})

module.exports = router;