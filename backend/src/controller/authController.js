import userModel from "../models/userModel.js";
import { sendEmail } from "../services/mail.services.js";
import jwt from 'jsonwebtoken'

export async function registerContoller(req,res){

    try {

        const {username,email,password} = req.body;

       const userExtist = await userModel.findOne({
   $or:[
      { email },
      { username }
   ]
})

        if(userExtist){

   if(userExtist.email === email){
      return res.status(400).json({
         success:false,
         message:'email already exists'
      })
   }

   if(userExtist.username === username){
      return res.status(400).json({
         success:false,
         message:'username already exists'
      })
   }
}

        const user = await userModel.create({
            username,
            email,
            password
        })

        res.status(201).json({
            success:true,
            message : 'user created successfully',
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })

        // background email
        try {

            const emailVerficationToken = jwt.sign(
                {email:user.email},
                process.env.JWT_SECRECT
            )

            await sendEmail({
                to:email,
                subject:'Welcome to Perplexity!',
                html:`
                <p>Hi ${username}</p>

                <a href='https://perplexity-project-vay7.onrender.com/api/auth/verify-email?token=${emailVerficationToken}'>
                Verify Email
                </a>
                `
            })

        } catch(err) {
            console.log("EMAIL ERROR:", err)
        }

    } catch(err) {

        console.log(err)

        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

export async function loginController(req,res){

    const {username,email,password} = req.body

    // const user = await userModel.findOne({
    //     $or:[
    //         {username},
    //         {email}
    //     ]
    // })

     const user = await userModel.findOne({ email })


    if(!user){
        return res.status(404).json({
            message : 'user not found'
        })
    }

    const isPassMatch = await user.comparePassword(password)
   
   
    
    if(!isPassMatch){
        return res.status(400).json({
            message:"Incorrect password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message : 'email not verified'
        })
    }


    const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRECT)

    res.cookie("token",token)

    res.status(201).json({
        messsage : 'user login sucessfully',
        user
    })

    

}

export async function verifyEmail(req,res){


    const {token} = req.query

    const decoded = jwt.verify(token,process.env.JWT_SECRECT)


    const user = await userModel.findOne({email : decoded.email})

    if(!user){
        return res.status(400).json({
            message : 'user not found'
        })
    }

    user.verified = true;

    await user.save()

    const html = `<h1> your email verified </h1>
                    <a href='https://perplexity-project-navy.vercel.app/login'>Go to Login Page</a>`

    res.send(html)
   
}

export async function getMe(req,res){

    const id = req.user.id

    const user = await userModel.findById(id).select('-password')
    
    if(!user){
        res.status(404).json({
            message : 'user not Found'
        })
    }

    res.status(200).json({
        message : 'user found sucessfully',
        user
    })
    
    
}

export async function logout(req, res) {

    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    })

    res.status(200).json({
        message: 'user logout successfully'
    })
}

