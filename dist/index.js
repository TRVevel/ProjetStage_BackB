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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_1 = __importDefault(require("./config/swagger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const activityCron_1 = require("./cron/activityCron");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const loanRoutes_1 = __importDefault(require("./routes/loanRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const cityDbRoutes_1 = __importDefault(require("./routes/cityDbRoutes"));
const cloudinary_1 = require("cloudinary");
// Chargement des variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Configuration Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dhsf409o1',
    api_key: process.env.CLOUDINARY_API_KEY || '317442182697478',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'x37XaPmNXdQKa9huxGq2MJ8_R-A'
});
// Middleware CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200',
    credentials: true
}));
// Middleware pour parser les requêtes JSON et urlencoded (jusqu'à 100 Mo)
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
/**
* Connexion à MongoDB et démarrage du cron d'activité utilisateur
*/
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("✅ Connecté à MongoDB");
        // Démarrer le cron après la connexion réussie
        (0, activityCron_1.startUserActivityCron)();
    }
    catch (err) {
        console.error('❌ Erreur lors de la connexion à MongoDB:', err);
        process.exit(1);
    }
});
connectDB();
// Route pour exposer la documentation Swagger au format JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.default);
});
// Déclaration des routes principales
app.use('/api/auth', authRoutes_1.default);
app.use('/api', userRoutes_1.default);
app.use('/api', bookRoutes_1.default);
app.use('/api', loanRoutes_1.default);
app.use('/api', eventRoutes_1.default);
app.use('/api', commentRoute_1.default);
app.use('/api', cityDbRoutes_1.default);
// Documentation Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Démarrage du serveur
app.listen(PORT, () => {
    console.log('🚀 Server is running on port:', PORT);
});
