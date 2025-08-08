export type Vaccine = {
  id: string;
  name: string;
  diseases: string[];
  doses: number;
  age: string;
  doseInterval: string;
  doseIntervalDays?: number; // Added for calculation
};

export const vaccineList: Vaccine[] = [
  {
    id: 'BCG',
    name: 'BCG (Bacillus Calmette-Guerin)',
    diseases: ['Tuberculosis'],
    doses: 1,
    age: 'At Birth',
    doseInterval: 'Single dose',
  },
  {
    id: 'HepB',
    name: 'Hepatitis B',
    diseases: ['Hepatitis B'],
    doses: 3,
    age: 'Birth, 6 Weeks, 6 Months',
    doseInterval:
      '1st at birth, 2nd after 1-2 months, 3rd after 6-18 months from 1st',
    doseIntervalDays: 30, // Using minimum interval for calculation
  },
  {
    id: 'OPV',
    name: 'Oral Polio Vaccine (OPV)',
    diseases: ['Poliomyelitis'],
    doses: 4,
    age: 'Birth, 6, 10, 14 Weeks',
    doseInterval: 'At birth, then 3 doses at 4-week intervals',
    doseIntervalDays: 28,
  },
  {
    id: 'IPV',
    name: 'Inactivated Polio Vaccine (IPV)',
    diseases: ['Poliomyelitis'],
    doses: 2,
    age: '6 and 14 Weeks',
    doseInterval: 'Two fractional doses at 6 and 14 weeks of age',
    doseIntervalDays: 56, // 8 weeks between doses
  },
  {
    id: 'Penta',
    name: 'Pentavalent Vaccine',
    diseases: ['Diphtheria', 'Tetanus', 'Pertussis', 'Hepatitis B', 'Hib'],
    doses: 3,
    age: '6, 10, 14 Weeks',
    doseInterval: 'Three doses at 4-week intervals',
    doseIntervalDays: 28,
  },
  {
    id: 'RVV',
    name: 'Rotavirus Vaccine (RVV)',
    diseases: ['Rotavirus'],
    doses: 3,
    age: '6, 10, 14 Weeks',
    doseInterval: 'Three doses at 4-week intervals',
    doseIntervalDays: 28,
  },
  {
    id: 'PCV',
    name: 'Pneumococcal Conjugate Vaccine (PCV)',
    diseases: ['Pneumonia', 'Meningitis'],
    doses: 3,
    age: '6, 14 Weeks & 9-12 Months',
    doseInterval: 'Two primary doses, then a booster dose after 9 months of age',
    doseIntervalDays: 56, // 8 weeks between 1st and 2nd
  },
  {
    id: 'MMR',
    name: 'MMR Vaccine',
    diseases: ['Mumps', 'Measles', 'Rubella'],
    doses: 2,
    age: '9-12 Months, 16-24 Months',
    doseInterval: '1st dose at 9-12 months, 2nd dose at 16-24 months',
    doseIntervalDays: 120, // Approx 4 months minimum
  },
  {
    id: 'DPT-Booster',
    name: 'DPT Booster',
    diseases: ['Diphtheria', 'Tetanus', 'Pertussis'],
    doses: 2,
    age: '16-24 Months, 5-6 Years',
    doseInterval: 'First booster at 16-24 months, second at 5-6 years',
    doseIntervalDays: 1095, // Approx 3 years
  },
  {
    id: 'Td',
    name: 'Td/Tdap',
    diseases: ['Tetanus', 'Diphtheria', 'Pertussis'],
    doses: 1,
    age: '10 Years & 16 years',
    doseInterval: 'One dose at 10 years and another at 16 years',
  },
  {
    id: 'COVID19',
    name: 'COVID-19 Vaccine',
    diseases: ['COVID-19'],
    doses: 2,
    age: 'Adults',
    doseInterval: 'Intervals vary by vaccine type (e.g., 3-8 weeks)',
    doseIntervalDays: 21, // Minimum for most
  },
];
