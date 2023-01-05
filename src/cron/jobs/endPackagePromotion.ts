import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"
import moment from 'moment'
export const endPackagePromotion =async()=>{
  let today = moment().format('YYYY-MM-DD HH:MM');
  const promotionalPackages:any = await app.services.packages.find({query:{type:DEFAULT_VALUES.packagesTypes.PROMOTION, promotionEndDate:{$lt:today}}})
  // const promotionalPackages:any = await app.services.packages.find(async (packages:any) => packages.type === )
  promotionalPackages.map(async(_package:any) =>{
    await app.services.packages.patch(_package.id, {isActive:false}) 
    //notify admins
    const admins:any = await app.services.users.find({query:{isAdmin:true}})
    admins.data.map(async (user:any) =>{
      await app.services.notification.create({ userId: user.id,
        message:`Promotional package ${_package.name}, has ended`
      })
    })
  })
}
