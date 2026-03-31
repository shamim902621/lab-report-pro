export type UserRole = 'admin' | 'staff' | 'doctor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Patient {
  id: string;
  patientId: string;
  uhid: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob?: string;
  mobile: string;
  email?: string;
  address?: string;
  city?: string;
  referredBy?: string;
  registrationDate: string;
  sampleCollectionDate?: string;
  reportDate?: string;
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  clinicName?: string;
  mobile: string;
  email?: string;
  address?: string;
  referralCode: string;
  notes?: string;
}

export type ResultType = 'numeric' | 'text' | 'positive_negative' | 'dropdown';

export interface Test {
  id: string;
  name: string;
  shortName: string;
  testCode: string;
  category: string;
  department: string;
  sampleType: string;
  method?: string;
  unit: string;
  referenceRange: string;
  maleRange?: string;
  femaleRange?: string;
  childRange?: string;
  criticalHigh?: number;
  criticalLow?: number;
  resultType: ResultType;
  interpretation?: string;
  printSequence: number;
  active: boolean;
  formula?: string;
  dropdownOptions?: string[];
  price: number;
}

export interface Profile {
  id: string;
  name: string;
  profileCode: string;
  category: string;
  testIds: string[];
  price: number;
  description?: string;
}

export type ReportStatus = 'draft' | 'pending' | 'verified' | 'printed' | 'delivered';

export interface ReportItem {
  testId: string;
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: 'normal' | 'high' | 'low' | 'critical' | '';
  category: string;
}

export interface Report {
  id: string;
  reportNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId?: string;
  doctorName?: string;
  items: ReportItem[];
  status: ReportStatus;
  remarks?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
  sampleCollectionDate: string;
  reportDate: string;
}

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';
export type PaymentMode = 'cash' | 'card' | 'upi' | 'netbanking' | 'other';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  reportId?: string;
  items: { name: string; amount: number }[];
  totalAmount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  invoiceDate: string;
}

export interface LabSettings {
  labName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  registrationNumber?: string;
  nablNumber?: string;
  footerNote: string;
  pathologistName: string;
  qualification: string;
  logoUrl?: string;
  signatureUrl?: string;
}
