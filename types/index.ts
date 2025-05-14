import type { ObjectId, Mixed } from 'mongoose';

export interface Student {
  _id: ObjectId;
  SubmissionID: string;
  submissionIdUnique: string;
  FullName: string;
  FirstName: string;
  LastName: string;
  IEP: string;
  Accommodations?: string;
  CheckIn: Mixed;
  CheckOut: Mixed;
  TestSession: Mixed;
}

export interface Session {
  _id: string;
  proctor: string;
  phone: string;
  room: string;
  wing: string;
  date: string;
  start?: string;
  end?: string;
  students: Array<Object>;
}

export interface Pickup {
  _id: ObjectId;
  Departure: Mixed;
  FirstName: String;
  LastName: String;
  PickupDate: String;
  PickupPerson: String;
  PickupPhone: String;
  PickupRelation: String;
  PickupTime: String;
  QID: String;
}
