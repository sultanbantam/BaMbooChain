import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{B as t,Cr as n,F as r,Kr as ee,Lt as i,N as te,Nn as a,P as o,Rt as s,St as ne,U as c,Vt as l,W as u,Xt as d,Zr as f,cn as re,fr as ie,gt as ae,hn as p,ht as m,ir as h,mr as g,rr as oe,tt as _,vr as se,wn as v}from"./vendor-core-txHh52xq.js";import{C as y,D as b,d as ce,u as x,w as S}from"./vendor-firebase-BWtpIomP.js";import{n as C}from"./config-9PloHodL.js";import{n as w}from"./AuthContext-DUwWFFzD.js";import"./BackButton-0Ew3KaPy.js";import{o as T,s as le}from"./useFirestoreQueries-MgmMx2X2.js";var E=e(f(),1),D=n(),O=()=>{let e=ee(),{user:n}=w(),{data:f=[]}=le(`verified`),{data:O=[]}=T(`verified`),[ue,de]=(0,E.useState)(!1),[k,fe]=(0,E.useState)(`New`),[A,j]=(0,E.useState)(null),[pe,M]=(0,E.useState)(!1),[N,P]=(0,E.useState)([{role:`bot`,text:`Halo! Saya BambuAI. Ada yang bisa saya bantu terkait karir di ekosistem Sabumi?`}]),[F,I]=(0,E.useState)(``),[L,R]=(0,E.useState)(``),[z,B]=(0,E.useState)(!1),[me,V]=(0,E.useState)(!1),[H,U]=(0,E.useState)({title:``,department:``,location:``,type:`Full-time`,salaryMin:``,salaryMax:``,description:``,requirements:``,contactName:``,contactEmail:``,contactWa:``,bambooChat:``}),[W,G]=(0,E.useState)({title:``,category:`Tenaga Kerja`,expertise:``,location:``,quantity:``,duration:``,budgetRange:``,description:``,qualifications:``,contactName:``,contactEmail:``,contactWa:``,bambooChat:``,projectLink:``,documentPdf:``}),[he,K]=(0,E.useState)(!1),[ge,q]=(0,E.useState)(!1),_e=async e=>{e.preventDefault();try{await x(y(C,`career_job_posts`),{...H,salary:`IDR ${H.salaryMin} - ${H.salaryMax}`,status:`pending`,submittedBy:n?.id||`guest`,submittedByName:n?.username||`Guest`,createdAt:b()}),K(!0),setTimeout(()=>{K(!1),B(!1),U({title:``,department:``,location:``,type:`Full-time`,salaryMin:``,salaryMax:``,description:``,requirements:``,contactName:``,contactEmail:``,contactWa:``,bambooChat:``})},2500)}catch(e){console.error(`Error submitting job:`,e),alert(`Gagal mengirim lowongan. Silakan coba lagi.`)}},ve=async e=>{e.preventDefault();try{await x(y(C,`career_demand_posts`),{...W,status:`pending`,submittedBy:n?.id||`guest`,submittedByName:n?.username||`Guest`,createdAt:b()}),q(!0),setTimeout(()=>{q(!1),V(!1),G({title:``,category:`Tenaga Kerja`,expertise:``,location:``,quantity:``,duration:``,budgetRange:``,description:``,qualifications:``,contactName:``,contactEmail:``,contactWa:``,bambooChat:``,projectLink:``,documentPdf:``})},2500)}catch(e){console.error(`Error submitting demand:`,e),alert(`Gagal mengirim kebutuhan. Silakan coba lagi.`)}},J=async(e,t)=>{if(window.confirm(`Yakin ingin menghapus postingan ini?`))try{await ce(S(C,t,e)),alert(`Postingan berhasil dihapus. Refresh halaman untuk melihat perubahan.`)}catch(e){console.error(`Error deleting post:`,e),alert(`Gagal menghapus postingan.`)}};(0,E.useEffect)(()=>{de(!0)},[]);let Y=[...[{id:`JOB-001`,title:`Senior Smart Contract Developer`,department:`Web3 Engineering`,location:`Remote / Jakarta`,type:`Full-time`,salary:`IDR 30M - 50M`,findersFee:`500 BMC`,icon:(0,D.jsx)(te,{size:24,color:`#f59f00`}),color:`#f59f00`},{id:`JOB-002`,title:`Ahli Agronomi Spesialis Bambu`,department:`Plantation & R&D`,location:`Kasepuhan Cibarani, Banten`,type:`Full-time`,salary:`IDR 15M - 25M`,findersFee:`200 BMC`,icon:(0,D.jsx)(d,{size:24,color:`#0ca678`}),color:`#0ca678`},{id:`JOB-003`,title:`Legal & Compliance Web3`,department:`Legal & Operations`,location:`Tangerang Selatan`,type:`Full-time`,salary:`IDR 20M - 35M`,findersFee:`300 BMC`,icon:(0,D.jsx)(h,{size:24,color:`#3b82f6`}),color:`#3b82f6`}],...f.map(e=>({id:e.id,title:e.title,department:e.department,location:e.location,type:e.type,salary:e.salary,findersFee:`TBD`,icon:(0,D.jsx)(h,{size:24,color:`#0ca678`}),color:`#0ca678`,description:e.description,requirements:e.requirements,contactName:e.contactName,contactEmail:e.contactEmail,contactWa:e.contactWa,bambooChat:e.bambooChat,submittedBy:e.submittedBy}))],ye=[{id:`BTY-01`,title:`Terjemahkan Whitepaper ke Bahasa Jepang`,reward:`500 BMC`,difficulty:`Medium`,tag:`Translation`,category:`New`,value:500},{id:`BTY-02`,title:`Desain Infografis Ekosistem bambuNUSA`,reward:`250 BMC`,difficulty:`Easy`,tag:`Design`,category:`Top`,value:250},{id:`BTY-03`,title:`Audit Kontrak Cerdas Vesting V2`,reward:`2,000 BMC`,difficulty:`Hard`,tag:`Security`,category:`Value`,value:2e3},{id:`BTY-04`,title:`Tulis Artikel Medium tentang Skema Karbon`,reward:`150 BMC`,difficulty:`Easy`,tag:`Content`,category:`New`,value:150}].filter(e=>k===`New`?e.category===`New`||e.category===`Top`:k===`Top`?e.category===`Top`||e.category===`Value`:k===`Value`?e.value>=500:!0),be=[...[{id:`DMD-001`,title:`Pembangunan Villa Bambu Ekologis 10 Unit`,location:`Ubud, Bali`,demandType:`Konstruksi & Arsitektur`,funding:`Terkonfirmasi (150K USDT)`,status:`Mencari Tim Pelaksana`,icon:(0,D.jsx)(_,{size:24,color:`#e03131`}),color:`#e03131`,details:null},{id:`DMD-002`,title:`Pengadaan 50,000 Bibit Bambu Betung`,location:`Jawa Barat`,demandType:`Suplai Material`,funding:`Terkonfirmasi (PO Aktif)`,status:`Mencari Petani/Koperasi`,icon:(0,D.jsx)(d,{size:24,color:`#0ca678`}),color:`#0ca678`,details:null},{id:`DMD-003`,title:`Suplai Bambu untuk Rangka Layangan ke India`,location:`Pengumpulan (WA: 08174139994)`,demandType:`Ekspor Material`,funding:`PO Aktif ($2.8 / Bundle)`,status:`Mencari Suplier`,icon:(0,D.jsx)(_,{size:24,color:`#f59f00`}),color:`#f59f00`,details:{reqs:`1 sampai 2 Kontainer 20ft / 40ft per bulan (1000 - 1100 bundle).`,price:`$ 2.8 / bundle (Harga terima di lokasi pengumpulan).`,specs:[`Ukuran 40 inci (102 cm) : 10 belahan - Tanpa simpul`,`Ukuran 34 inci (86-87 cm) : 10 belahan - Tanpa simpul`,`Ukuran 36 inci (92 cm) : 10 belahan - Tanpa simpul`,`Ketebalan: 8 - 10 mm`,`Diameter: 9 cm untuk setiap belahan`,`Toleransi tertentu dapat digunakan`,`Berbagai jenis bambu masuk asalkan sesuai ukuran`,`Kondisi: Treatment anti hama bubuk, kering (Kadar air 8-14%)`,`Packaging: Diikat tali bambu, 1 bundle = 100 bilah / 50 batang sesuai ukuran masing-masing spek`],images:[`gambar/demandmarket/bl.jpeg`,`gambar/demandmarket/bl1.jpeg`,`gambar/demandmarket/bl3.jpeg`,`gambar/demandmarket/bl4.jpeg`,`gambar/demandmarket/bl5.jpeg`,`gambar/demandmarket/bl6.jpeg`,`gambar/demandmarket/bl7.jpeg`,`gambar/demandmarket/bl8.jpeg`,`gambar/demandmarket/bl9.jpeg`]}},{id:`DMD-004`,title:`Rumah Modular Bambu 4m x 6m`,location:`Workshop (WA: 08174139994)`,demandType:`Konstruksi & Arsitektur`,funding:`Rp 70.000.000 / Unit`,status:`Mencari Vendor`,icon:(0,D.jsx)(_,{size:24,color:`#e03131`}),color:`#e03131`,details:{reqs:`Kebutuhan saat ini: 1 Unit Rumah Modular.`,price:`Rp 70.000.000 (Harga jadi di lokasi workshop/pabrik vendor).`,specs:[`Bahan: Bambu laminasi dari berbagai jenis bambu.`,`Ukuran Bangunan: 4 meter x 6 meter.`,`Desain: Mengikuti gambar acuan terlampir.`,`Fleksibilitas: Jika vendor memiliki desain alternatif yang lebih efisien, sangat diperbolehkan untuk diajukan.`],images:[],pdf:`gambar/demandmarket/rumahmodular/rmb.pdf`}},{id:`DMD-005`,title:`Komponen Huntap RISHAM T36 (6.000 Unit)`,location:`Sumatera Barat & Aceh (WA: 08174139994)`,demandType:`Manufaktur Massal`,funding:`Mega Proyek (Terkonfirmasi)`,status:`Mencari Suplier Pabrikasi`,icon:(0,D.jsx)(_,{size:24,color:`#3b82f6`}),color:`#3b82f6`,details:{reqs:`Kebutuhan Bertahap: 1 Unit Sample -> 250 Unit Rumah Contoh -> 5.750 Unit Pembangunan Massal (Total 6.000 Unit).`,price:`Dinding: Rp 270.000/m² (1 unit = 67 m²). Kusen Pintu Jendela: Rp 3.500.000/set (Harga di workshop vendor).`,specs:[`Peruntukan: Hunian Tetap (Huntap) RISHAM Type 36 untuk Korban Bencana Alam di Sumatera.`,`Komponen Dibutuhkan: Dinding, Kusen, Pintu, dan Jendela.`,`Bahan Material: Bambu laminasi dari berbagai jenis bambu.`,`Desain Acuan: Telah tersedia (File PDF terlampir).`,`Fleksibilitas: Jika vendor memiliki alternatif gambar dinding, kusen, pintu, atau jendela lain yang lebih efisien, sangat diperbolehkan untuk diajukan.`],images:[],pdf:`gambar/demandmarket/risham/risham.pdf`}}],...O.map(e=>({id:e.id,title:e.title,location:e.location,demandType:e.category,funding:e.budgetRange||`Negosiasi`,status:`Mencari Tim`,icon:(0,D.jsx)(_,{size:24,color:`#e03131`}),color:`#e03131`,details:{price:e.budgetRange||`Negosiasi`,reqs:e.description,specs:e.qualifications?e.qualifications.split(`
`):[]},projectLink:e.projectLink,documentPdf:e.documentPdf,contactName:e.contactName,contactEmail:e.contactEmail,contactWa:e.contactWa,bambooChat:e.bambooChat,submittedBy:e.submittedBy}))],X=Y.filter(e=>e.title.toLowerCase().includes(L.toLowerCase())||e.location.toLowerCase().includes(L.toLowerCase())||e.department.toLowerCase().includes(L.toLowerCase())),Z=be.filter(e=>e.title.toLowerCase().includes(L.toLowerCase())||e.location.toLowerCase().includes(L.toLowerCase())||e.demandType.toLowerCase().includes(L.toLowerCase())),Q=[`User @mukoddas baru saja menerima 500 BMC untuk Audit Kontrak`,`Posisi 'Smart Contract Dev' memiliki pendaftar baru dari 5 negara`,`Total Payout Bounty bulan ini mencapai 12,500 BMC`,`Koperasi Tani Cibarani membuka 10 slot Mitra Lapangan baru`,`Pendaftaran Magang batch Mei 2026 kini dibuka!`],$=()=>{if(!F.trim())return;let e={role:`user`,text:F};P(t=>[...t,e]),I(``),setTimeout(()=>{let e={role:`bot`,text:`Terima kasih pertanyaannya! Untuk posisi tersebut, kami mencari ahli yang memahami integrasi Blockchain dengan aset fisik (RWA). Apakah Anda memiliki portofolio terkait?`};P(t=>[...t,e])},1e3)};return(0,D.jsxs)(`div`,{className:`careers-page-wrapper`,children:[(0,D.jsx)(`div`,{className:`activity-ticker`,children:(0,D.jsx)(`div`,{style:{display:`inline-block`,animation:`ticker 30s linear infinite`},children:Q.concat(Q).map((e,t)=>(0,D.jsxs)(`span`,{style:{margin:`0 40px`,fontSize:`0.85rem`,fontWeight:`bold`,fontFamily:`monospace`},children:[(0,D.jsx)(se,{size:14,style:{display:`inline`,marginBottom:`-2px`,marginRight:`8px`}}),e]},t))})}),(0,D.jsxs)(`div`,{className:`container`,children:[(0,D.jsxs)(`div`,{className:`careers-header-section`,children:[(0,D.jsxs)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:`8px`,background:`rgba(12, 166, 120, 0.1)`,color:`var(--primary)`,padding:`8px 20px`,borderRadius:`30px`,fontSize:`0.9rem`,fontWeight:`bold`,marginBottom:`24px`},children:[(0,D.jsx)(h,{size:18}),` Karir & Peluang Terbuka`]}),(0,D.jsxs)(`h1`,{className:`careers-main-title`,children:[`Bangun Masa Depan `,(0,D.jsxs)(`span`,{style:{color:`var(--primary)`,position:`relative`,display:`inline-block`},children:[`Desentralisasi Hijau`,(0,D.jsx)(`svg`,{className:`title-underline`,viewBox:`0 0 300 20`,fill:`none`,children:(0,D.jsx)(`path`,{d:`M5 15Q150 5 295 15`,stroke:`var(--primary)`,strokeWidth:`4`,strokeLinecap:`round`})})]})]}),(0,D.jsx)(`p`,{className:`careers-main-desc`,children:`Bergabunglah dengan ekosistem yang menggabungkan ekonomi riil, restorasi ekologi, dan transparansi Web3. Kami tidak hanya mencari pekerja, kami mencari pembangun peradaban baru.`}),(0,D.jsxs)(`div`,{className:`live-stats-dashboard`,children:[(0,D.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,D.jsx)(`div`,{className:`stat-number`,children:`24`}),(0,D.jsx)(`div`,{className:`stat-label`,children:`Active Jobs`})]}),(0,D.jsx)(`div`,{className:`stat-divider`}),(0,D.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,D.jsx)(`div`,{className:`stat-number`,children:`1,250+`}),(0,D.jsx)(`div`,{className:`stat-label`,children:`Contributors`})]}),(0,D.jsx)(`div`,{className:`stat-divider`}),(0,D.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,D.jsx)(`div`,{className:`stat-number`,children:`450k`}),(0,D.jsx)(`div`,{className:`stat-label`,children:`BMC Payouts`})]})]})]}),(0,D.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(280px, 1fr))`,gap:`30px`,marginBottom:`80px`},children:[{id:`profesional`,title:`Tim Profesional`,icon:(0,D.jsx)(h,{size:32,color:`#3b82f6`}),color:`#3b82f6`,desc:`Bergabung sebagai tim inti (Full-time) di bidang rekayasa Web3, Agronomi, atau Legalitas.`,link:`#profesional`,action:`Lihat Posisi`},{id:`mitra`,title:`Mitra Lapangan`,icon:(0,D.jsx)(d,{size:32,color:`var(--primary)`}),color:`var(--primary)`,desc:`Menjadi Petani pengelola lahan atau Validator data di lapangan dengan insentif berbasis hasil.`,link:`/bambunusa/join-farmer`,action:`Daftar Mitra`},{id:`akademik`,title:`Riset & Magang`,icon:(0,D.jsx)(re,{size:32,color:`#845ef7`}),color:`#845ef7`,desc:`Jalur riset skripsi/tesis khusus mahasiswa tingkat akhir dari kampus mitra global.`,link:`#akademik`,action:`Info Program`},{id:`bounty`,title:`Web3 Bounties`,icon:(0,D.jsx)(_,{size:32,color:`#f59f00`}),color:`#f59f00`,desc:`Kerjakan misi lepas (bounty) dari mana saja dan dapatkan reward token BMC.`,link:`#bounty`,action:`Lihat Misi`}].map(t=>(0,D.jsxs)(`div`,{className:`premium-card`,style:{background:`var(--bg-card)`,padding:`40px`,borderRadius:`32px`,border:`1px solid var(--border-color)`,transition:`all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,position:`relative`},children:[(0,D.jsx)(`div`,{style:{background:`${t.color}10`,width:`70px`,height:`70px`,borderRadius:`24px`,display:`flex`,alignItems:`center`,justifyContent:`center`,marginBottom:`24px`},children:t.icon}),(0,D.jsx)(`h3`,{style:{fontSize:`1.5rem`,fontWeight:`800`,marginBottom:`16px`,color:`var(--text-main)`},children:t.title}),(0,D.jsx)(`p`,{style:{color:`var(--text-muted)`,fontSize:`0.95rem`,lineHeight:`1.6`,marginBottom:`30px`},children:t.desc}),(0,D.jsxs)(`button`,{onClick:()=>t.link.startsWith(`#`)?document.getElementById(t.link.substring(1))?.scrollIntoView({behavior:`smooth`}):e(t.link),style:{background:t.color,color:`white`,border:`none`,padding:`12px 24px`,borderRadius:`16px`,fontWeight:`bold`,fontSize:`0.9rem`,cursor:`pointer`,display:`flex`,alignItems:`center`,gap:`8px`},children:[t.action,` `,(0,D.jsx)(g,{size:16})]})]},t.id))}),(0,D.jsxs)(`div`,{id:`profesional`,className:`profesional-section`,children:[(0,D.jsxs)(`div`,{className:`section-header-flex`,children:[(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`h2`,{style:{fontSize:`2.5rem`,fontWeight:`900`,color:`var(--text-main)`,marginBottom:`12px`},children:`Open Positions`}),(0,D.jsx)(`p`,{style:{color:`var(--text-muted)`,fontSize:`1.1rem`},children:`Bergabunglah membangun fondasi ekosistem triliunan rupiah.`})]}),(0,D.jsxs)(`div`,{className:`section-header-actions`,children:[(0,D.jsxs)(`button`,{onClick:()=>B(!0),className:`upload-btn-primary`,children:[(0,D.jsx)(ne,{size:16}),` Upload Lowongan`]}),(0,D.jsxs)(`div`,{style:{background:`rgba(12, 166, 120, 0.1)`,color:`var(--primary)`,padding:`10px 20px`,borderRadius:`30px`,fontWeight:`bold`,fontSize:`0.85rem`,display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,D.jsx)(t,{size:16}),` Community Hires`]}),(0,D.jsx)(`button`,{style:{background:`var(--bg-secondary)`,color:`var(--text-main)`,border:`1px solid var(--border-color)`,padding:`10px 25px`,borderRadius:`30px`,fontWeight:`bold`,cursor:`pointer`},children:`Lihat Departemen`})]})]}),(0,D.jsxs)(`div`,{style:{position:`relative`,marginBottom:`30px`},children:[(0,D.jsx)(ae,{size:20,style:{position:`absolute`,left:`20px`,top:`18px`,color:`#adb5bd`}}),(0,D.jsx)(`input`,{type:`text`,placeholder:`Cari pekerjaan atau proyek (Contoh: Web3, Bali, Konstruksi)...`,value:L,onChange:e=>R(e.target.value),style:{width:`100%`,padding:`18px 20px 18px 50px`,borderRadius:`20px`,border:`1px solid var(--border-color)`,fontSize:`1rem`,boxSizing:`border-box`,boxShadow:`0 4px 15px rgba(0,0,0,0.02)`,background:`var(--bg-secondary)`,color:`var(--text-main)`}})]}),(0,D.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`20px`},children:X.length>0?X.map(e=>(0,D.jsxs)(`div`,{className:`job-row`,children:[(0,D.jsxs)(`div`,{className:`job-info-group`,children:[(0,D.jsx)(`div`,{className:`job-icon-container`,style:{background:`${e.color}15`},children:e.icon}),(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,marginBottom:`4px`,flexWrap:`wrap`},children:[(0,D.jsx)(`h3`,{style:{fontSize:`1.4rem`,fontWeight:`800`,color:`var(--text-main)`,margin:0},children:e.title}),(0,D.jsxs)(`span`,{style:{fontSize:`0.7rem`,color:`var(--text-muted)`,fontFamily:`monospace`},children:[`#`,e.id]})]}),(0,D.jsxs)(`div`,{style:{display:`flex`,gap:`15px`,color:`var(--text-muted)`,fontSize:`0.9rem`,flexWrap:`wrap`,marginTop:`8px`},children:[(0,D.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,D.jsx)(l,{size:16}),` `,e.location]}),(0,D.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,D.jsx)(a,{size:16}),` `,e.type]})]})]})]}),(0,D.jsxs)(`div`,{className:`job-actions-group`,children:[(0,D.jsxs)(`div`,{className:`job-salary`,children:[(0,D.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`var(--text-muted)`,fontWeight:`bold`,textTransform:`uppercase`},children:`Kompensasi`}),(0,D.jsx)(`div`,{style:{fontWeight:`900`,color:`var(--text-main)`,fontSize:`1.1rem`},children:e.salary})]}),(0,D.jsxs)(`div`,{style:{textAlign:`center`,background:`rgba(245, 159, 0, 0.05)`,padding:`10px 20px`,borderRadius:`15px`,border:`1px solid rgba(245, 159, 0, 0.1)`},children:[(0,D.jsx)(`div`,{style:{fontSize:`0.7rem`,color:`#f59f00`,fontWeight:`bold`},children:`FINDER'S FEE`}),(0,D.jsx)(`div`,{style:{fontWeight:`900`,color:`#f59f00`},children:e.findersFee})]}),(0,D.jsxs)(`div`,{style:{display:`flex`,gap:`10px`},children:[(0,D.jsx)(`button`,{onClick:()=>e.contactEmail?window.location.href=`mailto:${e.contactEmail}?subject=Lamaran: ${e.title}`:alert(`Mohon hubungi pihak yayasan terkait lamaran ini.`),style:{background:`var(--primary)`,color:`white`,border:`none`,padding:`12px 24px`,borderRadius:`16px`,fontWeight:`bold`,cursor:`pointer`},children:`Lamar`}),(0,D.jsx)(`button`,{style:{background:`var(--bg-secondary)`,color:`var(--text-main)`,border:`1px solid var(--border-color)`,width:`45px`,height:`45px`,borderRadius:`16px`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`},title:`Refer a Friend`,children:(0,D.jsx)(t,{size:20})}),(n?.id===e.submittedBy||n?.username===`admin_yayasan`)&&(0,D.jsxs)(D.Fragment,{children:[(0,D.jsx)(`button`,{onClick:()=>alert(`Fitur edit segera hadir`),style:{background:`transparent`,color:`#1c7ed6`,border:`1px solid #1c7ed6`,width:`45px`,height:`45px`,borderRadius:`16px`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`},title:`Edit`,children:(0,D.jsx)(r,{size:18})}),(0,D.jsx)(`button`,{onClick:()=>J(e.id,`career_job_posts`),style:{background:`transparent`,color:`#fa5252`,border:`1px solid #fa5252`,width:`45px`,height:`45px`,borderRadius:`16px`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`},title:`Hapus`,children:(0,D.jsx)(o,{size:18})})]})]})]})]},e.id)):(0,D.jsxs)(`div`,{style:{padding:`40px`,textAlign:`center`,color:`#888`,background:`#f8f9fa`,borderRadius:`24px`},children:[`Tidak ada lowongan pekerjaan yang cocok dengan pencarian "`,L,`"`]})})]}),(0,D.jsxs)(`div`,{id:`demand`,className:`profesional-section`,style:{background:`var(--bg-card)`,borderColor:`#e0313120`},children:[(0,D.jsxs)(`div`,{className:`section-header-flex`,children:[(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`h2`,{style:{fontSize:`2.5rem`,fontWeight:`900`,color:`var(--text-main)`,marginBottom:`12px`,display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,D.jsx)(_,{color:`#e03131`,size:36}),` Demand Market`]}),(0,D.jsx)(`p`,{style:{color:`var(--text-muted)`,fontSize:`1.1rem`},children:`Peluang proyek yang sudah memiliki konfirmasi pendanaan (PO/Funding Ready).`})]}),(0,D.jsxs)(`div`,{className:`section-header-actions`,children:[(0,D.jsxs)(`button`,{onClick:()=>V(!0),className:`upload-btn-secondary`,children:[(0,D.jsx)(u,{size:16}),` Upload Kebutuhan`]}),(0,D.jsx)(`div`,{style:{background:`rgba(224, 49, 49, 0.1)`,color:`#e03131`,padding:`10px 20px`,borderRadius:`30px`,fontWeight:`bold`,fontSize:`0.85rem`},children:`High Priority`})]})]}),(0,D.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`20px`},children:Z.length>0?Z.map(e=>(0,D.jsxs)(`div`,{className:`job-row`,style:{borderColor:`${e.color}30`},children:[(0,D.jsxs)(`div`,{className:`job-info-group`,children:[(0,D.jsx)(`div`,{className:`job-icon-container`,style:{background:`${e.color}15`},children:e.icon}),(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,marginBottom:`4px`,flexWrap:`wrap`},children:[(0,D.jsx)(`h3`,{style:{fontSize:`1.4rem`,fontWeight:`800`,color:`var(--text-main)`,margin:0},children:e.title}),(0,D.jsxs)(`span`,{style:{fontSize:`0.7rem`,color:`var(--text-muted)`,fontFamily:`monospace`},children:[`#`,e.id]})]}),(0,D.jsxs)(`div`,{style:{display:`flex`,gap:`15px`,color:`var(--text-muted)`,fontSize:`0.9rem`,flexWrap:`wrap`,marginTop:`8px`},children:[(0,D.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,D.jsx)(l,{size:16}),` `,e.location]}),(0,D.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,color:`#0ca678`,fontWeight:`bold`},children:[(0,D.jsx)(v,{size:16}),` `,e.funding]})]})]})]}),(0,D.jsxs)(`div`,{className:`job-actions-group`,children:[(0,D.jsxs)(`div`,{className:`job-salary`,children:[(0,D.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`var(--text-muted)`,fontWeight:`bold`,textTransform:`uppercase`},children:`Kategori`}),(0,D.jsx)(`div`,{style:{fontWeight:`900`,color:`var(--text-main)`,fontSize:`1.1rem`},children:e.demandType})]}),(0,D.jsxs)(`div`,{style:{textAlign:`center`,background:`rgba(224, 49, 49, 0.05)`,padding:`10px 20px`,borderRadius:`15px`,border:`1px solid rgba(224, 49, 49, 0.1)`},children:[(0,D.jsx)(`div`,{style:{fontSize:`0.7rem`,color:`#ff6b6b`,fontWeight:`bold`},children:`STATUS`}),(0,D.jsx)(`div`,{style:{fontWeight:`900`,color:`#ff6b6b`},children:e.status})]}),(0,D.jsxs)(`div`,{style:{display:`flex`,gap:`10px`},children:[(0,D.jsx)(`button`,{onClick:()=>j(e),style:{background:e.color,color:`white`,border:`none`,padding:`12px 24px`,borderRadius:`16px`,fontWeight:`bold`,cursor:`pointer`},children:e.details||e.projectLink||e.documentPdf||e.description?`Detail Proyek`:`Apply Proyek`}),(n?.id===e.submittedBy||n?.username===`admin_yayasan`)&&(0,D.jsxs)(D.Fragment,{children:[(0,D.jsx)(`button`,{onClick:()=>alert(`Fitur edit segera hadir`),style:{background:`transparent`,color:`#1c7ed6`,border:`1px solid #1c7ed6`,padding:`12px`,borderRadius:`16px`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`},title:`Edit`,children:(0,D.jsx)(r,{size:18})}),(0,D.jsx)(`button`,{onClick:()=>J(e.id,`career_demand_posts`),style:{background:`transparent`,color:`#fa5252`,border:`1px solid #fa5252`,padding:`12px`,borderRadius:`16px`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`},title:`Hapus`,children:(0,D.jsx)(o,{size:18})})]})]})]})]},e.id)):(0,D.jsxs)(`div`,{style:{padding:`40px`,textAlign:`center`,color:`#888`,background:`#f8f9fa`,borderRadius:`24px`},children:[`Tidak ada permintaan pasar yang cocok dengan "`,L,`"`]})})]}),(0,D.jsxs)(`div`,{id:`bounty`,className:`bounty-section`,children:[(0,D.jsx)(`div`,{style:{position:`absolute`,top:`-100px`,left:`-100px`,width:`400px`,height:`400px`,background:`radial-gradient(circle, var(--primary) 0%, transparent 70%)`,opacity:.1}}),(0,D.jsxs)(`div`,{style:{position:`relative`,zIndex:1},children:[(0,D.jsxs)(`div`,{className:`section-header-flex`,style:{marginBottom:`50px`},children:[(0,D.jsxs)(`div`,{children:[(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`,marginBottom:`16px`},children:[(0,D.jsx)(`div`,{style:{background:`rgba(255,255,255,0.1)`,padding:`12px`,borderRadius:`16px`},children:(0,D.jsx)(_,{size:28})}),(0,D.jsx)(`h2`,{style:{fontSize:`clamp(2rem, 5vw, 3rem)`,fontWeight:`900`,margin:0,letterSpacing:`-1px`},children:`Bounty Board`})]}),(0,D.jsx)(`p`,{style:{fontSize:`1.15rem`,color:`#aaa`,maxWidth:`600px`,lineHeight:`1.6`},children:`Ekosistem Permissionless. Kerjakan misi, serahkan Proof of Work, dan klaim BMC Anda.`})]}),(0,D.jsx)(`div`,{style:{background:`rgba(255,255,255,0.05)`,padding:`6px`,borderRadius:`20px`,display:`flex`,gap:`4px`,flexWrap:`wrap`},children:[`New`,`Top`,`Value`].map(e=>(0,D.jsx)(`button`,{onClick:()=>fe(e),style:{padding:`10px 24px`,borderRadius:`16px`,border:`none`,background:k===e?`white`:`transparent`,color:k===e?`#1a1a1a`:`#aaa`,fontWeight:`bold`,cursor:`pointer`,transition:`0.2s`,flex:1,minWidth:`80px`},children:e},e))})]}),(0,D.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(320px, 1fr))`,gap:`24px`},children:ye.map(e=>(0,D.jsxs)(`div`,{className:`bounty-card`,style:{background:`rgba(255,255,255,0.03)`,border:`1px solid rgba(255,255,255,0.08)`,padding:`32px`,borderRadius:`28px`,backdropFilter:`blur(20px)`,transition:`all 0.3s`},children:[(0,D.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,marginBottom:`20px`},children:[(0,D.jsx)(`span`,{style:{color:`#0ca678`,fontFamily:`monospace`,fontSize:`0.8rem`,fontWeight:`bold`},children:e.id}),(0,D.jsx)(`span`,{style:{color:e.difficulty===`Hard`?`#ff6b6b`:e.difficulty===`Medium`?`#fcc419`:`#51cf66`,fontSize:`0.75rem`,fontWeight:`bold`,textTransform:`uppercase`},children:e.difficulty})]}),(0,D.jsx)(`h3`,{style:{fontSize:`1.3rem`,fontWeight:`800`,marginBottom:`24px`,lineHeight:`1.4`},children:e.title}),(0,D.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,borderTop:`1px solid rgba(255,255,255,0.05)`,paddingTop:`24px`},children:[(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#666`,fontWeight:`bold`},children:`REWARD`}),(0,D.jsx)(`div`,{style:{fontSize:`1.6rem`,fontWeight:`900`,color:`#ffd43b`,fontFamily:`monospace`},children:e.reward})]}),(0,D.jsx)(`button`,{style:{background:`white`,color:`#1a1a1a`,border:`none`,padding:`12px 24px`,borderRadius:`16px`,fontWeight:`900`,fontSize:`0.9rem`,cursor:`pointer`},children:`Claim Mission`})]})]},e.id))})]})]}),A&&(0,D.jsx)(`div`,{style:{position:`fixed`,top:0,left:0,width:`100%`,height:`100%`,background:`rgba(0,0,0,0.85)`,zIndex:6e4,display:`flex`,alignItems:`center`,justifyContent:`center`,padding:`20px`,backdropFilter:`blur(5px)`},children:(0,D.jsxs)(`div`,{className:`glass animate-scale-in`,style:{width:`100%`,maxWidth:`900px`,maxHeight:`90vh`,background:`white`,borderRadius:`30px`,overflow:`hidden`,position:`relative`,display:`flex`,flexDirection:window.innerWidth<768?`column`:`row`},children:[(0,D.jsx)(`button`,{onClick:()=>j(null),style:{position:`absolute`,top:`20px`,right:`20px`,background:`#eee`,border:`none`,borderRadius:`50%`,padding:`8px`,cursor:`pointer`,zIndex:10},children:(0,D.jsx)(o,{size:24})}),(0,D.jsxs)(`div`,{style:{flex:1,height:window.innerWidth<768?`300px`:`auto`,background:`#f1f3f5`,overflowY:`auto`,padding:`20px`,display:`flex`,flexDirection:`column`,gap:`20px`},children:[A.details?.images&&A.details.images.length>0&&(0,D.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(150px, 1fr))`,gap:`10px`},children:A.details.images.map((e,t)=>(0,D.jsx)(`a`,{href:e,target:`_blank`,rel:`noopener noreferrer`,children:(0,D.jsx)(`img`,{src:e,alt:`Detail ${t}`,style:{width:`100%`,height:`150px`,objectFit:`cover`,borderRadius:`12px`,cursor:`zoom-in`,boxShadow:`0 4px 12px rgba(0,0,0,0.1)`}})},t))}),(A.documentPdf||A.details?.pdf)&&(0,D.jsxs)(`div`,{style:{background:`white`,padding:`20px`,borderRadius:`16px`,textAlign:`center`,border:`1px dashed #ccc`},children:[(0,D.jsx)(`div`,{style:{fontSize:`3rem`,marginBottom:`10px`},children:`📄`}),(0,D.jsx)(`div`,{style:{fontWeight:`bold`,marginBottom:`5px`},children:`Dokumen Desain Acuan Tersedia`}),(0,D.jsx)(`a`,{href:A.documentPdf||A.details?.pdf,target:`_blank`,rel:`noopener noreferrer`,style:{display:`inline-block`,background:A.color,color:`white`,textDecoration:`none`,padding:`10px 20px`,borderRadius:`12px`,fontWeight:`bold`,fontSize:`0.9rem`},children:`Buka Dokumen PDF`})]}),A.projectLink&&(0,D.jsxs)(`div`,{style:{background:`white`,padding:`20px`,borderRadius:`16px`},children:[(0,D.jsx)(`div`,{style:{fontWeight:`bold`,marginBottom:`5px`},children:`Link Proyek`}),(0,D.jsx)(`a`,{href:A.projectLink,target:`_blank`,rel:`noopener noreferrer`,style:{wordBreak:`break-all`,color:`var(--primary)`},children:A.projectLink})]})]}),(0,D.jsxs)(`div`,{style:{flex:1.2,padding:`40px`,overflowY:`auto`},children:[(0,D.jsx)(`div`,{style:{fontSize:`0.85rem`,color:A.color,fontWeight:`bold`,marginBottom:`8px`},children:A.demandType}),(0,D.jsx)(`h2`,{style:{fontSize:`1.8rem`,margin:`0 0 16px 0`,lineHeight:1.3},children:A.title}),(0,D.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`15px`,marginBottom:`24px`},children:[(0,D.jsxs)(`div`,{style:{background:`#f8f9fa`,padding:`15px`,borderRadius:`15px`},children:[(0,D.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#888`,fontWeight:`bold`},children:`LOKASI`}),(0,D.jsx)(`div`,{style:{fontWeight:`bold`,color:`#1a1a1a`},children:A.location})]}),(0,D.jsxs)(`div`,{style:{background:`rgba(245, 159, 0, 0.05)`,padding:`15px`,borderRadius:`15px`},children:[(0,D.jsx)(`div`,{style:{fontSize:`0.75rem`,color:A.color,fontWeight:`bold`},children:`HARGA PENERIMAAN`}),(0,D.jsx)(`div`,{style:{fontWeight:`bold`,color:A.color},children:A.details?.price||A.funding})]})]}),(0,D.jsxs)(`div`,{style:{marginBottom:`24px`},children:[(0,D.jsx)(`h4`,{style:{marginBottom:`8px`},children:`Kebutuhan Bulanan`}),(0,D.jsx)(`p`,{style:{color:`#666`,background:`#f1f3f5`,padding:`12px`,borderRadius:`10px`,fontSize:`0.95rem`},children:A.details?.reqs||A.description})]}),A.details?.specs?.length>0&&(0,D.jsxs)(`div`,{style:{marginBottom:`30px`},children:[(0,D.jsx)(`h4`,{style:{marginBottom:`12px`},children:`Spesifikasi Teknis`}),(0,D.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:A.details.specs.map((e,t)=>(0,D.jsxs)(`div`,{style:{fontSize:`0.85rem`,background:`white`,border:`1px solid #eee`,padding:`10px 12px`,borderRadius:`8px`,display:`flex`,gap:`10px`},children:[(0,D.jsx)(`span`,{style:{color:A.color},children:`•`}),` `,e]},t))})]}),(0,D.jsx)(`button`,{onClick:()=>{alert(`Mengarahkan ke Chat WA...`),window.open(`https://wa.me/${A.contactWa||`628174139994`}`,`_blank`)},style:{width:`100%`,padding:`16px`,borderRadius:`15px`,background:A.color,color:`white`,border:`none`,fontWeight:`bold`,fontSize:`1rem`,cursor:`pointer`,display:`flex`,justifyContent:`center`,alignItems:`center`,gap:`10px`},children:`Hubungi Pihak Pengumpul`})]})]})}),z&&(0,D.jsx)(`div`,{className:`upload-modal-overlay`,onClick:e=>e.target===e.currentTarget&&B(!1),children:(0,D.jsxs)(`div`,{className:`upload-modal animate-scale-in`,children:[(0,D.jsx)(`button`,{onClick:()=>B(!1),className:`upload-modal-close`,children:(0,D.jsx)(o,{size:22})}),he?(0,D.jsxs)(`div`,{className:`upload-success-state`,children:[(0,D.jsx)(`div`,{className:`upload-success-icon`,children:`✅`}),(0,D.jsx)(`h2`,{children:`Lowongan Berhasil Dikirim!`}),(0,D.jsx)(`p`,{children:`Tim kami akan mereview dan mempublikasikan lowongan Anda dalam 1x24 jam.`})]}):(0,D.jsxs)(D.Fragment,{children:[(0,D.jsxs)(`div`,{className:`upload-modal-header`,children:[(0,D.jsx)(`div`,{className:`upload-modal-icon`,style:{background:`rgba(12, 166, 120, 0.1)`},children:(0,D.jsx)(h,{size:28,color:`var(--primary)`})}),(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`h2`,{className:`upload-modal-title`,children:`Upload Lowongan Kerja`}),(0,D.jsx)(`p`,{className:`upload-modal-subtitle`,children:`Pasang lowongan kerja Anda di ekosistem BambooChain`})]})]}),(0,D.jsxs)(`form`,{onSubmit:_e,className:`upload-form`,children:[(0,D.jsxs)(`div`,{className:`upload-form-grid`,children:[(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(p,{size:14}),` Judul Posisi *`]}),(0,D.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Senior Smart Contract Developer`,value:H.title,onChange:e=>U({...H,title:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(oe,{size:14}),` Departemen *`]}),(0,D.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Web3 Engineering`,value:H.department,onChange:e=>U({...H,department:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(l,{size:14}),` Lokasi *`]}),(0,D.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Remote / Jakarta`,value:H.location,onChange:e=>U({...H,location:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(a,{size:14}),` Tipe Pekerjaan`]}),(0,D.jsxs)(`select`,{value:H.type,onChange:e=>U({...H,type:e.target.value}),children:[(0,D.jsx)(`option`,{children:`Full-time`}),(0,D.jsx)(`option`,{children:`Part-time`}),(0,D.jsx)(`option`,{children:`Contract`}),(0,D.jsx)(`option`,{children:`Freelance`}),(0,D.jsx)(`option`,{children:`Magang`})]})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(v,{size:14}),` Range Gaji (IDR)`]}),(0,D.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,D.jsx)(`input`,{type:`text`,placeholder:`Min (cth: 15M)`,value:H.salaryMin,onChange:e=>U({...H,salaryMin:e.target.value})}),(0,D.jsx)(`input`,{type:`text`,placeholder:`Max (cth: 30M)`,value:H.salaryMax,onChange:e=>U({...H,salaryMax:e.target.value})})]})]}),(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsx)(`label`,{children:`Deskripsi Pekerjaan *`}),(0,D.jsx)(`textarea`,{required:!0,rows:4,placeholder:`Jelaskan tanggung jawab dan lingkup kerja...`,value:H.description,onChange:e=>U({...H,description:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsx)(`label`,{children:`Persyaratan & Kualifikasi`}),(0,D.jsx)(`textarea`,{rows:3,placeholder:`Satu persyaratan per baris...`,value:H.requirements,onChange:e=>U({...H,requirements:e.target.value})})]}),(0,D.jsx)(`div`,{className:`upload-form-divider`}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(c,{size:14}),` Nama Kontak *`]}),(0,D.jsx)(`input`,{type:`text`,required:!0,placeholder:`Nama penanggung jawab`,value:H.contactName,onChange:e=>U({...H,contactName:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(m,{size:14}),` Email Kontak *`]}),(0,D.jsx)(`input`,{type:`email`,required:!0,placeholder:`email@company.com`,value:H.contactEmail,onChange:e=>U({...H,contactEmail:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsx)(`label`,{children:`WhatsApp (opsional)`}),(0,D.jsx)(`input`,{type:`text`,placeholder:`08xxxxxxxxxx`,value:H.contactWa,onChange:e=>U({...H,contactWa:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(s,{size:14}),` Nickname BambooChat (opsional)`]}),(0,D.jsx)(`input`,{type:`text`,placeholder:`Nickname Anda di BambooChat`,value:H.bambooChat,onChange:e=>U({...H,bambooChat:e.target.value})})]})]}),(0,D.jsxs)(`button`,{type:`submit`,className:`upload-submit-btn`,style:{background:`var(--primary)`},children:[(0,D.jsx)(u,{size:18}),` Kirim Lowongan`]})]})]})]})}),me&&(0,D.jsx)(`div`,{className:`upload-modal-overlay`,onClick:e=>e.target===e.currentTarget&&V(!1),children:(0,D.jsxs)(`div`,{className:`upload-modal animate-scale-in`,children:[(0,D.jsx)(`button`,{onClick:()=>V(!1),className:`upload-modal-close`,children:(0,D.jsx)(o,{size:22})}),ge?(0,D.jsxs)(`div`,{className:`upload-success-state`,children:[(0,D.jsx)(`div`,{className:`upload-success-icon`,children:`✅`}),(0,D.jsx)(`h2`,{children:`Kebutuhan Berhasil Dikirim!`}),(0,D.jsx)(`p`,{children:`Tim kami akan mereview dan menampilkan permintaan Anda di Demand Market.`})]}):(0,D.jsxs)(D.Fragment,{children:[(0,D.jsxs)(`div`,{className:`upload-modal-header`,children:[(0,D.jsx)(`div`,{className:`upload-modal-icon`,style:{background:`rgba(224, 49, 49, 0.1)`},children:(0,D.jsx)(r,{size:28,color:`#e03131`})}),(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`h2`,{className:`upload-modal-title`,children:`Upload Kebutuhan Tenaga Kerja & Ahli`}),(0,D.jsx)(`p`,{className:`upload-modal-subtitle`,children:`Publikasikan kebutuhan tenaga kerja atau tenaga ahli proyek Anda`})]})]}),(0,D.jsxs)(`form`,{onSubmit:ve,className:`upload-form`,children:[(0,D.jsxs)(`div`,{className:`upload-form-grid`,children:[(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(p,{size:14}),` Judul Kebutuhan *`]}),(0,D.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Tukang Kayu Spesialis Bambu Laminasi`,value:W.title,onChange:e=>G({...W,title:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(_,{size:14}),` Kategori *`]}),(0,D.jsxs)(`select`,{value:W.category,onChange:e=>G({...W,category:e.target.value}),children:[(0,D.jsx)(`option`,{children:`Tenaga Kerja`}),(0,D.jsx)(`option`,{children:`Tenaga Ahli`}),(0,D.jsx)(`option`,{children:`Konsultan`}),(0,D.jsx)(`option`,{children:`Kontraktor`}),(0,D.jsx)(`option`,{children:`Tim Proyek`})]})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(ie,{size:14}),` Bidang Keahlian *`]}),(0,D.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Arsitektur Bambu, Agronomi`,value:W.expertise,onChange:e=>G({...W,expertise:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(l,{size:14}),` Lokasi Penempatan *`]}),(0,D.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Ubud, Bali`,value:W.location,onChange:e=>G({...W,location:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(t,{size:14}),` Jumlah Dibutuhkan`]}),(0,D.jsx)(`input`,{type:`text`,placeholder:`Contoh: 5 orang`,value:W.quantity,onChange:e=>G({...W,quantity:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(a,{size:14}),` Durasi Proyek`]}),(0,D.jsx)(`input`,{type:`text`,placeholder:`Contoh: 6 bulan`,value:W.duration,onChange:e=>G({...W,duration:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(v,{size:14}),` Range Budget`]}),(0,D.jsx)(`input`,{type:`text`,placeholder:`Contoh: Rp 50M - 100M`,value:W.budgetRange,onChange:e=>G({...W,budgetRange:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsx)(`label`,{children:`Deskripsi Kebutuhan *`}),(0,D.jsx)(`textarea`,{required:!0,rows:4,placeholder:`Jelaskan detail proyek, lingkup kerja, dan ekspektasi...`,value:W.description,onChange:e=>G({...W,description:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsx)(`label`,{children:`Kualifikasi yang Dibutuhkan`}),(0,D.jsx)(`textarea`,{rows:3,placeholder:`Pengalaman, sertifikasi, kompetensi yang dibutuhkan...`,value:W.qualifications,onChange:e=>G({...W,qualifications:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsx)(`label`,{children:`Link Proyek / Referensi (opsional)`}),(0,D.jsx)(`input`,{type:`text`,placeholder:`https://...`,value:W.projectLink,onChange:e=>G({...W,projectLink:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsx)(`label`,{children:`Link File / Dokumen PDF (opsional)`}),(0,D.jsx)(`input`,{type:`text`,placeholder:`https://...`,value:W.documentPdf,onChange:e=>G({...W,documentPdf:e.target.value})})]}),(0,D.jsx)(`div`,{className:`upload-form-divider`}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(c,{size:14}),` Nama Kontak *`]}),(0,D.jsx)(`input`,{type:`text`,required:!0,placeholder:`Nama penanggung jawab`,value:W.contactName,onChange:e=>G({...W,contactName:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(m,{size:14}),` Email Kontak *`]}),(0,D.jsx)(`input`,{type:`email`,required:!0,placeholder:`email@company.com`,value:W.contactEmail,onChange:e=>G({...W,contactEmail:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsx)(`label`,{children:`WhatsApp (opsional)`}),(0,D.jsx)(`input`,{type:`text`,placeholder:`08xxxxxxxxxx`,value:W.contactWa,onChange:e=>G({...W,contactWa:e.target.value})})]}),(0,D.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,D.jsxs)(`label`,{children:[(0,D.jsx)(s,{size:14}),` Nickname BambooChat (opsional)`]}),(0,D.jsx)(`input`,{type:`text`,placeholder:`Nickname Anda di BambooChat`,value:W.bambooChat,onChange:e=>G({...W,bambooChat:e.target.value})})]})]}),(0,D.jsxs)(`button`,{type:`submit`,className:`upload-submit-btn`,style:{background:`#e03131`},children:[(0,D.jsx)(u,{size:18}),` Kirim Kebutuhan`]})]})]})]})})]}),(0,D.jsx)(`div`,{style:{position:`fixed`,bottom:`110px`,left:`30px`,zIndex:11e3},children:pe?(0,D.jsxs)(`div`,{style:{width:`380px`,height:`500px`,background:`white`,borderRadius:`32px`,boxShadow:`0 30px 60px rgba(0,0,0,0.15)`,display:`flex`,flexDirection:`column`,overflow:`hidden`,animation:`slideUpChat 0.4s cubic-bezier(0.16, 1, 0.3, 1)`},children:[(0,D.jsxs)(`div`,{style:{background:`var(--primary)`,color:`white`,padding:`24px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,D.jsx)(`div`,{style:{width:`40px`,height:`40px`,borderRadius:`50%`,background:`rgba(255,255,255,0.2)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`1.2rem`},children:`🎋`}),(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`div`,{style:{fontWeight:`bold`},children:`BambuAI Assistant`}),(0,D.jsx)(`div`,{style:{fontSize:`0.7rem`,opacity:.8},children:`Online • Karir & Peluang`})]})]}),(0,D.jsx)(`button`,{onClick:()=>M(!1),style:{background:`transparent`,border:`none`,color:`white`,cursor:`pointer`},children:(0,D.jsx)(o,{size:20})})]}),(0,D.jsx)(`div`,{style:{flex:1,padding:`20px`,overflowY:`auto`,display:`flex`,flexDirection:`column`,gap:`15px`},children:N.map((e,t)=>(0,D.jsx)(`div`,{style:{alignSelf:e.role===`bot`?`flex-start`:`flex-end`,background:e.role===`bot`?`#f1f3f5`:`var(--primary)`,color:e.role===`bot`?`#1a1a1a`:`white`,padding:`12px 16px`,borderRadius:`18px`,borderBottomLeftRadius:e.role===`bot`?`4px`:`18px`,borderBottomRightRadius:e.role===`user`?`4px`:`18px`,maxWidth:`85%`,fontSize:`0.9rem`,lineHeight:`1.5`},children:e.text},t))}),(0,D.jsxs)(`div`,{style:{padding:`20px`,borderTop:`1px solid #f1f3f5`,display:`flex`,gap:`10px`},children:[(0,D.jsx)(`input`,{type:`text`,value:F,onChange:e=>I(e.target.value),onKeyDown:e=>e.key===`Enter`&&$(),placeholder:`Tanya tentang karir...`,style:{flex:1,padding:`12px 18px`,borderRadius:`15px`,border:`1px solid #eee`,background:`#f8f9fa`,outline:`none`}}),(0,D.jsx)(`button`,{onClick:$,style:{background:`var(--primary)`,color:`white`,border:`none`,width:`46px`,height:`46px`,borderRadius:`15px`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`},children:(0,D.jsx)(m,{size:18})})]})]}):(0,D.jsxs)(`button`,{onClick:()=>M(!0),style:{width:`70px`,height:`70px`,borderRadius:`50%`,background:`var(--primary)`,color:`white`,border:`none`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`,boxShadow:`0 10px 30px rgba(12,166,120,0.4)`,transition:`all 0.3s`},onMouseEnter:e=>e.currentTarget.style.transform=`scale(1.1)`,onMouseLeave:e=>e.currentTarget.style.transform=`scale(1)`,children:[(0,D.jsx)(i,{size:30}),(0,D.jsx)(`div`,{style:{position:`absolute`,top:`-5px`,right:`-5px`,background:`#ff6b6b`,color:`white`,width:`24px`,height:`24px`,borderRadius:`50%`,fontSize:`0.7rem`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:`bold`,border:`3px solid #fdfdfd`},children:`1`})]})}),(0,D.jsx)(`style`,{children:`
        .careers-page-wrapper {
          padding-top: 150px;
          padding-bottom: 100px;
          min-height: 100vh;
          background: var(--bg-color);
          color: var(--text-main);
        }
        .activity-ticker {
          background: #1a1a1a;
          color: #0ca678;
          padding: 12px 0;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          border-bottom: 1px solid #333;
          margin-bottom: 40px;
        }
        .careers-header-section {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInUp 0.8s ease-out;
        }
        .careers-main-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900;
          color: var(--text-main);
          margin-bottom: 20px;
          line-height: 1.1;
          letter-spacing: -1px;
        }
        .title-underline {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
        }
        .careers-main-desc {
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: #666;
          max-width: 800px;
          margin: 30px auto;
          line-height: 1.6;
          padding: 0 15px;
        }
        .live-stats-dashboard {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        .stat-number {
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: 900;
          color: var(--primary);
        }
        .stat-label {
          font-size: 0.85rem;
          font-weight: bold;
          color: #999;
          text-transform: uppercase;
        }
        .stat-divider {
          width: 1px;
          background: #eee;
        }
        
        /* Sections */
        .profesional-section {
          background: var(--bg-card);
          border-radius: 40px;
          padding: 60px;
          border: 1px solid var(--border-color);
          margin-bottom: 80px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.02);
        }
        .bounty-section {
          background: #1a1a1a;
          border-radius: 40px;
          padding: 60px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 50px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .section-header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        /* Job Rows */
        .job-row {
          padding: 30px;
          border: 1px solid var(--border-color);
          border-radius: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-secondary);
          transition: all 0.3s;
          flex-wrap: wrap;
          gap: 20px;
        }
        .job-info-group {
          display: flex;
          gap: 25px;
          align-items: center;
          flex-wrap: wrap;
        }
        .job-icon-container {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .job-actions-group {
          display: flex;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
          width: 100%;
          justify-content: flex-start;
        }

        @media (min-width: 768px) {
          .job-actions-group {
            width: auto;
            justify-content: flex-end;
          }
        }

        @media (max-width: 768px) {
          .careers-page-wrapper {
             padding-top: 90px; /* Reduced for mobile navbar */
          }
          .activity-ticker {
             margin-bottom: 20px;
          }
          .live-stats-dashboard {
             gap: 20px;
          }
          .stat-divider {
             display: none;
          }
          .profesional-section, .bounty-section {
             padding: 30px 20px;
             border-radius: 24px;
          }
          .job-row {
             padding: 20px;
             flex-direction: column;
             align-items: flex-start;
          }
          .job-info-group {
             gap: 15px;
          }
          .job-actions-group {
             gap: 15px;
             margin-top: 10px;
             padding-top: 20px;
             border-top: 1px dashed #eee;
          }
          .job-salary {
             text-align: left !important;
          }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideUpChat {
          from { opacity: 0; transform: translateY(100px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .premium-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(12,166,120,0.1);
          border-color: var(--primary);
        }
        .job-row:hover {
          background: white !important;
          border-color: #333 !important;
          transform: scale(1.01);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
         .bounty-card:hover {
           background: rgba(255,255,255,0.06) !important;
           border-color: var(--primary) !important;
           transform: translateY(-5px);
         }

         /* Upload Buttons */
         .upload-btn-primary {
           background: linear-gradient(135deg, var(--primary), #0ca678);
           color: white;
           border: none;
           padding: 12px 24px;
           border-radius: 30px;
           font-weight: bold;
           font-size: 0.85rem;
           cursor: pointer;
           display: flex;
           align-items: center;
           gap: 8px;
           transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
           box-shadow: 0 4px 15px rgba(12, 166, 120, 0.3);
         }
         .upload-btn-primary:hover {
           transform: translateY(-2px) scale(1.05);
           box-shadow: 0 8px 25px rgba(12, 166, 120, 0.4);
         }
         .upload-btn-secondary {
           background: linear-gradient(135deg, #e03131, #c92a2a);
           color: white;
           border: none;
           padding: 12px 24px;
           border-radius: 30px;
           font-weight: bold;
           font-size: 0.85rem;
           cursor: pointer;
           display: flex;
           align-items: center;
           gap: 8px;
           transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
           box-shadow: 0 4px 15px rgba(224, 49, 49, 0.3);
         }
         .upload-btn-secondary:hover {
           transform: translateY(-2px) scale(1.05);
           box-shadow: 0 8px 25px rgba(224, 49, 49, 0.4);
         }

         /* Upload Modal */
         .upload-modal-overlay {
           position: fixed;
           top: 0; left: 0; width: 100%; height: 100%;
           background: rgba(0,0,0,0.7);
           backdrop-filter: blur(8px);
           z-index: 70000;
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 20px;
         }
         .upload-modal {
           width: 100%;
           max-width: 720px;
           max-height: 90vh;
           background: white;
           border-radius: 32px;
           overflow-y: auto;
           position: relative;
           padding: 48px;
           box-shadow: 0 40px 80px rgba(0,0,0,0.25);
         }
         .upload-modal-close {
           position: absolute;
           top: 20px; right: 20px;
           background: #f1f3f5;
           border: none;
           border-radius: 50%;
           width: 44px; height: 44px;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: all 0.2s;
           color: #495057;
         }
         .upload-modal-close:hover {
           background: #e9ecef;
           transform: rotate(90deg);
         }
         .upload-modal-header {
           display: flex;
           align-items: center;
           gap: 20px;
           margin-bottom: 36px;
           padding-bottom: 24px;
           border-bottom: 1px solid #f1f3f5;
         }
         .upload-modal-icon {
           width: 64px; height: 64px;
           border-radius: 20px;
           display: flex;
           align-items: center;
           justify-content: center;
           flex-shrink: 0;
         }
         .upload-modal-title {
           font-size: 1.6rem;
           font-weight: 900;
           color: #1a1a1a;
           margin: 0 0 4px 0;
           line-height: 1.2;
         }
         .upload-modal-subtitle {
           color: #888;
           font-size: 0.95rem;
           margin: 0;
         }

         /* Upload Form */
         .upload-form-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 20px;
           margin-bottom: 32px;
         }
         .upload-form-full {
           grid-column: 1 / -1;
         }
         .upload-form-group label {
           display: flex;
           align-items: center;
           gap: 6px;
           font-size: 0.85rem;
           font-weight: 700;
           color: #495057;
           margin-bottom: 8px;
         }
         .upload-form-group input,
         .upload-form-group textarea,
         .upload-form-group select {
           width: 100%;
           padding: 14px 16px;
           border-radius: 14px;
           border: 1.5px solid #dee2e6;
           font-size: 0.95rem;
           background: #f8f9fa;
           transition: all 0.2s;
           outline: none;
           box-sizing: border-box;
           font-family: inherit;
           color: #1a1a1a;
         }
         .upload-form-group input:focus,
         .upload-form-group textarea:focus,
         .upload-form-group select:focus {
           border-color: var(--primary);
           background: white;
           box-shadow: 0 0 0 4px rgba(12, 166, 120, 0.1);
         }
         .upload-form-group textarea {
           resize: vertical;
           min-height: 80px;
         }
         .upload-form-divider {
           grid-column: 1 / -1;
           height: 1px;
           background: linear-gradient(to right, transparent, #dee2e6, transparent);
           margin: 4px 0;
         }
         .upload-submit-btn {
           width: 100%;
           padding: 18px;
           border-radius: 20px;
           border: none;
           color: white;
           font-weight: 900;
           font-size: 1.05rem;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 10px;
           transition: all 0.3s;
           box-shadow: 0 8px 25px rgba(0,0,0,0.15);
         }
         .upload-submit-btn:hover {
           transform: translateY(-2px);
           box-shadow: 0 12px 35px rgba(0,0,0,0.2);
         }

         /* Upload Success State */
         .upload-success-state {
           text-align: center;
           padding: 60px 20px;
         }
         .upload-success-icon {
           font-size: 4rem;
           margin-bottom: 20px;
           animation: bounceIn 0.6s ease;
         }
         .upload-success-state h2 {
           font-size: 1.8rem;
           font-weight: 900;
           color: #1a1a1a;
           margin-bottom: 12px;
         }
         .upload-success-state p {
           color: #888;
           font-size: 1.05rem;
           max-width: 400px;
           margin: 0 auto;
           line-height: 1.6;
         }

         @keyframes bounceIn {
           0% { transform: scale(0); opacity: 0; }
           50% { transform: scale(1.2); }
           100% { transform: scale(1); opacity: 1; }
         }
         @keyframes animate-scale-in {
           from { opacity: 0; transform: scale(0.9) translateY(20px); }
           to { opacity: 1; transform: scale(1) translateY(0); }
         }
         .animate-scale-in {
           animation: animate-scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
         }

         @media (max-width: 768px) {
           .upload-modal {
             padding: 30px 20px;
             border-radius: 24px;
             max-height: 95vh;
           }
           .upload-form-grid {
             grid-template-columns: 1fr;
           }
           .upload-modal-header {
             flex-direction: column;
             align-items: flex-start;
             gap: 12px;
           }
           .upload-modal-title {
             font-size: 1.3rem;
           }
           .upload-btn-primary,
           .upload-btn-secondary {
             padding: 10px 16px;
             font-size: 0.8rem;
           }
         }
       `})]})};export{O as default};