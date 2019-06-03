import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import { config } from "../config";

/**
 * GET:/Gallery/index
 */
router.get("/index", (req, res) => {
    res.render("Gallery/index");
});

/**
 * GET:/Gallery/index
 */
router.get("/", (req, res) => {
    res.render("Gallery/index");
});

export default router;