import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"

export const totalRevenue =async()=>{
    let total = 0
    const todaySubscription :any = await app.services.subscriptions.find({query:{$limit: 9999999,isRevenueCounted : false}})
    todaySubscription.data.map(async (subscription:any)=>{
       total += subscription.amount
       await app.services.subscriptions.patch(subscription.id, {isRevenueCounted:true})
    })
    await app.services.revenue.create({
        amount:total
    })

}
