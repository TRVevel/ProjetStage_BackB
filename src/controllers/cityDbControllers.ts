import { Request, Response } from "express";
import CitySchema from "../DBSchemas/CitySchema";

export async function getAllCities(req: Request, res: Response) {
    try {
        const cities = await CitySchema.find();
        res.status(200).json({ message: "Liste des villes", data: cities });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

function normalizeString(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export async function getCityByName(req: Request, res: Response) {
    try {
        const { cityName } = req.params;
        const normalized = normalizeString(cityName);

        // Recherche exacte sur le champ normalisé
        let city = await CitySchema.findOne({ ville_nom_simple: normalized });

        if (!city) {
            const regex = new RegExp("^" + normalized, "i");
            const suggestions = await CitySchema.find({
                ville_nom_simple: { $regex: regex }
            }).limit(5);

            if (suggestions.length === 0) {
                return res.status(404).json({ message: "Ville non trouvée" });
            }

            return res.status(200).json({
                message: "Ville non trouvée, mais suggestions disponibles",
                suggestions,
            });
        }

        res.status(200).json({ message: "Ville trouvée", data: city });

    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

