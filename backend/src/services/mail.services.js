import dotenv from 'dotenv'
dotenv.config()

import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.GOOGLE_USER,
        pass:process.env.GOOGLE_APP_PASSWORD
    }
})




transport.verify().then((res)=>{
    console.log("Email transporter is ready to send emails",res);
}).catch((err)=>{
     console.error("Email transporter verification failed:",err);
})



export async function sendEmail({to,subject,html}){

    const res = await transport.sendMail({
        from : process.env.GOOGLE_USER,
        to,
        subject,
        html
    })
    

    
}