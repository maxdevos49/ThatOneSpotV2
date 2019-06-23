import express, { Request, Response, Router } from "express";
import { ProjectViewModel } from "../../viewModels/projectViewModel";
import { View } from "../../helpers/vash/view";
import { permit } from "../../middleware/permit";
import projectModel from "../../Models/projectModel";
const router: Router = express.Router();

//Only allow admin here
router.use(permit(["homecenter-admin"]));

/**
 * GET:/Admin/Project/index
 */
router.get("/index", (req, res) => {

    projectModel.find({ isActive: true }, (err, model) => {
        if (err) throw err;

        res.render("Admin/Projects/index", View(res, ProjectViewModel, model));
    })
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
router.post("/create", (req: Request, res: Response) => {

    let project = new projectModel({
        name: req.body.name,
        description: req.body.description,
        url: req.body.url,
        createdBy: res.locals.authentication.id
    })

    project.save((err) => {
        if (err) {
            console.log(err);
            return res.render("Admin/Projects/create", View(res, ProjectViewModel, req.body));
        }

        return res.redirect("/Admin/Projects/Index");
    })
});

/**
 * GET:/Admin/Project/edit
 */
router.get("/edit:id?", (req: Request, res: Response) => {
    let id = req.query.id;

    projectModel.findOne({ _id: id }, (err, model) => {
        if (err) {
            console.error(err);
            res.redirect("/Admin/Projects/Index");
        }

        res.render("Admin/Projects/edit", View(res, ProjectViewModel, model));

    })
});

/**
 * POST:/Admin/Project/edit
 */
router.post("/edit:id?", (req: Request, res: Response) => {
    let id = req.query.id;

    if (id === req.body.id) {

        projectModel.updateOne({ _id: req.body.id }, req.body, (err) => {
            if (err) {
                console.error(err);
                return res.render("Admin/Projects/edit", View(res, ProjectViewModel, req.body));
            }

            return res.redirect("/Admin/Projects/Index");
        })

    } else {
        //somethings was tampered
    }

});

/**
 * GET:/Admin/Project/details
 */
router.get("/details:id?", (req: Request, res: Response) => {
    let id = req.query.id;

    projectModel.findOne({ _id: id }, (err, model) => {
        if (err) {
            console.error(err);
            res.redirect("/Admin/Projects/Index");
        }

        res.render("Admin/Projects/details", View(res, ProjectViewModel, model));

    })
});

/**
 * GET:/Admin/Project/delete
 */
router.get("/delete:id?", (req: Request, res: Response) => {
    let id = req.query.id;

    projectModel.findOne({ _id: id }, (err, model) => {
        if (err) {
            console.error(err);
            res.redirect("/Admin/Projects/Index");
        }

        res.render("Admin/Projects/delete", View(res, ProjectViewModel, model));

    })
});

/**
 * POST:/Admin/Project/delete
 */
router.post("/delete", (req: Request, res: Response) => {
    projectModel.findOneAndUpdate({ _id: req.body.id }, { isActive: false }, (err) => {
        if (err) {
            console.error(err);
        }

        return res.redirect("/Admin/Projects/Index");
    });
});

export default router;
