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
const node_cron_1 = __importDefault(require("node-cron"));
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
const BookSchema_1 = __importDefault(require("../DBSchemas/BookSchema"));
function startUserActivityCron() {
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log("⏰ Cron lancé : vérification des activités utilisateur");
        try {
            const users = yield UserSchema_1.default.find();
            const now = new Date();
            for (const user of users) {
                if (!user.lastLogin) {
                    console.log(`Utilisateur ${user._id} n'a jamais été connecté.`);
                    continue;
                }
                const lastLogin = new Date(user.lastLogin);
                const differenceInDays = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
                if (differenceInDays > 30) {
                    user.isActive = false;
                    const books = yield BookSchema_1.default.find({ owner: user._id });
                    for (const book of books) {
                        book.ownerActive = false;
                        yield book.save();
                    }
                }
                yield user.save();
            }
            console.log("✅ Vérification terminée avec succès.");
        }
        catch (err) {
            console.error("❌ Erreur dans le cron de vérification :", err);
        }
    }));
}
