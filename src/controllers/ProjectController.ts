import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import projectModel from "../Models/projectModel";
import { View } from "../helpers/vash/view";
import { ProjectViewModel } from "../viewModels/projectViewModel";
import { GeneralUtils } from "../helpers/Shared";

/**
 * GET:/Project/index
 */
router.get("/index", async (_, res: Response) => {

    let model = await projectModel.find({isActive: true, isPublic: true});

    res.render("Projects/index", View(res, ProjectViewModel, model));
});

/**
 * GET:/Project/index
 */
router.get("/", (_, res: Response) => {
    res.redirect("/index");
});

/**
 * GET:/Projects/project?id=<project>
 */
router.get("/project:id?", async (req: Request, res: Response) => {
    let projectId = req.query.id;

    if(projectId == null)
        res.redirect("/projects/index")

    try{

        if(await projectModel.exists({isActive: true, isPublic: true, projectType: "Internal", url: projectId}))
            return res.render("Projects/" + projectId);

        return res.redirect("/projects/index")

    }catch(err){
        GeneralUtils.sendErrorNotification(err);
    }
    
});


export default router;
