import mongoose, { Schema } from 'mongoose';
import { IAttendee } from '../interfaces/attendee.interface';

class AttendeeModel {
  private attendeeSchema: Schema;

  constructor() {
    this.attendeeSchema = new Schema(
      {
        eventId: {
          type: Schema.Types.ObjectId,
          ref: 'Event',
          required: [true, 'Event ID is required'],
        },
        name: {
          type: String,
          required: [true, 'Attendee name is required'],
          trim: true,
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          trim: true,
          lowercase: true,
          validate: {
            validator: (email: string) => {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: 'Please enter a valid email',
          },
        },
        phone: {
          type: String,
          trim: true,
        },
        checkedIn: {
          type: Boolean,
          default: false,
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
      {
        timestamps: true,
      }
    );

    // Ensure one attendee per event (unique email per event)
    this.attendeeSchema.index({ eventId: 1, email: 1 }, { unique: true });
  }

  public getModel(): mongoose.Model<IAttendee> {
    return mongoose.model<IAttendee>('Attendee', this.attendeeSchema);
  }
}

export default new AttendeeModel().getModel();