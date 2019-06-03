import { IViewModel, IViewProperty } from "../helpers/vash/vashInterfaces";

export class UserViewModel implements IViewModel {

    public oktaId: IViewProperty = {
        type: String,
        path: "oktaId",
        name: "Okta Id",
    };

    public firstname: IViewProperty = {
        type: String,
        path: "firstname",
        name: "First Name",
        minlength: 3,
        maxlength: 40,
        required: true
    };

    public lastname: IViewProperty = {
        type: String,
        path: "lastname",
        name: "Last Name",
        minlength: 3,
        maxlength: 40,
        required: true
    };

    public email: IViewProperty = {
        type: String,
        path: "email",
        name: "Email",
        minlength: 5,
        maxlength: 40,
        required: true
    };

    public role: IViewProperty = {
        type: String,
        path: "role",
        name: "Roles",
    };

}
