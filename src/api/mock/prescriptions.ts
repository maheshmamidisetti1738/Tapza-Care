import { Prescription } from '../../types/models';

export const prescriptions: Prescription[] = [
  {
    id: 'rx1',
    issuedAt: '2026-11-20T11:15:00+05:30',
    doctorName: 'Dr. Arjun Rao',
    clinicName: 'Tapza Clinic, Banjara Hills, Hyderabad',
    medicines: [
      {
        id: 'm1',
        name: 'Metformin',
        dose: '500 mg, 1 tablet after food',
        days: 30,
        timing: ['morning', 'night'],
      },
      {
        id: 'm2',
        name: 'Glimepiride',
        dose: '1 mg, 1 tablet before breakfast',
        days: 30,
        timing: ['morning'],
      },
      {
        id: 'm3',
        name: 'Vitamin B12',
        dose: '1 capsule after lunch',
        days: 15,
        timing: ['afternoon'],
      },
    ],
  },
  {
    id: 'rx2',
    issuedAt: '2026-11-02T17:40:00+05:30',
    doctorName: 'Dr. Lakshmi Reddy',
    clinicName: 'Tapza Clinic, Banjara Hills, Hyderabad',
    medicines: [
      {
        id: 'm4',
        name: 'Paracetamol',
        dose: '650 mg, 1 tablet when fever is above 100°F',
        days: 3,
        timing: ['morning', 'afternoon', 'night'],
      },
      {
        id: 'm5',
        name: 'Cetirizine',
        dose: '10 mg, 1 tablet',
        days: 5,
        timing: ['night'],
      },
    ],
  },
  {
    id: 'rx3',
    issuedAt: '2026-10-14T10:05:00+05:30',
    doctorName: 'Dr. Venkat Subramanyam',
    clinicName: 'Tapza Clinic, Benz Circle, Vijayawada',
    medicines: [
      {
        id: 'm6',
        name: 'Atorvastatin',
        dose: '10 mg, 1 tablet',
        days: 60,
        timing: ['night'],
      },
      {
        id: 'm7',
        name: 'Aspirin',
        dose: '75 mg, 1 tablet after food',
        days: 60,
        timing: ['afternoon'],
      },
    ],
  },
];
