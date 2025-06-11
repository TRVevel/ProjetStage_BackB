import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IBook extends Document {
    title : string;
    description: string;
    genre: "fantasy" | "science-fiction" | "romance" | "mystery" | "non-fiction" | "historical" | "thriller" | "horror" | "biography" | "self-help" | "children's" | "young adult" | "poetry" | "classics" | "manga" | "comics" | "adventure" | "educative" | "cookbook" | "travel" | "humor" ; // Genre du livre
    author: string;
    publishedYear: number;
    language: "french" | "ukrainian" | "english";
    state: "new"| "good" | "used"; // État du livre (neuf, bon état, usé, etc.)
<<<<<<< HEAD
    imageCouverture: string;
    imageBack: string;
    imageInBook: string;
=======
    images: string;
>>>>>>> b8c3b51ca433b119fd7674711eef2f96ad02eecf
    readBy: string[]; // Tableau d'IDs de livres lus
    owner: string;
    isActive: boolean;
    ownerActive: boolean; // Indique si le propriétaire du livre est actif ou non
    alreadyLoaned: boolean; // Indique si le livre est déjà emprunté
    addedAt: Date;
}

// Définir le schéma Mongoose
const BookSchema: Schema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true },
    genre: { type: String, enum: ['fantasy', 'science-fiction', 'romance', 'mystery', 'non-fiction', 'historical', 'thriller', 'horror', 'biography', 'self-help', "children's", 'young adult', 'poetry', 'classics', 'manga', 'comics', 'adventure', 'educative', 'cookbook', 'travel', 'humor'], required: true }, // Genre du livre
    author: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    language: { type: String,enum: ['french', 'ukrainian', 'english'], required: true},
<<<<<<< HEAD
    state: { type: String,enum: ['new', 'good', 'used'], required: false, default: 'good' },
    imageCouverture: { type: String, required: true }, 
    imageBack: { type: String, required: true },
    imageInBook: { type: String, required: true }, 
=======
    state: { type: String,enum: ['new', 'good', 'used'], required: false},
    images: { type: String, default: '' }, // Chemin de l'image du livre, par défaut une chaîne vide
>>>>>>> b8c3b51ca433b119fd7674711eef2f96ad02eecf
    readBy: { type: [String], default: [] }, // Tableau d'IDs de livres lus
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }, // ID de l'utilisateur qui possède le livre
    isActive: { type: Boolean, default: true }, // Indique si le livre est actif ou non
    ownerActive: { type: Boolean, default: true }, // Indique si le propriétaire du livre est actif ou non
    alreadyLoaned: { type: Boolean, default: false }, // Indique si le livre est déjà emprunté
    addedAt: { type: Date, default: Date.now } // Date d'ajout par défaut à l'instant présent   
});

// Exporter le modèle
export default mongoose.model<IBook>('Book', BookSchema);