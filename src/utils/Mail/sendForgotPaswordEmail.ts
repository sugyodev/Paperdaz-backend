import nodemailer from "nodemailer";
import app from "../../app";

export const sendForgotPasswordMail = (email: string, link: string,) =>{
  var sender = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: app.get('email_user'),
      pass: app.get('email_password')
    }
  });

  var mail = {
    from: "info@paperdaz.com",
    to: email,
    subject: "Reset your Paperdaz Password",
    html:`<p>${link}</p>`,
  };

  sender.sendMail(mail, function(error, info) {
    if (error) {
      console.log(error);
      return
    } else {
      console.log("Email sent successfully: " + info.response);
      return
    }
  });

}

