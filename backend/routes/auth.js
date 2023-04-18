const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const createAndAssignJWT = (user, res) => {
    // Create and assign JWT for this session
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn:'30d'});
    res.status(200).header('auth-token-danke', token).send(
        {
            id: user._id,
            token: token,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phoneNumber: user.phoneNumber,
            fcmRegistrationToken: user.fcmRegistrationToken
        });
}
const registerUser = async(req, res) => {

    // create a new user.
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        phoneNumber: req.body.phoneNumber,
        fcmRegistrationToken: req.body.fcmRegistrationToken
    });

    try {
        const savedUser = await user.save();
        createAndAssignJWT(savedUser, res);
    }
    catch(err) {
        res.status(400).send(err);
    }
}

router.post('/social-auth', async(req, res) => {

    // check if email exists in the database -- that means user already signed up with google
    const user = await User.findOne({email: req.body.email});

    // if not, register user.
    if(!user) {
        registerUser(req, res);
        return;
    }

    // social media picture may differ from login to login.
    // so update it.
    // same case for firebase cloud messaging token
    await User.updateOne({_id: user._id}, {
        photo: req.body.photo,
        fcmRegistrationToken: req.body.fcmRegistrationToken
    });

    // create and assign JWT for this session.
    createAndAssignJWT(user, res);
});

router.post('/wallet-auth', async(req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(404).send('user does not exist! can\'t authenticate the wallet!');
    }
    const walletAddress = req.body.walletAddress;
    if(!walletAddress) return res.status(400).send('wallet address not provided! cannot continue');
    user.walletAddress = walletAddress;
    try {
        await user.save();
        return res.status(200).send('user wallet address saved!');
    }
    catch(err) {
        return res.status(400).send(err);
    }
});

module.exports = router;