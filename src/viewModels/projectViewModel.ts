import { IViewModel, IViewProperty } from "../helpers/vash/vashInterfaces";

export class ProjectViewModel implements IViewModel {

    public id: IViewProperty = {
        type: String,
        path: "id",
    };

    public name: IViewProperty = {
        type: String,
        path: "name",
        name: "Project Name",
        required: true
    };

    public url: IViewProperty = {
        required: true,
        path: "url",
        name: "Site Url",
        type: String
    };

    public description: IViewProperty = {
        type: String,
        path: "description",
        name: "Description"
    };

    public imageUrl: IViewProperty = {
        type: String,
        path: "imageUrl",
        name: "Image Url"
    };

    public isActive: IViewProperty = {
        type: Boolean,
        path: "isActive",
        name: "Is Active"
    };

    public createdOn: IViewProperty = {
        type: Date,
        path: "createdOn",
        name: "Created On"
    };

    public createdBy: IViewProperty = {
        type: String,
        path: "createdBy",
        name: "Created By"
    };

    public updatedOn: IViewProperty = {
        type: Number,
        path: "updatedOn",
        name: "Updated On"
    };

    public updatedBy: IViewProperty = {
        type: String,
        path: "updatedBy",
        name: "Updated By"
    };

}
