import express, { Request, Response, Router } from "express";
import { permit } from "../middleware/permit";
import userModel from "../Models/userModel";
import { View } from "../helpers/vash/view";
import { UserViewModel } from "../viewModels/userViewModel";
const router: Router = express.Router();

/**
 * GET:/logout
 */
router.get("/logout", (req: any, res: Response) => {
    req.logOut();
    res.redirect("/Home/");
});

/**s
 * GET:/dashboard
 */
router.get("/dashboard", permit(["homecenter-user"]), (req: any, res: Response) => {
    
    userModel.findOne({oktaId: req.userContext.userinfo.sub}, (err, doc) => {
        if(err) throw err;

         res.render("Account/dashboard", View(res, UserViewModel, doc));


    });
});


export default router;