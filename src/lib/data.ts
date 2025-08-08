export type AgeGroupData = {
  age: string;
  rate: number;
};

export const overallCoverage = {
  rate: 78,
  population: 1350482,
};

export const ageGroupData: AgeGroupData[] = [
  { age: '0-17', rate: 65 },
  { age: '18-49', rate: 75 },
  { age: '50-64', rate: 85 },
  { age: '65+', rate: 92 },
];
