import userModel from "../Models/userModel";

export function loginProcess(req: any, res: any, next: any) {

    userModel.findOne({ oktaId: req.userContext.userinfo.sub }, {}, (err, doc: any) => {
        if (err) throw err;

        if (!doc) {
            //new user
            let newuser = new userModel({
                oktaId: req.userContext.userinfo.sub,
                firstname: req.userContext.userinfo.given_name,
                lastname: req.userContext.userinfo.family_name,
                email: req.userContext.userinfo.preferred_username,
                role: req.userContext.userinfo.groups,
                updatedAt: req.userContext.userinfo.updated_at
            })

            newuser.save((err) => {
                if (err) throw err;

                res.redirect("/home");

            })

        } else {
            //exisiting user
            
            if (req.userContext.userinfo.updated_at != doc.updatedAt) {

                userModel.updateOne({ oktaId: doc.oktaId }, {
                    firstname: req.userContext.userinfo.given_name,
                    lastname: req.userContext.userinfo.family_name,
                    email: req.userContext.userinfo.preferred_username,
                    role: req.userContext.userinfo.groups,
                    updatedAt: req.userContext.userinfo.updated_at
                }, (err) => {
                    if (err) throw err;
                    
                    res.redirect("/home");

                })
            } else {

                res.redirect("/home");

            }
        }
    })
}