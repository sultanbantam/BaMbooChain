const fs = require('fs');
let content = fs.readFileSync('src/locales/translations.js', 'utf8');

const aiID = `
    tw_kyc_ai_title: "🤖 AI Liveness & Fraud Engine",
    tw_kyc_ai_step1: "1. Menganalisis metadata EXIF file asli...",
    tw_kyc_ai_step2: "2. Memeriksa ELA (Error Level Analysis) editan foto...",
    tw_kyc_ai_step3: "3. Memindai rekayasa AI & Deepfake wajah...",
    tw_kyc_ai_step4: "4. Pencocokan biometrik wajah (Kemiripan: 98.4%)...",
    tw_kyc_ai_success: "🎉 AI VERDICT: DOKUMEN 100% ASLI & AMAN!",
    tw_kyc_ai_wait: "Mohon tidak menutup jendela ini selama pemindaian AI berlangsung...",
`;

const aiEN = `
    tw_kyc_ai_title: "🤖 AI Liveness & Fraud Engine",
    tw_kyc_ai_step1: "1. Analyzing original file EXIF metadata...",
    tw_kyc_ai_step2: "2. Checking ELA (Error Level Analysis) for photo edits...",
    tw_kyc_ai_step3: "3. Scanning for AI manipulation & face Deepfakes...",
    tw_kyc_ai_step4: "4. Facial biometric matching (Similarity: 98.4%)...",
    tw_kyc_ai_success: "🎉 AI VERDICT: DOCUMENT IS 100% AUTHENTIC & SAFE!",
    tw_kyc_ai_wait: "Please do not close this window while AI scanning is in progress...",
`;

const aiJA = `
    "tw_kyc_ai_title": "🤖 AIライブネス＆不正検知エンジン",
    "tw_kyc_ai_step1": "1. 元のファイルのEXIFメタデータを分析しています...",
    "tw_kyc_ai_step2": "2. 写真編集のELA (エラーレベル分析) を確認しています...",
    "tw_kyc_ai_step3": "3. AI操作と顔のディープフェイクをスキャンしています...",
    "tw_kyc_ai_step4": "4. 顔の生体認証マッチング (類似度: 98.4%)...",
    "tw_kyc_ai_success": "🎉 AIの判定: ドキュメントは100%本物で安全です！",
    "tw_kyc_ai_wait": "AIスキャン中は、このウィンドウを閉じないでください...",
`;

content = content.replace(/(tw_kyc_why_priority_desc:\s*"Reward lebih tinggi untuk akun terverifikasi\.",)/, '$1\n' + aiID);
content = content.replace(/(tw_kyc_why_priority_desc:\s*"Higher rewards for verified accounts\.",)/, '$1\n' + aiEN);
content = content.replace(/("tw_kyc_why_priority_desc":\s*"認証済みアカウントのより高い報酬。",)/, '$1\n' + aiJA);

fs.writeFileSync('src/locales/translations.js', content);
