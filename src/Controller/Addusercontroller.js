
import Adduser from "../models/adduserschema.js";

export const adduser = async (req ,res ) => {

    try{ 
        const saveduser = await new Adduser(req.body).save();
        console.log(saveduser);
        res.send(saveduser);
    }catch (err) {
        console.error(err);
        
    }
}

export const getuser = async (req ,res)  => {
    try{
        const users = await Adduser.find();
        res.send(users);
    }catch (err) {
        console.error(err);
        
    }
}

export const getusername = async (req, res) => {
    try {
  
      const user = await Adduser.findOne({ email: req.user.email });
      
      if (!user) {
        if (req.user.role === "admin") {
          return res.send({ Name: "Admin", role: "admin" }); 
        }
        return res.status(404).json({ error: "User not found" });
      }
  
      res.send({ Name: user.Name || "User", role: user.role || "user" }); // Default to "User" if Name is missing
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const getid = async (req ,res) => {
    try{
        
        const users = await Adduser.findById(req.params.id);
        if (!users) {
            return res.status(404).json({ message: "user not found" });
        }
        res.json(users);
    }catch (err) {
        console.error(err);
         
    }
}

export const updateid = async (req, res) => { 
    const updateuser = await Adduser.findByIdAndUpdate( req.params.id,  req.body, { new: true }  ); 
    if (!updateuser) {
        return res.status(404).json({ message: "User not found" });
    } 
    res.json(updateuser); 
}

