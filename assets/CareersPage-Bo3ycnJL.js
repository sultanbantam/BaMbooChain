import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{B as t,Cr as n,F as r,Kr as ee,Lt as te,N as i,Nn as a,P as o,Rt as s,St as c,U as l,Vt as u,W as d,Xt as f,Zr as p,cn as m,fr as h,gt as g,hn as _,ht as v,ir as y,mr as ne,rr as re,tt as b,vr as ie,wn as x}from"./vendor-core-txHh52xq.js";import{C as S,D as C,u as w}from"./vendor-firebase-BWtpIomP.js";import{n as T}from"./config-9PloHodL.js";import{n as E}from"./AuthContext-DUwWFFzD.js";import"./BackButton-0Ew3KaPy.js";var D=e(p(),1),O=n(),k=()=>{let e=ee(),{user:n}=E(),[p,k]=(0,D.useState)(!1),[A,ae]=(0,D.useState)(`New`),[j,M]=(0,D.useState)(null),[oe,N]=(0,D.useState)(!1),[se,P]=(0,D.useState)([{role:`bot`,text:`Halo! Saya BambuAI. Ada yang bisa saya bantu terkait karir di ekosistem Sabumi?`}]),[F,I]=(0,D.useState)(``),[L,R]=(0,D.useState)(``),[z,B]=(0,D.useState)(!1),[V,H]=(0,D.useState)(!1),[U,W]=(0,D.useState)({title:``,department:``,location:``,type:`Full-time`,salaryMin:``,salaryMax:``,description:``,requirements:``,contactName:``,contactEmail:``,contactWa:``,bambooChat:``}),[G,K]=(0,D.useState)({title:``,category:`Tenaga Kerja`,expertise:``,location:``,quantity:``,duration:``,budgetRange:``,description:``,qualifications:``,contactName:``,contactEmail:``,contactWa:``,bambooChat:``}),[ce,q]=(0,D.useState)(!1),[le,J]=(0,D.useState)(!1),ue=async e=>{e.preventDefault();try{await w(S(T,`career_job_posts`),{...U,salary:`IDR ${U.salaryMin} - ${U.salaryMax}`,status:`pending`,submittedBy:n?.id||`guest`,submittedByName:n?.username||`Guest`,createdAt:C()}),q(!0),setTimeout(()=>{q(!1),B(!1),W({title:``,department:``,location:``,type:`Full-time`,salaryMin:``,salaryMax:``,description:``,requirements:``,contactName:``,contactEmail:``,contactWa:``,bambooChat:``})},2500)}catch(e){console.error(`Error submitting job:`,e),alert(`Gagal mengirim lowongan. Silakan coba lagi.`)}},de=async e=>{e.preventDefault();try{await w(S(T,`career_demand_posts`),{...G,status:`pending`,submittedBy:n?.id||`guest`,submittedByName:n?.username||`Guest`,createdAt:C()}),J(!0),setTimeout(()=>{J(!1),H(!1),K({title:``,category:`Tenaga Kerja`,expertise:``,location:``,quantity:``,duration:``,budgetRange:``,description:``,qualifications:``,contactName:``,contactEmail:``,contactWa:``,bambooChat:``})},2500)}catch(e){console.error(`Error submitting demand:`,e),alert(`Gagal mengirim kebutuhan. Silakan coba lagi.`)}};(0,D.useEffect)(()=>{k(!0)},[]);let fe=[{id:`JOB-001`,title:`Senior Smart Contract Developer`,department:`Web3 Engineering`,location:`Remote / Jakarta`,type:`Full-time`,salary:`IDR 30M - 50M`,findersFee:`500 BMC`,icon:(0,O.jsx)(i,{size:24,color:`#f59f00`}),color:`#f59f00`},{id:`JOB-002`,title:`Ahli Agronomi Spesialis Bambu`,department:`Plantation & R&D`,location:`Kasepuhan Cibarani, Banten`,type:`Full-time`,salary:`IDR 15M - 25M`,findersFee:`200 BMC`,icon:(0,O.jsx)(f,{size:24,color:`#0ca678`}),color:`#0ca678`},{id:`JOB-003`,title:`Legal & Compliance Web3`,department:`Legal & Operations`,location:`Tangerang Selatan`,type:`Full-time`,salary:`IDR 20M - 35M`,findersFee:`300 BMC`,icon:(0,O.jsx)(y,{size:24,color:`#3b82f6`}),color:`#3b82f6`}],pe=[{id:`BTY-01`,title:`Terjemahkan Whitepaper ke Bahasa Jepang`,reward:`500 BMC`,difficulty:`Medium`,tag:`Translation`,category:`New`,value:500},{id:`BTY-02`,title:`Desain Infografis Ekosistem bambuNUSA`,reward:`250 BMC`,difficulty:`Easy`,tag:`Design`,category:`Top`,value:250},{id:`BTY-03`,title:`Audit Kontrak Cerdas Vesting V2`,reward:`2,000 BMC`,difficulty:`Hard`,tag:`Security`,category:`Value`,value:2e3},{id:`BTY-04`,title:`Tulis Artikel Medium tentang Skema Karbon`,reward:`150 BMC`,difficulty:`Easy`,tag:`Content`,category:`New`,value:150}].filter(e=>A===`New`?e.category===`New`||e.category===`Top`:A===`Top`?e.category===`Top`||e.category===`Value`:A===`Value`?e.value>=500:!0),Y=[{id:`DMD-001`,title:`Pembangunan Villa Bambu Ekologis 10 Unit`,location:`Ubud, Bali`,demandType:`Konstruksi & Arsitektur`,funding:`Terkonfirmasi (150K USDT)`,status:`Mencari Tim Pelaksana`,icon:(0,O.jsx)(b,{size:24,color:`#e03131`}),color:`#e03131`,details:null},{id:`DMD-002`,title:`Pengadaan 50,000 Bibit Bambu Betung`,location:`Jawa Barat`,demandType:`Suplai Material`,funding:`Terkonfirmasi (PO Aktif)`,status:`Mencari Petani/Koperasi`,icon:(0,O.jsx)(f,{size:24,color:`#0ca678`}),color:`#0ca678`,details:null},{id:`DMD-003`,title:`Suplai Bambu untuk Rangka Layangan ke India`,location:`Pengumpulan (WA: 08174139994)`,demandType:`Ekspor Material`,funding:`PO Aktif ($2.8 / Bundle)`,status:`Mencari Suplier`,icon:(0,O.jsx)(b,{size:24,color:`#f59f00`}),color:`#f59f00`,details:{reqs:`1 sampai 2 Kontainer 20ft / 40ft per bulan (1000 - 1100 bundle).`,price:`$ 2.8 / bundle (Harga terima di lokasi pengumpulan).`,specs:[`Ukuran 40 inci (102 cm) : 10 belahan - Tanpa simpul`,`Ukuran 34 inci (86-87 cm) : 10 belahan - Tanpa simpul`,`Ukuran 36 inci (92 cm) : 10 belahan - Tanpa simpul`,`Ketebalan: 8 - 10 mm`,`Diameter: 9 cm untuk setiap belahan`,`Toleransi tertentu dapat digunakan`,`Berbagai jenis bambu masuk asalkan sesuai ukuran`,`Kondisi: Treatment anti hama bubuk, kering (Kadar air 8-14%)`,`Packaging: Diikat tali bambu, 1 bundle = 100 bilah / 50 batang sesuai ukuran masing-masing spek`],images:[`gambar/demandmarket/bl.jpeg`,`gambar/demandmarket/bl1.jpeg`,`gambar/demandmarket/bl3.jpeg`,`gambar/demandmarket/bl4.jpeg`,`gambar/demandmarket/bl5.jpeg`,`gambar/demandmarket/bl6.jpeg`,`gambar/demandmarket/bl7.jpeg`,`gambar/demandmarket/bl8.jpeg`,`gambar/demandmarket/bl9.jpeg`]}},{id:`DMD-004`,title:`Rumah Modular Bambu 4m x 6m`,location:`Workshop (WA: 08174139994)`,demandType:`Konstruksi & Arsitektur`,funding:`Rp 70.000.000 / Unit`,status:`Mencari Vendor`,icon:(0,O.jsx)(b,{size:24,color:`#e03131`}),color:`#e03131`,details:{reqs:`Kebutuhan saat ini: 1 Unit Rumah Modular.`,price:`Rp 70.000.000 (Harga jadi di lokasi workshop/pabrik vendor).`,specs:[`Bahan: Bambu laminasi dari berbagai jenis bambu.`,`Ukuran Bangunan: 4 meter x 6 meter.`,`Desain: Mengikuti gambar acuan terlampir.`,`Fleksibilitas: Jika vendor memiliki desain alternatif yang lebih efisien, sangat diperbolehkan untuk diajukan.`],images:[],pdf:`gambar/demandmarket/rumahmodular/rmb.pdf`}},{id:`DMD-005`,title:`Komponen Huntap RISHAM T36 (6.000 Unit)`,location:`Sumatera Barat & Aceh (WA: 08174139994)`,demandType:`Manufaktur Massal`,funding:`Mega Proyek (Terkonfirmasi)`,status:`Mencari Suplier Pabrikasi`,icon:(0,O.jsx)(b,{size:24,color:`#3b82f6`}),color:`#3b82f6`,details:{reqs:`Kebutuhan Bertahap: 1 Unit Sample -> 250 Unit Rumah Contoh -> 5.750 Unit Pembangunan Massal (Total 6.000 Unit).`,price:`Dinding: Rp 270.000/m² (1 unit = 67 m²). Kusen Pintu Jendela: Rp 3.500.000/set (Harga di workshop vendor).`,specs:[`Peruntukan: Hunian Tetap (Huntap) RISHAM Type 36 untuk Korban Bencana Alam di Sumatera.`,`Komponen Dibutuhkan: Dinding, Kusen, Pintu, dan Jendela.`,`Bahan Material: Bambu laminasi dari berbagai jenis bambu.`,`Desain Acuan: Telah tersedia (File PDF terlampir).`,`Fleksibilitas: Jika vendor memiliki alternatif gambar dinding, kusen, pintu, atau jendela lain yang lebih efisien, sangat diperbolehkan untuk diajukan.`],images:[],pdf:`gambar/demandmarket/risham/risham.pdf`}}],X=fe.filter(e=>e.title.toLowerCase().includes(L.toLowerCase())||e.location.toLowerCase().includes(L.toLowerCase())||e.department.toLowerCase().includes(L.toLowerCase())),Z=Y.filter(e=>e.title.toLowerCase().includes(L.toLowerCase())||e.location.toLowerCase().includes(L.toLowerCase())||e.demandType.toLowerCase().includes(L.toLowerCase())),Q=[`User @mukoddas baru saja menerima 500 BMC untuk Audit Kontrak`,`Posisi 'Smart Contract Dev' memiliki pendaftar baru dari 5 negara`,`Total Payout Bounty bulan ini mencapai 12,500 BMC`,`Koperasi Tani Cibarani membuka 10 slot Mitra Lapangan baru`,`Pendaftaran Magang batch Mei 2026 kini dibuka!`],$=()=>{if(!F.trim())return;let e={role:`user`,text:F};P(t=>[...t,e]),I(``),setTimeout(()=>{let e={role:`bot`,text:`Terima kasih pertanyaannya! Untuk posisi tersebut, kami mencari ahli yang memahami integrasi Blockchain dengan aset fisik (RWA). Apakah Anda memiliki portofolio terkait?`};P(t=>[...t,e])},1e3)};return(0,O.jsxs)(`div`,{className:`careers-page-wrapper`,children:[(0,O.jsx)(`div`,{className:`activity-ticker`,children:(0,O.jsx)(`div`,{style:{display:`inline-block`,animation:`ticker 30s linear infinite`},children:Q.concat(Q).map((e,t)=>(0,O.jsxs)(`span`,{style:{margin:`0 40px`,fontSize:`0.85rem`,fontWeight:`bold`,fontFamily:`monospace`},children:[(0,O.jsx)(ie,{size:14,style:{display:`inline`,marginBottom:`-2px`,marginRight:`8px`}}),e]},t))})}),(0,O.jsxs)(`div`,{className:`container`,children:[(0,O.jsxs)(`div`,{className:`careers-header-section`,children:[(0,O.jsxs)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:`8px`,background:`rgba(12, 166, 120, 0.1)`,color:`var(--primary)`,padding:`8px 20px`,borderRadius:`30px`,fontSize:`0.9rem`,fontWeight:`bold`,marginBottom:`24px`},children:[(0,O.jsx)(y,{size:18}),` Karir & Peluang Terbuka`]}),(0,O.jsxs)(`h1`,{className:`careers-main-title`,children:[`Bangun Masa Depan `,(0,O.jsxs)(`span`,{style:{color:`var(--primary)`,position:`relative`,display:`inline-block`},children:[`Desentralisasi Hijau`,(0,O.jsx)(`svg`,{className:`title-underline`,viewBox:`0 0 300 20`,fill:`none`,children:(0,O.jsx)(`path`,{d:`M5 15Q150 5 295 15`,stroke:`var(--primary)`,strokeWidth:`4`,strokeLinecap:`round`})})]})]}),(0,O.jsx)(`p`,{className:`careers-main-desc`,children:`Bergabunglah dengan ekosistem yang menggabungkan ekonomi riil, restorasi ekologi, dan transparansi Web3. Kami tidak hanya mencari pekerja, kami mencari pembangun peradaban baru.`}),(0,O.jsxs)(`div`,{className:`live-stats-dashboard`,children:[(0,O.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,O.jsx)(`div`,{className:`stat-number`,children:`24`}),(0,O.jsx)(`div`,{className:`stat-label`,children:`Active Jobs`})]}),(0,O.jsx)(`div`,{className:`stat-divider`}),(0,O.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,O.jsx)(`div`,{className:`stat-number`,children:`1,250+`}),(0,O.jsx)(`div`,{className:`stat-label`,children:`Contributors`})]}),(0,O.jsx)(`div`,{className:`stat-divider`}),(0,O.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,O.jsx)(`div`,{className:`stat-number`,children:`450k`}),(0,O.jsx)(`div`,{className:`stat-label`,children:`BMC Payouts`})]})]})]}),(0,O.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(280px, 1fr))`,gap:`30px`,marginBottom:`80px`},children:[{id:`profesional`,title:`Tim Profesional`,icon:(0,O.jsx)(y,{size:32,color:`#3b82f6`}),color:`#3b82f6`,desc:`Bergabung sebagai tim inti (Full-time) di bidang rekayasa Web3, Agronomi, atau Legalitas.`,link:`#profesional`,action:`Lihat Posisi`},{id:`mitra`,title:`Mitra Lapangan`,icon:(0,O.jsx)(f,{size:32,color:`var(--primary)`}),color:`var(--primary)`,desc:`Menjadi Petani pengelola lahan atau Validator data di lapangan dengan insentif berbasis hasil.`,link:`/bambunusa/join-farmer`,action:`Daftar Mitra`},{id:`akademik`,title:`Riset & Magang`,icon:(0,O.jsx)(m,{size:32,color:`#845ef7`}),color:`#845ef7`,desc:`Jalur riset skripsi/tesis khusus mahasiswa tingkat akhir dari kampus mitra global.`,link:`#akademik`,action:`Info Program`},{id:`bounty`,title:`Web3 Bounties`,icon:(0,O.jsx)(b,{size:32,color:`#f59f00`}),color:`#f59f00`,desc:`Kerjakan misi lepas (bounty) dari mana saja dan dapatkan reward token BMC.`,link:`#bounty`,action:`Lihat Misi`}].map(t=>(0,O.jsxs)(`div`,{className:`premium-card`,style:{background:`var(--bg-card)`,padding:`40px`,borderRadius:`32px`,border:`1px solid var(--border-color)`,transition:`all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,position:`relative`},children:[(0,O.jsx)(`div`,{style:{background:`${t.color}10`,width:`70px`,height:`70px`,borderRadius:`24px`,display:`flex`,alignItems:`center`,justifyContent:`center`,marginBottom:`24px`},children:t.icon}),(0,O.jsx)(`h3`,{style:{fontSize:`1.5rem`,fontWeight:`800`,marginBottom:`16px`,color:`var(--text-main)`},children:t.title}),(0,O.jsx)(`p`,{style:{color:`var(--text-muted)`,fontSize:`0.95rem`,lineHeight:`1.6`,marginBottom:`30px`},children:t.desc}),(0,O.jsxs)(`button`,{onClick:()=>t.link.startsWith(`#`)?document.getElementById(t.link.substring(1))?.scrollIntoView({behavior:`smooth`}):e(t.link),style:{background:t.color,color:`white`,border:`none`,padding:`12px 24px`,borderRadius:`16px`,fontWeight:`bold`,fontSize:`0.9rem`,cursor:`pointer`,display:`flex`,alignItems:`center`,gap:`8px`},children:[t.action,` `,(0,O.jsx)(ne,{size:16})]})]},t.id))}),(0,O.jsxs)(`div`,{id:`profesional`,className:`profesional-section`,children:[(0,O.jsxs)(`div`,{className:`section-header-flex`,children:[(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`h2`,{style:{fontSize:`2.5rem`,fontWeight:`900`,color:`#1a1a1a`,marginBottom:`12px`},children:`Open Positions`}),(0,O.jsx)(`p`,{style:{color:`#666`,fontSize:`1.1rem`},children:`Bergabunglah membangun fondasi ekosistem triliunan rupiah.`})]}),(0,O.jsxs)(`div`,{className:`section-header-actions`,children:[(0,O.jsxs)(`button`,{onClick:()=>B(!0),className:`upload-btn-primary`,children:[(0,O.jsx)(c,{size:16}),` Upload Lowongan`]}),(0,O.jsxs)(`div`,{style:{background:`rgba(12, 166, 120, 0.1)`,color:`var(--primary)`,padding:`10px 20px`,borderRadius:`30px`,fontWeight:`bold`,fontSize:`0.85rem`,display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,O.jsx)(t,{size:16}),` Community Hires`]}),(0,O.jsx)(`button`,{style:{background:`white`,color:`#1a1a1a`,border:`1px solid #eee`,padding:`10px 25px`,borderRadius:`30px`,fontWeight:`bold`,cursor:`pointer`},children:`Lihat Departemen`})]})]}),(0,O.jsxs)(`div`,{style:{position:`relative`,marginBottom:`30px`},children:[(0,O.jsx)(g,{size:20,style:{position:`absolute`,left:`20px`,top:`18px`,color:`#adb5bd`}}),(0,O.jsx)(`input`,{type:`text`,placeholder:`Cari pekerjaan atau proyek (Contoh: Web3, Bali, Konstruksi)...`,value:L,onChange:e=>R(e.target.value),style:{width:`100%`,padding:`18px 20px 18px 50px`,borderRadius:`20px`,border:`1px solid #dee2e6`,fontSize:`1rem`,boxSizing:`border-box`,boxShadow:`0 4px 15px rgba(0,0,0,0.02)`}})]}),(0,O.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`20px`},children:X.length>0?X.map(e=>(0,O.jsxs)(`div`,{className:`job-row`,children:[(0,O.jsxs)(`div`,{className:`job-info-group`,children:[(0,O.jsx)(`div`,{className:`job-icon-container`,style:{background:`${e.color}15`},children:e.icon}),(0,O.jsxs)(`div`,{children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,marginBottom:`4px`,flexWrap:`wrap`},children:[(0,O.jsx)(`h3`,{style:{fontSize:`1.4rem`,fontWeight:`800`,color:`#1a1a1a`,margin:0},children:e.title}),(0,O.jsxs)(`span`,{style:{fontSize:`0.7rem`,color:`#999`,fontFamily:`monospace`},children:[`#`,e.id]})]}),(0,O.jsxs)(`div`,{style:{display:`flex`,gap:`15px`,color:`#666`,fontSize:`0.9rem`,flexWrap:`wrap`,marginTop:`8px`},children:[(0,O.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,O.jsx)(u,{size:16}),` `,e.location]}),(0,O.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,O.jsx)(a,{size:16}),` `,e.type]})]})]})]}),(0,O.jsxs)(`div`,{className:`job-actions-group`,children:[(0,O.jsxs)(`div`,{className:`job-salary`,children:[(0,O.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#999`,fontWeight:`bold`,textTransform:`uppercase`},children:`Kompensasi`}),(0,O.jsx)(`div`,{style:{fontWeight:`900`,color:`#1a1a1a`,fontSize:`1.1rem`},children:e.salary})]}),(0,O.jsxs)(`div`,{style:{textAlign:`center`,background:`rgba(245, 159, 0, 0.05)`,padding:`10px 20px`,borderRadius:`15px`,border:`1px solid rgba(245, 159, 0, 0.1)`},children:[(0,O.jsx)(`div`,{style:{fontSize:`0.7rem`,color:`#f59f00`,fontWeight:`bold`},children:`FINDER'S FEE`}),(0,O.jsx)(`div`,{style:{fontWeight:`900`,color:`#f59f00`},children:e.findersFee})]}),(0,O.jsxs)(`div`,{style:{display:`flex`,gap:`10px`},children:[(0,O.jsx)(`button`,{style:{background:`#1a1a1a`,color:`white`,border:`none`,padding:`12px 24px`,borderRadius:`16px`,fontWeight:`bold`,cursor:`pointer`},children:`Lamar`}),(0,O.jsx)(`button`,{style:{background:`white`,color:`#1a1a1a`,border:`1px solid #ddd`,width:`45px`,height:`45px`,borderRadius:`16px`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`},title:`Refer a Friend`,children:(0,O.jsx)(t,{size:20})})]})]})]},e.id)):(0,O.jsxs)(`div`,{style:{padding:`40px`,textAlign:`center`,color:`#888`,background:`#f8f9fa`,borderRadius:`24px`},children:[`Tidak ada lowongan pekerjaan yang cocok dengan pencarian "`,L,`"`]})})]}),(0,O.jsxs)(`div`,{id:`demand`,className:`profesional-section`,style:{background:`#fdfdfd`,borderColor:`#e0313120`},children:[(0,O.jsxs)(`div`,{className:`section-header-flex`,children:[(0,O.jsxs)(`div`,{children:[(0,O.jsxs)(`h2`,{style:{fontSize:`2.5rem`,fontWeight:`900`,color:`#1a1a1a`,marginBottom:`12px`,display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,O.jsx)(b,{color:`#e03131`,size:36}),` Demand Market`]}),(0,O.jsx)(`p`,{style:{color:`#666`,fontSize:`1.1rem`},children:`Peluang proyek yang sudah memiliki konfirmasi pendanaan (PO/Funding Ready).`})]}),(0,O.jsxs)(`div`,{className:`section-header-actions`,children:[(0,O.jsxs)(`button`,{onClick:()=>H(!0),className:`upload-btn-secondary`,children:[(0,O.jsx)(d,{size:16}),` Upload Kebutuhan`]}),(0,O.jsx)(`div`,{style:{background:`rgba(224, 49, 49, 0.1)`,color:`#e03131`,padding:`10px 20px`,borderRadius:`30px`,fontWeight:`bold`,fontSize:`0.85rem`},children:`High Priority`})]})]}),(0,O.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`20px`},children:Z.length>0?Z.map(e=>(0,O.jsxs)(`div`,{className:`job-row`,style:{borderColor:`${e.color}30`},children:[(0,O.jsxs)(`div`,{className:`job-info-group`,children:[(0,O.jsx)(`div`,{className:`job-icon-container`,style:{background:`${e.color}15`},children:e.icon}),(0,O.jsxs)(`div`,{children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,marginBottom:`4px`,flexWrap:`wrap`},children:[(0,O.jsx)(`h3`,{style:{fontSize:`1.4rem`,fontWeight:`800`,color:`#1a1a1a`,margin:0},children:e.title}),(0,O.jsxs)(`span`,{style:{fontSize:`0.7rem`,color:`#999`,fontFamily:`monospace`},children:[`#`,e.id]})]}),(0,O.jsxs)(`div`,{style:{display:`flex`,gap:`15px`,color:`#666`,fontSize:`0.9rem`,flexWrap:`wrap`,marginTop:`8px`},children:[(0,O.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,O.jsx)(u,{size:16}),` `,e.location]}),(0,O.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,color:`#0ca678`,fontWeight:`bold`},children:[(0,O.jsx)(x,{size:16}),` `,e.funding]})]})]})]}),(0,O.jsxs)(`div`,{className:`job-actions-group`,children:[(0,O.jsxs)(`div`,{className:`job-salary`,children:[(0,O.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#999`,fontWeight:`bold`,textTransform:`uppercase`},children:`Kategori`}),(0,O.jsx)(`div`,{style:{fontWeight:`900`,color:`#1a1a1a`,fontSize:`1.1rem`},children:e.demandType})]}),(0,O.jsxs)(`div`,{style:{textAlign:`center`,background:`rgba(224, 49, 49, 0.05)`,padding:`10px 20px`,borderRadius:`15px`,border:`1px solid rgba(224, 49, 49, 0.1)`},children:[(0,O.jsx)(`div`,{style:{fontSize:`0.7rem`,color:`#e03131`,fontWeight:`bold`},children:`STATUS`}),(0,O.jsx)(`div`,{style:{fontWeight:`900`,color:`#e03131`},children:e.status})]}),(0,O.jsx)(`div`,{style:{display:`flex`,gap:`10px`},children:(0,O.jsx)(`button`,{onClick:()=>M(e),style:{background:e.color,color:`white`,border:`none`,padding:`12px 24px`,borderRadius:`16px`,fontWeight:`bold`,cursor:`pointer`},children:e.details?`Detail Proyek`:`Apply Proyek`})})]})]},e.id)):(0,O.jsxs)(`div`,{style:{padding:`40px`,textAlign:`center`,color:`#888`,background:`#f8f9fa`,borderRadius:`24px`},children:[`Tidak ada permintaan pasar yang cocok dengan "`,L,`"`]})})]}),(0,O.jsxs)(`div`,{id:`bounty`,className:`bounty-section`,children:[(0,O.jsx)(`div`,{style:{position:`absolute`,top:`-100px`,left:`-100px`,width:`400px`,height:`400px`,background:`radial-gradient(circle, var(--primary) 0%, transparent 70%)`,opacity:.1}}),(0,O.jsxs)(`div`,{style:{position:`relative`,zIndex:1},children:[(0,O.jsxs)(`div`,{className:`section-header-flex`,style:{marginBottom:`50px`},children:[(0,O.jsxs)(`div`,{children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`,marginBottom:`16px`},children:[(0,O.jsx)(`div`,{style:{background:`rgba(255,255,255,0.1)`,padding:`12px`,borderRadius:`16px`},children:(0,O.jsx)(b,{size:28})}),(0,O.jsx)(`h2`,{style:{fontSize:`clamp(2rem, 5vw, 3rem)`,fontWeight:`900`,margin:0,letterSpacing:`-1px`},children:`Bounty Board`})]}),(0,O.jsx)(`p`,{style:{fontSize:`1.15rem`,color:`#aaa`,maxWidth:`600px`,lineHeight:`1.6`},children:`Ekosistem Permissionless. Kerjakan misi, serahkan Proof of Work, dan klaim BMC Anda.`})]}),(0,O.jsx)(`div`,{style:{background:`rgba(255,255,255,0.05)`,padding:`6px`,borderRadius:`20px`,display:`flex`,gap:`4px`,flexWrap:`wrap`},children:[`New`,`Top`,`Value`].map(e=>(0,O.jsx)(`button`,{onClick:()=>ae(e),style:{padding:`10px 24px`,borderRadius:`16px`,border:`none`,background:A===e?`white`:`transparent`,color:A===e?`#1a1a1a`:`#aaa`,fontWeight:`bold`,cursor:`pointer`,transition:`0.2s`,flex:1,minWidth:`80px`},children:e},e))})]}),(0,O.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(320px, 1fr))`,gap:`24px`},children:pe.map(e=>(0,O.jsxs)(`div`,{className:`bounty-card`,style:{background:`rgba(255,255,255,0.03)`,border:`1px solid rgba(255,255,255,0.08)`,padding:`32px`,borderRadius:`28px`,backdropFilter:`blur(20px)`,transition:`all 0.3s`},children:[(0,O.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,marginBottom:`20px`},children:[(0,O.jsx)(`span`,{style:{color:`#0ca678`,fontFamily:`monospace`,fontSize:`0.8rem`,fontWeight:`bold`},children:e.id}),(0,O.jsx)(`span`,{style:{color:e.difficulty===`Hard`?`#ff6b6b`:e.difficulty===`Medium`?`#fcc419`:`#51cf66`,fontSize:`0.75rem`,fontWeight:`bold`,textTransform:`uppercase`},children:e.difficulty})]}),(0,O.jsx)(`h3`,{style:{fontSize:`1.3rem`,fontWeight:`800`,marginBottom:`24px`,lineHeight:`1.4`},children:e.title}),(0,O.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,borderTop:`1px solid rgba(255,255,255,0.05)`,paddingTop:`24px`},children:[(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#666`,fontWeight:`bold`},children:`REWARD`}),(0,O.jsx)(`div`,{style:{fontSize:`1.6rem`,fontWeight:`900`,color:`#ffd43b`,fontFamily:`monospace`},children:e.reward})]}),(0,O.jsx)(`button`,{style:{background:`white`,color:`#1a1a1a`,border:`none`,padding:`12px 24px`,borderRadius:`16px`,fontWeight:`900`,fontSize:`0.9rem`,cursor:`pointer`},children:`Claim Mission`})]})]},e.id))})]})]}),j&&j.details&&(0,O.jsx)(`div`,{style:{position:`fixed`,top:0,left:0,width:`100%`,height:`100%`,background:`rgba(0,0,0,0.85)`,zIndex:6e4,display:`flex`,alignItems:`center`,justifyContent:`center`,padding:`20px`,backdropFilter:`blur(5px)`},children:(0,O.jsxs)(`div`,{className:`glass animate-scale-in`,style:{width:`100%`,maxWidth:`900px`,maxHeight:`90vh`,background:`white`,borderRadius:`30px`,overflow:`hidden`,position:`relative`,display:`flex`,flexDirection:window.innerWidth<768?`column`:`row`},children:[(0,O.jsx)(`button`,{onClick:()=>M(null),style:{position:`absolute`,top:`20px`,right:`20px`,background:`#eee`,border:`none`,borderRadius:`50%`,padding:`8px`,cursor:`pointer`,zIndex:10},children:(0,O.jsx)(o,{size:24})}),(0,O.jsxs)(`div`,{style:{flex:1,height:window.innerWidth<768?`300px`:`auto`,background:`#f1f3f5`,overflowY:`auto`,padding:`20px`,display:`flex`,flexDirection:`column`,gap:`20px`},children:[j.details.images&&j.details.images.length>0&&(0,O.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(150px, 1fr))`,gap:`10px`},children:j.details.images.map((e,t)=>(0,O.jsx)(`a`,{href:e,target:`_blank`,rel:`noopener noreferrer`,children:(0,O.jsx)(`img`,{src:e,alt:`Detail ${t}`,style:{width:`100%`,height:`150px`,objectFit:`cover`,borderRadius:`12px`,cursor:`zoom-in`,boxShadow:`0 4px 12px rgba(0,0,0,0.1)`}})},t))}),j.details.pdf&&(0,O.jsxs)(`div`,{style:{background:`white`,padding:`20px`,borderRadius:`16px`,textAlign:`center`,border:`1px dashed #ccc`},children:[(0,O.jsx)(`div`,{style:{fontSize:`3rem`,marginBottom:`10px`},children:`📄`}),(0,O.jsx)(`div`,{style:{fontWeight:`bold`,marginBottom:`5px`},children:`Dokumen Desain Acuan Tersedia`}),(0,O.jsx)(`div`,{style:{fontSize:`0.85rem`,color:`#888`,marginBottom:`15px`},children:`Silakan unduh untuk melihat detail teknis.`}),(0,O.jsx)(`a`,{href:j.details.pdf,target:`_blank`,rel:`noopener noreferrer`,style:{display:`inline-block`,background:j.color,color:`white`,textDecoration:`none`,padding:`10px 20px`,borderRadius:`12px`,fontWeight:`bold`,fontSize:`0.9rem`},children:`Buka Dokumen PDF`})]})]}),(0,O.jsxs)(`div`,{style:{flex:1.2,padding:`40px`,overflowY:`auto`},children:[(0,O.jsx)(`div`,{style:{fontSize:`0.85rem`,color:j.color,fontWeight:`bold`,marginBottom:`8px`},children:j.demandType}),(0,O.jsx)(`h2`,{style:{fontSize:`1.8rem`,margin:`0 0 16px 0`,lineHeight:1.3},children:j.title}),(0,O.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`15px`,marginBottom:`24px`},children:[(0,O.jsxs)(`div`,{style:{background:`#f8f9fa`,padding:`15px`,borderRadius:`15px`},children:[(0,O.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#888`,fontWeight:`bold`},children:`LOKASI`}),(0,O.jsx)(`div`,{style:{fontWeight:`bold`,color:`#1a1a1a`},children:j.location})]}),(0,O.jsxs)(`div`,{style:{background:`rgba(245, 159, 0, 0.05)`,padding:`15px`,borderRadius:`15px`},children:[(0,O.jsx)(`div`,{style:{fontSize:`0.75rem`,color:j.color,fontWeight:`bold`},children:`HARGA PENERIMAAN`}),(0,O.jsx)(`div`,{style:{fontWeight:`bold`,color:j.color},children:j.details.price})]})]}),(0,O.jsxs)(`div`,{style:{marginBottom:`24px`},children:[(0,O.jsx)(`h4`,{style:{marginBottom:`8px`},children:`Kebutuhan Bulanan`}),(0,O.jsx)(`p`,{style:{color:`#666`,background:`#f1f3f5`,padding:`12px`,borderRadius:`10px`,fontSize:`0.95rem`},children:j.details.reqs})]}),(0,O.jsxs)(`div`,{style:{marginBottom:`30px`},children:[(0,O.jsx)(`h4`,{style:{marginBottom:`12px`},children:`Spesifikasi Teknis`}),(0,O.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`},children:j.details.specs.map((e,t)=>(0,O.jsxs)(`div`,{style:{fontSize:`0.85rem`,background:`white`,border:`1px solid #eee`,padding:`10px 12px`,borderRadius:`8px`,display:`flex`,gap:`10px`},children:[(0,O.jsx)(`span`,{style:{color:j.color},children:`•`}),` `,e]},t))})]}),(0,O.jsx)(`button`,{onClick:()=>{alert(`Mengarahkan ke Chat WA...`),window.open(`https://wa.me/628174139994`,`_blank`)},style:{width:`100%`,padding:`16px`,borderRadius:`15px`,background:j.color,color:`white`,border:`none`,fontWeight:`bold`,fontSize:`1rem`,cursor:`pointer`,display:`flex`,justifyContent:`center`,alignItems:`center`,gap:`10px`},children:`Hubungi Pihak Pengumpul`})]})]})}),z&&(0,O.jsx)(`div`,{className:`upload-modal-overlay`,onClick:e=>e.target===e.currentTarget&&B(!1),children:(0,O.jsxs)(`div`,{className:`upload-modal animate-scale-in`,children:[(0,O.jsx)(`button`,{onClick:()=>B(!1),className:`upload-modal-close`,children:(0,O.jsx)(o,{size:22})}),ce?(0,O.jsxs)(`div`,{className:`upload-success-state`,children:[(0,O.jsx)(`div`,{className:`upload-success-icon`,children:`✅`}),(0,O.jsx)(`h2`,{children:`Lowongan Berhasil Dikirim!`}),(0,O.jsx)(`p`,{children:`Tim kami akan mereview dan mempublikasikan lowongan Anda dalam 1x24 jam.`})]}):(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)(`div`,{className:`upload-modal-header`,children:[(0,O.jsx)(`div`,{className:`upload-modal-icon`,style:{background:`rgba(12, 166, 120, 0.1)`},children:(0,O.jsx)(y,{size:28,color:`var(--primary)`})}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`h2`,{className:`upload-modal-title`,children:`Upload Lowongan Kerja`}),(0,O.jsx)(`p`,{className:`upload-modal-subtitle`,children:`Pasang lowongan kerja Anda di ekosistem BambooChain`})]})]}),(0,O.jsxs)(`form`,{onSubmit:ue,className:`upload-form`,children:[(0,O.jsxs)(`div`,{className:`upload-form-grid`,children:[(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(_,{size:14}),` Judul Posisi *`]}),(0,O.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Senior Smart Contract Developer`,value:U.title,onChange:e=>W({...U,title:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(re,{size:14}),` Departemen *`]}),(0,O.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Web3 Engineering`,value:U.department,onChange:e=>W({...U,department:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(u,{size:14}),` Lokasi *`]}),(0,O.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Remote / Jakarta`,value:U.location,onChange:e=>W({...U,location:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(a,{size:14}),` Tipe Pekerjaan`]}),(0,O.jsxs)(`select`,{value:U.type,onChange:e=>W({...U,type:e.target.value}),children:[(0,O.jsx)(`option`,{children:`Full-time`}),(0,O.jsx)(`option`,{children:`Part-time`}),(0,O.jsx)(`option`,{children:`Contract`}),(0,O.jsx)(`option`,{children:`Freelance`}),(0,O.jsx)(`option`,{children:`Magang`})]})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(x,{size:14}),` Range Gaji (IDR)`]}),(0,O.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,O.jsx)(`input`,{type:`text`,placeholder:`Min (cth: 15M)`,value:U.salaryMin,onChange:e=>W({...U,salaryMin:e.target.value})}),(0,O.jsx)(`input`,{type:`text`,placeholder:`Max (cth: 30M)`,value:U.salaryMax,onChange:e=>W({...U,salaryMax:e.target.value})})]})]}),(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsx)(`label`,{children:`Deskripsi Pekerjaan *`}),(0,O.jsx)(`textarea`,{required:!0,rows:4,placeholder:`Jelaskan tanggung jawab dan lingkup kerja...`,value:U.description,onChange:e=>W({...U,description:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsx)(`label`,{children:`Persyaratan & Kualifikasi`}),(0,O.jsx)(`textarea`,{rows:3,placeholder:`Satu persyaratan per baris...`,value:U.requirements,onChange:e=>W({...U,requirements:e.target.value})})]}),(0,O.jsx)(`div`,{className:`upload-form-divider`}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(l,{size:14}),` Nama Kontak *`]}),(0,O.jsx)(`input`,{type:`text`,required:!0,placeholder:`Nama penanggung jawab`,value:U.contactName,onChange:e=>W({...U,contactName:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(v,{size:14}),` Email Kontak *`]}),(0,O.jsx)(`input`,{type:`email`,required:!0,placeholder:`email@company.com`,value:U.contactEmail,onChange:e=>W({...U,contactEmail:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsx)(`label`,{children:`WhatsApp (opsional)`}),(0,O.jsx)(`input`,{type:`text`,placeholder:`08xxxxxxxxxx`,value:U.contactWa,onChange:e=>W({...U,contactWa:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(s,{size:14}),` Nickname BambooChat (opsional)`]}),(0,O.jsx)(`input`,{type:`text`,placeholder:`Nickname Anda di BambooChat`,value:U.bambooChat,onChange:e=>W({...U,bambooChat:e.target.value})})]})]}),(0,O.jsxs)(`button`,{type:`submit`,className:`upload-submit-btn`,style:{background:`var(--primary)`},children:[(0,O.jsx)(d,{size:18}),` Kirim Lowongan`]})]})]})]})}),V&&(0,O.jsx)(`div`,{className:`upload-modal-overlay`,onClick:e=>e.target===e.currentTarget&&H(!1),children:(0,O.jsxs)(`div`,{className:`upload-modal animate-scale-in`,children:[(0,O.jsx)(`button`,{onClick:()=>H(!1),className:`upload-modal-close`,children:(0,O.jsx)(o,{size:22})}),le?(0,O.jsxs)(`div`,{className:`upload-success-state`,children:[(0,O.jsx)(`div`,{className:`upload-success-icon`,children:`✅`}),(0,O.jsx)(`h2`,{children:`Kebutuhan Berhasil Dikirim!`}),(0,O.jsx)(`p`,{children:`Tim kami akan mereview dan menampilkan permintaan Anda di Demand Market.`})]}):(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)(`div`,{className:`upload-modal-header`,children:[(0,O.jsx)(`div`,{className:`upload-modal-icon`,style:{background:`rgba(224, 49, 49, 0.1)`},children:(0,O.jsx)(r,{size:28,color:`#e03131`})}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`h2`,{className:`upload-modal-title`,children:`Upload Kebutuhan Tenaga Kerja & Ahli`}),(0,O.jsx)(`p`,{className:`upload-modal-subtitle`,children:`Publikasikan kebutuhan tenaga kerja atau tenaga ahli proyek Anda`})]})]}),(0,O.jsxs)(`form`,{onSubmit:de,className:`upload-form`,children:[(0,O.jsxs)(`div`,{className:`upload-form-grid`,children:[(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(_,{size:14}),` Judul Kebutuhan *`]}),(0,O.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Tukang Kayu Spesialis Bambu Laminasi`,value:G.title,onChange:e=>K({...G,title:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(b,{size:14}),` Kategori *`]}),(0,O.jsxs)(`select`,{value:G.category,onChange:e=>K({...G,category:e.target.value}),children:[(0,O.jsx)(`option`,{children:`Tenaga Kerja`}),(0,O.jsx)(`option`,{children:`Tenaga Ahli`}),(0,O.jsx)(`option`,{children:`Konsultan`}),(0,O.jsx)(`option`,{children:`Kontraktor`}),(0,O.jsx)(`option`,{children:`Tim Proyek`})]})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(h,{size:14}),` Bidang Keahlian *`]}),(0,O.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Arsitektur Bambu, Agronomi`,value:G.expertise,onChange:e=>K({...G,expertise:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(u,{size:14}),` Lokasi Penempatan *`]}),(0,O.jsx)(`input`,{type:`text`,required:!0,placeholder:`Contoh: Ubud, Bali`,value:G.location,onChange:e=>K({...G,location:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(t,{size:14}),` Jumlah Dibutuhkan`]}),(0,O.jsx)(`input`,{type:`text`,placeholder:`Contoh: 5 orang`,value:G.quantity,onChange:e=>K({...G,quantity:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(a,{size:14}),` Durasi Proyek`]}),(0,O.jsx)(`input`,{type:`text`,placeholder:`Contoh: 6 bulan`,value:G.duration,onChange:e=>K({...G,duration:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(x,{size:14}),` Range Budget`]}),(0,O.jsx)(`input`,{type:`text`,placeholder:`Contoh: Rp 50M - 100M`,value:G.budgetRange,onChange:e=>K({...G,budgetRange:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsx)(`label`,{children:`Deskripsi Kebutuhan *`}),(0,O.jsx)(`textarea`,{required:!0,rows:4,placeholder:`Jelaskan detail proyek, lingkup kerja, dan ekspektasi...`,value:G.description,onChange:e=>K({...G,description:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsx)(`label`,{children:`Kualifikasi yang Dibutuhkan`}),(0,O.jsx)(`textarea`,{rows:3,placeholder:`Pengalaman, sertifikasi, kompetensi yang dibutuhkan...`,value:G.qualifications,onChange:e=>K({...G,qualifications:e.target.value})})]}),(0,O.jsx)(`div`,{className:`upload-form-divider`}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(l,{size:14}),` Nama Kontak *`]}),(0,O.jsx)(`input`,{type:`text`,required:!0,placeholder:`Nama penanggung jawab`,value:G.contactName,onChange:e=>K({...G,contactName:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(v,{size:14}),` Email Kontak *`]}),(0,O.jsx)(`input`,{type:`email`,required:!0,placeholder:`email@company.com`,value:G.contactEmail,onChange:e=>K({...G,contactEmail:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsx)(`label`,{children:`WhatsApp (opsional)`}),(0,O.jsx)(`input`,{type:`text`,placeholder:`08xxxxxxxxxx`,value:G.contactWa,onChange:e=>K({...G,contactWa:e.target.value})})]}),(0,O.jsxs)(`div`,{className:`upload-form-group upload-form-full`,children:[(0,O.jsxs)(`label`,{children:[(0,O.jsx)(s,{size:14}),` Nickname BambooChat (opsional)`]}),(0,O.jsx)(`input`,{type:`text`,placeholder:`Nickname Anda di BambooChat`,value:G.bambooChat,onChange:e=>K({...G,bambooChat:e.target.value})})]})]}),(0,O.jsxs)(`button`,{type:`submit`,className:`upload-submit-btn`,style:{background:`#e03131`},children:[(0,O.jsx)(d,{size:18}),` Kirim Kebutuhan`]})]})]})]})})]}),(0,O.jsx)(`div`,{style:{position:`fixed`,bottom:`30px`,left:`30px`,zIndex:11e3},children:oe?(0,O.jsxs)(`div`,{style:{width:`380px`,height:`500px`,background:`white`,borderRadius:`32px`,boxShadow:`0 30px 60px rgba(0,0,0,0.15)`,display:`flex`,flexDirection:`column`,overflow:`hidden`,animation:`slideUpChat 0.4s cubic-bezier(0.16, 1, 0.3, 1)`},children:[(0,O.jsxs)(`div`,{style:{background:`var(--primary)`,color:`white`,padding:`24px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,O.jsx)(`div`,{style:{width:`40px`,height:`40px`,borderRadius:`50%`,background:`rgba(255,255,255,0.2)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`1.2rem`},children:`🎋`}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`div`,{style:{fontWeight:`bold`},children:`BambuAI Assistant`}),(0,O.jsx)(`div`,{style:{fontSize:`0.7rem`,opacity:.8},children:`Online • Karir & Peluang`})]})]}),(0,O.jsx)(`button`,{onClick:()=>N(!1),style:{background:`transparent`,border:`none`,color:`white`,cursor:`pointer`},children:(0,O.jsx)(o,{size:20})})]}),(0,O.jsx)(`div`,{style:{flex:1,padding:`20px`,overflowY:`auto`,display:`flex`,flexDirection:`column`,gap:`15px`},children:se.map((e,t)=>(0,O.jsx)(`div`,{style:{alignSelf:e.role===`bot`?`flex-start`:`flex-end`,background:e.role===`bot`?`#f1f3f5`:`var(--primary)`,color:e.role===`bot`?`#1a1a1a`:`white`,padding:`12px 16px`,borderRadius:`18px`,borderBottomLeftRadius:e.role===`bot`?`4px`:`18px`,borderBottomRightRadius:e.role===`user`?`4px`:`18px`,maxWidth:`85%`,fontSize:`0.9rem`,lineHeight:`1.5`},children:e.text},t))}),(0,O.jsxs)(`div`,{style:{padding:`20px`,borderTop:`1px solid #f1f3f5`,display:`flex`,gap:`10px`},children:[(0,O.jsx)(`input`,{type:`text`,value:F,onChange:e=>I(e.target.value),onKeyDown:e=>e.key===`Enter`&&$(),placeholder:`Tanya tentang karir...`,style:{flex:1,padding:`12px 18px`,borderRadius:`15px`,border:`1px solid #eee`,background:`#f8f9fa`,outline:`none`}}),(0,O.jsx)(`button`,{onClick:$,style:{background:`var(--primary)`,color:`white`,border:`none`,width:`46px`,height:`46px`,borderRadius:`15px`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`},children:(0,O.jsx)(v,{size:18})})]})]}):(0,O.jsxs)(`button`,{onClick:()=>N(!0),style:{width:`70px`,height:`70px`,borderRadius:`50%`,background:`var(--primary)`,color:`white`,border:`none`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`,boxShadow:`0 10px 30px rgba(12,166,120,0.4)`,transition:`all 0.3s`},onMouseEnter:e=>e.currentTarget.style.transform=`scale(1.1)`,onMouseLeave:e=>e.currentTarget.style.transform=`scale(1)`,children:[(0,O.jsx)(te,{size:30}),(0,O.jsx)(`div`,{style:{position:`absolute`,top:`-5px`,right:`-5px`,background:`#ff6b6b`,color:`white`,width:`24px`,height:`24px`,borderRadius:`50%`,fontSize:`0.7rem`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:`bold`,border:`3px solid #fdfdfd`},children:`1`})]})}),(0,O.jsx)(`style`,{children:`
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
       `})]})};export{k as default};