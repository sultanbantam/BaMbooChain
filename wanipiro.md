# Rangkuman Eksekutif

**Bahasa Indonesia:** Wanipiro adalah aplikasi AI dwibahasa untuk menghitung nilai/​harga karbon dan nilai ekonomi produk mulai dari bahan baku, barang bekas, kerajinan, kuliner hingga barang industri. Sistem mengintegrasikan data real-time dari pasar domestik (Bappebti, IDX) dan internasional (komoditas global), serta faktor emisi dari sumber resmi (IPCC/GHG Protocol, FAO, ESDM). Data tersebut diolah dalam pipeline terskala (streaming/Kafka) dengan normalisasi satuan, konversi mata uang (API BI/OANDA), dan geolokasi untuk akurasi lokal. Model AI bersifat hibrid (fisika-terpanduan + ML), memanfaatkan ensembling dan dropout untuk kuantifikasi ketidakpastian. UI mendukung Bahasa Indonesia dan Inggris, dengan log audit lengkap dan modul penjelasan (explainability) setiap hitungan. Arsitektur ter-deploy dalam kontainer (Docker/Kubernetes) di cloud dan edge untuk skalabilitas dan latensi rendah.

**English:** *Wanipiro* is a bilingual (ID/EN) AI application for computing carbon price/value and monetary value of products (raw materials, secondhand goods, crafts, food, and manufactured goods). It integrates real-time market data from domestic (Bappebti farm-gate prices, IDX stock/commodities) and global feeds (energy, metals, agriculture via APIs) with authoritative emission factors (UN/IPCC, FAO, GHG Protocol). Data pipelines ingest and normalize heterogeneous inputs, apply currency conversion (via BI or OANDA/Forex APIs), geolocation, and time alignment. The AI model combines physics-informed rules (e.g. conservation laws) with machine learning (neural networks, ensembles) to predict precise carbon footprints, using uncertainty quantification (ensembles, MC dropout) for robustness. The agent UI is bilingual and safety-guarded, provides transparent explanations, and records audit logs (prompt, model choice, sources). Deployment is containerized (Docker/K8s) across cloud and edge for scalability and low latency, leveraging Kubernetes at edge for local processing and resilience.

## Key Data Inputs (Masukan Data Utama)

- **Taksonomi Produk:** Gunakan klasifikasi internasional (mis. CPC/HS code) untuk standardisasi produk dan bahan. Tetapkan satuan pengukuran (kg, L, unit) seragam dengan konversi otomatis.  
- **Tahapan Siklus Hidup:** Sertakan tahap *cradle-to-gate* atau *cradle-to-grave* (ekstraksi bahan, produksi, transportasi, penggunaan, pembuangan). Misalnya, model LCA (Life Cycle Assessment) 5 tahap.  
- **Faktor Emisi:** Tarik faktor emisi standar (CO₂-ekuivalen) dari sumber resmi, misalnya IPCC/GHG Protocol (IPCC database EF), lembaga nasional (WRI Indonesia), atau basis data LCA global (ecoinvent, Climatiq). Sertakan emisi dari bahan bakar (ESDM), proses industri, pertanian (FAO).  
- **Feed Harga Pasar:** Data harga komoditas energy, logam, pertanian global (API TradingEconomics atau Bloomberg/Yahoo); data harga lokal (IDX, ICE data feeds, harga petani dari Bappebti).  
- **Nilai Tukar:** API mata uang real-time (mis. Open Exchange Rates, OANDA) dengan Riil Waktu/harian. Bank Indonesia (JISDOR) sebagai acuan resmi. Konversi otomatis ke mata uang yang diinginkan.  

## Authoritative Data Sources & APIs (Sumber Data & API)

- **Pasar Domestik:** *Bappebti* menampilkan harga petani (cabai, beras, kopi, dll); *Kemendag/Kemendagri/BPS* mengeluarkan data ekspor-impor dan indeks harga. *IDX/ICE Data Services* menyediakan streaming harga saham dan komoditas Indonesia.  
- **Komoditas Global:** Platform seperti TradingEconomics menawarkan *API komoditas* (minyak, emas, sawit, dll); *Yahoo Finance* dan *Bloomberg* juga populer untuk data real-time (via API *yfinance*, *Alpha Vantage*, dll).  
- **Emisi & LCA:** UN IPCC/GHG Protocol (EF Database) menyediakan faktor emisi proses global. *FAOSTAT* mencakup emisi agrifood per negara. *Climatiq* dan *ecoinvent* adalah basis data LCA komprehensif. *WRI Indonesia* menggarisbawahi perlunya faktor emisi lokal.  
- **Satelit & Remote Sensing:** Data CO₂ global dari satelit NASA OCO-2/OCO-3, dan emisi CH₄ (EMIT, Sentinel-5P TROPOMI). GHGSat menawarkan konstela­tion komersial pemantauan metana di tingkat fasilitas. Copernicus (ESA) memberi akses gratis citra gas atmosfer (Sentinel-5P fokus CH₄).  
- **Data Perdagangan:** *UN Comtrade* (data perdagangan internasional per HS code) dapat mendukung estimasi jejak karbon berdasar aliran barang. Data BPS/Kemendag (ekspor/impor ID) tersedia via portal resmi.  

