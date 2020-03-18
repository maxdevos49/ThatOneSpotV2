import express, { Router } from "express";
const router: Router = express.Router();
import galleryModel from "../Models/galleryModel";
import { View } from "../helpers/vash/view";
import { GalleryViewModel } from "../viewModels/galleryViewModel";
import { GeneralUtils } from "../helpers/Shared";

/**
 * GET:/Gallery/index
 */
router.get("/index", async (_, res) => {
    
    try {

        let model = await galleryModel.find({ isActive: true, isPublic: true });
        return res.render("Gallery/index", View(res, GalleryViewModel, model));

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }
});

/**
 * GET:/Gallery/index
 */
router.get("/", (_, res) => {
    res.redirect("index");
});


export default router;