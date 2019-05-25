'use strict';

const mailer = require('./base');

function sendVerificationMail(user, link, host) {
    const subject = `Подтверждение регистрации учетной записи на сайте ${ host.name }`;
    const html = `Здравствуйте!` +
        `<br /><br />` +
        `Новая учетная запись <strong>${ user.name }</strong> была зарегистрирована на сайте <a href="${ host.url }">${ host.name }</a>, ` +
        `где в качестве электронной почты был указан адрес ${ user.email }.` +
        `<br />` +
        `Для того, чтобы завершить процедуру регистрации, необходимо подтвердить адрес почты пройдя по ссылке ниже:` +
        `<br />` +
        `<a href="${ link }">${ link }</a>` +
        `<br /><br />` +
        `Пожалуйста, проигнорируйте это письмо, если оно попало к вам по ошибке.`;
    mailer.sendMail(user.email, subject, html);
}

module.exports.sendVerificationMail = sendVerificationMail;