## Arsitektur Model AI

- **Hibrid Fisika-Informed + ML:** Model menggabungkan *physical simulations* (mis. model energi/pembakaran) dengan algoritma ML (regresi, neural network). Pendekatan *Physics-Informed ML* membantu menjaga konsistensi ilmiah. Contoh: metode THOR yang pakai neural network + prinsip dinamik fluida.  
- **Kuantisasi Ketidakpastian:** Terapkan teknik seperti *deep ensembles* dan *Monte Carlo dropout* untuk mengukur ketidakpastian (epistemik) prediksi. Pendekatan ensemble dapat menghasilkan perkiraan yang lebih stabil dan akurasi lebih baik dengan confidence interval.  
- **Kalibrasi Model:** Kalibrasi parameter (emisi per unit, intensitas karbon) dengan data lapangan (mis. data pemantauan); gunakan algoritma Bayesian atau difusi (DBUQ) untuk memperkirakan distribusi parameter. Lakukan validasi silang dengan data historis dan audit manual.  
- **Explainability:** Gunakan model interpretable (feature importance, rule extraction) untuk menjelaskan output. Sertakan penjelasan langkah hitungan (mis. “Emisi = massa × EF, nilai karbon = emisi × harga karbon”) dalam output agent.  
- **Keamanan Model:** Terapkan proteksi agar model tidak berspekulasi data di luar domain. Gunakan teknik ensemble filtering dan verifikasi hasil (mis. periksa nilai komoditas dalam rentang wajar).  

## Data Pipeline & Infrastructure

- **Ingestion Real-time:** Gunakan *streaming pipeline* (Kafka, Kinesis) untuk mengumpulkan data saat tersedia. Contoh: Kafka membaca feed API pasar, sensor satelit, laporan perdagangan simultan.  
- **Normalisasi & ETL:** Lakukan pembersihan dan transformasi: konversi satuan, format tanggal, penerjemahan kategori, validasi konsistensi. Gunakan Spark/Flink untuk pemrosesan in-motion. Simpan ke *data warehouse* time-series (mis. InfluxDB, TimescaleDB) atau data lake.  
- **Konversi Mata Uang:** Integrasi API kurs (mis. Open Exchange Rates) untuk konversi dinamis. Untuk tanggal berbeda, tarik data historis BI.  
- **Geolokasi & Resolusi Temporal:** Tandai asal/tujuan produk untuk menggunakan faktor emisi lokal. Sampling data pada frekuensi sesuai (harga: detik/menit; faktor emisi: tahunan). Sinkronkan zona waktu (UTC).  
- **Provenance & Validasi:** Simpan metadata sumber data setiap record (timestamp, sumber, API). Terapkan pemeriksaan otomatis (cek outlier, kekonsistenan dengan sumber lain). Kirim peringatan jika pipeline gagal atau data anomali terjadi (memonitor *data freshness* dan *throughput*).  
- **Feedback Loop:** Desain mekanisme feedback (mis. formulir masukan pengguna) dan sistem retraining berkala. Gunakan data revisi untuk memperbaiki emisi factor dan prediksi.   

```mermaid
flowchart LR
    subgraph Pengumpulan Data
      A[Feeds Pasar\n(Real-time)] --> B[Ingestion Stream]
      C[Satelit & Sensor\n(DHL, OCO)] --> B
      D[Statistik & LCA\n(UN, FAO, ESDM)] --> B
    end
    B --> E[ETL & Normalisasi]
    E --> F[Penyimpanan Terpusat]
    F --> G[AI Model (Hibrid)]
    G --> H[API & Layanan Agen]
    H --> I{Antarmuka Pengguna\n(Bahasa/English)}
    I --> J[Log Audit & Monitoring]
    G --> J
```  

