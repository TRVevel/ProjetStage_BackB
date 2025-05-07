"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - address
 *               - postalCode
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ava Sarf"
 *               phone:
 *                 type: string
 *                 example: "+123456789"
 *               address:
 *                 type: string
 *                 example: "123 Rue Exemple, Paris"
 *               postalCode:
 *                 type: string
 *                 example: "54"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ava.sarf@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Champs manquant ou email déjà utilisé
 *       500:
 *         description: Erreur interne
 */
router.post('/register', authControllers_1.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ava.sarf@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne
 */
router.post('/login', authControllers_1.login);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Déconnexion utilisateur
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       500:
 *         description: Erreur interne
 */
router.post('/logout', verifyTokenMiddleware_1.verifyTokenMiddleware, authControllers_1.logout);
/**
 * @swagger
 * /api/auth/updatePassword:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Modifier le mot de passe utilisateur connecté
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       400:
 *         description: Ancien mot de passe incorrect ou champs manquant
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne
 */
router.put('/updatePassword', verifyTokenMiddleware_1.verifyTokenMiddleware, authControllers_1.passwordChange);
exports.default = router;
