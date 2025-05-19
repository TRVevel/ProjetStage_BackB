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
exports.getAllCities = getAllCities;
exports.getCityByName = getCityByName;
const CitySchema_1 = __importDefault(require("../DBSchemas/CitySchema"));
function getAllCities(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cities = yield CitySchema_1.default.find();
            res.status(200).json({ message: "Liste des villes", data: cities });
            return;
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
            return;
        }
    });
}
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function getCityByName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { cityName } = req.params;
            const normalized = normalizeString(cityName);
            // Recherche exacte sur le champ normalisé
            let city = yield CitySchema_1.default.findOne({ ville_nom_simple: normalized });
            if (!city) {
                const regex = new RegExp("^" + normalized, "i");
                const suggestions = yield CitySchema_1.default.find({
                    ville_nom_simple: { $regex: regex }
                }).limit(5);
                if (suggestions.length === 0) {
                    res.status(404).json({ message: "Ville non trouvée" });
                    return;
                }
                res.status(200).json({
                    message: "Ville non trouvée, mais suggestions disponibles",
                    suggestions,
                });
                return;
            }
            res.status(200).json({ message: "Ville trouvée", data: city });
            return;
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
            return;
        }
    });
}
