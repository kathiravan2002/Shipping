import express from "express";
import {track} from "../Controller/Trackcontroller.js"



const Trackrouter = express.Router();

Trackrouter.get("/track/:orderId" , track)


export default Trackrouter;