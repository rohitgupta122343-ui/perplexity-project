
import mongoose from "mongoose";

export async function ConnectToDb(){
   await mongoose.connect(process.env.MONGO_URI)

   console.log('connected To DB');
   
}