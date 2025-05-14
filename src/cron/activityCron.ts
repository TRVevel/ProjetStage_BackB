// src/cron/activityCron.ts
import cron from 'node-cron';
import UserSchema from '../DBSchemas/UserSchema';
import BookSchema from '../DBSchemas/BookSchema';

export function startUserActivityCron(): void {
  cron.schedule('0 0 * * *', async () => {
    console.log("⏰ Cron lancé : vérification des activités utilisateur");

    try {
     const users = await UserSchema.find();
     
         const now = new Date();
     
         for (const user of users) {
           if (!user.lastLogin) {
             console.log(`Utilisateur ${user._id} n'a jamais été connecté.`);
             continue;
           }
     
           const lastLogin = new Date(user.lastLogin);
           const differenceInDays = Math.floor(
             (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
           );
     
           if (differenceInDays > 30) {
             user.isActive = false;
             const books = await BookSchema.find({ owner: user._id });
             for (const book of books) {
               book.ownerActive = false;
               await book.save();
             }
           }
           await user.save();
         }

      console.log("✅ Vérification terminée avec succès.");
    } catch (err) {
      console.error("❌ Erreur dans le cron de vérification :", err);
    }
  });
}
