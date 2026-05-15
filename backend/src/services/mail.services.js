import dotenv from 'dotenv'
dotenv.config()

import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
        user:process.env.GOOGLE_USER
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