import express, { Request, Response, Router } from "express";
import { View } from "../../helpers/vash/view";
import { permit } from "../../middleware/permit";
import { GeneralUtils } from "../../helpers/Shared";
import galleryModel from "../../Models/galleryModel";
import { GalleryViewModel } from "../../viewModels/galleryViewModel";
const router: Router = express.Router();

//Only allow admin here
router.use(permit(["homecenter-admin"]));

/**
 * GET:/Admin/Gallery/index
 */
router.get("/index", async (_, res) => {

    try {

        let model = await galleryModel.find({ isActive: true });
        return res.render("Admin/Gallery/index", View(res, GalleryViewModel, model));

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }

});

/**
 * GET:/Admin/Gallery/create
 */
router.get("/create", (req: Request, res: Response) => {
    return res.render("Admin/Gallery/create", View(res, GalleryViewModel));
});

/**
 * POST:/Admin/Gallery/create
 */
router.post("/create", async (req: Request, res: Response) => {

    try {

        //Make sure we have a file
        if(!req.files)
            return res.redirect("/Admin/Gallery/Create")


        //upload file
        let fileName: string[] = await GeneralUtils.UploadFiles({
            files: req.files.image,//this needs defined or it craps itself
            limit: 1,
            accept: ["image/png", "image/jpg", "image/jpeg", "image/gif"]
        });

        //make sure we got a picture back
        if(fileName.length == 0)
            throw new Error("Filename not returned\n");

        let newGalleryPost = {
            name: fileName[0],
            createdBy: res.locals.authentication.id,
            isPublic: req.body.isPublic
        }

        let project = new galleryModel(newGalleryPost);
        await project.save();

        return res.redirect("/Admin/Gallery/Index");

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }

});

/**
 * GET:/Admin/Gallery/edit
 */
router.get("/edit:id?", async (req: Request, res: Response) => {
    let id = req.query.id;

    try {

        let model = await galleryModel.findOne({ _id: id });
        
        return res.render("Admin/Gallery/edit", View(res, GalleryViewModel, model));

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }


});

/**
 * POST:/Admin/Gallery/edit
 */
router.post("/edit:id?", async (req: Request, res: Response) => {

    try {
        
        if(req.files)
        {
            let fileNames: string[] = await GeneralUtils.UploadFiles({
                files: req.files.image,//this needs defined or it craps itself
                limit: 1,
                accept: ["image/png", "image/jpg", "image/jpeg", "image/gif"]
            });

            GeneralUtils.DeactivateFiles([req.body.name]);

            req.body.name = fileNames[0];
        }

        //update meta info
        req.body.updatedOn = Date.now();
        req.body.updatedBy = GeneralUtils.GetLoggedInUserId(res);

        //Save
        await galleryModel.updateOne({ _id: req.body.id }, req.body);


        return res.redirect("/Admin/Gallery/Index");

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }


});

/**
 * GET:/Admin/Gallery/details
 */
router.get("/details:id?", async (req: Request, res: Response) => {
    let id = req.query.id;

    try {

        let model = await galleryModel.findOne({ _id: id });
        return res.render("Admin/Gallery/details", View(res, GalleryViewModel, model));

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }
});

/**
 * GET:/Admin/Gallery/delete
 */
router.get("/delete:id?", async (req: Request, res: Response) => {
    let id = req.query.id;

    try {

        let model = await galleryModel.findOne({ _id: id });
        return res.render("Admin/Gallery/delete", View(res, GalleryViewModel, model));

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }
});

/**
 * POST:/Admin/Gallery/delete
 */
router.post("/delete", async (req: Request, res: Response) => {

    try {

        await galleryModel.findOneAndUpdate({ _id: req.body.id }, {
            isActive: false,
            updatedOn: Date.now(),
            updatedBy: GeneralUtils.GetLoggedInUserId(res)
        });
        
        return res.redirect("/Admin/Gallery/Index");

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }

});


export default router;
