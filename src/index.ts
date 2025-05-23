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
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dhsf409o1',
  api_key: '317442182697478',
  api_secret: 'x37XaPmNXdQKa9huxGq2MJ8_R-A'
});


//-------------------------------------------------------------------------------------------

const app = express();
dotenv.config();
console.log(process.env.MONGO_URI);
const PORT = process.env.PORT;
console.log(PORT);

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
// Connecter MongoDB
const connectDB = async () => {
    try {
        await mongoose
  .connect(process.env.MONGO_URI as string, )
  .then(() => {
    console.log("✅ Connecté à MongoDB");

    // Démarrer le cron **après** la connexion réussie
    startUserActivityCron();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err);
  });
    console.log('MongoDB connecté avec succès');
    } catch (err) {
    console.error('Erreur lors de la connexion à MongoDB:', err);
    process.exit(1);
    }
    };

    connectDB();
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerDocs);
    });
    app.use('/api/auth', authRoutes);
    app.use('/api', userRoutes);
    app.use('/api', bookRoutes);
    app.use('/api', loanRoutes);
    app.use('/api', eventRoutes)
    app.use('/api', commentRoute)
    app.use('/api', cityDbRoutes)
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    

app.listen(3000, () => {
    console.log('Server is running on port :',PORT);
});
