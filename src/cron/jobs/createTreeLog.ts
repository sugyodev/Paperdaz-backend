import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"
import { sendPlantTree } from "../../utils/email-sender/plant-tree";

export const createTree =async()=>{
    const maxLeaves:any = await app.services["admin-settings"].find({query:{name: DEFAULT_VALUES.adminSettings.MAX_LEAVES}})
    const users:any = await app.services.users.find({query:{totalLeavesEarned:{$gte: maxLeaves[0].value}}});
    users.data.map(async(user:any )=>{
      await app.services.users.patch(user.id, {totalLeavesEarned: user.totalLeavesEarned - maxLeaves[0].value})
      await app.services["plant-tree"].create({
        userId: user.id,
        
      })
      await app.services.notification.create({ userId: user.id,
        message:"Congratulation you now have enough leaves and a tree will be planted in your name"
      })
      await sendPlantTree(user, maxLeaves[0].value)
    })
}
