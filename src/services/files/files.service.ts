// Initializes the `files` service on path `/files`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Files } from './files.class';
import createModel from '../../models/files.model';
import hooks from './files.hooks';
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import { Request, response, Response} from "express";

import handleUpload from '../../middleware/handle-upload';
require("dotenv").config();
// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'files': Files & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/files',

  multer({
    fileFilter: (req: Request, file, cb) => {
      // validate file
      let isValid = false;
      if(file.mimetype == 'application/pdf' || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
        isValid = true;
        cb(null, isValid);
      }else{
        cb(new Error("File type must be in pdf format"));
      }
    },
    storage: multerS3({
      //@ts-ignore
      s3: new aws.S3({
        //@ts-ignore
        accessKeyId: process.env.DO_SPACES_KEY || null,
        //@ts-ignore
        secretAccessKey: process.env.DO_SPACES_SECRET || null,
        //@ts-ignore
        endpoint: process.env.DO_SPACES_ENDPOINT || null,
        signatureVersion: "v4"
      }),
      //@ts-ignore
      bucket: process.env.DO_SPACES_BUCKET || null,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: "public-read",
      key: (req: Request, file, cb): any => {
        // save file to Spaces, you can use / to add folders directory
        const fileName = Date.now().toString() + file.originalname;
        cb(null, `uploaded-pdfs/${fileName}`);

      }
    })

  }).array("upload", 1),
  handleUpload(),
  new Files(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('files');

  service.hooks(hooks);
}
