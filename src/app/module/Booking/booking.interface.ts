import { Types } from 'mongoose';

export interface TBooking {
  facility: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  user: Types.ObjectId;
  isBooked: TBookedStatus;
  payableAmount: number;
}

export type TBookTime = {
  _id: Types.ObjectId;
  startTime: string;
  endTime: string;
};

export type TBookedStatus = 'confirmed' | 'unconfirmed' | 'canceled';
