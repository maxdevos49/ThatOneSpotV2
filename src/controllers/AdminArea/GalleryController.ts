import express, { Request, Response, Router } from "express";
import { View } from "../../helpers/vash/view";
import { permit } from "../../middleware/permit";
import { GeneralUtils } from "../../helpers/Shared";
import galleryModel from "../../Models/galleryModel";
import { GalleryViewModel } from "../../viewModels/galleryViewModel";
import { GridFSBucketReadStream } from "mongodb";
const router: Router = express.Router();

//Only allow admin here
router.use(permit(["homecenter-admin"]));

/**
 * GET:/Admin/Gallery/index
 */
router.get("/index", async (req, res) => {

    try {

        let model = await galleryModel.find({ isActive: true });
        return res.render("Admin/Gallery/index", View(res, GalleryViewModel, model));

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }

});

/**
 * GET:/Admin/Project/create
 */
router.get("/create", (req: Request, res: Response) => {
    return res.render("Admin/Gallery/create", View(res, GalleryViewModel));
});

/**
 * POST:/Admin/Gallery/create
 */
router.post("/create", async (req: Request, res: Response) => {

    try {

        let newGalleryPost = {
            name: req.body.name,
            description: req.body.description,
            url: req.body.url,
            imageUrl: "",
            createdBy: res.locals.authentication.id
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
    let id = req.query.id;

    if (id !== req.body.id) {
        //shouldnt be here so we have error
    }

    try {

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

        await galleryModel.findOneAndUpdate({ _id: req.body.id }, { isActive: false });
        return res.redirect("/Admin/Gallery/Index");

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }

});


export default router;
