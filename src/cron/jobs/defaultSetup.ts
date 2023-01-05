import axios from "axios"
import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"

export const defaultSetup =async()=>{

    let check:any 

    check = await app.services.leaves.find({query:{action: DEFAULT_VALUES.fileActions.UPLOADED}})    
    if(check.length < 1){
      await app.services.leaves.create({
       action:DEFAULT_VALUES.fileActions.UPLOADED,
       leavesPerAction:5
     })
    }

    check = await app.services.leaves.find({query:{action: DEFAULT_VALUES.fileActions.COMPLETE}})    
    if(check.length < 1){
      await app.services.leaves.create({
       action:DEFAULT_VALUES.fileActions.COMPLETE,
       leavesPerAction:20
     })
    }

    check = await app.services.leaves.find({query:{action: DEFAULT_VALUES.fileActions.CONFIRM}})    
    if(check.length < 1){
      await app.services.leaves.create({
       action:DEFAULT_VALUES.fileActions.CONFIRM,
       leavesPerAction:5
     })
    }

    check = await app.services.leaves.find({query:{action: DEFAULT_VALUES.fileActions.SAVED}})    
    if(check.length < 1){
      await app.services.leaves.create({
       action:DEFAULT_VALUES.fileActions.SAVED,
       leavesPerAction:5
     })
    }

    check = await app.services.leaves.find({query:{action: DEFAULT_VALUES.fileActions.SIGNED}})    
    if(check.length < 1){
      await app.services.leaves.create({
       action:DEFAULT_VALUES.fileActions.SIGNED,
       leavesPerAction:5
     })
    }

    check = await app.services.leaves.find({query:{action: DEFAULT_VALUES.fileActions.SHARED}})    
    if(check.length < 1){
      await app.services.leaves.create({
       action:DEFAULT_VALUES.fileActions.SHARED,
       leavesPerAction:5
     })
    }

}
