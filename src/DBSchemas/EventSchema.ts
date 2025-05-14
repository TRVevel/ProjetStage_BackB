import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IEvent extends Document {
    title : string;
    description: string;
    images: string[];
    language: "french" | "ukrainian" | "english";
    usersInEvent: string[];
    eventStartDate: Date;
    eventEndDate: Date;
    addedAt: Date;
    modifiedAt: Date;
}

const EventSchema: Schema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    language: { type: String,enum: ['french', 'ukrainian', 'english'], required: true},
    usersInEvent: { type: [String], default: [] },
    eventStartDate: { type: Date, required: true },
    eventEndDate: { type: Date, required: true },
    addedAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
});

// Exporter le modèle
export default mongoose.model<IEvent>('Event', EventSchema);