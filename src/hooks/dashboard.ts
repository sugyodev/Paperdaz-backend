// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { CreatedAt } from 'sequelize-typescript';
import app from '../app';
import { DEFAULT_VALUES } from '../utils/constants';
import moment from "moment";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const filesData:any = await app.services.files.find()
    const completedFiles:any = await app.services.files.find({query:{fileAction:DEFAULT_VALUES.fileActions.COMPLETE}})
    const confirmedFiles:any = await app.services.files.find({query:{fileAction:DEFAULT_VALUES.fileActions.CONFIRM}})
    const signedFiles:any = await app.services.files.find({query:{fileAction:DEFAULT_VALUES.fileActions.SIGNED}})
    const sharedFiles:any = await app.services.files.find({query:{fileAction:DEFAULT_VALUES.fileActions.SHARED}})


    let today = moment().format('YYYY-MM-DD');
    let thisWeek = moment().subtract(7,'d').format('YYYY-MM-DD');
    let lastWeek = moment().subtract(14,'d').format('YYYY-MM-DD');
    
    const thisWeekUploadedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek}, isEditing: false}})
    const lastWeekUploadedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek, $lte:thisWeek}, isEditing: false}})
    const thisWeekCompletedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek}, fileAction:DEFAULT_VALUES.fileActions.COMPLETE}})
    const lastWeekCompletedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek, $lte:thisWeek}, fileAction:DEFAULT_VALUES.fileActions.COMPLETE}})
    const thisWeekConfirmedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek}, fileAction:DEFAULT_VALUES.fileActions.CONFIRM}})
    const lastWeekConfirmedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek, $lte:thisWeek}, fileAction:DEFAULT_VALUES.fileActions.CONFIRM}})
    const thisWeekSignedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek}, fileAction:DEFAULT_VALUES.fileActions.SIGNED}})
    const lastWeekSignedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek, $lte:thisWeek}, fileAction:DEFAULT_VALUES.fileActions.SIGNED}})
    const thisWeekSharedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek}, fileAction:DEFAULT_VALUES.fileActions.SHARED}})
    const lastWeekSharedFile:any = await app.services.files.find({query:{createdAt:{$gte:lastWeek, $lte:thisWeek}, fileAction:DEFAULT_VALUES.fileActions.SHARED}})


    const  getPercentage =(oldData:any, newData:any )=>{
        return ((newData - oldData) / (newData + oldData)) * 100
    }


    var fileStat = {
        uploaded: filesData.total,
        uploadedPercentage: getPercentage(lastWeekUploadedFile.total, thisWeekUploadedFile.total),
        completed: completedFiles.total,
        completedPercentage: getPercentage(lastWeekCompletedFile.total, thisWeekCompletedFile.total),
        confirm: confirmedFiles.total,
        confirmedPercentage: getPercentage(lastWeekConfirmedFile.total, thisWeekConfirmedFile.total),
        signed: signedFiles.total,
        signedPercentage: getPercentage(lastWeekSignedFile.total, thisWeekSignedFile.total),
        shared: sharedFiles.total,
        sharedPercentage: getPercentage(lastWeekSharedFile.total, thisWeekSharedFile.total),
    }

    const users:any = await app.services.users.find({query:{role:{$nin:[DEFAULT_VALUES.users.roles.TEAM_MEMBER, DEFAULT_VALUES.users.roles.SUPER_ADMIN, DEFAULT_VALUES.users.roles.ADMIN]}}})
    const paidUsers:any = await app.services.users.find({query:{role:DEFAULT_VALUES.users.roles.PAID_USER}})
    const freeUsers:any = await app.services.users.find({query:{role:DEFAULT_VALUES.users.roles.FREE_USER}})
    const paidRefUsers:any = await app.services.users.find({query:{role:DEFAULT_VALUES.users.roles.PAID_USER, referreeId:{$ne:null}}})
    const freeRefUsers:any = await app.services.users.find({query:{role:DEFAULT_VALUES.users.roles.FREE_USER, referreeId:{$ne:null}}})

    //user stat
    let paidUserPercent= 0
    let freeUserPercent= 0
    freeUserPercent = getPercentage( paidUsers.total, freeUsers.total)
    paidUserPercent =  100 - (freeUserPercent < 0 ? freeUserPercent * (-1) : freeUserPercent)

    //referal start
    const getReferalPercent=(data:number)=>{
      let total: number = paidUsers.total + freeUsers.total + paidRefUsers.total + freeRefUsers.total
     return  (( data/total ) * 100)
    }
    
     

    var userStat = {
        paidUsersPercentage: paidUserPercent < 0 ? paidUserPercent * (-1) : paidUserPercent,
        freeUsersPercentage: freeUserPercent < 0 ? freeUserPercent * (-1) : freeUserPercent,
    }
    var referalStat = {
        businessReferals: getReferalPercent(paidRefUsers.total),
        businessUser: getReferalPercent(paidUsers.total),
        freeReferals: getReferalPercent(freeRefUsers.total),
        freeUsers: getReferalPercent(freeUsers.total)
    }
    var totalTree:any = await app.services['plant-tree'].find();


    let thisMonth = moment().subtract(30,'d').format('YYYY-MM-DD');
    let lastMonth = moment().subtract(60,'d').format('YYYY-MM-DD');
    let thisMonthRevenue: any = await app.services.revenue.find({query:{createdAt:{$gte:thisMonth}}}) 
    let lastMonthRevenue: any = await app.services.revenue.find({query:{createdAt:{$gte:thisMonth, $lte:lastMonth}}}) 
    let totalRevenueThisMonth = 0
    let totalRevenueLastMonth = 0
    thisMonthRevenue.map((revenue: any) => totalRevenueThisMonth += revenue.amount)
    lastMonthRevenue.map((revenue: any) => totalRevenueLastMonth += revenue.amount)
    var totalRevenue={
      totalRevenueThisMonth,
      totalRevenueLastMonth
    }
  
    context.result ={
        fileStat,
        userStat,
        referalStat,
        totalTree : totalTree.total,
        totalRevenue
      }
    

    return context;
  };
};
