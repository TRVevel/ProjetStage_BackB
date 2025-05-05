import { Router } from "express";
import { login, logout, passwordChange, register } from "../controllers/authControllers";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

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
 *               - department
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
 *               department:
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
router.post('/register', register);

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
router.post('/login', login);

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
router.post('/logout',verifyTokenMiddleware, logout);

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
router.put('/updatePassword',verifyTokenMiddleware, passwordChange);

export default router;
