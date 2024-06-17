import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { BookingService } from './booking.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { convertDate, getFormattedDate } from './booking.utils';

const createBooking: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  data.user = id;
  const result = await BookingService.createBookingIntoDb(data);
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBooking: RequestHandler = catchAsync(async (req, res) => {
  const result = await BookingService.getAllBookingFromDb();
  return sendResponse(res, {
    success: result.length ? true : false,
    statusCode: result.length ? 200 : 404,
    message: result.length
      ? 'Bookings retrieved successfully'
      : 'No Data Found',
    data: result,
  });
});

const getAllBookingByUser: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await BookingService.getAllBookingByUserFromDb(id);
    return sendResponse(res, {
      success: result.length ? true : false,
      statusCode: result.length ? 200 : 404,
      message: result.length
        ? 'Bookings retrieved successfully'
        : 'No Data Found',
      data: result,
    });
  },
);

const deleteBookingByUser: RequestHandler = catchAsync(async (req, res) => {
    const { id: userID } = req.user;
    const { id: bookingID } = req.params;
    const result = await BookingService.deleteBookingByUserFromDb(
      userID,bookingID,
    );
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Booking cancelled successfully',
      data: result,
    });
  },
);

const getAvailableTimeSlots: RequestHandler = catchAsync(
  async (req, res) => {
    const formattedDate = getFormattedDate();
    const date = (req.query?.date as string) || formattedDate;
    const resultDate = convertDate(date);
    const result =
      await BookingService.getAvailableTimeSlotsFromBooking(resultDate);

    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Availability checked successfully',
      data: result,
    });
  },
);
export const BookingController = {
  createBooking,
  getAllBooking,
  getAllBookingByUser,
  deleteBookingByUser,
  getAvailableTimeSlots
};
