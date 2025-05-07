import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IBook extends Document {
    title : string;
    description: string;
    genre: string;
    author: string;
    publishedYear: number;
    language: "french" | "ukrainian" | "english";
    state: "new"| "good" | "used"; // État du livre (neuf, bon état, usé, etc.)
    images: string[];
    readBy: string[]; // Tableau d'IDs de livres lus
    owner: string;
    isActive: boolean;
    alreadyLoaned: boolean; // Indique si le livre est déjà emprunté
    addedAt: Date;
}

// Définir le schéma Mongoose
const BookSchema: Schema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true },
    genre: { type: String, required: true },
    author: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    language: { type: String,enum: ['french', 'ukrainian', 'english'], required: true},
    state: { type: String,enum: ['new', 'good', 'used'], required: true},
    images: { type: [String], default: [] },
    readBy: { type: [String], default: [] }, // Tableau d'IDs de livres lus
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }, // ID de l'utilisateur qui possède le livre
    isActive: { type: Boolean, default: true }, // Indique si le livre est actif ou non
    alreadyLoaned: { type: Boolean, default: false }, // Indique si le livre est déjà emprunté
    addedAt: { type: Date, default: Date.now } // Date d'ajout par défaut à l'instant présent   
});

// Exporter le modèle
export default mongoose.model<IBook>('Book', BookSchema);