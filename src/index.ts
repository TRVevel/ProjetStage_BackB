import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerDocs from "./config/swagger";
import swaggerUi from 'swagger-ui-express';
import cors from "cors";
import { startUserActivityCron } from "./cron/activityCron";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import loanRoutes from "./routes/loanRoutes";
import eventRoutes from "./routes/eventRoutes";
import commentRoute from "./routes/commentRoute";
import cityDbRoutes from "./routes/cityDbRoutes";
import { v2 as cloudinary } from 'cloudinary';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dhsf409o1',
  api_key: process.env.CLOUDINARY_API_KEY || '317442182697478',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'x37XaPmNXdQKa9huxGq2MJ8_R-A'
});

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Middleware pour parser les requêtes JSON et urlencoded (jusqu'à 100 Mo)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

 /**
 * Connexion à MongoDB et démarrage du cron d'activité utilisateur
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connecté à MongoDB");
    // Démarrer le cron après la connexion réussie
    startUserActivityCron();
  } catch (err) {
    console.error('❌ Erreur lors de la connexion à MongoDB:', err);
    process.exit(1);
  }
};
connectDB();

// Route pour exposer la documentation Swagger au format JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// Déclaration des routes principales
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', loanRoutes);
app.use('/api', eventRoutes);
app.use('/api', commentRoute);
app.use('/api', cityDbRoutes);

// Documentation Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('🚀 Server is running on port:', PORT);
});
