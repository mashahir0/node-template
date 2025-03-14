

export interface IPost {
    _id ?: string,
    userId : string,
    text : string,
    likes ?: number,
    dislikes ?: number,
} 


export class Post {
    constructor(
        public userId : string,
        public text : string
    ){}
}