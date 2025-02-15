import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Adduser from '../models/adduserschema.js';
import Login from '../models/loginschema.js';


const seedAdmin = async () => {
    const existingAdmin = await Login.findOne({ email: "admin@gmail.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin@123", 10);
      await Login.create({ email: "admin@gmail.com", password: hashedPassword, role: "admin" });
      console.log("Admin user created");
    }
  };
  seedAdmin();

  export const login =  async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log("Login request received:", req.body);
  
      
      let user = await Login.findOne({ email});
   
      if (!user) { 
        user = await Adduser.findOne({ email,password });
        if (!user) {
          console.log("User not found for email:", email);
          return res.status(401).json({ message: "Invalid email or password" });
        }
      }   
      
      if(user.status === 'inactive'){
        return res.status(403).json({message: "Your account is inactive. Please contact support."})
      }
      
      const tokenPayload = {       
        email: user.email,      
        role: user.role,           
        region : user.region         
      };


      const expiresIn = "10h";
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn});
      const expiresAt = new Date(Date.now() + 10 * 60 * 60 * 1000)
      // const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000)
      res.status(200).json({ message: "Login successful", role: user.role, token , region : user.region , expiresAt: expiresAt.getTime()});

  
    }catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error", error });
    }
   };