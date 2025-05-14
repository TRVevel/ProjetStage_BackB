import {Router} from "express";
import { createEvent, getEventById, getAllEvents, updateEvent, deleteEvent } from "../controllers/eventController";
import { isAdmin } from "../middlewares/verifyIsAdmin";

const router = Router();

router.get('/events', getAllEvents);
router.get('/events/:eventId', getEventById);
router.post('/events', isAdmin, createEvent);
router.put('/events/:eventId', isAdmin, updateEvent);
router.delete('/events/:eventId', isAdmin, deleteEvent);

export default router;