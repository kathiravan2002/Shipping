import express from "express";
import {uploadMiddleware,imageupload,imageget } from "../Controller/imagecontroller.js";

const imageRouter = express.Router();


imageRouter.post("/images/:id", uploadMiddleware, imageupload);
imageRouter.get("/imagesget",imageget )

export default imageRouter;
