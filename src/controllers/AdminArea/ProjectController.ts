import express, { Request, Response, Router } from "express";
import { ProjectViewModel } from "../../viewModels/projectViewModel";
import { View } from "../../helpers/vash/view";
import { permit } from "../../middleware/permit";
import projectModel from "../../Models/projectModel";
import { Shared } from "../../helpers/Shared";
const router: Router = express.Router();

//Only allow admin here
router.use(permit(["homecenter-admin"]));

/**
 * GET:/Admin/Project/index
 */
router.get("/index", async (req, res) => {

    try {

        let model = await projectModel.find({ isActive: true });
        return res.render("Admin/Projects/index", View(res, ProjectViewModel, model));

    } catch (err) {
        Shared.sendErrorNotification(err);
    }
});

/**
 * GET:/Admin/Project/create
 */
router.get("/create", (req: Request, res: Response) => {
    res.render("Admin/Projects/create", View(res, ProjectViewModel));
});

/**
 * POST:/Admin/Project/create
 */
router.post("/create", async (req: Request, res: Response) => {

    try {
        let newProject = {
            name: req.body.name,
            description: req.body.description,
            url: req.body.url,
            imageUrl: "",
            createdBy: res.locals.authentication.id
        }
        if (req.files) {

            let fileNames: string[] = await Shared.UploadFiles({
                files: req.files.image,//this needs defined or it craps itself
                limit: 1,
                accept: ["image/png", "image/jpg", "image/jpeg", "image/gif"]
            });

            if (fileNames.length > 0) {
                newProject.imageUrl = fileNames[0];
            }
        }

        let project = new projectModel(newProject);

        await project.save();
        return res.redirect("/Admin/Projects/Index");

    } catch (err) {
        Shared.sendErrorNotification(err);
    }
});

/**
 * GET:/Admin/Project/edit
 */
router.get("/edit:id?", async (req: Request, res: Response) => {
    let id = req.query.id;

    try {

        let model = await projectModel.findOne({ _id: id });
        return res.render("Admin/Projects/edit", View(res, ProjectViewModel, model));

    } catch (err) {
        Shared.sendErrorNotification(err);
    }
});

/**
 * POST:/Admin/Project/edit
 */
router.post("/edit:id?", async (req: Request, res: Response) => {
    let id = req.query.id;

    try {

        //check to update image
        if (req.files) {

            //process it
            let fileNames: string[] = await Shared.UploadFiles({
                files: req.files.image,//this needs defined or it craps itself
                limit: 1,
                accept: ["image/png", "image/jpg", "image/gif"]
            });

            //deactivate the old files
            Shared.DeactivateFiles([req.body.imageUrl]);

            //add reference
            if (fileNames.length != 0) {
                req.body.imageUrl = fileNames[0];
            }

        }

        await projectModel.updateOne({ _id: req.body.id }, req.body);
        return res.redirect("/Admin/Projects/Index");

    } catch (err) {
        Shared.sendErrorNotification(err);
    }

});

/**
 * GET:/Admin/Project/details
 */
router.get("/details:id?", async (req: Request, res: Response) => {
    let id = req.query.id;

    try {

        let model = await projectModel.findOne({ _id: id });
        return res.render("Admin/Projects/details", View(res, ProjectViewModel, model));

    } catch (err) {
        Shared.sendErrorNotification(err);
    }
});

/**
 * GET:/Admin/Project/delete
 */
router.get("/delete:id?", async (req: Request, res: Response) => {
    let id = req.query.id;

    try {

        let model = await projectModel.findOne({ _id: id });
        return res.render("Admin/Projects/delete", View(res, ProjectViewModel, model));

    } catch (err) {
        Shared.sendErrorNotification(err);
    }
});

/**
 * POST:/Admin/Project/delete
 */
router.post("/delete", async (req: Request, res: Response) => {
    try {

        await projectModel.findOneAndUpdate({ _id: req.body.id }, { isActive: false });
        return res.redirect("/Admin/Projects/Index");

    } catch (err) {
        Shared.sendErrorNotification(err);
    }
});

export default router;
