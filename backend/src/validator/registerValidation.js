
import { body,validationResult } from "express-validator";

const valid =  (req,res,next)=>{

        const errors = validationResult(req)

        if(errors.isEmpty()){
            return next()
        }

        res.status(400).json({
            errors : errors.array() 
        })
    }

  export const registerValid = [

    body('username').isString().withMessage('username must be String'),
        body('email').isEmail().withMessage('email must be email'),
        body('password').isLength({min : 6}).withMessage('password must be at least 6 characters'),
   valid

]

 export const loginValid = [

       
    body('email').isEmail().withMessage('email must be valid'),
    body('password').isLength({ min: 6, max: 12 }).withMessage('password must be 6-12 chars'),
    valid


]