## Desain Agen AI

- **Prompt & Interaksi:** Buat prompt system yang jelas: misalnya instruksi agar model selalu memberikan referensi sumber data. Rancangan agent mengikuti pendekatan “tool-augmented LLM” (mis. retrieval-augmented generation) agar dapat menanyakan data tertentu ke API sebelum menjawab. Contoh prompt: *"Hitung emisi karbon dan harganya untuk [produk] ..."* (ID) dan *"Calculate the carbon footprint and price for [product] ..."* (EN).  
- **Keamanan & Kebijakan:** Terapkan kontrol keamanan agar agent hanya menjawab pertanyaan terkait karbon/produk saja. Gunakan mekanisme content filter dan policy checker (mis. GDPR/PII filter) sesuai pedoman e.g. Microsoft Copilot Log audit.  
- **UX Dwibahasa:** Antarmuka mendukung Bahasa Indonesia dan Inggris (otomatis switch atau pilihan pengguna). Pastikan semua label, pesan, dan dokumentasi bilingual. Pengguna dapat menanyakan dalam salah satu bahasa dan sistem merespons sesuai bahasa.  
- **Explainability:** Setiap jawaban dilengkapi penjelasan langkah perhitungan. Contoh: *"Emisi dihitung sebagai 100 kg × 2.5 kg CO₂/kg = 250 kg CO₂; harga karbon @IDR 100.000/ton = Rp25.000"*. Sertakan aspek transparansi (mis. link ke sumber EF atau harga).  
- **Audit Logs:** Simpan log lengkap: prompt asli, versi model, sumber data yang diakses, hasil jawaban (hash), dan pemeriksaan kebijakan. Ini memudahkan penelusuran (traceability) dan kepatuhan audit.  

## Infrastruktur dan Deployment

- **Cloud vs Edge:** Aplikasi utama di-cloud (AWS/GCP/Azure) untuk manajemen data dan model berat. Penerapan edge (kubernetes on-premises/kubeedge) di titik pengolahan lokal (mis. kios pertanian atau area pabrik) meningkatkan latensi rendah dan kontinuitas saat offline.  
- **Kontainerisasi:** Container (Docker) untuk semua komponen (data ingestor, transformer, model, API). Orkestrasi Kubernetes untuk skalabilitas multi-cloud & on-prem. Gunakan CI/CD pipeline untuk otomatisasi deploy.  
- **Skalabilitas:** Gunakan managed services cloud (Kinesis/Kafka as a Service, BigQuery/Redshift) untuk menangani lonjakan data. Pastikan autoscaling pada beban tinggi.  
- **Kehandalan:** Desain multi-zone dengan failover. Jalankan instance model cadangan. Terapkan health checks dan retry logic pada integrasi API eksternal.  
- **Keamanan Infrastruktur:** Pastikan container images terbebas dari kerentanan, jaringan VPC, enkripsi data in-transit dan at-rest.  

## Tabel Perbandingan

**API Harga Pasar & Emisi:**  


| API/Sumber        | Jenis Data                   | Update    | Latensi/Ka tinggi  | Biaya (*$/bulan*)          | Catatan                    |
|-------------------|------------------------------|----------|--------------------|---------------------------|----------------------------|
| TradingEconomics  | Komoditas (energi, logam)    | Real-time | Sub-detik – menit  | *Freemium/Premium*        | Banyak komoditas global |
| Yahoo Finance     | Indeks saham, komoditas      | Real-time | Sub-detik         | Gratis (SDK pihak ke-3)   | Data terbatas vs harga official |
| OANDA / fixer.io  | Mata uang (Forex)            | Real-time | ~60 detik         | Gratis/Paid tier          | ~150+ mata uang |
| Bappebti (infoharga)| Harga komoditas domestik   | Harian    | 1 hari laten     | Gratis                   | Harga petani (contoh: cabai, kopi) |
| IDX (ICE Data API)| Data saham & indeks IDX      | Real-time | <1 detik (Live)  | Lisensi enterprise        | Streaming Level1/2 available |
| IPCC EF Database  | Faktor emisi proses          | Statis    | –                  | Gratis                   | Rekomendasi standar global |
| Climatiq API      | Emisi (LCA aggregator)       | Terus update | ~ harian       | Gratis/Tier Berbayar      | 18k+ faktor terverifikasi |
| FAOSTAT Emissions | Emisi agrifood by country    | Tahunan   | 1-2 tahun          | Gratis                   | Seluruh negara 1961–2021 |
| NASA OCO2/EMIT    | CO₂ atmosfer global          | Harian    | ~1-2 hari          | Gratis                   | Monitoring global via satelit |
| GHGSat SPECTRA    | Emisi CH₄/CO₂ lokal (fasilitas) | Ad-hoc | <1 jam (high-res) | Berbayar (komersial)     | Satelit komersial untuk metana |

