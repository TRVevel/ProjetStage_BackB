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
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, phone, address, department, email, password } = req.body;
            const missingFields = [];
            if (!name)
                missingFields.push('name');
            if (!phone)
                missingFields.push('phone');
            if (!address)
                missingFields.push('address');
            if (!department)
                missingFields.push('department');
            if (!email)
                missingFields.push('email');
            if (!password)
                missingFields.push('password');
            if (missingFields.length > 0) {
                res.status(400).json({ message: `Champs manquants: ${missingFields.join(', ')}` });
                return;
            }
            // Hashage du mot de passe
            const hashedPassword = yield (0, pwdUtils_1.hashPassword)(password);
            // Créer un nouvel utilisateur
            const newUser = new UserSchema_1.default({ name, phone, address, department, email, hashedPassword });
            // Sauvegarde de l'utilisateur
            const savedUser = yield newUser.save();
            // Supprimer le mot de passe haché avant de renvoyer l'utilisateur
            savedUser.hashedPassword = '';
            res.status(201).json({ message: 'Utilisateur créé avec succès', data: savedUser });
        }
        catch (err) {
            if (err.code === 11000) {
                res.status(400).json({ message: 'Cet Email est déjà utilisé' });
                return;
            }
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const missingFields = [];
            if (!email)
                missingFields.push('email');
            if (!password)
                missingFields.push('password');
            if (missingFields.length > 0) {
                res.status(400).json({ message: `Champs manquants: ${missingFields.join(', ')}` });
                return;
            }
            const user = yield UserSchema_1.default.findOne({ email });
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            const isPasswordValid = yield (0, pwdUtils_1.verifyPassword)(password, user.hashedPassword);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Mot de passe incorrect' });
                return;
            }
            // Générer un token avec les informations de l'utilisateur
            const token = (0, JWTUtils_1.generateToken)({ _id: user._id, email: user.email });
            // Stocker le token dans un cookie
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
            res.status(200).json({
                message: 'Connexion réussie',
                data: {
                    userId: user._id,
                    email: user.email
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
/**
 * Fonction pour décoder le JWT
 * @param token
 */
function decodeToken(token) {
    // Utilise une bibliothèque comme jwt-simple ou jsonwebtoken pour décoder le token
    const jwt = require('jsonwebtoken');
    return jwt.decode(token); // Décoder le token sans vérifier la signature
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.clearCookie('jwt');
            res.status(200).json({ message: 'Déconnexion réussie' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
function passwordChange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
                return;
            }
            // Parse the logged-in user's _id from the decoded token
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
            const isMatch = yield (0, pwdUtils_1.verifyPassword)(oldPassword, existingUser.hashedPassword);
            if (!isMatch) {
                res.status(400).json({ message: 'Ancien mot de passe incorrect' });
                return;
            }
            const hashedPassword = yield (0, pwdUtils_1.hashPassword)(newPassword);
            existingUser.hashedPassword = hashedPassword;
            yield existingUser.save();
            res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
