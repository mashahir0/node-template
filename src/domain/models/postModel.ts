import mongoose from "mongoose";
import { IPost } from "../Post"; 


const postSchema = new mongoose.Schema<IPost>({
    userId : {
        type: String,
        ref: 'User',
        required: true,
    },
    text : {type : String , required : true},
    likes : {type :Number , default : 0},
    dislikes : {type : Number ,default : 0},

})

const  postModel = mongoose.model<IPost>('Post',postSchema)

export default postModel