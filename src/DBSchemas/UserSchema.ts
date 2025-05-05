import mongoose, { Schema, Document } from 'mongoose';
import { ref } from 'process';
// Interface TypeScript pour le document utilisateur

export interface IUser extends Document {
    admin : boolean;
    name: string;
    phone: string;
    address: string;
    department: string;
    email: string;
    booksOwned: string[];
    booksRead: string[];
    hashedPassword: string;
    isActive: boolean;
    addedAt: Date;
}

// Définir le schéma Mongoose
const UserSchema: Schema = new Schema({
    admin: { type: Boolean, default: false }, // Par défaut, l'utilisateur n'est pas admin
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    booksOwned: { type: [mongoose.Schema.Types.ObjectId],
        ref: "Book",
         default: [] 
        }, // Tableau d'IDs de livres possédés
    booksRead: { type: [mongoose.Schema.Types.ObjectId],
        ref: "Book",
         default: [] 
        }, // Tableau d'IDs de livres lus
    hashedPassword: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // Par défaut, l'utilisateur est actif
    addedAt: { type: Date, default: Date.now } // Date d'ajout par défaut à l'instant présent
});

// Exporter le modèle
export default mongoose.model<IUser>('User', UserSchema);