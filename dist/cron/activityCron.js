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
exports.startUserActivityCron = startUserActivityCron;
// src/cron/activityCron.ts
// Importation du module node-cron pour la planification des tâches
const node_cron_1 = __importDefault(require("node-cron"));
// Importation du schéma utilisateur
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
// Importation du schéma livre
const BookSchema_1 = __importDefault(require("../DBSchemas/BookSchema"));
/**
 * Lance un cron qui désactive les utilisateurs inactifs depuis plus de 30 jours
 * et désactive également tous leurs livres.
 */
function startUserActivityCron() {
    // Planifie une tâche qui s'exécute tous les jours à minuit
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log("⏰ Cron lancé : vérification des activités utilisateur");
        try {
            // Récupère tous les utilisateurs
            const users = yield UserSchema_1.default.find();
            const now = new Date();
            // Parcourt chaque utilisateur
            for (const user of users) {
                // Si l'utilisateur ne s'est jamais connecté, on passe au suivant
                if (!user.lastLogin) {
                    console.log(`Utilisateur ${user._id} n'a jamais été connecté.`);
                    continue;
                }
                // Calcule le nombre de jours depuis la dernière connexion
                const lastLogin = new Date(user.lastLogin);
                const differenceInDays = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
                // Si plus de 30 jours d'inactivité, désactive l'utilisateur et ses livres
                if (differenceInDays > 30) {
                    user.isActive = false;
                    // Récupère tous les livres de l'utilisateur
                    const books = yield BookSchema_1.default.find({ owner: user._id });
                    for (const book of books) {
                        book.ownerActive = false;
                        yield book.save(); // Sauvegarde l'état du livre
                    }
                }
                yield user.save(); // Sauvegarde l'état de l'utilisateur
            }
            console.log("✅ Vérification terminée avec succès.");
        }
        catch (err) {
            // Gestion des erreurs lors de l'exécution du cron
            console.error("❌ Erreur dans le cron de vérification :", err);
        }
    }));
}
