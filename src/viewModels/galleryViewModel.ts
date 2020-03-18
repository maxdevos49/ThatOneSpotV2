import { IViewModel, IViewProperty } from "../helpers/vash/vashInterfaces";

export class GalleryViewModel implements IViewModel {

    public id: IViewProperty = {
        type: String,
        path: "id",
    };

    public name: IViewProperty = {
        type: String,
        path: "name",
        name: "Image Name",
        required: true
    };

    public image: IViewProperty = {
        type: function File(){},//Has to be a function so we make it a function. File.name = "File" so this works. basically its a hack but it works for what we need
        path: "image",
        name: "Image",
    }

    public isPublic: IViewProperty = {
        type: Boolean,
        path: "isPublic",
        name: "Is Public"
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
