export type DoseTiming = 'morning' | 'afternoon' | 'night';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  feeInr: number;
  languages: string[];
}

export interface Slot {
  id: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface Booking {
  id: string;
  doctorId: string;
  slotId: string;
  startsAt: string;
  endsAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  days: number;
  timing: DoseTiming[];
}

export interface Prescription {
  id: string;
  issuedAt: string;
  doctorName: string;
  clinicName: string;
  medicines: Medicine[];
}
