import express, { Request, Response, Router } from "express";
import { ProjectViewModel } from "../../viewModels/projectViewModel";
import { View } from "../../helpers/vash/view";
import { permit } from "../../middleware/permit";
import projectModel from "../../Models/projectModel";
import { config } from "../../config";
import { v1 } from "uuid";
const router: Router = express.Router();

//Only allow admin here
router.use(permit(["homecenter-admin"]));

/**
 * GET:/Admin/Gallery/index
 */
router.get("/index", (req, res) => {

    projectModel.find({ isActive: true }, (err, model) => {
        if (err) throw err;

        res.render("Admin/Gallery/index", View(res, ProjectViewModel, model));
    })
});

/**
 * GET:/Admin/Project/create
 */
router.get("/create", (req: Request, res: Response) => {
    res.render("Admin/Gallery/create", View(res, ProjectViewModel));
});

function getExtension(file: string) {
    let ext = file.split(".");

    if (ext.length === 1 || (ext[0] === "" && ext.length === 2)) {
        return "";
    }
    return ext.pop();
}

function UploadFile(options: IFileConfig, callback: Function) {

    let resultIds: string[] = [];

    for (let file in options.files) {

        let filename = v1() + getExtension(options.files[file].name);

        options.files[file].mv(`${config.path}/public/upload/${filename}`, (err: any) => {
            if (err) console.error(err);
        });


        
    }

}

interface IFileConfig {
    files: any,

    limit?: number,

    accept?: string[],


}

/**
 * POST:/Admin/Gallery/create
 */
router.post("/create", (req: Request, res: Response) => {

    let filename = v1();

    let fileData: any = req.files.image;

    filename += fileData.name.split('.').pop();

    fileData.mv(`${config.path}/public/uploads/${filename}`, (err: any) => {
        if (err) throw err;
        console.log(fileData);
    });

    let project = new projectModel({
        name: req.body.name,
        description: req.body.description,
        url: req.body.url,
        imageUrl: filename,
        createdBy: res.locals.authentication.id
    })

    project.save((err) => {
        if (err) {
            console.error(err);

            return res.render("Admin/Gallery/create", View(res, ProjectViewModel, req.body));
        }

        return res.redirect("/Admin/Gallery/Index");
    })
});

/**
 * GET:/Admin/Gallery/edit
 */
router.get("/edit:id?", (req: Request, res: Response) => {
    let id = req.query.id;

    projectModel.findOne({ _id: id }, (err, model) => {
        if (err) {
            console.error(err);
            res.redirect("/Admin/Gallery/Index");
        }

        res.render("Admin/Gallery/edit", View(res, ProjectViewModel, model));

    })
});

/**
 * POST:/Admin/Gallery/edit
 */
router.post("/edit:id?", (req: Request, res: Response) => {
    let id = req.query.id;

    if (id === req.body.id) {

        projectModel.updateOne({ _id: req.body.id }, req.body, (err) => {
            if (err) {
                console.error(err);
                return res.render("Admin/Gallery/edit", View(res, ProjectViewModel, req.body));
            }

            return res.redirect("/Admin/Gallery/Index");
        })

    } else {
        //somethings was tampered
    }

});

/**
 * GET:/Admin/Gallery/details
 */
router.get("/details:id?", (req: Request, res: Response) => {
    let id = req.query.id;

    projectModel.findOne({ _id: id }, (err, model) => {
        if (err) {
            console.error(err);
            res.redirect("/Admin/Gallery/Index");
        }

        res.render("Admin/Gallery/details", View(res, ProjectViewModel, model));

    })
});

/**
 * GET:/Admin/Gallery/delete
 */
router.get("/delete:id?", (req: Request, res: Response) => {
    let id = req.query.id;

    projectModel.findOne({ _id: id }, (err, model) => {
        if (err) {
            console.error(err);
            res.redirect("/Admin/Gallery/Index");
        }

        res.render("Admin/Gallery/delete", View(res, ProjectViewModel, model));

    })
});

/**
 * POST:/Admin/Gallery/delete
 */
router.post("/delete", (req: Request, res: Response) => {
    projectModel.findOneAndUpdate({ _id: req.body.id }, { isActive: false }, (err) => {
        if (err) {
            console.error(err);
        }

        return res.redirect("/Admin/Gallery/Index");
    });
});

export default router;
