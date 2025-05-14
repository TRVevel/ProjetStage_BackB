"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
const EventSchema_1 = __importDefault(require("../DBSchemas/EventSchema"));
function getAllEvents(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield EventSchema_1.default.find();
            res.status(200).json({ message: "Liste des événements", data: event });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
        }
    });
}
function getEventById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { eventId } = req.params;
            const event = yield EventSchema_1.default.findById(eventId);
            res.status(200).json({ message: "Liste des événements", data: event });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
        }
    });
}
function createEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, description, images, language, eventStartDate, eventEndDate } = req.body;
            if (!title || !description || !language || !eventStartDate || !eventEndDate) {
                res.status(400).json({ message: "Champs manquant" });
                return;
            }
            const event = yield EventSchema_1.default.create({
                title,
                description,
                images,
                language,
                eventStartDate,
                eventEndDate,
            });
            res.status(201).json({ message: "Événement créé", data: event });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
        }
    });
}
function updateEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { eventId } = req.params;
            const { title, description, images, creator, language, usersInEvent, eventStartDate, eventEndDate } = req.body;
            if (!eventId || !title || !description || !creator || !language || !usersInEvent || !eventStartDate || !eventEndDate) {
                res.status(400).json({ message: "Champs manquant" });
                return;
            }
            const event = yield EventSchema_1.default.findByIdAndUpdate(eventId, {
                title,
                description,
                images,
                creator,
                language,
                usersInEvent: [],
                eventStartDate,
                eventEndDate,
            });
            res.status(200).json({ message: "Événement mis à jour", data: event });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
        }
    });
}
function deleteEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { eventId } = req.params;
            if (!eventId) {
                res.status(400).json({ message: "ID inconnu" });
            }
            const event = yield EventSchema_1.default.findByIdAndDelete(eventId);
            res.status(200).json({ message: "Événement supprimé", data: event });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
        }
    });
}
