import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerDocs from "./config/swagger";
import swaggerUi from 'swagger-ui-express';
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import loanRoutes from "./routes/loanRoutes";


const app = express();
dotenv.config();
console.log(process.env.MONGO_URI);
const PORT = process.env.PORT;
console.log(PORT);

app.use(express.json());
// Connecter MongoDB
const connectDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI as string);
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
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(3000, () => {
    console.log('Server is running on port :',PORT); 
});
