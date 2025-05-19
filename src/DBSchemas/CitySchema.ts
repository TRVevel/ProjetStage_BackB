import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface ICity extends Document {
    ville_departement: string;
    ville_nom: string;
    ville_nom_simple: string;
    ville_nom_reel: string;
    ville_code_postal: string;
}

// Définir le schéma Mongoose
const CitySchema: Schema = new Schema({
    ville_departement: { type: String, required: true },
    ville_nom: { type: String, required: true },
    ville_nom_simple: { type: String, required: true },
    ville_nom_reel: { type: String, required: true },
    ville_code_postal: { type: String, required: true},
    
});
CitySchema.index({ ville_nom_simple: 1 });
// Exporter le modèle
export default mongoose.model<ICity>('City', CitySchema);