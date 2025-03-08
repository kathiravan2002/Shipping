
import Adduser from "../models/adduserschema.js";

export const adduser = async (req ,res ) => {
    console.log(req.body)
    try{ 
        const saveduser = await new Adduser(req.body).save();
        console.log(saveduser);
        res.send(saveduser);
    }catch (err) {
        console.error(err);
        
    }
}

export const getuser =  async (req, res) => {
    try {
      const query = {};
      Object.keys(req.query).forEach((key) => {
        if (key !== "globalSearch") {
          query[key] = { $in: req.query[key].split(",") };
        }
      });
      if (req.query.globalSearch) {
        query.$or = [
          { Name: { $regex: req.query.globalSearch, $options: "i" } },
          { role:{ $regex: req.query.globalSearch, $options: "i" } },
          { email: { $regex: req.query.globalSearch, $options: "i" } },
          { region: { $regex: req.query.globalSearch, $options: "i" } },
          { Doj: { $regex: req.query.globalSearch, $options: "i" }},
          {Dob: { $regex: req.query.globalSearch, $options: "i" }},
          {status: { $regex: req.query.globalSearch, $options: "i" }},
          {ContactNo: { $regex: req.query.globalSearch, $options: "i" }},
          {password: { $regex: req.query.globalSearch, $options: "i" }}
        ];
      }
  
      const users = await Adduser.find(query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  }
    


// export const getusername = async (req, res) => {
//   try {
//     console.log("Received request for /add/login/getname with user:", req.user);
//     const user = await Adduser.findOne({ email: req.user.email }, 'Name'); // Find by email instead of _id
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     console.log("Found user:", user);
//     res.send({ Name: user.Name }); // Return only the name
//   } catch (err) {
//     console.error("Error in getusername:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

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



export const getFilterOptions = async (req, res) => {
    try {
      const names = await Adduser.distinct("Name");
      const roles = await Adduser.distinct("role");
      const emails = await Adduser.distinct("email");
      const contactNos = await Adduser.distinct("ContactNo");
      const dobs = await Adduser.distinct("Dob");
      const dojs = await Adduser.distinct("Doj");
      const regions = await Adduser.distinct("region");
      const statuses = await Adduser.distinct("status");
  
      res.json({
        Name: names,
        role: roles,
        email: emails,
        ContactNo: contactNos,
        Dob: dobs,
        Doj: dojs,
        region: regions,
        status: statuses,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching filter options", error: error.message });
    }
  }




