/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
const _ = require('lodash');
const MailComposer = require('nodemailer/lib/mail-composer');

const config = require('../../config/config');
const defaultLogger = require('../../logger');
const generateCompiledHbs = require('../../utils');

const sendEmail = async body => {
  const {
    subject, toEmail, message, type, data, template, fromEmail,
  } = body;

  let toEmails = [];
  if (!_.isArray(toEmail)) {
    toEmails = [toEmail];
  } else {
    toEmails = toEmail;
  }

  try {
    // AWS SESv2 configuration
    const sesClient = new SESv2Client({
      region: config.AWS_SES.REGION,
      credentials: {
        accessKeyId: config.AWS_SES.ACCESS_KEY,
        secretAccessKey: config.AWS_SES.SECRET_KEY,
      },
    });

    let sendObj = {
      fromEmail: fromEmail || config.AWS_SES.DEFAULT_EMAIL_COMPOSER,
      subject,
    };

    // eslint-disable-next-line no-unused-vars
    for (const email of toEmails) {
      sendObj = {
        ...sendObj,
        to: email,
      };

      if (type === 'TEXT') {
        sendObj.text = message;
      } else {
        const htmlBody = generateCompiledHbs(template, data);
        sendObj.html = htmlBody;
      }

      // Send email with AWS-SES service
      const mailData = await new MailComposer(sendObj).compile().build();

      const params = {
        Content: { Raw: { Data: mailData } },
        Destination: {
          ToAddresses: [email],
        },
        FromEmailAddress: sendObj.fromEmail,
      };

      // Send email with AWS SESv2
      const command = new SendEmailCommand(params);
      const sendInstance = await sesClient.send(command);

      defaultLogger(`AWS-SES EMAIL ID: ${sendInstance.MessageId}`, null, 'info');
    }
  } catch (exec) {
    defaultLogger('ERROR WHILE SENDING AN EMAIL WITH AWS-SES  > ', null, 'error');
  }
};

module.exports = sendEmail;
