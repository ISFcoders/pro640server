'use strict';

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const config = require('../common/configs-reader').getServerConfig();
const configMailer = config['mailer']['qlfund_yndx'];

const transporter = nodemailer.createTransport(smtpTransport({
    service: configMailer['service'],
    host: configMailer['host'],
    auth: {
        user: configMailer['user'],
        pass: configMailer['password']
    }
}));

function sendMail(to, subject, html) {
    const mailOptions = {
        from: configMailer['user'],
        to: to,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.sendMail = sendMail;
