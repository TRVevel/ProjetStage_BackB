import mongoose, { Schema, Document } from 'mongoose';


interface IComment extends Document {
    title: string;
    comment: string;
    date_création?: Date;
    date_modification?: Date
}


const CommentSchema: Schema = new Schema({
    title: { type: String, required: true },
    Comment: { type: String, required: true },
    date_création: { type: Date, default: Date.now },
    date_modification: { type: Date, default: Date.now }
})

export default mongoose.model<IComment>('City', CommentSchema);
