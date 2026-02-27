import { Document, Types } from 'mongoose';

export interface IAttendee extends Document {
  eventId: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  checkedIn: boolean;
  registeredAt: Date;
}

export interface IAttendeeCreate {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
}