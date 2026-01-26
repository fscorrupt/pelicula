import { Timestamp } from 'firebase/firestore';

export interface Event {
  id: string;
  timestamp: Timestamp | number;
  date: Date;
  description: string;
}
