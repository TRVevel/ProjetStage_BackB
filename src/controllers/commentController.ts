import { Request, Response } from "express";
import UserSchema from "../DBSchemas/UserSchema";
import CommentSchema from "../DBSchemas/CommentSchema";
import BookSchema from "../DBSchemas/BookSchema";



export async function getAllCommentsByBook(req: Request, res: Response) {
    try {
        const { bookId } = req.params;
        const comments = await CommentSchema.find({ where: { book: bookId } });
        res.status(200).json({ message: 'Liste des commentaires', data: comments });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

export async function getCommentById(req: Request, res: Response) {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            res.status(400).json
        }
        const comment = await CommentSchema.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: 'Commentaire non trouvé' });
            return;
        }
        res.status(200).json({ message: 'Commentaire trouvé', data: comment });
    }
    catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

export async function getAllCommentByUser(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const utilisateursSession = await CommentSchema.findById({where: { user_id }});
        if (!utilisateursSession) {
            res.status(404).json({ message: "Utilisateur non trouvé"})
        }
        res.send(utilisateursSession);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}






export async function createComment(req: Request, res: Response) {
    try {
        // Validation des champs
        const { comment, title } = req.body;
        const user = req.headers.user ? JSON.parse(req.headers.user as string) : null;
        const book = req.headers.book ? JSON.parse(req.headers.book as string) : null;

        if(!comment ){
            res.status(400).send('Le commentaire est incomplet.');
            return 
        }
        if (!user) {
            res.status(403).json({ message: "Utilisateur non valide." });
            return
        }
        
        if (!book) {
            res.status(400).json({ message: "Le post avec cet ID n'existe pas." });
            return
        }
        const commentUser = new CommentSchema({ title, comment })
        const savedComment = await commentUser.save();
    } catch (err: any) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Erreur interne', error: err.message });

    }
}


// export async function modifyComment(req: Request, res: Response) {
//     try {
//         const { id } = req.params;
//         const { comment } = req.body;

//         const commentUser = await Commentaire.findByPk(id);
//         if (!commentUser) {
//             res.status(404).json({ message: "Commentaire non trouvé" });
//             return
//         }


//         if (comment) commentUser.comment = comment;

//         await commentUser.save();
//         res.status(200).json({ message: "Commentaire modifié avec succès", commentUser});
//     } catch (error) {
//         console.error("Erreur lors de la modification :", error);
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// }

// export async function deleteComment(req: Request, res: Response) {
//     try {
//         const {id } = req.params;

//         const commentUser = await Commentaire.findByPk(id);
//         if (!commentUser) {
//             res.status(404).json({ message: "Commentaire non trouvé" });
//             return
//         }

//         await commentUser.destroy();
//         res.json({ message: "Commentaire supprimé avec succès" });
//     } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// }