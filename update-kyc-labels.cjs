const fs = require('fs');
let content = fs.readFileSync('src/locales/translations.js', 'utf8');

const labelsID = `
    tw_kyc_lbl_passport: "Nomor Paspor (Passport Number)",
    tw_kyc_lbl_sim: "Nomor SIM (Driver License Number)",
    tw_kyc_lbl_student: "Nomor Kartu Pelajar / Mahasiswa (Student ID)",
    tw_kyc_lbl_ktp: "NIK (Nomor Induk Kependudukan - KTP)",
    tw_kyc_ph_passport: "Contoh: A12345678",
    tw_kyc_ph_sim: "Contoh: 123456789012",
    tw_kyc_ph_student: "Contoh: 20260518",
    tw_kyc_ph_ktp: "16 digit angka NIK",
`;

const labelsEN = `
    tw_kyc_lbl_passport: "Passport Number",
    tw_kyc_lbl_sim: "Driver License Number",
    tw_kyc_lbl_student: "Student ID Number",
    tw_kyc_lbl_ktp: "National ID Number (NIK)",
    tw_kyc_ph_passport: "Example: A12345678",
    tw_kyc_ph_sim: "Example: 123456789012",
    tw_kyc_ph_student: "Example: 20260518",
    tw_kyc_ph_ktp: "16 digit ID number",
`;

const labelsJA = `
    "tw_kyc_lbl_passport": "パスポート番号",
    "tw_kyc_lbl_sim": "運転免許証番号",
    "tw_kyc_lbl_student": "学生証番号",
    "tw_kyc_lbl_ktp": "国民ID番号 (NIK)",
    "tw_kyc_ph_passport": "例: A12345678",
    "tw_kyc_ph_sim": "例: 123456789012",
    "tw_kyc_ph_student": "例: 20260518",
    "tw_kyc_ph_ktp": "16桁のID番号",
`;

content = content.replace(/(tw_kyc_doc_passport:\s*"Paspor.*?Global\)",)/, '$1\n' + labelsID);
content = content.replace(/(tw_kyc_doc_passport:\s*"Passport.*?Global\)",)/, '$1\n' + labelsEN);
content = content.replace(/("tw_kyc_doc_passport":\s*"パスポート.*?グローバル\)",)/, '$1\n' + labelsJA);

fs.writeFileSync('src/locales/translations.js', content);
