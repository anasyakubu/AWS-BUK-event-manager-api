import { Types } from 'mongoose';
import AttendeeModel from '../models/attendee.model';
import EventModel from '../models/event.model';
import { IAttendee, IAttendeeCreate } from '../interfaces/attendee.interface';

class AttendeeService {
  async registerAttendee(attendeeData: IAttendeeCreate): Promise<IAttendee> {
    try {
      if (!Types.ObjectId.isValid(attendeeData.eventId)) {
        throw new Error('Invalid event ID');
      }

      // Check if event exists
      const event = await EventModel.findById(attendeeData.eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Check event capacity
      const currentAttendees = await AttendeeModel.countDocuments({ eventId: attendeeData.eventId });
      if (currentAttendees >= event.capacity) {
        throw new Error('Event has reached maximum capacity');
      }

      // Check if attendee already registered
      const existingAttendee = await AttendeeModel.findOne({
        eventId: attendeeData.eventId,
        email: attendeeData.email,
      });

      if (existingAttendee) {
        throw new Error('Attendee already registered for this event');
      }

      const attendee = new AttendeeModel(attendeeData);
      await attendee.save();
      return attendee;
    } catch (error) {
      console.error('Error registering attendee:', error);
      throw error;
    }
  }

  async getAttendeeById(id: string): Promise<IAttendee | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid attendee ID');
      }

      return await AttendeeModel.findById(id).populate('eventId');
    } catch (error) {
      console.error('Error fetching attendee:', error);
      throw error;
    }
  }

  async checkInAttendee(id: string): Promise<IAttendee | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid attendee ID');
      }

      const attendee = await AttendeeModel.findByIdAndUpdate(
        id,
        { checkedIn: true },
        { new: true, runValidators: true }
      );

      return attendee;
    } catch (error) {
      console.error('Error checking in attendee:', error);
      throw error;
    }
  }

  async uncheckAttendee(id: string): Promise<IAttendee | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid attendee ID');
      }

      const attendee = await AttendeeModel.findByIdAndUpdate(
        id,
        { checkedIn: false },
        { new: true, runValidators: true }
      );

      return attendee;
    } catch (error) {
      console.error('Error unchecking attendee:', error);
      throw error;
    }
  }

  async deleteAttendee(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid attendee ID');
      }

      const result = await AttendeeModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting attendee:', error);
      throw error;
    }
  }

  async getAttendeesByEvent(eventId: string): Promise<IAttendee[]> {
    try {
      if (!Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
      }

      return await AttendeeModel.find({ eventId }).sort({ registeredAt: -1 });
    } catch (error) {
      console.error('Error fetching attendees by event:', error);
      throw error;
    }
  }
}

export default new AttendeeService();