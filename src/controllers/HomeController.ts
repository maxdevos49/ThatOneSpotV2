import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import { config } from "../config";


/**
 * GET:/index
 */
router.get("/index", (req: Request, res: Response) => {
    res.render("Home/index");
});

/**
 * GET:/index
 */
router.get("/", (req: Request, res: Response) => {
    res.render("Home/index");
});

/**
 * GET:/resume
 */
router.get("/resume", (req: Request, res: Response) => {
    res.render("Home/resume");
});


export default router;
