import React, { useState } from 'react';
import { 
  X, 
  User, 
  Dog, 
  Leaf, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { cekkesStore } from '../../services/cekkes/cekkesStore';

const CekkesAddProfileModal = ({ isOpen, onClose, onProfileAdded }) => {
  const [domain, setDomain] = useState('human');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);

  // Human Form States
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [birthYear, setBirthYear] = useState('1995');
  const [gender, setGender] = useState('Laki-laki');
  const [bloodType, setBloodType] = useState('O+');
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('65');
  const [allergies, setAllergies] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Animal Form States
  const [animalName, setAnimalName] = useState('');
  const [species, setSpecies] = useState('Kucing Domestik (Felis catus)');
  const [breed, setBreed] = useState('');
  const [animalAge, setAnimalAge] = useState('');
  const [animalGender, setAnimalGender] = useState('Jantan (Telah Steril)');
  const [animalWeight, setAnimalWeight] = useState('4.0');
  const [microchipTag, setMicrochipTag] = useState('');
  const [vaccineStatus, setVaccineStatus] = useState('Lengkap / Terjadwal');
  const [vetName, setVetName] = useState('');

  // Plant Form States
  const [plantName, setPlantName] = useState('');
  const [scientificName, setScientificName] = useState('Dendrocalamus asper (Schult.f.) Backer');
  const [variety, setVariety] = useState('Bambu Petung');
  const [growthPhase, setGrowthPhase] = useState('Vegetatif Aktif');
  const [location, setLocation] = useState('Plot Bambu Sabumi Cibarani');
  const [substrate, setSubstrate] = useState('Tanah Humus Vulkanik Berpasir');
  const [nutrition, setNutrition] = useState('Pupuk Cibarani Guano Organik 2 kg / kuartal');

  // Common Notes
  const [generalNotes, setGeneralNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consentChecked) {
      alert('Mohon centang persetujuan pemrosesan data sesuai UU PDP No. 27/2022.');
      return;
    }

    setIsSubmitting(true);
    try {
      let profilePayload = {
        domain,
        notes: generalNotes,
        consentGranted: {
          healthDataProcessing: true,
          aiEducationalInsights: true,
          biometricEnrollment: false,
          lastUpdated: new Date().toISOString()
        }
      };

      if (domain === 'human') {
        if (!fullName.trim()) {
          alert('Nama lengkap wajib diisi.');
          setIsSubmitting(false);
          return;
        }

        const h = parseFloat(heightCm) || 170;
        const w = parseFloat(weightKg) || 65;
        const bmi = parseFloat((w / ((h / 100) * (h / 100))).toFixed(1));

        profilePayload = {
          ...profilePayload,
          fullName: fullName.trim(),
          preferredName: preferredName.trim() || fullName.split(' ')[0],
          ageGroup: `${new Date().getFullYear() - parseInt(birthYear || '1995')} Tahun`,
          birthYear,
          gender,
          bloodType: bloodType || 'Belum Diisi',
          physicalSummary: {
            heightCm: h,
            weightKg: w,
            bmi,
            bmiCategory: bmi < 18.5 ? 'Kurang' : bmi < 25 ? 'Normal/Ideal' : bmi < 30 ? 'Kelebihan' : 'Obesitas',
            latestBloodPressure: 'Belum diukur',
            restingHeartRate: 'Normal',
            knownAllergies: allergies ? allergies.split(',').map(s => s.trim()) : ['Tidak ada alergi terlapor'],
            currentSupplements: [],
            chronicConditions: []
          },
          emergencyContact: {
            name: emergencyName || 'Belum diisi',
            phone: emergencyPhone || 'Belum diisi',
            relationship: 'Kontak Darurat'
          }
        };
      } else if (domain === 'animal') {
        if (!animalName.trim()) {
          alert('Nama hewan wajib diisi.');
          setIsSubmitting(false);
          return;
        }

        profilePayload = {
          ...profilePayload,
          name: animalName.trim(),
          species: species.trim(),
          breed: breed.trim() || 'Lokal / Campuran',
          ageDescription: animalAge.trim() || 'Estimasi 2 Tahun',
          gender: animalGender,
          weightKg: parseFloat(animalWeight) || 3.0,
          identificationTag: {
            type: microchipTag ? 'Visual Tag / Microchip' : 'Tidak Ada Tag Terdaftar',
            code: microchipTag || 'Belum didaftarkan',
            collarColor: 'Standar'
          },
          careProfile: {
            dietType: 'Pakan Standar Seimbang',
            feedingSchedule: '2x Sehari',
            vaccinationStatus: vaccineStatus,
            dewormingDate: new Date().toISOString().split('T')[0],
            veterinarianName: vetName || 'Puskeswan / Klinik Hewan Terdekat',
            allergiesOrSensitivities: []
          }
        };
      } else {
        if (!plantName.trim()) {
          alert('Nama tanaman wajib diisi.');
          setIsSubmitting(false);
          return;
        }

        profilePayload = {
          ...profilePayload,
          name: plantName.trim(),
          scientificName: scientificName.trim() || 'Dendrocalamus asper',
          variety: variety.trim() || 'Bambu / Pangan Lokal',
          growthPhase,
          plantingDate: new Date().toISOString().split('T')[0],
          location: location.trim() || 'Lahan Sabumi',
          cultivationDetails: {
            substrate,
            sunlightNeed: 'Matahari Penuh',
            irrigationNeed: 'Sesuai musim',
            nutritionProgram: nutrition,
            pestResistance: 'Organik Terpadu',
            culmCount: 1
          }
        };
      }

      const created = cekkesStore.addSubject(profilePayload);
      if (onProfileAdded) onProfileAdded(created);
      onClose();
    } catch (err) {
      console.error('Gagal menambahkan profil:', err);
      alert('Terjadi kesalahan saat menyimpan profil: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#111827',
    border: '1px solid #374151',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '0.85rem',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: '5px'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 20000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid #334155',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '8px', borderRadius: '10px', color: '#34d399' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
                Tambah Profil Biologis ceKKes
              </h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Pilih domain dan isi data observasi biologis sesuai standar UU PDP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Domain Selection Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          padding: '12px 20px',
          background: '#0f172a',
          borderBottom: '1px solid #334155'
        }}>
          {[
            { id: 'human', label: 'Manusia (Human)', icon: <User size={18} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
            { id: 'animal', label: 'Hewan (Animal)', icon: <Dog size={18} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' },
            { id: 'plant', label: 'Tumbuhan (Plant)', icon: <Leaf size={18} />, color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.2)' },
          ].map(d => {
            const isSel = domain === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDomain(d.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: isSel ? `2px solid ${d.color}` : '1px solid #334155',
                  background: isSel ? d.bg : 'rgba(30, 41, 59, 0.5)',
                  color: isSel ? d.color : '#94a3b8',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {d.icon}
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {domain === 'human' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nama Panggilan</label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="Contoh: Budi"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Tahun Lahir</label>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Gol. Darah (Opsional)</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="Belum Tahu">Belum Tahu</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Riwayat Alergi (Opsional)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Contoh: Udang, Penisilin (pisahkan dengan koma)"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Kontak Darurat (Nama)</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Contoh: Rina (Pasangan)"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>No. HP Kontak Darurat</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    style={inputStyle}
                  />
                </div>
              </div>
            </>
          )}

          {domain === 'animal' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Nama Hewan *</label>
                  <input
                    type="text"
                    required
                    value={animalName}
                    onChange={(e) => setAnimalName(e.target.value)}
                    placeholder="Contoh: Miko, Bima"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Spesies *</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Kucing Domestik (Felis catus)">Kucing (Felis catus)</option>
                    <option value="Kambing Perah (Capra hircus)">Kambing (Capra hircus)</option>
                    <option value="Sapi Perah / Potong (Bos taurus)">Sapi (Bos taurus)</option>
                    <option value="Anjing (Canis familiaris)">Anjing (Canis familiaris)</option>
                    <option value="Unggas / Ayam (Gallus gallus)">Ayam / Unggas</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Ras / Varietas</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Contoh: Short Hair, Ettawa"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Usia / Deskripsi</label>
                  <input
                    type="text"
                    value={animalAge}
                    onChange={(e) => setAnimalAge(e.target.value)}
                    placeholder="Contoh: 2 Tahun 6 Bulan"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Bobot (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={animalWeight}
                    onChange={(e) => setAnimalWeight(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Tag / Microchip (Opsional)</label>
                  <input
                    type="text"
                    value={microchipTag}
                    onChange={(e) => setMicrochipTag(e.target.value)}
                    placeholder="ID-MC-982-12093 / Ear Tag #008"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Status Vaksinasi</label>
                  <input
                    type="text"
                    value={vaccineStatus}
                    onChange={(e) => setVaccineStatus(e.target.value)}
                    placeholder="Rabies Aktif s/d 2027"
                    style={inputStyle}
                  />
                </div>
              </div>
            </>
          )}

          {domain === 'plant' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Nama Tanaman / Rumpun *</label>
                  <input
                    type="text"
                    required
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="Contoh: Rumpun Bambu Petung A-3"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nama Ilmiah (Latin)</label>
                  <input
                    type="text"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    placeholder="Dendrocalamus asper"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Kultivar / Varietas</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="Petung Hitam Banten"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Fase Pertumbuhan</label>
                  <select
                    value={growthPhase}
                    onChange={(e) => setGrowthPhase(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Bibit / Semai">Bibit / Semai</option>
                    <option value="Vegetatif Aktif">Vegetatif Aktif</option>
                    <option value="Pembungaan / Generatif">Pembungaan / Generatif</option>
                    <option value="Rumpun Dewasa / Siap Panen">Rumpun Dewasa / Siap Panen</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Lokasi / Plot</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Plot Sabumi Blok A"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Program Pupuk & Nutrisi</label>
                <input
                  type="text"
                  value={nutrition}
                  onChange={(e) => setNutrition(e.target.value)}
                  placeholder="Cibarani Guano Organik 2 kg / kuartal"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Catatan observasi awal, kondisi fisik, atau riwayat perawatan..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Privacy & Legal Consent Notice (UU PDP) */}
          <div style={{
            background: 'rgba(6, 78, 59, 0.3)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input
                type="checkbox"
                id="consent-check"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                style={{ marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="consent-check" style={{ fontSize: '0.76rem', color: '#e2e8f0', cursor: 'pointer', lineHeight: 1.5 }}>
                <strong style={{ color: '#34d399' }}>Persetujuan Pemrosesan Data (UU PDP No. 27/2022):</strong> Saya mengonfirmasi bahwa pencatatan data biologis ini bersifat sukarela dan non-biometrik (tanpa pengambilan sidik jari/retina mentah). Data tersimpan di perangkat lokal pengguna.
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #334155' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                background: '#334155',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: '10px',
                background: '#10b981',
                border: 'none',
                color: '#022c22',
                fontSize: '0.85rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
              }}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CekkesAddProfileModal;
