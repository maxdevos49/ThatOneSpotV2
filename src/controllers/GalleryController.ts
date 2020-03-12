import express, { Router } from "express";
const router: Router = express.Router();
import galleryModel from "../Models/galleryModel";
import { View } from "../helpers/vash/view";
import { GalleryViewModel } from "../viewModels/galleryViewModel";
import { GeneralUtils } from "../helpers/Shared";

/**
 * GET:/Gallery/index
 */
router.get("/index", async (req, res) => {
    
    try {

        let model = await galleryModel.find({ isActive: true });
        return res.render("Gallery/index", View(res, GalleryViewModel, model));

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }
});

/**
 * GET:/Gallery/index
 */
router.get("/", async (req, res) => {
    try {

        let model = await galleryModel.find({ isActive: true });
        return res.render("Gallery/index", View(res, GalleryViewModel, model));

    } catch (err) {
        GeneralUtils.sendErrorNotification(err);
    }
});

export default router;