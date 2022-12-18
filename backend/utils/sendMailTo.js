const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(emailTo, subject, data) {

    const my_emailTo = emailTo;
    const my_token = token;
    const my_subject = subject;
    const my_data = data;

    const mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.mailadd,
            pass: process.env.mailpass
        }
    });

    const mailOptions = {
        from: 'DAnke',
        to: my_emailTo,
        subject: my_subject,
        html: `<p>Hello, take this: ${my_data}.</p>`
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