import { Request, Response } from 'express';
import eventService from '../services/eventService';

class EventController {
  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventData = {
        title: req.body.title,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        location: req.body.location,
        capacity: parseInt(req.body.capacity),
      };

      const file = req.file;
      const event = await eventService.createEvent(eventData, file);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create event',
      });
    }
  }

  async getAllEvents(req: Request, res: Response): Promise<void> {
    console.log(req);
    try {
      const events = await eventService.getAllEvents();

      res.status(200).json({
        success: true,
        count: events.length,
        data: events,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch events',
      });
    }
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);

      if (!event) {
        res.status(404).json({
          success: false,
          message: 'Event not found',
        });
        return;
      }

      // Get attendees for this event
      const attendeesData = await eventService.getEventAttendees(id);

      res.status(200).json({
        success: true,
        data: {
          ...event.toObject(),
          attendees: attendeesData.attendees,
          stats: attendeesData.stats,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch event',
      });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.startDate && { startDate: new Date(req.body.startDate) }),
        ...(req.body.endDate && { endDate: new Date(req.body.endDate) }),
        ...(req.body.location && { location: req.body.location }),
        ...(req.body.capacity && { capacity: parseInt(req.body.capacity) }),
      };

      const file = req.file;
      const updatedEvent = await eventService.updateEvent(id, updateData, file);

      if (!updatedEvent) {
        res.status(404).json({
          success: false,
          message: 'Event not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update event',
      });
    }
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await eventService.deleteEvent(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Event not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete event',
      });
    }
  }

  async getEventAttendees(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const attendeesData = await eventService.getEventAttendees(id);

      res.status(200).json({
        success: true,
        data: attendeesData,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch attendees',
      });
    }
  }
}

export default new EventController();