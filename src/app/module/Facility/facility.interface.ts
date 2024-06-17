import { Model } from 'mongoose';

export interface TFacility {
  name: string;
  description: string;
  pricePerHour: number;
  location: string;
  isDeleted: boolean;
}

export interface T_Facility_Find_Methods extends Model<TFacility> {
  isFacitityExist(id: string): Promise<boolean>;
}
