const fs = require('fs');
let content = fs.readFileSync('src/locales/translations.js', 'utf8');

const twBuyID = `
    tw_buy_rate_prefix: "Kurs Saat Ini: 1 USDT ≈ Rp ",
    tw_buy_confirm: "Konfirmasi:",
    tw_buy_transfer_1: "Transfer ",
    tw_buy_transfer_2: " ke rekening resmi yayasan:",
    tw_buy_bank_name_label: "Bank BRI",
    tw_buy_bank_account_name: "An. Yayasan Sabumi Nusantara Jaya",
    tw_buy_bank_account_number: "NO REK: 141101000456562",
    tw_buy_bank_name: "Nama Lengkap di Rekening Bank:",
    tw_buy_bank_name_ph: "Wajib sama dengan Nama KYC",
    tw_buy_bank_name_note: "Hanya diproses jika nama pengirim sama dengan profil.",
    tw_buy_upload: "Upload Bukti Transfer",
    tw_buy_cancel: "Batal",
    tw_buy_save_10: "Hemat 10%",
    tw_buy_save_20: "Hemat 20%",
    tw_buy_order_now: "Pesan Sekarang",
    tw_buy_custom: "Beli Bebas",
    tw_buy_payment_methods: "💳 Metode Pembayaran Terdukung:",
    tw_buy_payment_desc: "Transfer Bank (BRI, BCA, Mandiri), E-Wallet (OVO, Dana, ShopeePay, GoPay).",
`;

const twBuyEN = `
    tw_buy_rate_prefix: "Current Rate: 1 USDT ≈ Rp ",
    tw_buy_confirm: "Confirm:",
    tw_buy_transfer_1: "Transfer ",
    tw_buy_transfer_2: " to the official foundation account:",
    tw_buy_bank_name_label: "Bank BRI",
    tw_buy_bank_account_name: "An. Yayasan Sabumi Nusantara Jaya",
    tw_buy_bank_account_number: "Account No: 141101000456562",
    tw_buy_bank_name: "Full Name on Bank Account:",
    tw_buy_bank_name_ph: "Must match KYC Name",
    tw_buy_bank_name_note: "Only processed if the sender's name matches the profile.",
    tw_buy_upload: "Upload Transfer Proof",
    tw_buy_cancel: "Cancel",
    tw_buy_save_10: "Save 10%",
    tw_buy_save_20: "Save 20%",
    tw_buy_order_now: "Order Now",
    tw_buy_custom: "Custom Buy",
    tw_buy_payment_methods: "💳 Supported Payment Methods:",
    tw_buy_payment_desc: "Bank Transfer (BRI, BCA, Mandiri), E-Wallet (OVO, Dana, ShopeePay, GoPay).",
`;

const twBuyJA = `
    "tw_buy_rate_prefix": "現在のレート: 1 USDT ≈ Rp ",
    "tw_buy_confirm": "確認:",
    "tw_buy_transfer_1": "振込 ",
    "tw_buy_transfer_2": " を公式財団口座へ:",
    "tw_buy_bank_name_label": "Bank BRI (銀行)",
    "tw_buy_bank_account_name": "名義: Yayasan Sabumi Nusantara Jaya",
    "tw_buy_bank_account_number": "口座番号: 141101000456562",
    "tw_buy_bank_name": "銀行口座のフルネーム:",
    "tw_buy_bank_name_ph": "KYC名と一致する必要があります",
    "tw_buy_bank_name_note": "送信者の名前がプロフィールと一致する場合にのみ処理されます。",
    "tw_buy_upload": "振込証明書のアップロード",
    "tw_buy_cancel": "キャンセル",
    "tw_buy_save_10": "10%節約",
    "tw_buy_save_20": "20%節約",
    "tw_buy_order_now": "今すぐ注文",
    "tw_buy_custom": "カスタム購入",
    "tw_buy_payment_methods": "💳 サポートされている支払い方法:",
    "tw_buy_payment_desc": "銀行振込 (BRI、BCA、Mandiri)、電子マネー (OVO、Dana、ShopeePay、GoPay)。",
`;

content = content.replace(/(tw_menu_title:\s*"Menu Token & Wallet",)/, '$1\n' + twBuyID);
content = content.replace(/(tw_menu_title:\s*"Token & Wallet Menu",)/, '$1\n' + twBuyEN);
content = content.replace(/("tw_menu_title":\s*"トークンとウォレットのメニュー",)/, '$1\n' + twBuyJA);

fs.writeFileSync('src/locales/translations.js', content);
