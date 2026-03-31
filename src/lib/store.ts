import { Patient, Doctor, Test, Profile, Report, Invoice, LabSettings, User } from '@/types';
import { seedTests } from '@/data/seedTests';
import { seedProfiles } from '@/data/seedProfiles';
import { samplePatients, sampleDoctors, sampleReports, sampleInvoices, defaultLabSettings, defaultUsers } from '@/data/sampleData';

const STORAGE_KEYS = {
  patients: 'lab_patients',
  doctors: 'lab_doctors',
  tests: 'lab_tests',
  profiles: 'lab_profiles',
  reports: 'lab_reports',
  invoices: 'lab_invoices',
  settings: 'lab_settings',
  users: 'lab_users',
  currentUser: 'lab_current_user',
  initialized: 'lab_initialized',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function initializeData() {
  if (localStorage.getItem(STORAGE_KEYS.initialized)) return;
  save(STORAGE_KEYS.tests, seedTests);
  save(STORAGE_KEYS.profiles, seedProfiles);
  save(STORAGE_KEYS.patients, samplePatients);
  save(STORAGE_KEYS.doctors, sampleDoctors);
  save(STORAGE_KEYS.reports, sampleReports);
  save(STORAGE_KEYS.invoices, sampleInvoices);
  save(STORAGE_KEYS.settings, defaultLabSettings);
  save(STORAGE_KEYS.users, defaultUsers);
  localStorage.setItem(STORAGE_KEYS.initialized, 'true');
}

// Generic CRUD
function createStore<T extends { id: string }>(key: string) {
  return {
    getAll: (): T[] => load<T[]>(key, []),
    getById: (id: string): T | undefined => load<T[]>(key, []).find(i => i.id === id),
    create: (item: T) => { const all = load<T[]>(key, []); all.push(item); save(key, all); return item; },
    update: (id: string, updates: Partial<T>) => {
      const all = load<T[]>(key, []);
      const idx = all.findIndex(i => i.id === id);
      if (idx >= 0) { all[idx] = { ...all[idx], ...updates }; save(key, all); }
      return all[idx];
    },
    remove: (id: string) => { const all = load<T[]>(key, []).filter(i => i.id !== id); save(key, all); },
  };
}

export const patientStore = createStore<Patient>(STORAGE_KEYS.patients);
export const doctorStore = createStore<Doctor>(STORAGE_KEYS.doctors);
export const testStore = createStore<Test>(STORAGE_KEYS.tests);
export const profileStore = createStore<Profile>(STORAGE_KEYS.profiles);
export const reportStore = createStore<Report>(STORAGE_KEYS.reports);
export const invoiceStore = createStore<Invoice>(STORAGE_KEYS.invoices);

export function getSettings(): LabSettings { return load(STORAGE_KEYS.settings, defaultLabSettings); }
export function updateSettings(s: Partial<LabSettings>) { save(STORAGE_KEYS.settings, { ...getSettings(), ...s }); }

export function getUsers(): User[] { return load(STORAGE_KEYS.users, defaultUsers); }
export function getCurrentUser(): User | null { return load(STORAGE_KEYS.currentUser, null); }
export function setCurrentUser(u: User | null) { save(STORAGE_KEYS.currentUser, u); }

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

export function generateSequentialId(prefix: string, existingIds: string[]): string {
  const nums = existingIds.map(id => {
    const match = id.match(/(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  });
  const next = Math.max(0, ...nums) + 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
}
