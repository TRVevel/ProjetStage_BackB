import { Request, Response } from "express";
import EventSchema from "../DBSchemas/EventSchema";

export async function getAllEvents(req: Request, res: Response) {
    try {
        const event = await EventSchema.find()
        res.status(200).json({ message: "Liste des événements", data: event });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

export async function getEventById(req: Request, res: Response) {
    try {
        const { eventId } = req.params;
        const event = await EventSchema.findById(eventId)
        res.status(200).json({ message: "Liste des événements", data: event });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

export async function createEvent(req: Request, res: Response) {
    try {
        const { title, description, images, language } = req.body;
        if (!title || !description  || !language) {
            res.status(400).json({ message: "Champs manquant" });
            return;
        }
        const event = await EventSchema.create({
            title,
            description,
            images,
            language,
        });
        res.status(201).json({ message: "Événement créé", data: event });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

export async function updateEvent(req: Request, res: Response) {
    try {
        const { eventId } = req.params;
        const { title, description, images, creator, language } = req.body;
        if (!eventId || !title || !description || !creator || !language) {
            res.status(400).json({ message: "Champs manquant" });
            return;
        }
        const event = await EventSchema.findByIdAndUpdate(eventId, {
            title,
            description,
            images,
            creator,
            language,
        });
        res.status(200).json({ message: "Événement mis à jour", data: event });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}

export async function deleteEvent(req: Request, res: Response) {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            res.status(400).json({ message: "ID inconnu" });
        }
        const event = await EventSchema.findByIdAndDelete(eventId);
        res.status(200).json({ message: "Événement supprimé", data: event });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne", error: err.message });
    }
}