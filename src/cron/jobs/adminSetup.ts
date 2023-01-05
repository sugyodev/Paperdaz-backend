import axios from "axios"
import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"

export const adminSetup = async ()=>{

  const url = app.get('base_url')+'/admin-settings'

     //app settings
    let check:any = await app.services["admin-settings"].find({query:{name: DEFAULT_VALUES.adminSettings.MAX_LEAVES}})    
    if(check.length < 1){
      await app.services["admin-settings"].create({
       name:DEFAULT_VALUES.adminSettings.MAX_LEAVES,
       value:501
     })
    }

    
    check = await app.services["admin-settings"].find({query:{name: DEFAULT_VALUES.adminSettings.REGISTRATION_LEAVES}})
    if(check.length < 1){
      await app.services["admin-settings"].create({
        name:DEFAULT_VALUES.adminSettings.REGISTRATION_LEAVES,
        value:500
      })
    }
    
    check = await app.services["admin-settings"].find({query:{name: DEFAULT_VALUES.adminSettings.REFERRAL_CREDIT}})
    if(check.length < 1){
      await app.services["admin-settings"].create({
        name:DEFAULT_VALUES.adminSettings.REFERRAL_CREDIT,
        value:5
      })
    }

    check = await app.services["admin-settings"].find({query:{name: DEFAULT_VALUES.adminSettings.TOTAL_LEAVES_DISPERSED}})
    if(check.length < 1){
      await app.services["admin-settings"].create({
        name:DEFAULT_VALUES.adminSettings.TOTAL_LEAVES_DISPERSED,
        value:0
      })
    }

    check = await app.services["admin-settings"].find({query:{name: DEFAULT_VALUES.adminSettings.TOTAL_CREDIT_DISPERSED}})
    if(check.length < 1){
      await app.services["admin-settings"].create({
        name:DEFAULT_VALUES.adminSettings.TOTAL_CREDIT_DISPERSED,
        value:0
      })
    }

    check = await app.services["admin-settings"].find({query:{name: DEFAULT_VALUES.adminSettings.LEAVES_PER_FILE}})
    if(check.length < 1){
      await app.services["admin-settings"].create({
        name:DEFAULT_VALUES.adminSettings.LEAVES_PER_FILE,
        value:20
      })
    }

    check = await app.services["admin-settings"].find({query:{name: DEFAULT_VALUES.adminSettings.LEAVES_PER_SHARE}})
    if(check.length < 1){
      await app.services["admin-settings"].create({
        name:DEFAULT_VALUES.adminSettings.LEAVES_PER_SHARE,
        value:5
      })
    }

 

}
