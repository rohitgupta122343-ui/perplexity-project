
import { Router } from "express";
const authRouter = Router()

import { registerContoller,loginController,verifyEmail, getMe,logout } from "../controller/authController.js";
import { registerValid,loginValid } from "../validator/registerValidation.js";
import { authUser } from "../middleware/auth.middleware.js";


authRouter.post('/register',registerValid,registerContoller)

authRouter.post('/login',loginValid,loginController)

authRouter.get('/logout',authUser,logout)

authRouter.get('/get-me',authUser,getMe)

authRouter.get('/verify-email',verifyEmail)

app.get("/test-mail", async (req, res) => {

  try {

    await sendEmail({
      to: "yourmobilegmail@gmail.com",
      subject: "Mobile Test",
      html: "<h1>Email working on mobile 🚀</h1>"
    })

    res.send("EMAIL SENT")

  } catch (err) {

    console.log(err)

    res.send("FAILED")
  }
})



export default authRouter