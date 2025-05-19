import { Router } from "express";
import { getAllCities, getCityByName } from "../controllers/cityDbControllers";

const router = Router();
/**
 * @swagger
 * /api/cities:
 *   get:
 *     tags:
 *       - Cities
 *     summary: Récupérer toutes les villes
 *     responses:
 *       200:
 *         description: Liste des villes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 */
router.get("/cities", getAllCities);

router.get("/cities/:cityName", getCityByName);

export default router;