const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(emailTo, token) {

    const my_emailTo = emailTo;
    const my_token = token;

    const mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.mailadd,
            pass: process.env.mailpass
        }
    });

    const mailOptions = {
        from: 'Connexio',
        to: my_emailTo,
        subject: 'Registration Token - Connexio',
        html: `<p>One more step to register in Connexio. Go back to the app and input this token: ${my_token}. The token expires in 15 minutes.</p>`
    };

    mail.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.log(error);
        }
        else {
            console.log('Mail sent successfully!');
        }
    });
}