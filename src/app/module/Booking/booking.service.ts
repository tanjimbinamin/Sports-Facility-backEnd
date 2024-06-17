import httpStatus from 'http-status';
import { Facility } from '../Facility/facility.model';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';
import AppError from '../../errors/AppError';
import {availableTimeSlot,getTotalTimeInHour,hasTimeConflict,} from './booking.utils';

//create booking
const createBookingIntoDb = async (data: TBooking) => {
  //check if facility exixt
  const isFacilityExist = await Facility.findById(data.facility);
  if (!isFacilityExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
  }

  //check if facility deleted
  if (isFacilityExist.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility is deleted');
  }

  //get already booked time slot
  const getAllBookingTimeForProvidedDate = await Booking.find({
    facility: data.facility,
    date: data.date,
  }).select(['startTime', 'endTime', '_id']);
  //check time conflict
  if (
    hasTimeConflict(getAllBookingTimeForProvidedDate, {
      startTime: data.startTime,
      endTime: data.endTime,
    })
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Seleted Time is not available');
  }
  
  //calculate payable  ammount for booking
  const totalTime = getTotalTimeInHour(data.startTime, data.endTime);
  data.payableAmount = totalTime * isFacilityExist.pricePerHour;

  
  //create booking
  const result = await Booking.create(data);

  return result;
};

//get all booking by admin
const getAllBookingFromDb = async () => {
  const result = await Booking.find().populate('user').populate('facility');
  return result;
};
//get all booking by user
const getAllBookingByUserFromDb = async (id: string) => {
  const result = await Booking.find({
    user: id,
  }).populate('facility');

  return result;
};
//cencel booking
const deleteBookingByUserFromDb = async (userID: string, bookingID: string) => {
  const isBookingExist = await Booking.findOne({
    _id: bookingID,
    user: userID,
  });

  if (!isBookingExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  const result = await Booking.findByIdAndUpdate(
    bookingID,
    { isBooked: 'canceled' },
    { new: true },
  ).populate('facility');
  return result;
};
//get available time
const getAvailableTimeSlotsFromBooking = async (givenDate: string) => {
  const date = givenDate;

  const bookings = await Booking.find({ date: date }).select([
    'date',
    'startTime',
    'endTime',
  ]);

  const availableTimeSlots = availableTimeSlot(bookings);

  return availableTimeSlots;
};

export const BookingService = {
  createBookingIntoDb,
  getAllBookingFromDb,
  getAllBookingByUserFromDb,
  deleteBookingByUserFromDb,
  getAvailableTimeSlotsFromBooking,
};
