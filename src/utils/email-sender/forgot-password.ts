import nodemailer from "nodemailer";
import app from "../../app";
import { DEFAULT_VALUES } from "../constants";
import { email_footer } from "../email-footer";

export const sendForgotPassword = async (user: any, forgotPasswordLink:string) => {
  var sender = nodemailer.createTransport({
    service: "Mailgun",
    auth: {
      user: app.get("email_user"),
      pass: app.get("email_password"),
    },
  });

  let admins:any = await app.services.users.find({query:{role: DEFAULT_VALUES.users.roles.SUPER_ADMIN}});
  let admin = admins.data[0];
  let admin_name = admin.firstName +' '+ admin.lastName

  var mail = {
    from: app.get("email_from"),
    to: user.email,
    subject: "Paperdaz, Forgot Password",
    html: `
          <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
          <!--[if gte mso 9]>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <script src="https://cdn.jsdelivr.net/npm/iconify-icon@1.0.0-beta.3/dist/iconify-icon.min.js"></script>
            <script src="https://code.iconify.design/iconify-icon/1.0.0-beta.3/iconify-icon.min.js"></script>
            <title></title>
            
              <style type="text/css">
                @media only screen and (min-width: 620px) {
            .u-row {
              width: 600px !important;
            }
            .u-row .u-col {
              vertical-align: top;
            }
          
            .u-row .u-col-33p33 {
              width: 199.98px !important;
            }
            .u-col-small{
              width: 80.98px !important;
            }
            .u-col-large{
              width: calc(100% - 80.98px) !important;
            }
            .u-col-smaller{
              width: 55.98px !important;
            }
            .u-col-larger{
              width: calc(100% - 55.98px) !important;
              padding-left: 0 !important;
            }
            .u-row .u-col-66p67 {
              width: 400.02px !important;
            }
          
            .u-row .u-col-100 {
              width: 600px !important;
            }
          
          }
          
          @media (max-width: 620px) {
            .u-row-container {
              max-width: 100% !important;
              padding-left: 0px !important;
              padding-right: 0px !important;
            }
            .u-row .u-col {
              min-width: 320px !important;
              max-width: 100% !important;
              display: block !important;
            }
            .u-row {
              width: calc(100% - 40px) !important;
            }
            .u-col {
              width: 100% !important;
            }
            .u-col > div {
              margin: 0 auto;
            }
            .u-col-small{
              width: 80.98px !important;
            }
            .u-col-large{
              width: calc(100% - 80.98px) !important;
            }
            .u-col-smaller{
              width: 55.98px !important;
            }
            .u-col-larger{
              width: calc(100% - 55.98px) !important;
              padding-left: 0 !important;
            }
          }
          body {
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
          }
          
          table,
          tr,
          td {
            vertical-align: top;
            border-collapse: collapse;
          }
          
          p {
            margin: 0;
          }
          
          .ie-container table,
          .mso-container table {
            table-layout: fixed;
          }
          
          * {
            line-height: inherit;
          }
          
          a[x-apple-data-detectors='true'] {
            color: inherit !important;
            text-decoration: none !important;
          }
          
          table, td { color: #000000; } a { color: #0000ee; text-decoration: underline; }
              </style>
            
            
          
          <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css"><!--<![endif]-->
          
          </head>
          
          <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background: #f9f9f9 !important;color: #000000">
            <!--[if IE]><div class="ie-container"><![endif]-->
            <!--[if mso]><div class="mso-container"><![endif]-->
              <main style="background-color: #f9f9f9; padding:1em 0">
            <table style="border-radius:20px;width:100%;max-width:600px; border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
            <tbody>
            <tr style="vertical-align: top">
              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
              
          
          <div class="u-row-container" style="padding: 0px;background:#FFFFFF !important;height: auto;">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                
          <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
            <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
            
          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:'Cabin',sans-serif;" align="left">
                  
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right: 0px;padding-left: 0px;" align="center">
                
                <img align="center" border="0" src="https://assets.unlayer.com/projects/94341/1659802952531-PAPERDAZ1%20(1).png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 40%;max-width: 236px;" width="236"/>
                
              </td>
            </tr>
          </table>
          
                </td>
              </tr>
            </tbody>
          </table>
          
            <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          
          
          
          <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
                
          <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
            
          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
                  
            <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 3px solid #77b550;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
              <tbody>
                <tr style="vertical-align: top">
                  <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <span>&#160;</span>
                  </td>
                </tr>
              </tbody>
            </table>
          
                </td>
              </tr>
            </tbody>
          </table>
          
            <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          
          
          
          <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
                
          <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
            
          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Cabin',sans-serif;" align="left">
                  
            <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
              <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 20px; line-height: 28px; font-family: 'Open Sans', sans-serif;"><strong>Forgot Password</strong></span></p>
            </div>
          
                </td>
              </tr>
            </tbody>
          </table>
          
            <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          
          
          
          <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
                
          <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
            <div style="height: 100%;width: 100% !important;">
            <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
            
          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 55px;font-family:'Cabin',sans-serif;" align="left">
                  
            <div style="line-height: 160%; text-align: left; word-wrap: break-word;">
              <div style="font-size: 14px; line-height: 160%;display: flex;align-items: center;">
                  <div class="u-col-smaller" style="display: inline-block;flex:none">
                      <img src="${user.profilePicture}" style="width: 40px;height:40px;border-radius:55%;padding: 2px;border: 1px solid #4caf50;object-fit: cover;"/>
                  </div>
            
                  <div  class="u-col-larger" >
                      <p> Hi ${user.firstName}</p>
                  </div>
              </div>
          <p style="font-size: 14px; line-height: 160%;"> </p>
          <p style="font-size: 14px; line-height: 160%;padding: 1em 0;"><span style="font-size: 18px; line-height: 28.8px;"> Forgot your password? No worries. We’ve got your back</span></p>
          <p style="font-size: 14px; line-height: 160%;"> </p>
          <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;"><strong><span style="line-height: 17.8px; font-size: 18px;">Click on the link to create a new password.</span></strong></span></p>
            </div>
          
                </td>
              </tr>
            </tbody>
          </table>
          
          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td style="overflow-wrap:break-wsupportord;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
                  
          <div align="center">
            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Cabin',sans-serif;"><tr><td style="font-family:'Cabin',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:46px; v-text-anchor:middle; width:203px;" arcsize="8.5%" stroke="f" fillcolor="#77b550"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Cabin',sans-serif;"><![endif]-->
              <a href="${forgotPasswordLink}" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:'Cabin',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; color: #77b550; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                <span style="display:block;padding:0px 0px;line-height:120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong><span style="line-height: 19.2px; font-size: 16px;">Create New Password</span></strong></span></span>
              </a>
            <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
          </div>
          
                </td>
              </tr>
            </tbody>
          </table>
      ${await email_footer()}
    `,
  };

  sender.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error);
      return;
    } else {
      console.log("Email sent successfully: " + info.response);
      //log here
      return; 
    }
  }); 
};