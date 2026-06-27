const fs = require('fs');
let content = fs.readFileSync('src/locales/translations.js', 'utf8');

const kycID = `
    tw_kyc_desc: "Verifikasi identitas untuk akses penuh ekosistem.",
    tw_kyc_name: "Nama Lengkap (Sesuai Identitas)",
    tw_kyc_doc_type: "Jenis Dokumen Identitas",
    tw_kyc_doc_ktp: "KTP (Kartu Tanda Penduduk - Indonesia)",
    tw_kyc_doc_passport: "Paspor (Passport - Global)",
    tw_kyc_doc_sim: "SIM (Surat Izin Mengemudi)",
    tw_kyc_doc_student: "Kartu Pelajar / Kartu Mahasiswa (Student ID)",
    tw_kyc_photo_selfie: "Foto Identitas & Selfie",
    tw_kyc_original: "Asli",
    tw_kyc_no_photo: "Belum ada foto dipilih",
    tw_kyc_choose_photo: "Pilih Foto",
    tw_kyc_agreement: "Saya menyatakan data ini benar dan setuju dengan kebijakan privasi.",
    tw_kyc_sending: "Mengirim...",
    tw_kyc_submit: "Kirim Pengajuan",
    tw_kyc_why: "Kenapa KYC?",
    tw_kyc_why_security: "Keamanan:",
    tw_kyc_why_security_desc: "Menghindari serangan bot massal.",
    tw_kyc_why_compliance: "Kepatuhan:",
    tw_kyc_why_compliance_desc: "Memenuhi regulasi aset digital.",
    tw_kyc_why_priority: "Prioritas:",
    tw_kyc_why_priority_desc: "Reward lebih tinggi untuk akun terverifikasi.",
`;

const kycEN = `
    tw_kyc_desc: "Verify your identity for full ecosystem access.",
    tw_kyc_name: "Full Name (As per ID)",
    tw_kyc_doc_type: "Identity Document Type",
    tw_kyc_doc_ktp: "National ID Card (KTP - Indonesia)",
    tw_kyc_doc_passport: "Passport (Global)",
    tw_kyc_doc_sim: "Driving License (SIM)",
    tw_kyc_doc_student: "Student ID Card",
    tw_kyc_photo_selfie: "Identity Photo & Selfie",
    tw_kyc_original: "Original",
    tw_kyc_no_photo: "No photo selected",
    tw_kyc_choose_photo: "Choose Photo",
    tw_kyc_agreement: "I declare this data is true and agree to the privacy policy.",
    tw_kyc_sending: "Sending...",
    tw_kyc_submit: "Submit Application",
    tw_kyc_why: "Why KYC?",
    tw_kyc_why_security: "Security:",
    tw_kyc_why_security_desc: "Avoid mass bot attacks.",
    tw_kyc_why_compliance: "Compliance:",
    tw_kyc_why_compliance_desc: "Meet digital asset regulations.",
    tw_kyc_why_priority: "Priority:",
    tw_kyc_why_priority_desc: "Higher rewards for verified accounts.",
`;

const kycJA = `
    "tw_kyc_desc": "完全なエコシステムアクセスのための本人確認。",
    "tw_kyc_name": "氏名 (身分証明書通り)",
    "tw_kyc_doc_type": "身分証明書の種類",
    "tw_kyc_doc_ktp": "国民IDカード (KTP - インドネシア)",
    "tw_kyc_doc_passport": "パスポート (グローバル)",
    "tw_kyc_doc_sim": "運転免許証 (SIM)",
    "tw_kyc_doc_student": "学生証",
    "tw_kyc_photo_selfie": "身分証明書の写真と自撮り",
    "tw_kyc_original": "原本",
    "tw_kyc_no_photo": "写真が選択されていません",
    "tw_kyc_choose_photo": "写真を選択",
    "tw_kyc_agreement": "このデータが真実であることを宣言し、プライバシーポリシーに同意します。",
    "tw_kyc_sending": "送信中...",
    "tw_kyc_submit": "申請を送信する",
    "tw_kyc_why": "なぜKYCなのか？",
    "tw_kyc_why_security": "セキュリティ:",
    "tw_kyc_why_security_desc": "大規模なボット攻撃を回避します。",
    "tw_kyc_why_compliance": "コンプライアンス:",
    "tw_kyc_why_compliance_desc": "デジタル資産規制を遵守します。",
    "tw_kyc_why_priority": "優先順位:",
    "tw_kyc_why_priority_desc": "認証済みアカウントのより高い報酬。",
`;

content = content.replace(/(tw_subtab_marketplace:\s*"Marketplace",)/, '$1\n' + kycID);
// To be safe, target EN specifically using a known EN string
content = content.replace(/(tw_buy_payment_desc:\s*"Bank Transfer.*?GoPay\)\.",)/, '$1\n' + kycEN);
content = content.replace(/("tw_buy_payment_desc":\s*"銀行振込.*?GoPay\)。",)/, '$1\n' + kycJA);

fs.writeFileSync('src/locales/translations.js', content);
