import { Request, Response } from "express";
import CitySchema from "../DBSchemas/CitySchema";

export async function getAllCities(req: Request, res: Response) {
    try {
        const cities = await CitySchema.find();
        res.status(200).json({ message: "Liste des villes", data: cities });
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
        return;
    }
}

function normalizeString(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

