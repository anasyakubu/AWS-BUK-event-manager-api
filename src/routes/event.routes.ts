import { Router } from 'express';
import eventController from '../controllers/event.controller';
import uploadMiddleware from '../middleware/upload.middleware';

class EventRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create event with optional banner image
    this.router.post(
      '/',
      uploadMiddleware.singleFile('banner'),
      eventController.createEvent.bind(eventController)
    );

    // Get all events
    this.router.get('/', eventController.getAllEvents.bind(eventController));

    // Get event by ID with attendees
    this.router.get('/:id', eventController.getEventById.bind(eventController));

    // Update event with optional banner image
    this.router.put(
      '/:id',
      uploadMiddleware.singleFile('banner'),
      eventController.updateEvent.bind(eventController)
    );

    // Delete event
    this.router.delete('/:id', eventController.deleteEvent.bind(eventController));

    // Get event attendees
    this.router.get('/:id/attendees', eventController.getEventAttendees.bind(eventController));
  }
}

export default new EventRoutes().router;