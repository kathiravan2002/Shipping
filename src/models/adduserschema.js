
import mongoose from "mongoose";
const adduserschema = mongoose.Schema({

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
     role: String, 
   
   
  
   Name:
   {
       type: String,
   },
   ContactNo:
   {
       type: String,
   },
   Dob:
   {
       type: String,
   },
   Doj:
   {
       type: String,
   },
   region :
   {
       type: String,
   },
   status :
   {
       type: String,
   }

 });

 const Adduser = mongoose.model("adduser",adduserschema);
 export default Adduser;