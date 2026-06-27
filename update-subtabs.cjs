const fs = require('fs');
let content = fs.readFileSync('src/locales/translations.js', 'utf8');

const tabsID = `
    tw_subtab_earn: "Earn (Gratis)",
    tw_subtab_buy: "Buy BMC",
    tw_subtab_contribute: "Contribute Data",
    tw_subtab_validator: "Validator",
    tw_subtab_marketplace: "Marketplace",
`;

const tabsEN = `
    tw_subtab_earn: "Earn (Free)",
    tw_subtab_buy: "Buy BMC",
    tw_subtab_contribute: "Contribute Data",
    tw_subtab_validator: "Validator",
    tw_subtab_marketplace: "Marketplace",
`;

const tabsJA = `
    "tw_subtab_earn": "獲得 (無料)",
    "tw_subtab_buy": "BMCを購入",
    "tw_subtab_contribute": "データ提供",
    "tw_subtab_validator": "バリデーター",
    "tw_subtab_marketplace": "マーケットプレイス",
`;

content = content.replace(/(tw_buy_rate_prefix:\s*"Kurs Saat Ini: 1 USDT ≈ Rp ",)/, '$1\n' + tabsID);
content = content.replace(/(tw_buy_rate_prefix:\s*"Current Rate: 1 USDT ≈ Rp ",)/, '$1\n' + tabsEN);
content = content.replace(/("tw_buy_rate_prefix":\s*"現在のレート: 1 USDT ≈ Rp ",)/, '$1\n' + tabsJA);

fs.writeFileSync('src/locales/translations.js', content);
