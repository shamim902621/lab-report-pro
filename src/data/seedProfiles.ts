import { Profile } from '@/types';
import { seedTests } from './seedTests';

const findTestIds = (names: string[]): string[] => {
  return names.map(name => {
    const test = seedTests.find(t => t.name === name || t.shortName === name);
    return test?.id || '';
  }).filter(Boolean);
};

export const seedProfiles: Profile[] = [
  {
    id: 'profile-001', name: 'Complete Blood Count (CBC)', profileCode: 'CBC', category: 'Hematology',
    price: 350,
    testIds: findTestIds(['Hemoglobin', 'Total Leukocyte Count', 'RBC Count', 'Hematocrit / PCV', 'MCV', 'MCH', 'MCHC', 'RDW-CV', 'Platelet Count', 'MPV', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils']),
    description: 'Complete blood count with differential'
  },
  {
    id: 'profile-002', name: 'Liver Function Test (LFT)', profileCode: 'LFT', category: 'Biochemistry',
    price: 500,
    testIds: findTestIds(['Total Bilirubin', 'Direct Bilirubin', 'Indirect Bilirubin', 'SGOT / AST', 'SGPT / ALT', 'Alkaline Phosphatase', 'Gamma GT / GGT', 'Total Protein', 'Albumin', 'Globulin', 'A/G Ratio']),
    description: 'Complete liver function panel'
  },
  {
    id: 'profile-003', name: 'Kidney Function Test (KFT)', profileCode: 'KFT', category: 'Biochemistry',
    price: 600,
    testIds: findTestIds(['Blood Urea', 'Blood Urea Nitrogen', 'Serum Creatinine', 'Uric Acid', 'eGFR', 'Sodium', 'Potassium', 'Chloride', 'Calcium', 'Phosphorus']),
    description: 'Complete kidney/renal function panel'
  },
  {
    id: 'profile-004', name: 'Lipid Profile', profileCode: 'LIPID', category: 'Biochemistry',
    price: 450,
    testIds: findTestIds(['Total Cholesterol', 'Triglycerides', 'HDL Cholesterol', 'LDL Cholesterol', 'VLDL Cholesterol', 'TC/HDL Ratio', 'LDL/HDL Ratio']),
    description: 'Complete lipid/cholesterol panel'
  },
  {
    id: 'profile-005', name: 'Thyroid Profile', profileCode: 'THYROID', category: 'Biochemistry',
    price: 700,
    testIds: findTestIds(['T3', 'T4', 'TSH']),
    description: 'Basic thyroid function panel'
  },
  {
    id: 'profile-006', name: 'Diabetic Profile', profileCode: 'DM', category: 'Biochemistry',
    price: 550,
    testIds: findTestIds(['Fasting Blood Sugar', 'Post Prandial Blood Sugar', 'HbA1c']),
    description: 'Diabetes screening panel'
  },
  {
    id: 'profile-007', name: 'Iron Profile', profileCode: 'IRON', category: 'Biochemistry',
    price: 800,
    testIds: findTestIds(['Serum Iron', 'TIBC', 'UIBC', 'Transferrin Saturation', 'Ferritin']),
    description: 'Iron deficiency panel'
  },
  {
    id: 'profile-008', name: 'Hormone Profile (Female)', profileCode: 'HRM-F', category: 'Biochemistry',
    price: 2500,
    testIds: findTestIds(['FSH', 'LH', 'Prolactin', 'Estradiol', 'Progesterone', 'Testosterone', 'DHEAS']),
    description: 'Female hormone panel'
  },
  {
    id: 'profile-009', name: 'Cardiac Profile', profileCode: 'CARDIAC', category: 'Biochemistry',
    price: 1500,
    testIds: findTestIds(['CK-MB', 'CPK Total', 'Troponin I', 'LDH', 'hs-CRP']),
    description: 'Cardiac risk markers'
  },
  {
    id: 'profile-010', name: 'Coagulation Profile', profileCode: 'COAG', category: 'Hematology',
    price: 900,
    testIds: findTestIds(['PT', 'INR', 'aPTT', 'Bleeding Time', 'Clotting Time']),
    description: 'Coagulation/clotting profile'
  },
  {
    id: 'profile-011', name: 'Vitamin Profile', profileCode: 'VIT', category: 'Biochemistry',
    price: 1800,
    testIds: findTestIds(['Vitamin D', 'Vitamin B12', 'Folate / Folic Acid']),
    description: 'Essential vitamin panel'
  },
  {
    id: 'profile-012', name: 'Electrolyte Profile', profileCode: 'ELEC', category: 'Biochemistry',
    price: 400,
    testIds: findTestIds(['Sodium', 'Potassium', 'Chloride', 'Calcium', 'Magnesium', 'Phosphorus', 'Bicarbonate']),
    description: 'Serum electrolytes panel'
  },
  {
    id: 'profile-013', name: 'Urine Routine', profileCode: 'URINE', category: 'Clinical Pathology',
    price: 200,
    testIds: findTestIds(['Urine Color', 'Urine Appearance', 'Specific Gravity', 'Urine pH', 'Urine Protein', 'Urine Sugar', 'Urine Ketone', 'Bile Salt', 'Bile Pigment', 'Urobilinogen', 'Nitrite', 'Leukocyte Esterase', 'Urine Pus Cells', 'Urine RBC', 'Epithelial Cells', 'Casts', 'Crystals', 'Bacteria']),
    description: 'Complete urine examination'
  },
  {
    id: 'profile-014', name: 'Stool Routine', profileCode: 'STOOL', category: 'Clinical Pathology',
    price: 200,
    testIds: findTestIds(['Stool Color', 'Stool Consistency', 'Stool Mucus', 'Stool Blood', 'Stool Ova', 'Stool Cyst', 'Stool Parasites', 'Stool RBC', 'Stool Pus Cells', 'Stool Occult Blood']),
    description: 'Complete stool examination'
  },
  {
    id: 'profile-015', name: 'Fever Profile', profileCode: 'FEVER', category: 'Clinical Pathology',
    price: 1200,
    testIds: findTestIds(['Hemoglobin', 'Total Leukocyte Count', 'Platelet Count', 'ESR', 'CRP', 'Malaria Antigen', 'Dengue NS1', 'Widal Test']),
    description: 'Fever investigation panel'
  },
  {
    id: 'profile-016', name: 'Arthritis Profile', profileCode: 'ARTH', category: 'Immunology',
    price: 1000,
    testIds: findTestIds(['RA Factor', 'Anti-CCP', 'CRP', 'ESR', 'Uric Acid', 'ASO Titer']),
    description: 'Arthritis screening panel'
  },
  {
    id: 'profile-017', name: 'Prenatal Profile', profileCode: 'PRENATAL', category: 'Clinical Pathology',
    price: 2000,
    testIds: findTestIds(['Hemoglobin', 'Blood Group', 'Rh Typing', 'HIV 1 & 2', 'HBsAg', 'VDRL', 'Fasting Blood Sugar', 'TSH']),
    description: 'Antenatal screening panel'
  },
  {
    id: 'profile-018', name: 'Full Body Checkup', profileCode: 'FBC', category: 'Biochemistry',
    price: 3500,
    testIds: findTestIds(['Hemoglobin', 'Total Leukocyte Count', 'RBC Count', 'Platelet Count', 'Fasting Blood Sugar', 'HbA1c', 'Total Cholesterol', 'Triglycerides', 'HDL Cholesterol', 'LDL Cholesterol', 'Total Bilirubin', 'SGOT / AST', 'SGPT / ALT', 'Blood Urea', 'Serum Creatinine', 'TSH', 'Vitamin D', 'Vitamin B12']),
    description: 'Comprehensive health checkup'
  },
];
