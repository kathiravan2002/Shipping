
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

