import mongoose from "mongoose";
const loginSchema = new mongoose.Schema({
    email:
    { 
       type: String,
       required: true, 
       unique: true 
   },
   password: 
   { 
       type: String, 
       required: true 
   },
   role: 
   { type: String, 
   
        
   },
});

  const Login = mongoose.model("Login", loginSchema);
  export default Login;
