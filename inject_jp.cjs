const fs = require('fs');
let content = fs.readFileSync('src/locales/translations.js', 'utf8');

const jpTarget = `"market_mode_buyer": "買い手",\n    "market_mode_admin": "管理者ダッシュボード",`;
const jpReplacement = `"market_mode_buyer": "買い手",
    "market_mode_admin": "管理者ダッシュボード",
    "market_shop_settings_title": "ショップ設定",
    "market_shop_settings_desc": "より多くの購入者を引き付けるために、ショップ名と説明を設定してください。",
    "market_shop_name_label": "ショップ / ブランド名",
    "market_shop_name_placeholder": "例: BambooCraft Nusantara",
    "market_shop_desc_label": "ショップの説明",
    "market_shop_desc_placeholder": "あなたのショップや工芸品について教えてください...",
    "market_shop_save_btn": "ショッププロフィールを保存",
    "market_shop_save_success": "ショッププロフィールが正常に更新されました！",
    "market_shop_login_required": "最初にログインしてください。",
    "market_shop_name_required": "ショップ名は必須です。",
    "market_shop_official": "BaMbooChainの公式{vendor}ショップ。",
    "market_shop_collection": "製品コレクション",
    "market_shop_edit_btn": "ショップを編集",
    "market_btn_start_live": "ライブを開始",
    "market_btn_shop_settings": "ショップ設定",`;

// Try \r\n as well if \n fails
let newContent = content.replace(jpTarget, jpReplacement);
if (newContent === content) {
    const jpTargetWin = `"market_mode_buyer": "買い手",\r\n    "market_mode_admin": "管理者ダッシュボード",`;
    newContent = content.replace(jpTargetWin, jpReplacement);
}

fs.writeFileSync('src/locales/translations.js', newContent);
console.log('JP replaced');
