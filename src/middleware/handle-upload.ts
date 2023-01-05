import { BadRequest } from '@feathersjs/errors';
import { Request, Response, NextFunction } from 'express';
import app from '../app';
import { DEFAULT_VALUES } from '../utils/constants';
export default () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (req: Request, res: Response, next: NextFunction) => {

    const files: any = req.files
    const file = files?.[0]

    if (file) {
      if (req.body.type === DEFAULT_VALUES.fileUploadType.FILE) {
        try {
          const user = await app.services.users.get(req.body.userId)
          // console.log(user)
          if (!user) {
            throw new Error("no user found")
          }
          // leaves reward
          const leaves = await app.services.leaves.find()
          let reward = 0
          //@ts-ignore
          leaves.map((leaf: any) => {
            if (leaf.action === DEFAULT_VALUES.fileActions.SAVED) {
              reward = leaf.leavesPerAction
            }
          })
          //update file
          //if uploaded by a team member
          let userId = req.body.userId
          let uploadedBy = null
          if (user.role === DEFAULT_VALUES.users.roles.TEAM_MEMBER) {
            userId = user.teamId;
            uploadedBy = user.id;
          }
          // const newFile = {}
          let allFiles: any = {};
          allFiles = await app.services.files.find({ query: { fixedFileName: file.originalname } });
          const fileName = allFiles.total > 0 ? file.originalname.replace('.pdf', '') + `(${allFiles.total}).pdf` : file.originalname;
          const newFile = await app.services.files.create({
            fixedFileName: file.originalname,
            fileName: fileName,
            downloadLink: file.location,
            paperLink: Date.now().toString(),
            key: file.key,
            userId: userId,
            role: user.role,
            userName: user.firstName + " " + user.lastName,
            leavesEarned: reward,
            uploadedBy: uploadedBy
          })
          allFiles.aa
          newFile.aa
          // create a leaves daily activities
          // create daily activies

          await app.services['daily-activies'].create({
            action: DEFAULT_VALUES.fileActions.COMPLETE,
            leavesEarned: newFile.leavesEarned,
            userId: user.id,
            fileId: newFile.id
          })

          //updating the user total leaves count
          let totalLeaves = user.totalLeavesEarned + reward
          const updateUser = await app.services.users.patch(req.body.userId, { totalLeavesEarned: totalLeaves })
          // console.log(updateUser)

          return res.status(201).json(newFile).end();

        } catch (error) {
          console.log(error)
          throw new BadRequest("failed to upload file")
        }
      } else if (req.body.type === DEFAULT_VALUES.fileUploadType.PROFILE_PICTURE) {
        const updateUser = await app.services.users.patch(req.body.userId, { profilePicture: file.location })
        console.log("profile picture updated")
        return res.status(201).json(updateUser).end();
      } else if (req.body.type === DEFAULT_VALUES.fileUploadType.SIGNATURE) {
        const updateUser = await app.services.users.patch(req.body.userId, { signatureURL: file.location })
        console.log("signature updated")
        return res.status(201).json(updateUser).end();
      } else if (req.body.type === DEFAULT_VALUES.fileUploadType.INITIAL) {
        const updateUser = await app.services.users.patch(req.body.userId, { initialURL: file.location })
        console.log("initial updated")
        return res.status(201).json(updateUser).end();
      } else if (req.body.type === DEFAULT_VALUES.fileUploadType.PDF) {
        return res.status(201).json(file).end();
      }

    } else {
      return next();
    }


  };
}
