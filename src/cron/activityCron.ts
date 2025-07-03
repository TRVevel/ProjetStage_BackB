// src/cron/activityCron.ts
// Importation du module node-cron pour la planification des tâches
import cron from 'node-cron';
// Importation du schéma utilisateur
import UserSchema from '../DBSchemas/UserSchema';
// Importation du schéma livre
import BookSchema from '../DBSchemas/BookSchema';

/**
 * Lance un cron qui désactive les utilisateurs inactifs depuis plus de 30 jours
 * et désactive également tous leurs livres.
 */
export function startUserActivityCron(): void {
  // Planifie une tâche qui s'exécute tous les jours à minuit
  cron.schedule('0 0 * * *', async () => {
    console.log("⏰ Cron lancé : vérification des activités utilisateur");

    try {
      // Récupère tous les utilisateurs
      const users = await UserSchema.find();
      const now = new Date();

      // Parcourt chaque utilisateur
      for (const user of users) {
        // Si l'utilisateur ne s'est jamais connecté, on passe au suivant
        if (!user.lastLogin) {
          console.log(`Utilisateur ${user._id} n'a jamais été connecté.`);
          continue;
        }

        // Calcule le nombre de jours depuis la dernière connexion
        const lastLogin = new Date(user.lastLogin);
        const differenceInDays = Math.floor(
          (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Si plus de 30 jours d'inactivité, désactive l'utilisateur et ses livres
        if (differenceInDays > 30) {
          user.isActive = false;
          // Récupère tous les livres de l'utilisateur
          const books = await BookSchema.find({ owner: user._id });
          for (const book of books) {
            book.ownerActive = false;
            await book.save(); // Sauvegarde l'état du livre
          }
        }
        await user.save(); // Sauvegarde l'état de l'utilisateur
      }

      console.log("✅ Vérification terminée avec succès.");
    } catch (err) {
      // Gestion des erreurs lors de l'exécution du cron
      console.error("❌ Erreur dans le cron de vérification :", err);
    }
  });
}
