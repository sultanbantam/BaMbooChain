const fs = require('fs');
let content = fs.readFileSync('src/locales/translations.js', 'utf8');

content = content.replace(/(tw_menu_title:\s*"Token & Wallet Menu",)/, '$1\n    tw_bmc_desc: "BMC is a utility token to access services, earn rewards, and participate in a transparent digital bamboo ecosystem.",');
content = content.replace(/("tw_menu_title":\s*"トークンとウォレットのメニュー",)/, '$1\n    "tw_bmc_desc": "BMCは、サービスへのアクセス、報酬の獲得、および透明なデジタル竹エコシステムへの参加のためのユーティリティトークンです。",');

fs.writeFileSync('src/locales/translations.js', content);
