import mongoose, { Schema, Document } from 'mongoose';


interface IComment extends Document {
    book_id: string;
    title: string;
    comment: string;
    date_création?: Date;
    date_modification?: Date
}


const CommentSchema: Schema = new Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    date_création: { type: Date, default: Date.now },
    date_modification: { type: Date, default: Date.now }
})

export default mongoose.model<IComment>('City', CommentSchema);
