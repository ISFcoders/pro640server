'use strict';

const mailer = require('./base');

function sendVerificationMail(username, to, link) {
    const subject = 'Подтверждение регистрации учетной записи на сайте k6040.ru';
    const html = `Здравствуйте!` +
        `<br /><br />` +
        `Новая учетная запись <strong>${ username }</strong> была зарегистрирована на сайте <a href="http://k6040.ru/">k6040.ru</a>, ` +
        `где в качестве электронной почты был указан адрес ${ to }.` +
        `<br />` +
        `Для того, чтобы завершить процедуру регистрации, необходимо подтвердить адрес почты пройдя по ссылке ниже:` +
        `<br />` +
        `<a href="${ link }">${ link }</a>` +
        `<br /><br />` +
        `Пожалуйста, проигнорируйте это письмо, если оно попало к вам по ошибке.`;
    mailer.sendMail(to, subject, html);
}

module.exports.sendVerificationMail = sendVerificationMail;
