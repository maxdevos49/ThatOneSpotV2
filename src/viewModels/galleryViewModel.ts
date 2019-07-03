import { IViewModel, IViewProperty } from "../helpers/vash/vashInterfaces";
import galleryModel from "../Models/galleryModel";

// export interface IGalleryViewModel{
//     id: string;
//     name: string;
//     url: string;
//     isActive: boolean;
//     createdOn: Date;
//     createdBy: string;
//     updatedOn?: Date;
//     updatedBy?: string    
// }

export class GalleryViewModel implements IViewModel {

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
        type: String,
        path: "url",
        name: "Site Url",
        required: true
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

    // public static async find(filter: any = null): Promise<IGalleryViewModel[]> {
    //     return await galleryModel.find({ isActive: true }) as unknown as IGalleryViewModel[];
    // }


    // public static async findOne(id?: string): Promise<IGalleryViewModel> {
    //     return await galleryModel.findOne({ _id: id }) as unknown as IGalleryViewModel;
    // }
}
