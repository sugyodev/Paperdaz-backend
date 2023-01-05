
import cron from  'node-cron'
import { endPackagePromotion } from './jobs/endPackagePromotion';
import { autoSubscribe } from './jobs/autoSubscribe';
// import { updateSubcriptionStatus } from './jobs/updateSubcriptionStatus';
import { defaultSetup } from './jobs/defaultSetup';
import { fakers } from './jobs/fakers';
import { adminSetup } from './jobs/adminSetup';
import { createTree } from './jobs/createTreeLog';
import { totalRevenue } from './jobs/dailyTotalRevenue';
import { notify3DaysToBilling } from './jobs/notifyUsers3daysToBilling';



export const jobs = async ()=>{

  //every minute
  cron.schedule('* * * * *', async() => {
    // fakers()
    adminSetup();
    defaultSetup();
    autoSubscribe()
    // createTree()
    endPackagePromotion()
    notify3DaysToBilling()
  });

  //every 5 minute
  // cron.schedule('5 * * * *', async() => {

  // });

  //once aday by 12:00
  cron.schedule('0 0 * * *', async() => {
    totalRevenue()
  });


}
