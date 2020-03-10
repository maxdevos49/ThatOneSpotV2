import { IViewModel } from "../helpers/vash/vashInterfaces";
import { ProjectViewModel } from "./projectViewModel";
import { GalleryViewModel } from "./galleryViewModel";


export class HomeViewModel implements IViewModel{

    public recentProjects: ProjectViewModel;

    public recentGallery: GalleryViewModel;

    //TODO
    //public recentBlogs: BlogViewModel[];

}