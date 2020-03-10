import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import { HomeViewModel } from "../viewModels/homeViewModel";
import projectModel from "../Models/projectModel";
import { View } from "../helpers/vash/view";
import galleryModel from "../Models/galleryModel";


/**
 * GET:/index
 */
router.get("/index", async (req: Request, res: Response) => {

    let model = {
        recentProjects: await projectModel.find({isActive: true}).sort({date: "desc"}).limit(4),
        recentGallery: await galleryModel.find({isActive: true}).sort({date: "desc"}).limit(4),
        //TODO blogs
    }

    res.render("Home/index", View(res, HomeViewModel, model));
});

/**
 * GET:/index
 */
router.get("/", async (req: Request, res: Response) => {
    
    let model = {
        recentProjects: await projectModel.find({isActive: true}).sort({date: "desc"}).limit(4),
        recentGallery: await galleryModel.find({isActive: true}).sort({date: "desc"}).limit(4),
        //TODO blogs
    }

    res.render("Home/index", View(res, HomeViewModel, model));
});

/**
 * GET:/resume
 */
router.get("/resume", (req: Request, res: Response) => {
    res.render("Home/resume");
});




export default router;
