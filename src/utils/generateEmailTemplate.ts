import fs from 'fs';
import path from 'path';
export const generateHtmlTemplate = (type?:string, user?:any, business?:any, file?:any, link?:any, admin?:any) =>{

    fs.readFile('././public/email-templates/registration-template.html', 'utf8' , (err, data) => {
        if (err) {
          console.error(err);
          return
        }
        console.log(data);
      });
   
 }