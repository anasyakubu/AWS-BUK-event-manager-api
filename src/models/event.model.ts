import mongoose, { Schema } from 'mongoose';
import { IEvent } from '../interfaces/event.interface';

class EventModel {
  private eventSchema: Schema;

  constructor() {
    this.eventSchema = new Schema(
      {
        title: {
          type: String,
          required: [true, 'Event title is required'],
          trim: true,
          maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          required: [true, 'Event description is required'],
          trim: true,
        },
        startDate: {
          type: Date,
          required: [true, 'Start date is required'],
        },
        endDate: {
          type: Date,
          required: [true, 'End date is required'],
        },
        location: {
          type: String,
          required: [true, 'Location is required'],
          trim: true,
        },
        bannerUrl: {
          type: String,
          default: null,
        },
        bannerKey: {
          type: String,
          default: null,
        },
        capacity: {
          type: Number,
          required: [true, 'Capacity is required'],
          min: [1, 'Capacity must be at least 1'],
        },
      },
      {
        timestamps: true,
      }
    );

    // Add index for better query performance
    this.eventSchema.index({ startDate: 1, endDate: 1 });
  }

  public getModel(): mongoose.Model<IEvent> {
    return mongoose.model<IEvent>('Event', this.eventSchema);
  }
}

export default new EventModel().getModel();