import { Types } from 'mongoose';
import EventModel from '../models/event.model';
import AttendeeModel from '../models/attendee.model';
import { IEvent, IEventCreate, IEventUpdate } from '../interfaces/event.interface';
import s3Service from './s3Service';

class EventService {
  async createEvent(eventData: IEventCreate, file?: Express.Multer.File): Promise<IEvent> {
    try {
      let bannerUrl: string | undefined;
      let bannerKey: string | undefined;

      if (file) {
        const uploadResult = await s3Service.uploadFile(file, 'event-banners');
        bannerUrl = uploadResult.url;
        bannerKey = uploadResult.key;
      }

      const event = new EventModel({
        ...eventData,
        bannerUrl,
        bannerKey,
      });

      await event.save();
      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async getAllEvents(): Promise<IEvent[]> {
    try {
      return await EventModel.find().sort({ startDate: 1 });
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async getEventById(id: string): Promise<IEvent | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid event ID');
      }

      const event = await EventModel.findById(id);
      return event;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  async updateEvent(id: string, updateData: IEventUpdate, file?: Express.Multer.File): Promise<IEvent | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid event ID');
      }

      const existingEvent = await EventModel.findById(id);
      if (!existingEvent) {
        return null;
      }

      let bannerUrl = existingEvent.bannerUrl;
      let bannerKey = existingEvent.bannerKey;

      if (file) {
        // Delete old banner if exists
        if (existingEvent.bannerKey) {
          await s3Service.deleteFile(existingEvent.bannerKey).catch(console.error);
        }

        const uploadResult = await s3Service.uploadFile(file, 'event-banners');
        bannerUrl = uploadResult.url;
        bannerKey = uploadResult.key;
      }

      const updatedEvent = await EventModel.findByIdAndUpdate(
        id,
        {
          ...updateData,
          bannerUrl,
          bannerKey,
        },
        { new: true, runValidators: true }
      );

      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid event ID');
      }

      const event = await EventModel.findById(id);
      if (!event) {
        return false;
      }

      // Delete event banner from S3 if exists
      if (event.bannerKey) {
        await s3Service.deleteFile(event.bannerKey).catch(console.error);
      }

      // Delete all attendees for this event
      await AttendeeModel.deleteMany({ eventId: id });

      // Delete the event
      await EventModel.findByIdAndDelete(id);

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  async getEventAttendees(eventId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
      }

      const attendees = await AttendeeModel.find({ eventId }).sort({ registeredAt: -1 });
      const totalCount = await AttendeeModel.countDocuments({ eventId });
      const checkedInCount = await AttendeeModel.countDocuments({ eventId, checkedIn: true });

      return {
        attendees,
        stats: {
          total: totalCount,
          checkedIn: checkedInCount,
        },
      };
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      throw error;
    }
  }
}

export default new EventService();