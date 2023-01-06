const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
require('dotenv').config();
const fs = require("fs");
const path = require("path");

const { EMAIL_HOST, ETHEREAL_USER, ETHEREAL_PASS, EMAIL_SENDER, EMAIL_PORT } = process.env;

const sendEmail = async (email, subject, payload) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: ETHEREAL_USER,
        pass: ETHEREAL_PASS, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, './template/resetPw.handlebars'), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: EMAIL_SENDER,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log({ er1: error });
        return error;
      } else {
        console.log('Email successfully sent');
        return res.status(200).json({ msg: 'success' });
      }
    });
  } catch (error) {
    console.log({ er2: error });
    return error;
  }
};

module.exports = sendEmail;