**Pilihan Model AI:**  

| Arsitektur Model        | Kelebihan                           | Kekurangan                   | Contoh Penggunaan       |
|-------------------------|--------------------------------------|------------------------------|-------------------------|
| **Fisika Murni**        | Akurat secara teoritis (validated)  | Perlu data terperinci, kompleks | Hitungan dasar (energi) |
| **ML (NN, Regresi)**    | Adaptif, belajar dari data history   | ‘Black box’, memerlukan data besar | Prediksi tren harga     |
| **Physics-informed NN** | Gabungkan ilmu fisika & data      | Lebih kompleks, perlu expert | Simulasi industri hybrid |
| **Ensemble/Bayesian**   | Perkiraan interval & kepercayaan    | Hitung berat, butuh banyak model | Forkasting harga/ekstrem |
| **Kalibrasi Data-Driven** | Koreksi data empiris         | Bergantung kualitas data lapangan | Penyesuaian EF lokal   |

**Latensi Data vs Biaya:** (*Real-time* vs *Delayed*)  

| Tier Data       | Latensi       | Update Frekuensi      | Biaya        | Cocok untuk          |
|-----------------|---------------|-----------------------|--------------|----------------------|
| **Real-time**   | <1 detik–100ms | Tick-by-tick (pasar) | \$50–500/bulan | Trading aktif, analisis cepat |
| **Delayed**     | 15–20 menit   | Snapshot setiap 15–20 menit | Gratis–\$5/bulan | Analisis jangka panjang, data historis |
| **EOD (End-of-Day)** | 15–60 menit  | 1x per hari (OHLC)    | Gratis–\$10/bulan | Laporan/regulasi, riset non-real-time |

## Contoh Prompt Agen (Agent Prompts)

- **Bahasa Indonesia:**  
  - *Pengguna:* “Hitung nilai karbon dan harga material baja 100 kg untuk ekspor ke Jepang.”  
    *Agen:* “Berikut perhitungannya: ... Emisi ~X kg CO₂; harga karbon IDR Y; nilai moneter Z…” (dengan penjelasan ringkas dan sumber data).  
  - *Pengguna:* “Berapa emisi dan biaya karbon fermentasi kopi arabika 1 ton di Indonesia?”  

- **English:**  
  - *User:* “Compute the carbon emissions and carbon cost of 200 kg of premium teak wood shipped to EU.”  
    *Agent:* “Calculation: ... Emissions ≈ X kg CO₂ (source: IPCC tables) at a carbon price of $Y per ton... Total value = $Z” (with explanation).  
  - *User:* “What is the CO₂ footprint of producing 50 liters of avian egg-based mayonnaise?”  

## Contoh Input/Output

Contoh format JSON untuk permintaan dan jawaban:  

```json
// INPUT
{
  "product": "Baja Strip",
  "quantity": 100, 
  "unit": "kg",
  "location_origin": "ID", 
  "location_destination": "EU", 
  "lifecycle_stage": "cradle-to-gate"
}

// OUTPUT
{
  "carbon_emissions": 2500.0,
  "carbon_unit": "kg CO2e",
  "carbon_price": 37.50,
  "currency": "USD",
  "monetary_value": 93.75,
  "currency": "USD",
  "breakdown": "Emissions = 100 kg × 25 kg CO₂/kg; Carbon price = $15/ton; Value = 2500 kg CO₂ × $15 = $37.50",
  "data_sources": ["IPCC EF Steel 2024", "World Bank Carbon Price Data"],
  "confidence_interval": [35.0, 40.0]  // contoh ketidakpastian
}
```

Mermaid flowchart di atas (Data Pipeline) memperlihatkan alur pengumpulan data dari berbagai sumber ke sistem perhitungan. Agen bertindak di ujung flow untuk melayani kueri pengguna berbasis data terintegrasi tersebut. Output disertai log audit dan sumber data untuk transparansi. Konten di atas menjamin cakupan menyeluruh penggunaan teknologi mutakhir (AI hibrid, IoT satelit, big data) dan memprioritaskan sumber resmi (mis. IPCC, WRI, BI, Bappebti).