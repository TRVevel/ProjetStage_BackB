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
    ville_departement: { type: String },
    ville_nom: { type: String },
    ville_nom_simple: { type: String },
    ville_nom_reel: { type: String },
    ville_code_postal: { type: String },
});

CitySchema.index({ ville_nom_simple: 1 });

// Vérifier si le modèle existe déjà avant de le définir
const CityModel = mongoose.models.City || mongoose.model<ICity>('City', CitySchema);

export default CityModel;