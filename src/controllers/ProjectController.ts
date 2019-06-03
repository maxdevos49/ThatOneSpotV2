import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
import { config } from "../config";

/**
 * GET:/Project/index
 */
router.get("/index", (req, res) => {
    res.render("Projects/index");
});

/**
 * GET:/Project/index
 */
router.get("/", (req, res) => {
    res.render("Projects/index");
});

// /**
//  * GET:/Project/gameoflife
//  */
// router.get("/gameoflife", (req, res) => {
//     res.render("Projects/gameoflife");
// });

// /**
//  * GET:/Project/langdonsant
//  */
// router.get("/langtonsant", (req, res) => {
//     res.render("Projects/langtonsant");
// });

// /**
//  * GET:/Project/snake
//  */
// router.get("/snake", (req, res) => {
//     res.render("Projects/snake");
// });

// /**
//  * GET:/Project/snowflake
//  */
// router.get("/snowflake", (req, res) => {
//     res.render("Projects/snowflake");
// });

// /**
//  * GET:/Project/pacman
//  */
// router.get("/pacman", (req, res) => {
//     res.render("Projects/pacman");
// });

// /**
//  * GET:/Project/blockjumper
//  */
// router.get("/blockjumper", (req, res) => {
//     res.render("Projects/blockjumper");
// });

export default router;
