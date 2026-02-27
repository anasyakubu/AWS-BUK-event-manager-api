import { Document, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  bannerUrl?: string;
  bannerKey?: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventCreate {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
}

export interface IEventUpdate extends Partial<IEventCreate> { }