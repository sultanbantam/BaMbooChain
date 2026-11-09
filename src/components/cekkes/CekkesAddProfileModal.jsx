import React, { useState } from 'react';
import { 
  X, 
  User, 
  Dog, 
  Leaf, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Info
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
  const [supplements, setSupplements] = useState('');
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
  const [dietType, setDietType] = useState('');
  const [vaccineStatus, setVaccineStatus] = useState('Lengkap / Terjadwal');
  const [vetName, setVetName] = useState('');

  // Plant Form States
  const [plantName, setPlantName] = useState('');
  const [scientificName, setScientificName] = useState('Dendrocalamus asper (Schult.f.) Backer');
  const [variety, setVariety] = useState('Bambu Petung');
  const [growthPhase, setGrowthPhase] = useState('Vegetatif Aktif');
  const [location, setLocation] = useState('Plot Bambu Sabumi Cibarani');
  const [substrate, setSubstrate] = useState('Tanah Humus Vulkanik Berpasir');
  const [sunlight, setSunlight] = useState('Matahari Penuh');
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
          biometricEnrollment: false, // Default NON-biometrik
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
            currentSupplements: supplements ? supplements.split(',').map(s => s.trim()) : [],
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
            dietType: dietType || 'Pakan Standar Seimbang',
            feedingSchedule: '2x Sehari',
            vaccinationStatus: vaccineStatus,
            dewormingDate: new Date().toISOString().split('T')[0],
            veterinarianName: vetName || 'Puskeswan / Klinik Hewan Terdekat',
            allergiesOrSensitivities: []
          }
        };
      } else {
        // Plant
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
            sunlightNeed: sunlight,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-950/70">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Tambah Profil Biologis ceKKes</h2>
              <p className="text-xs text-gray-400">Pilih domain dan isi data observasi biologis sesuai standar UU PDP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Domain Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-gray-950/40 border-b border-gray-800">
          <button
            type="button"
            onClick={() => setDomain('human')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              domain === 'human'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <User size={20} className="mb-1" />
            <span>Manusia (Human)</span>
          </button>
          <button
            type="button"
            onClick={() => setDomain('animal')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              domain === 'animal'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Dog size={20} className="mb-1" />
            <span>Hewan (Animal)</span>
          </button>
          <button
            type="button"
            onClick={() => setDomain('plant')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              domain === 'plant'
                ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Leaf size={20} className="mb-1" />
            <span>Tumbuhan (Plant)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[68vh] overflow-y-auto">
          {domain === 'human' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="Contoh: Budi"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Tahun Lahir</label>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="1995"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Gol. Darah (Opsional)</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="Belum Tahu">Belum Tahu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Riwayat Alergi (Opsional)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Contoh: Udang, Penisilin (pisahkan dengan koma)"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Kontak Darurat (Nama)</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Contoh: Rina (Pasangan)"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">No. HP Kontak Darurat</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {domain === 'animal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Nama Hewan *</label>
                  <input
                    type="text"
                    required
                    value={animalName}
                    onChange={(e) => setAnimalName(e.target.value)}
                    placeholder="Contoh: Miko, Bima"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Spesies *</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kucing Domestik (Felis catus)">Kucing (Felis catus)</option>
                    <option value="Kambing Perah (Capra hircus)">Kambing (Capra hircus)</option>
                    <option value="Sapi Perah / Potong (Bos taurus)">Sapi (Bos taurus)</option>
                    <option value="Anjing (Canis familiaris)">Anjing (Canis familiaris)</option>
                    <option value="Unggas / Ayam (Gallus gallus)">Ayam / Unggas</option>
                    <option value="Kelinci (Oryctolagus cuniculus)">Kelinci</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Ras / Varietas</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Contoh: Short Hair, Ettawa"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Usia / Tgl Lahir</label>
                  <input
                    type="text"
                    value={animalAge}
                    onChange={(e) => setAnimalAge(e.target.value)}
                    placeholder="Contoh: 2 Tahun 6 Bulan"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Bobot (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={animalWeight}
                    onChange={(e) => setAnimalWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Tag Fisik / Microchip ISO (Opsional)</label>
                  <input
                    type="text"
                    value={microchipTag}
                    onChange={(e) => setMicrochipTag(e.target.value)}
                    placeholder="Contoh: ID-MC-982-12093 / Ear Tag #008"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Status Vaksinasi</label>
                  <input
                    type="text"
                    value={vaccineStatus}
                    onChange={(e) => setVaccineStatus(e.target.value)}
                    placeholder="Contoh: Rabies Aktif s/d 2027"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Dokter Hewan / Puskeswan Rujukan</label>
                <input
                  type="text"
                  value={vetName}
                  onChange={(e) => setVetName(e.target.value)}
                  placeholder="Contoh: drh. Hendra Wijaya (Klinik Satwa Sejahtera)"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {domain === 'plant' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Nama Tanaman / Rumpun *</label>
                  <input
                    type="text"
                    required
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="Contoh: Rumpun Bambu Petung A-3"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Nama Ilmiah (Latin)</label>
                  <input
                    type="text"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    placeholder="Dendrocalamus asper"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Kultivar / Varietas</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="Contoh: Petung Hitam Banten"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Fase Pertumbuhan</label>
                  <select
                    value={growthPhase}
                    onChange={(e) => setGrowthPhase(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Bibit / Semai">Bibit / Semai</option>
                    <option value="Vegetatif Aktif">Vegetatif Aktif</option>
                    <option value="Pembungaan / Generatif">Pembungaan / Generatif</option>
                    <option value="Rumpun Dewasa / Siap Panen">Rumpun Dewasa / Siap Panen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Lokasi / Plot</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Plot Sabumi Blok A"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Program Pupuk & Nutrisi</label>
                <input
                  type="text"
                  value={nutrition}
                  onChange={(e) => setNutrition(e.target.value)}
                  placeholder="Contoh: Cibarani Guano Organik 2 kg / kuartal"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Catatan observasi awal, kondisi fisik, atau riwayat perawatan..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Privacy & Legal Consent Notice (UU PDP) */}
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="consent-check"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="consent-check" className="text-xs text-gray-300 cursor-pointer">
                <strong className="text-emerald-400">Persetujuan Pemrosesan Data (UU PDP No. 27/2022):</strong> Saya memberikan persetujuan eksplisit untuk pencatatan data biologis ini secara mandiri. Data hanya digunakan untuk pemantauan kebugaran, pemeliharaan hewan, atau budidaya tanaman tanpa pengambilan biometrik invasif (sidik jari/retina).
              </label>
            </div>
            <p className="text-[11px] text-gray-400 pl-6">
              * Data tersimpan aman di perangkat Anda dan dapat dihapus atau diekspor kapan saja via menu Hak Privasi.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
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
