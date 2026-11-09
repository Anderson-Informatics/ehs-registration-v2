export interface Student {
  _id: string;
  SubmissionID: string;
  submissionIdUnique: string;
  FullName: string;
  FirstName: string;
  LastName: string;
  IEP: string;
  Accommodations?: string;
  CheckIn:
    | {
        Date: string;
        Time: string;
        Timestamp: string;
        Registered: boolean;
      }
    | '';
  CheckOut:
    | {
        Date: string;
        Time: string;
        Timestamp: string;
        CheckedOut: boolean;
      }
    | '';
  TestSession:
    | {
        _id: string;
        proctor: string;
        phone: string;
        room: string;
        wing: string;
        date: string;
        start: string;
        end: string;
        duration: number;
      }
    | '';
  LinkedID?: string;
}

// Define the type for the student object
export interface StudentShort {
  SubmissionID: any;
  FullName: any;
  FirstName: any;
  LastName: any;
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
  duration?: number;
  students?: StudentShort[];
}

export interface Pickup {
  _id: string;
  Departure?: {
    Date: string;
    Time: string;
    Timestamp: string;
    PickedUp: boolean;
  };
  FirstName: string;
  LastName: string;
  PickupDate: string;
  PickupPerson: string;
  PickupPhone: string;
  PickupRelation: string;
  PickupTime: string;
  QID: string;
}
