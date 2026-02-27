import { Router } from 'express';
import attendeeController from '../controllers/attendee.controller';

class AttendeeRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Register attendee for event
    this.router.post('/', attendeeController.registerAttendee.bind(attendeeController));

    // Get attendee by ID
    this.router.get('/:id', attendeeController.getAttendeeById.bind(attendeeController));

    // Check in attendee
    this.router.patch('/:id/check-in', attendeeController.checkInAttendee.bind(attendeeController));

    // Uncheck attendee
    this.router.patch('/:id/uncheck', attendeeController.uncheckAttendee.bind(attendeeController));

    // Delete attendee
    this.router.delete('/:id', attendeeController.deleteAttendee.bind(attendeeController));

    // Get all attendees for an event
    this.router.get('/event/:eventId', attendeeController.getAttendeesByEvent.bind(attendeeController));
  }
}

export default new AttendeeRoutes().router;