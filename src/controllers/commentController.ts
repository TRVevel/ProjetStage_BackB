import { Request, Response } from "express";
import UserSchema from "../DBSchemas/UserSchema";
import CommentSchema from "../DBSchemas/CommentSchema";
import BookSchema from "../DBSchemas/BookSchema";



export async function getAllCommentsByBook(req: Request, res: Response) {
    try {
        const { bookId } = req.params;

        const comments = await CommentSchema.find({ book_id: bookId });
        res.status(200).json(comments);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

export async function getCommentById(req: Request, res: Response) {
    try {
        const {commentId} = req.params;
        if (!commentId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
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
      const { comment, title } = req.body;
      const bookId = req.params.bookId;
  
      // ✅ L'utilisateur connecté est injecté par le middleware
      const user = req.user;
  
      if (!comment || !title) {
        res.status(400).json({ message: "Le titre et le commentaire sont requis." });
        return
      }
  
      if (!user || !user._id) {
        res.status(401).json({ message: "Utilisateur non authentifié." });
        return
      }
  
      if (!bookId) {
        res.status(400).json({ message: "L'identifiant du livre est requis." });
        return
      }
  
      const commentToSave = new CommentSchema({
        book_id: bookId,
        owner: user._id,
        title,
        comment,
      });
  
      const savedComment = await commentToSave.save();
      res.status(201).json({ message: "Commentaire créé avec succès.", data: savedComment });
    } catch (err: any) {
      res.status(500).json({ message: "Erreur interne", error: err.message });
    }
  }
  

export async function modifyComment(req: Request, res: Response) {
    try {
        const {commentId} = req.params;
        const { title, comment } = req.body;

        const commentUser = await CommentSchema.findById(commentId);
        if (!commentUser) {
            res.status(404).json({ message: "Commentaire non trouvé" });
            return
        }

        if (comment) commentUser.comment = comment;
        if (title) commentUser.title = title;

        await commentUser.save();
        res.status(200).json({ message: "Commentaire modifié avec succès", commentUser});
    } catch (error) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function deleteComment(req: Request, res: Response) {
    try {
        const { commentId } = req.params;

        const commentUser = await CommentSchema.findByIdAndDelete(commentId);
        if (!commentUser) {
            res.status(404).json({ message: "Commentaire non trouvé" });
            return
        }
        res.json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}