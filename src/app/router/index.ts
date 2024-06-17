import { Router } from 'express';

import { AuthRouter } from '../module/auth/auth.route';
import { FacilityRouter } from '../module/Facility/facility.route';
import { BookingRouter } from '../module/Booking/booking.route';
import { AvailableTimeRouter } from '../module/AvailableTime/availableTime.route';


const router = Router();

const moduleRoutes = [
  { 
    path: '/auth', route: AuthRouter 
  },
  { 
    path: '/facility', route: FacilityRouter 
  },
  { 
    path: '/bookings', route: BookingRouter 
  },
  { 
    path: '/check-availability', route: AvailableTimeRouter
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
