import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface ILoan extends Document {
    userId: string; // ID de l'utilisateur qui a emprunté le livre
    bookId: string; // ID du livre emprunté
    startDate: Date; // Date de début de l'emprunt
    endDate: Date; // Date de fin de l'emprunt
    status: 'pending' | 'approved' | 'returned' ; // Statut de l'emprunt
    returnImages: string[]; // Images du livre emprunté
    returnedAt: Date | null; // Date de retour du livre, null si pas encore retourné
    addedAt: Date;
}

// Définir le schéma Mongoose
const LoanSchema: Schema = new Schema({
    userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          }, // ID de l'utilisateur qui a emprunté le livre
    bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
          }, // ID du livre emprunté
    startDate: { type: Date, required: true }, // Date de début de l'emprunt
    endDate: { type: Date, required: true }, // Date de fin de l'emprunt
    status: { type: String, enum: ['pending', 'approved', 'returned'], default: 'pending' }, // Statut de l'emprunt
    returnImages: { type: [String], default: [] }, // Images du livre emprunté
    returnedAt: { type: Date, default: null }, // Date de retour du livre, null si pas encore retourné
    addedAt: { type: Date, default: Date.now } // Date d'ajout par défaut à l'instant présent
});

// Exporter le modèle
export default mongoose.model<ILoan>('Loan', LoanSchema);