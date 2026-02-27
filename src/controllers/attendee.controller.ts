import { Request, Response } from 'express';
import attendeeService from '../services/attendeeService';

class AttendeeController {
  async registerAttendee(req: Request, res: Response): Promise<void> {
    try {
      const attendeeData = {
        eventId: req.body.eventId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      };

      const attendee = await attendeeService.registerAttendee(attendeeData);

      res.status(201).json({
        success: true,
        message: 'Attendee registered successfully',
        data: attendee,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to register attendee',
      });
    }
  }

  async getAttendeeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const attendee = await attendeeService.getAttendeeById(id);

      if (!attendee) {
        res.status(404).json({
          success: false,
          message: 'Attendee not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: attendee,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch attendee',
      });
    }
  }

  async checkInAttendee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const attendee = await attendeeService.checkInAttendee(id);

      if (!attendee) {
        res.status(404).json({
          success: false,
          message: 'Attendee not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Attendee checked in successfully',
        data: attendee,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to check in attendee',
      });
    }
  }

  async uncheckAttendee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const attendee = await attendeeService.uncheckAttendee(id);

      if (!attendee) {
        res.status(404).json({
          success: false,
          message: 'Attendee not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Attendee unchecked successfully',
        data: attendee,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to uncheck attendee',
      });
    }
  }

  async deleteAttendee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await attendeeService.deleteAttendee(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Attendee not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Attendee deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete attendee',
      });
    }
  }

  async getAttendeesByEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const attendees = await attendeeService.getAttendeesByEvent(eventId);

      res.status(200).json({
        success: true,
        count: attendees.length,
        data: attendees,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch attendees',
      });
    }
  }
}

export default new AttendeeController();