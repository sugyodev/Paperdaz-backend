import nodemailer from "nodemailer";
import app from "../../app";
import { DEFAULT_VALUES } from "../constants";
import { email_footer } from "../email-footer";

export const sendSaveFile = async (user: any, attachment:string, file:any) => {
  var sender = nodemailer.createTransport({
    service: "Mailgun",
    auth: {
      user: app.get("email_user"),
      pass: app.get("email_password"),
    },
  });

  let footer = await email_footer()
  let html = `
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
      <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 20px; line-height: 28px; font-family: 'Open Sans', sans-serif;"><strong>Paperlink</strong></span></p>
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
              <img src="${user.profilePicture}" style="width: 40px;height:40px;border-radius:10px;padding: 2px;border: 1px solid #4caf50;object-fit: cover;"/>
          </div>
    
          <div  class="u-col-larger" >
            <p> Hi ${user.companyName ?? user.firstName}</p>
        </div>
      </div>
  <p style="font-size: 14px; line-height: 160%;"> </p>
  <p style="font-size: 14px; line-height: 160%;padding: 1em 0;"><span style="font-size: 18px; line-height: 28.8px;"> One less paper in this world... </span></p>
  <p style="font-size: 14px; line-height: 160%;"> </p>
  <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;"><strong><span style="line-height: 17.8px; font-size: 18px;">Click below to access you file.</span></strong></span></p>
    </div>
  
        </td>
      </tr>
    </tbody>
  </table>
  
  <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
    <tbody>
      <tr>
        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
          
  <div style="padding-left:7%;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Cabin',sans-serif;"><tr><td style="font-family:'Cabin',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:46px; v-text-anchor:middle; width:203px;" arcsize="8.5%" stroke="f" fillcolor="#77b550"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Cabin',sans-serif;"><![endif]-->
      <a href="${app.get("app_url")}/pdf/${file.Paperlink}" target="_blank" style="box-sizing: border-box;display:block;font-family:'Cabin',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;color: #FFFFFF; color: #77b550; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:100%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
        <span style="display:block;padding:0px 0px;line-height:120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong><span style="display:inline-flex;align-items:center;line-height: 19.2px; font-size: 16px;">
          <svg style="padding-right:3px" width="23" height="26" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect width="23" height="26" fill="url(#pattern0)"/>
              <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_6165_3819" transform="translate(-0.363636 -0.139441) scale(0.00621212 0.00573096)"/>
              </pattern>
              <image id="image0_6165_3819" width="800" height="228" xlink:href="data:image/png;base64,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"/>
              </defs>
              </svg>
              
         ${file.fileName}</span></strong></span></span>
      </a>
    <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
  </div>
  
        </td>
      </tr>
    </tbody>
  </table>
  

   ${footer}

  `;
  var mail = {
    from: app.get("email_from"),
    to: user.email,
    subject: "Paperdaz, Paperlink Created",
    attachments:[
      {
        filename: file.fileName,
        path: attachment,
      }
    ],
    html: html
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
