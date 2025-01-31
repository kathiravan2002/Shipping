import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];  
  // console.log("Received Token:", token);  
  try {
     
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded); // Debug log for decoded token
    req.user = decoded;

    next();  
  } catch (err) {
    console.error("Error verifying token:", err.message);  
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

 
export const authorizeRoles = (roles) => (req, res, next) => {
  // Check if the user is logged in and has a valid role
  if (!req.user || !roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient permissions" });
  }

  next();  
};

