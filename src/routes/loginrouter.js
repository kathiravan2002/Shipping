import express from 'express'
import {login} from "../Controller/logincontroller.js"

 

const Loginrouter = express.Router();

Loginrouter.post("/user" ,login)


export default Loginrouter;