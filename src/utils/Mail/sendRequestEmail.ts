import nodemailer from "nodemailer";
import app from "../../app";

export const sendRequestMail = (email: string, note: string, file:string) =>{
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
    subject: "Request to complete file",
    html:`<p>${note}</p>`,
    attachments: [
      {
          filename: 'paperdaz.pdf',
          path: file,
      }
    ]
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

