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
const verifyLink =
  `https://perplexity-project-production.up.railway.app/api/auth/verify-email?token=${emailVerficationToken}`

            await sendEmail({
  to:user.email,
  subject: "Verify Email",
  html: `
  <h1>Welcome ${user.username}</h1>
    
  <p>Thank you for registering at <b> Perplexity </b>.</p>
    <p>Click below to verify your email:</p>

    <a href="${verifyLink}">
      Verify Email
    </a>

    <p>Best regards,</p>
    <p>The Perplexity Team</p>

  `
});

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

   res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None"
})

    res.status(201).json({
        messsage : 'user login sucessfully',
        user
    })

    

}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRECT);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.verified = true;
    await user.save();

    const html = `
      <h1>Email verified SucessFully✅</h1>
      <a href="https://perplexity-project-navy.vercel.app/login">
        Go to Login Page
      </a>
    `;

    return res.send(html);

  } catch (err) {
    console.log("VERIFY EMAIL ERROR:", err.message);

    return res.status(400).json({
      message: "Invalid or expired token"
    });
  }
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

