import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"

export const fakers =async()=>{
  try {
    await app.services.users.create({
        email: "user@test.com",
        password: "password",
        firstName:  "John",
        lastName: "Doe",
        phone:"+19028814649",
        country:"US"
    })
  } catch (error) {

  }
  try {
    await app.services.users.create({
        email: "user2@test.com",
        password: "password",
        firstName:  "John",
        lastName: "Doe",
        phone:"+190288146400",
        country:"US"
    })
  } catch (error) {

  }
  try {
    await app.services.users.create({
        email: "Steave@test.com",
        password: "password",
        firstName:  "Steave",
        lastName: "Doe",
        phone:"+190288146009",
        country:"US"
    })
  } catch (error) {

  }
  try {
    await app.services.users.create({
        email: "lucy@test.com",
        password: "password",
        firstName:  "lucy",
        lastName: "lake",
        phone:"+190288111149",
        country:"US"
    })
  } catch (error) {

  }

  try {
    await app.services.users.create({
        email: "admin@test.com",
        password: "password",
        firstName:  "John",
        lastName: "Doe",
        phone:"+19028814643",
        country:"US",
        role:"super_admin"
    })
  } catch (error) {

  }

  // try {
  //   await app.services["daily-activies"].create({
  //       email: "admin@test.com",
  //       password: "password",
  //       firstName:  "John",
  //       lastName: "Doe",
  //       phone:"+19028814643",
  //       country:"US",
  //       role:"super_admin"
  //   })
  // } catch (error) {

  // }



}
