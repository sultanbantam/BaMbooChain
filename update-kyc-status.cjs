const fs = require('fs');
let content = fs.readFileSync('src/locales/translations.js', 'utf8');

const statusID = `
    tw_kyc_status_verified_title: "Terverifikasi!",
    tw_kyc_status_verified_desc: "Selamat! Akun Anda telah terverifikasi penuh.",
    tw_kyc_status_review_title: "Sedang Ditinjau",
    tw_kyc_status_review_desc: "Mohon tunggu, tim kami sedang memvalidasi dokumen Anda.",
    tw_kyc_status_label: "Status:",
`;

const statusEN = `
    tw_kyc_status_verified_title: "Verified!",
    tw_kyc_status_verified_desc: "Congratulations! Your account has been fully verified.",
    tw_kyc_status_review_title: "Under Review",
    tw_kyc_status_review_desc: "Please wait, our team is currently validating your documents.",
    tw_kyc_status_label: "Status:",
`;

const statusJA = `
    "tw_kyc_status_verified_title": "認証済み！",
    "tw_kyc_status_verified_desc": "おめでとうございます！アカウントの認証が完了しました。",
    "tw_kyc_status_review_title": "審査中",
    "tw_kyc_status_review_desc": "お待ちください。チームがドキュメントを検証中です。",
    "tw_kyc_status_label": "ステータス:",
`;

content = content.replace(/(tw_kyc_ai_wait:\s*"Mohon tidak menutup jendela ini selama pemindaian AI berlangsung\.\.\.",)/, '$1\n' + statusID);
content = content.replace(/(tw_kyc_ai_wait:\s*"Please do not close this window while AI scanning is in progress\.\.\.",)/, '$1\n' + statusEN);
content = content.replace(/("tw_kyc_ai_wait":\s*"AIスキャン中は、このウィンドウを閉じないでください\.\.\.",)/, '$1\n' + statusJA);

fs.writeFileSync('src/locales/translations.js', content);
