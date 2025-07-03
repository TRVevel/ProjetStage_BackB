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
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.passwordChange = passwordChange;
const pwdUtils_1 = require("../utils/pwdUtils");
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
const JWTUtils_1 = require("../utils/JWTUtils");
const authValidators_1 = require("../JoiValidators/authValidators");
const BookSchema_1 = __importDefault(require("../DBSchemas/BookSchema"));
/**
 * Inscription d'un nouvel utilisateur
 */
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validation des données d'entrée avec Joi
            const { error } = authValidators_1.userValidationSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    message: 'Erreur de validation des champs.',
                    errors: error.details.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
                return;
            }
            const { name, phone, address, city, postalCode, email, password } = req.body;
            // Vérifier si un utilisateur avec le même email existe déjà (insensible à la casse)
            const existingUser = yield UserSchema_1.default.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
            if (existingUser) {
                res.status(409).json({
                    message: 'Un utilisateur avec cet email existe déjà.'
                });
                return;
            }
            // Hashage du mot de passe
            const hashedPassword = yield (0, pwdUtils_1.hashPassword)(password);
            // Création et sauvegarde du nouvel utilisateur
            const newUser = new UserSchema_1.default({ name, phone, address, city, postalCode, email, hashedPassword });
            const savedUser = yield newUser.save();
            // Supprimer le mot de passe haché avant de renvoyer l'utilisateur
            savedUser.hashedPassword = '';
            res.status(201).json({
                message: 'Utilisateur créé avec succès.',
                user: {
                    _id: savedUser._id,
                    name: savedUser.name,
                    phone: savedUser.phone,
                    address: savedUser.address,
                    city: savedUser.city,
                    postalCode: savedUser.postalCode,
                    email: savedUser.email
                }
            });
            return;
        }
        catch (err) {
            // Gestion des erreurs MongoDB (duplication, etc.)
            if (err.code === 11000) {
                res.status(409).json({
                    message: 'Cet email est déjà utilisé.'
                });
                return;
            }
            // Erreur inattendue
            res.status(500).json({
                message: 'Erreur interne du serveur.',
                error: err.message
            });
            return;
        }
    });
}
/**
 * Connexion utilisateur
 */
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validation des données d'entrée
            const { error } = authValidators_1.userLoginValidationSchema.validate(req.body);
            if (error) {
                res.status(400).json({ message: "Erreur de validation", details: error.details });
                return;
            }
            const { email, password } = req.body;
            // Recherche insensible à la casse pour l'email
            const user = yield UserSchema_1.default.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            // Vérification du mot de passe
            const isPasswordValid = yield (0, pwdUtils_1.verifyPassword)(password, user.hashedPassword);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Mot de passe incorrect' });
                return;
            }
            // Mise à jour de l'état utilisateur et des livres associés
            user.isActive = true;
            user.lastLogin = new Date();
            const userBooks = yield BookSchema_1.default.find({ owner: user._id });
            for (const book of userBooks) {
                book.ownerActive = true;
                yield book.save();
            }
            // Génération et stockage du token JWT
            const token = (0, JWTUtils_1.generateToken)({ _id: user._id, email: user.email, admin: user.admin });
            res.cookie("jwt", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production"
            });
            yield user.save();
            res.status(200).json({
                message: 'Connexion réussie',
                token,
                user
            });
            return;
        }
        catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    });
}
/**
 * Déconnexion utilisateur
 */
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.clearCookie('jwt');
            res.status(200).json({ message: 'Déconnexion réussie' });
            return;
        }
        catch (error) {
            res.status(500).json({ message: error.message });
            return;
        }
    });
}
/**
 * Changement de mot de passe utilisateur connecté
 */
function passwordChange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
                return;
            }
            // Récupération de l'utilisateur connecté via le header (à adapter selon ton auth middleware)
            const user = req.headers.user ? JSON.parse(req.headers.user) : null;
            if (!user || !user._id) {
                res.status(401).json({ message: 'Utilisateur non authentifié' });
                return;
            }
            const userId = user._id;
            const existingUser = yield UserSchema_1.default.findById(userId);
            if (!existingUser) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            // Vérification de l'ancien mot de passe
            const isMatch = yield (0, pwdUtils_1.verifyPassword)(oldPassword, existingUser.hashedPassword);
            if (!isMatch) {
                res.status(400).json({ message: 'Ancien mot de passe incorrect' });
                return;
            }
            // Mise à jour du mot de passe
            const hashedPassword = yield (0, pwdUtils_1.hashPassword)(newPassword);
            existingUser.hashedPassword = hashedPassword;
            yield existingUser.save();
            res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
            return;
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
            return;
        }
    });
}
