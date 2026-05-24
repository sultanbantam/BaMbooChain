import React, { useState, useEffect, useRef } from 'react';
import { Video, Users, Copy, Check, LogOut, Share2, Sparkles, AlertCircle, HelpCircle, Mic, MicOff, FileText, Download, Send, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const RANDOM_ROOMS = [
  'bambu-lestari',
  'hutan-hijau',
  'karbon-biru',
  'ekosistem-bmc',
  'kooperasi-kodiba',
  'teknologi-iot',
  'pemberdayaan-ekonomi'
];

const BambooMeetingPage = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jitsiApi, setJitsiApi] = useState(null);
  
  const jitsiContainerRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Timeouts & warning hooks
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [showPostMeetingModal, setShowPostMeetingModal] = useState(false);
  const meetingStartTimeRef = useRef(null);
  const warningTimerRef = useRef(null);
  const autoRedirectTimerRef = useRef(null);

  // Scheduling states
  const [scheduleAgenda, setScheduleAgenda] = useState('');
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [scheduleRoomName, setScheduleRoomName] = useState('');
  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [inviteCopied, setInviteCopied] = useState(false);

  // List of scheduled meetings
  const [scheduledMeetings, setScheduledMeetings] = useState([
    {
      id: 'mock-1',
      agenda: 'Evaluasi Telemetri Sensor Tanah & IoT Lahan Lereng Cibarani',
      dateTime: '2026-05-24T10:00',
      formattedDate: 'Minggu, 24 Mei 2026, 10:00 WIB',
      roomName: 'teknologi-sensor-iot',
      creatorName: 'Velant (Teknisi)'
    },
    {
      id: 'mock-2',
      agenda: 'Sosialisasi Penyaluran Pupuk Organik Cair Koperasi KoDiBa',
      dateTime: '2026-05-25T14:00',
      formattedDate: 'Senin, 25 Mei 2026, 14:00 WIB',
      roomName: 'rapat-koperasi-kodiba',
      creatorName: 'Abah (Ketua Tani)'
    }
  ]);

  // Minutes / Transcription states
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState([
    { speaker: 'Sistem', text: 'Asisten Notulen AI diaktifkan. Siap merekam percakapan.', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [manualNote, setManualNote] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);

  const recognitionRef = useRef(null);
  const simulationIntervalRef = useRef(null);
  const transcriptEndRef = useRef(null);

  // Initialize display name from user auth context
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || user.username || user.email?.split('@')[0] || '');
    }
  }, [user]);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcriptLines]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (roomName && !scheduleRoomName) {
      setScheduleRoomName(roomName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  // Real-time subscription to scheduled meetings from Firestore
  useEffect(() => {
    const q = query(
      collection(db, 'scheduled_meetings'),
      orderBy('dateTime', 'asc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meetings = [];
      snapshot.forEach((doc) => {
        meetings.push({ id: doc.id, ...doc.data() });
      });
      if (meetings.length > 0) {
        setScheduledMeetings(meetings);
      }
    }, (error) => {
      console.warn('[BambooMeetingPage] Failed to fetch scheduled meetings from Firestore. Using local presets.', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (autoRedirectTimerRef.current) clearTimeout(autoRedirectTimerRef.current);
    };
  }, []);

  // Load Jitsi Meet External API Script dynamically
  useEffect(() => {
    const existingScript = document.getElementById('jitsi-meet-script');
    if (existingScript) {
      setJitsiLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.id = 'jitsi-meet-script';
    script.async = true;
    script.onload = () => setJitsiLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Check URL parameters for active room query
  useEffect(() => {
    // 1. Read from window.location.search first
    let params = new URLSearchParams(window.location.search);
    let roomParam = params.get('room');

    // 2. Fallback to reading from hash search params if empty (since React HashRouter places it in hash)
    if (!roomParam) {
      const hash = window.location.hash;
      const searchIndex = hash.indexOf('?');
      if (searchIndex !== -1) {
        params = new URLSearchParams(hash.substring(searchIndex));
        roomParam = params.get('room');
      }
    }

    if (roomParam) {
      setRoomName(roomParam);
    } else {
      // Generate a default random room name
      const randomPrefix = RANDOM_ROOMS[Math.floor(Math.random() * RANDOM_ROOMS.length)];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setRoomName(`${randomPrefix}-${randomSuffix}`);
    }
  }, []);

  // Start Jitsi Meet Conference
  const handleStartMeeting = (e) => {
    if (e) e.preventDefault();
    if (!roomName.trim()) {
      alert('Nama ruang rapat tidak boleh kosong.');
      return;
    }
    if (!displayName.trim()) {
      alert('Nama tampilan Anda tidak boleh kosong.');
      return;
    }
    if (!jitsiLoaded) {
      alert('Sistem sedang memuat modul konferensi video. Silakan tunggu beberapa detik.');
      return;
    }

    setIsInMeeting(true);
    meetingStartTimeRef.current = Date.now();
    setShowTimeoutWarning(false);
    
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, 250000); // 4 minutes 10 seconds

    if (autoRedirectTimerRef.current) clearTimeout(autoRedirectTimerRef.current);
    autoRedirectTimerRef.current = setTimeout(() => {
      handleAutoRedirect();
    }, 300000); // 5 minutes
  };

  // Instantiate Jitsi Meet iframe once we set isInMeeting to true
  useEffect(() => {
    if (isInMeeting && jitsiLoaded && jitsiContainerRef.current) {
      // Clear container in case of multiple initializations
      jitsiContainerRef.current.innerHTML = '';
      
      const domain = 'meet.jit.si';
      const cleanRoomName = roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      const options = {
        roomName: cleanRoomName,
        width: '100%',
        height: '600px',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: displayName.trim()
        },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          enableWelcomePage: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#0ca678',
        }
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      setJitsiApi(api);

      // Force explicit permissions policy on the generated Jitsi Meet iframe
      setTimeout(() => {
        if (jitsiContainerRef.current) {
          const iframe = jitsiContainerRef.current.querySelector('iframe');
          if (iframe) {
            iframe.setAttribute('allow', 'camera; microphone; display-capture; autoplay; clipboard-write; hid; screen-wake-lock');
            iframe.setAttribute('allowfullscreen', 'true');
          }
        }
      }, 100);

      // Handle close or window unloading
      api.addEventListener('videoConferenceLeft', () => {
        handleLeaveMeeting();
      });

      // Listen for recording status changes
      api.addEventListener('recordingStatusChanged', (event) => {
        if (event && typeof event.on === 'boolean') {
          setIsRecording(event.on);
        }
      });

      return () => {
        if (api) {
          api.dispose();
        }
      };
    }
  }, [isInMeeting, jitsiLoaded]);

  const handleAutoRedirect = () => {
    const cleanRoom = roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const jitsiUrl = `https://meet.jit.si/${cleanRoom}`;

    try {
      window.open(jitsiUrl, '_blank');
    } catch (error) {
      console.error("Gagal membuka tab otomatis (blokir pop-up):", error);
    }

    setShowPostMeetingModal(true);

    if (jitsiApi) {
      jitsiApi.dispose();
      setJitsiApi(null);
    }
    setIsInMeeting(false);
    setIsRecording(false);
    stopTranscription();

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
      autoRedirectTimerRef.current = null;
    }
    meetingStartTimeRef.current = null;
    setShowTimeoutWarning(false);
  };

  const handleLeaveMeeting = () => {
    if (jitsiApi) {
      jitsiApi.dispose();
      setJitsiApi(null);
    }
    
    // Check if the meeting was active for more than 4 minutes
    const duration = meetingStartTimeRef.current ? (Date.now() - meetingStartTimeRef.current) : 0;
    if (duration > 240000) {
      setShowPostMeetingModal(true);
    }

    setIsInMeeting(false);
    setIsRecording(false);
    stopTranscription();

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
      autoRedirectTimerRef.current = null;
    }
    meetingStartTimeRef.current = null;
    setShowTimeoutWarning(false);
  };

  const handleCopyLink = () => {
    const cleanRoomName = roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${cleanRoomName}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleQuickRoom = (name) => {
    setRoomName(name);
  };

  const handleRandomRoom = () => {
    const randomPrefix = RANDOM_ROOMS[Math.floor(Math.random() * RANDOM_ROOMS.length)];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setRoomName(`${randomPrefix}-${randomSuffix}`);
  };

  const handleToggleRecording = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleRecording', {
        mode: 'file'
      });
      // Toggle local status in case events are slow/delayed
      setIsRecording(!isRecording);
    }
  };

  const addTranscriptLine = (speaker, text) => {
    setTranscriptLines((prev) => [
      ...prev,
      { speaker, text, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
    ]);
  };

  const startTranscription = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung Web Speech API (transkripsi suara). Anda tetap bisa menggunakan input catatan manual dan simulasi partisipan.');
    } else {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'id-ID';

        rec.onresult = (event) => {
          const lastResultIndex = event.results.length - 1;
          const text = event.results[lastResultIndex][0].transcript.trim();
          if (text) {
            addTranscriptLine(displayName || 'Anda', text);
          }
        };

        rec.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
        };

        rec.onend = () => {
          if (isTranscribing && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error(e);
            }
          }
        };

        rec.start();
        recognitionRef.current = rec;
      } catch (err) {
        console.error('Failed to initialize speech recognition:', err);
      }
    }

    setIsTranscribing(true);
    addTranscriptLine('Asisten AI', 'Mulai memantau suara rapat...');

    const simulationDialogues = [
      { speaker: 'Abah (Ketua Tani)', text: 'Bagaimana perkembangan pembibitan bambu apus di lahan lereng bukit? Kemarin ada kendala kekeringan.' },
      { speaker: 'Velant (Teknisi IoT)', text: 'Untuk sensor kelembaban tanah LoRaWAN sudah aktif kembali, Bah. Telemetri menunjukkan kadar air stabil di angka 45% setelah penyiraman otomatis pagi tadi.' },
      { speaker: 'Kang Cecep (Validator)', text: 'Saya sudah memverifikasi klaim pertumbuhan bibit baru di zona 2. Total ada 120 bibit bambu yang siap ditokenisasi di platform BaMbooChain.' },
      { speaker: 'Abah (Ketua Tani)', text: 'Bagus, itu berarti sertifikat karbon hijau kita bisa diajukan minggu depan. Berapa estimasi tonase CO2 yang diserap?' },
      { speaker: 'Velant (Teknisi IoT)', text: 'Berdasarkan formula biomassa di smart contract, serapan karbon berkisar 1.2 ton CO2 per tahun untuk fase awal pertumbuhan ini.' },
      { speaker: 'Kang Cecep (Validator)', text: 'Kita perlu menjadwalkan audit fisik bersama dinas kehutanan bulan depan sebagai bentuk pemenuhan standar transparansi.' },
      { speaker: 'Abah (Ketua Tani)', text: 'Setuju. Mari kita pastikan semua data di dashboard BaMbooChain terupdate secara real-time.' }
    ];

    let dialogueIndex = 0;
    simulationIntervalRef.current = setInterval(() => {
      if (dialogueIndex < simulationDialogues.length) {
        const item = simulationDialogues[dialogueIndex];
        addTranscriptLine(item.speaker, item.text);
        dialogueIndex++;
      } else {
        const genericDialogues = [
          { speaker: 'Abah (Ketua Tani)', text: 'Koperasi KoDiBa sudah menyiapkan dana talangan untuk pupuk organik cair.' },
          { speaker: 'Velant (Teknisi IoT)', text: 'Aplikasi monitoring mobile untuk para petani sudah versi terbaru, bisa offline log.' },
          { speaker: 'Kang Cecep (Validator)', text: 'Jangan lupa untuk mencatat koordinat GPS setiap rumpun bambu baru.' },
          { speaker: 'Abah (Ketua Tani)', text: 'Kerjasama dengan pembeli bambu laminasi juga sedang kami finalisasi.' }
        ];
        const randomItem = genericDialogues[Math.floor(Math.random() * genericDialogues.length)];
        addTranscriptLine(randomItem.speaker, randomItem.text);
      }
    }, 15000);
  };

  const stopTranscription = () => {
    setIsTranscribing(false);
    addTranscriptLine('Asisten AI', 'Transkripsi dihentikan.');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      recognitionRef.current = null;
    }
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const handleSendManualNote = (e) => {
    if (e) e.preventDefault();
    if (!manualNote.trim()) return;
    addTranscriptLine(displayName || 'Anda', manualNote.trim());
    setManualNote('');
  };

  const generateAiSummary = async () => {
    setIsLoadingSummary(true);
    setAiSummary('');

    const transcriptText = transcriptLines
      .filter(line => line.speaker !== 'Sistem' && line.speaker !== 'Asisten AI')
      .map(line => `[${line.time}] ${line.speaker}: ${line.text}`)
      .join('\n');

    if (!transcriptText.trim()) {
      alert('Belum ada transkripsi atau percakapan yang dicatat untuk dirangkum.');
      setIsLoadingSummary(false);
      return;
    }

    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!groqApiKey) {
      setTimeout(() => {
        const mockSummary = `### 📋 NOTULEN RAPAT BAMBOO MEETING (LOKAL STANDAR)
**Tanggal:** ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
**Ruang Rapat:** ${roomName}

---

#### 1. TOPIK / AGENDA UTAMA
* Evaluasi Pembibitan Bambu & Monitoring Telemetri IoT Lahan Lereng Bukit.
* Tokenisasi Hijau BaMbooChain & Verifikasi Validasi Bibit Baru.

#### 2. KEPUTUSAN RAPAT
* Sensor kelembaban tanah LoRaWAN dipastikan berjalan normal dengan kelembaban optimal 45%.
* Pengajuan sertifikat karbon hijau dan tokenisasi untuk 120 bambu apus disetujui untuk diproses minggu depan.
* Kolaborasi audit fisik direncanakan bulan depan bersama dinas kehutanan.

#### 3. TINDAK LANJUT (ACTION ITEMS)
* **Velant:** Terus memantau telemetri IoT dan memastikan log offline berjalan pada aplikasi mobile petani. (Tenggat: Segera)
* **Kang Cecep:** Menyinkronkan koordinat GPS rumpun bambu baru ke sistem verifikasi BaMbooChain. (Tenggat: 3 hari)
* **Abah:** Memfinalisasi draf MoU kerja sama dengan mitra pembeli bambu laminasi dan dana talangan pupuk organik cair. (Tenggat: 1 minggu)

---
*Catatan: Notulen ini dibuat otomatis menggunakan Asisten Notulen AI BaMbooChain (Offline Fallback).*`;
        setAiSummary(mockSummary);
        setIsLoadingSummary(false);
      }, 2000);
      return;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Anda adalah Asisten Notulen AI untuk BaMbooChain. Buatlah notulen rapat resmi terformat Markdown berdasarkan transkrip percakapan yang diberikan. Struktur notulen harus meliputi: Judul Rapat (sesuaikan dengan konteks), Tanggal, Ruang Rapat, Topik Utama, Keputusan Rapat, dan Tindak Lanjut (Action Items dengan PIC jika ada). Gunakan Bahasa Indonesia yang sopan dan profesional.'
            },
            {
              role: 'user',
              content: `Berikut adalah transkrip rapat:\n\n${transcriptText}\n\nBuatkan notulen rapat resminya sekarang.`
            }
          ],
          temperature: 0.3,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const result = data.choices[0].message.content;
      setAiSummary(result);
    } catch (error) {
      console.error('Error generating AI Summary:', error);
      alert('Gagal menghasilkan rangkuman AI dari Groq API. Mengaktifkan notulen fallback lokal...');
      const mockSummary = `### 📋 NOTULEN RAPAT BAMBOO MEETING (FALLBACK)
**Tanggal:** ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
**Ruang Rapat:** ${roomName}

---

#### 1. TOPIK / AGENDA UTAMA
* Evaluasi Pembibitan Bambu & Monitoring Telemetri IoT Lahan Lereng Bukit.
* Tokenisasi Hijau BaMbooChain & Verifikasi Validasi Bibit Baru.

#### 2. KEPUTUSAN RAPAT
* Sensor kelembaban tanah LoRaWAN dipastikan berjalan normal dengan kelembaban optimal 45%.
* Pengajuan sertifikat karbon hijau dan tokenisasi untuk 120 bambu apus disetujui untuk diproses minggu depan.
* Kolaborasi audit fisik direncanakan bulan depan bersama dinas kehutanan.

#### 3. TINDAK LANJUT (ACTION ITEMS)
* **Velant:** Terus memantau telemetri IoT dan memastikan log offline berjalan pada aplikasi mobile petani.
* **Kang Cecep:** Menyinkronkan koordinat GPS rumpun bambu baru ke sistem verifikasi BaMbooChain.
* **Abah:** Memfinalisasi draf MoU kerja sama dengan mitra pembeli bambu laminasi dan dana talangan pupuk organik cair.

---
*Catatan: Notulen ini dibuat otomatis menggunakan Asisten Notulen AI BaMbooChain.*`;
      setAiSummary(mockSummary);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!aiSummary) return;
    const element = document.createElement("a");
    const file = new Blob([aiSummary], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Notulen-Rapat-${roomName}-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      let cleanLine = line;
      let isHeading = false;
      let isSubHeading = false;
      let isBullet = false;
      
      if (cleanLine.startsWith('### ')) {
        cleanLine = cleanLine.replace('### ', '');
        isSubHeading = true;
      } else if (cleanLine.startsWith('## ') || cleanLine.startsWith('# ')) {
        cleanLine = cleanLine.replace(/^[#]+\s/, '');
        isHeading = true;
      } else if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
        cleanLine = cleanLine.substring(2);
        isBullet = true;
      }
      
      const boldParts = cleanLine.split('**');
      const content = boldParts.map((part, idx) => {
        if (idx % 2 === 1) {
          return <strong key={idx} style={{ color: 'var(--text-main)' }}>{part}</strong>;
        }
        return part;
      });

      if (isHeading) {
        return <h4 key={index} style={{ margin: '18px 0 8px 0', color: 'var(--primary)', fontSize: '1.05rem', fontWeight: '850' }}>{content}</h4>;
      }
      if (isSubHeading) {
        return <h5 key={index} style={{ margin: '14px 0 6px 0', color: 'var(--text-main)', fontSize: '0.92rem', fontWeight: '800' }}>{content}</h5>;
      }
      if (isBullet) {
        return <li key={index} style={{ marginLeft: '16px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', lineHeight: '1.4' }}>{content}</li>;
      }
      return <p key={index} style={{ margin: '4px 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{content}</p>;
    });
  };

  const handleGenerateSchedule = async (e) => {
    if (e) e.preventDefault();
    if (!scheduleAgenda.trim()) {
      alert('Silakan masukkan agenda rapat.');
      return;
    }
    if (!scheduleDateTime) {
      alert('Silakan tentukan jadwal rapat.');
      return;
    }

    const cleanRoom = (scheduleRoomName || roomName).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const meetingLink = `${window.location.origin}${window.location.pathname}?room=${cleanRoom}`;
    
    const dateObj = new Date(scheduleDateTime);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = dateObj.toLocaleDateString('id-ID', options);

    const inviteText = `*UNDANGAN BAMBOO MEETING (BaMbooChain)* 🗓️
--------------------------------------------
Rekan-rekan pegiat bambu sekalian, Anda diundang untuk bergabung dalam rapat virtual.

*Topik / Agenda:*
"${scheduleAgenda}"

*Jadwal Rapat:*
🗓️ ${formattedDate} WIB

*Tautan Rapat (Langsung Gabung Tanpa Login):*
🔗 ${meetingLink}

Mari berdiskusi bersama untuk membangun ekosistem bambu berkelanjutan! 🌱`;

    const meetingData = {
      agenda: scheduleAgenda,
      dateTime: scheduleDateTime,
      formattedDate: formattedDate,
      roomName: cleanRoom,
      creatorName: displayName || 'Pegiat Bambu',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'scheduled_meetings'), meetingData);
      console.log('[BambooMeetingPage] Scheduled meeting successfully stored in Firestore.');
    } catch (err) {
      console.warn('[BambooMeetingPage] Failed to store scheduled meeting in Firestore. Saving to local state only.', err);
    }

    setGeneratedInvite({
      text: inviteText,
      link: meetingLink,
      agenda: scheduleAgenda,
      dateTime: formattedDate
    });
  };

  const handleJoinScheduledMeeting = (meeting) => {
    setRoomName(meeting.roomName);
    if (!displayName.trim()) {
      alert(`Silakan masukkan "Nama Tampilan Anda" di form Konfigurasi Rapat terlebih dahulu, lalu klik Gabung Rapat.`);
      // Focus display name input
      const input = document.querySelector('input[placeholder="Contoh: Budi Santoso"]');
      if (input) input.focus();
      return;
    }
    // Set isInMeeting to true and start Jitsi meeting
    setIsInMeeting(true);
    meetingStartTimeRef.current = Date.now();
    setShowTimeoutWarning(false);
    
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, 250000); // 4 mins 10 secs

    if (autoRedirectTimerRef.current) clearTimeout(autoRedirectTimerRef.current);
    autoRedirectTimerRef.current = setTimeout(() => {
      handleAutoRedirect();
    }, 300000); // 5 mins
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-color)', transition: 'background-color 0.3s' }}>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(250, 82, 82, 0.6); }
          70% { box-shadow: 0 0 0 8px rgba(250, 82, 82, 0); }
          100% { box-shadow: 0 0 0 0 rgba(250, 82, 82, 0); }
        }
        .recording-pulse-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #fa5252;
          animation: pulse 1s infinite;
        }
        .recording-pulse-glow {
          animation: pulse-red 1.5s infinite;
        }
      `}</style>

      {/* Header / Back Navigation */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <BackButton to="/community" label="Kembali ke Komunitas" />
      </div>

      <div className="container" style={{ maxWidth: showSidebar && isInMeeting ? '1400px' : '1000px', padding: '20px 24px 80px 24px', transition: 'max-width 0.3s ease' }}>
        
        {!isInMeeting ? (
          /* LOBBY VIEW */
          <div style={{ display: 'grid', gridTemplateColumns: windowWidth < 850 ? '1fr' : '1.2fr 1fr', gap: '40px', alignItems: 'start', marginTop: '20px' }}>
            
            {/* Promo Info Column */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(12, 166, 120, 0.1)', padding: '8px 16px', borderRadius: '24px', marginBottom: '24px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>
                <Sparkles size={16} />
                <span>Teknologi Komunikasi Hijau</span>
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '850', color: 'var(--text-main)', marginBottom: '16px', lineHeight: '1.2' }}>
                Bamboo Meeting
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '28px' }}>
                Platform ruang rapat, presentasi online, dan diskusi virtual instan terintegrasi. Terhubung dengan petani, komunitas, validator, dan pengembang secara real-time.
              </p>

              {/* Quick Topics List */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                  Topik Diskusi Cepat
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button 
                    onClick={() => handleQuickRoom('bmc-konservasi-hutan')} 
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '30px', padding: '6px 14px', fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    🌲 Konservasi Bambu
                  </button>
                  <button 
                    onClick={() => handleQuickRoom('bmc-teknologi-sensor-iot')} 
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '30px', padding: '6px 14px', fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    🛰️ Sensor & IoT
                  </button>
                  <button 
                    onClick={() => handleQuickRoom('bmc-transaksi-pasar-marketplace')} 
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '30px', padding: '6px 14px', fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    🛒 Pasar Marketplace
                  </button>
                  <button 
                    onClick={() => handleQuickRoom('bmc-rapat-koperasi-kodiba')} 
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '30px', padding: '6px 14px', fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    🤝 Koperasi KoDiBa
                  </button>
                </div>
              </div>

              {/* Informative Alert */}
              <div style={{ background: 'rgba(12, 166, 120, 0.05)', border: '1px solid rgba(12, 166, 120, 0.15)', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <AlertCircle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  <strong>Bebas Hambatan & Tanpa Instalasi:</strong> Pertemuan menggunakan teknologi peer-to-peer terenkripsi langsung di browser Anda. Mendukung video HD, obrolan suara, dan presentasi layar (screen sharing).
                </div>
              </div>

              {/* Scheduling Card */}
              <div style={{ 
                background: 'var(--bg-card)', 
                borderRadius: '24px', 
                border: '1px solid var(--border-color)', 
                padding: '30px', 
                marginTop: '32px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0, fontWeight: '800' }}>Jadwalkan Rapat & Bagikan Agenda 🗓️</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Buat undangan dan bagikan jadwal ke media sosial</p>
                  </div>
                </div>

                <form onSubmit={handleGenerateSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                      Agenda / Topik Diskusi
                    </label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Pembahasan Sertifikasi Karbon Tahap 2"
                      value={scheduleAgenda}
                      onChange={(e) => setScheduleAgenda(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                      Pilih Waktu Rapat
                    </label>
                    
                    {/* Presets Row */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const twoDays = new Date();
                          twoDays.setDate(twoDays.getDate() + 2);
                          twoDays.setHours(10, 0, 0, 0); // default to 10:00 AM
                          const tzOffset = twoDays.getTimezoneOffset() * 60000;
                          setScheduleDateTime(new Date(twoDays.getTime() - tzOffset).toISOString().slice(0, 16));
                        }}
                        style={{
                          flex: 1,
                          background: 'var(--bg-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          color: 'var(--text-main)',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                      >
                        ⏱️ 2 Hari Lagi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const oneWeek = new Date();
                          oneWeek.setDate(oneWeek.getDate() + 7);
                          oneWeek.setHours(10, 0, 0, 0);
                          const tzOffset = oneWeek.getTimezoneOffset() * 60000;
                          setScheduleDateTime(new Date(oneWeek.getTime() - tzOffset).toISOString().slice(0, 16));
                        }}
                        style={{
                          flex: 1,
                          background: 'var(--bg-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          color: 'var(--text-main)',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                      >
                        🗓️ 1 Minggu Lagi
                      </button>
                    </div>

                    <input 
                      type="datetime-local" 
                      value={scheduleDateTime}
                      onChange={(e) => setScheduleDateTime(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                      Ruang Rapat Tujuan
                    </label>
                    <input 
                      type="text" 
                      placeholder="Contoh: rapat-evaluasi-karbon"
                      value={scheduleRoomName}
                      onChange={(e) => setScheduleRoomName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Share2 size={16} />
                    <span>Buat Undangan Rapat</span>
                  </button>
                </form>

                {/* Generated Invite Card */}
                {generatedInvite && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(12, 166, 120, 0.05)',
                    border: '1px solid rgba(12, 166, 120, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>
                      🎉 Undangan Rapat Berhasil Dibuat!
                    </div>
                    
                    <pre style={{
                      margin: 0,
                      padding: '10px',
                      background: 'var(--bg-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      color: 'var(--text-main)',
                      maxHeight: '150px',
                      overflowY: 'auto'
                    }}>
                      {generatedInvite.text}
                    </pre>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedInvite.text).then(() => {
                            setInviteCopied(true);
                            setTimeout(() => setInviteCopied(false), 2000);
                          });
                        }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: inviteCopied ? 'rgba(64, 192, 87, 0.1)' : 'var(--bg-color)',
                          border: inviteCopied ? '1px solid #40c057' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: inviteCopied ? '#40c057' : 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {inviteCopied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{inviteCopied ? 'Disalin!' : 'Salin Teks'}</span>
                      </button>

                      <button
                        onClick={() => {
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(generatedInvite.text)}`, '_blank');
                        }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: '#25D366',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <Share2 size={14} />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => {
                          window.open(`https://t.me/share/url?url=${encodeURIComponent(generatedInvite.link)}&text=${encodeURIComponent(generatedInvite.text)}`, '_blank');
                        }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: '#0088cc',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <Share2 size={14} />
                        <span>Telegram</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Form Lobby Column Wrapper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Form Lobby Card */}
              <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '40px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: '800' }}>Konfigurasi Rapat</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Masukkan nama dan pilih ruang rapat</p>
                  </div>
                </div>

                <form onSubmit={handleStartMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                      Nama Tampilan Anda
                    </label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Budi Santoso"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '600' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        Nama Ruang Rapat
                      </label>
                      <button 
                        type="button" 
                        onClick={handleRandomRoom}
                        style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        🔄 Acak Ruang
                      </button>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Contoh: rapat-koperasi"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '600' }}
                    />
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      💡 Anda bisa mengacak atau mengetik nama ruang rapat kustom Anda sendiri.
                    </span>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!roomName.trim()) {
                          alert('Nama ruang rapat tidak boleh kosong.');
                          return;
                        }
                        const cleanRoom = roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
                        window.open(`https://meet.jit.si/${cleanRoom}`, '_blank');
                      }}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        borderRadius: '12px', 
                        background: 'none',
                        border: '1.5px solid var(--primary)',
                        color: 'var(--primary)',
                        fontWeight: '800', 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(12, 166, 120, 0.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <Share2 size={16} />
                      <span>Gabung Rapat Sekarang (Durasi Tanpa Batas)</span>
                    </button>

                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={!jitsiLoaded}
                      style={{ 
                        width: '100%', 
                        padding: '14px', 
                        borderRadius: '12px', 
                        fontWeight: '800', 
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: jitsiLoaded ? 1 : 0.6,
                        cursor: jitsiLoaded ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <Video size={18} />
                      <span>{jitsiLoaded ? 'Gabung Rapat Sekarang (Durasi 5 Menit)' : 'Memuat Modul Video...'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* LIST DAFTAR MEETING TERJADWAL */}
              <div style={{ 
                background: 'var(--bg-card)', 
                borderRadius: '24px', 
                border: '1px solid var(--border-color)', 
                padding: '30px', 
                boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(12, 166, 120, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: 0, fontWeight: '800' }}>Jadwal Rapat Komunitas 🌱</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Klik untuk langsung bergabung ke ruang rapat</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {scheduledMeetings.map((meeting) => (
                    <div 
                      key={meeting.id}
                      onClick={() => handleJoinScheduledMeeting(meeting)}
                      style={{
                        background: 'var(--bg-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 15px rgba(12, 166, 120, 0.06)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px', paddingRight: '20px', lineHeight: '1.4' }}>
                        {meeting.agenda}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📅</span>
                          <span>{meeting.formattedDate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🔑 Ruang:</span>
                          <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 'bold' }}>{meeting.roomName}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                          <span>👤 Host: {meeting.creatorName}</span>
                        </div>
                      </div>

                      <div style={{
                        position: 'absolute',
                        right: '12px',
                        bottom: '12px',
                        background: 'rgba(12, 166, 120, 0.1)',
                        color: 'var(--primary)',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: '800'
                      }}>
                        Gabung ➔
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ACTIVE MEETING VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
            
            {/* Top Info Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'var(--bg-card)', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>
                  Ruang Rapat Aktif
                </span>
                <span style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{roomName}</span>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#40c057', animation: 'pulse 1.5s infinite' }}></span>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Record Meeting Button */}
                <button
                  onClick={handleToggleRecording}
                  className={isRecording ? 'recording-pulse-glow' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isRecording ? 'rgba(250, 82, 82, 0.1)' : 'var(--bg-color)',
                    border: isRecording ? '1.5px solid #fa5252' : '1px solid var(--border-color)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: isRecording ? '#fa5252' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isRecording ? (
                    <span className="recording-pulse-dot" />
                  ) : (
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                  )}
                  <span>{isRecording ? 'Sedang Merekam' : 'Mulai Rekam'}</span>
                </button>

                {/* AI Minutes Sidebar Toggle */}
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: showSidebar ? 'rgba(12, 166, 120, 0.1)' : 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: showSidebar ? 'var(--primary)' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Sparkles size={16} />
                  <span>{showSidebar ? 'Sembunyikan Notulen AI' : 'Asisten Notulen AI'}</span>
                </button>

                {/* Copy Invite Link */}
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: copied ? 'rgba(64, 192, 87, 0.1)' : 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: copied ? '#40c057' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                  <span>{copied ? 'Tautan Disalin!' : 'Undang Pegiat'}</span>
                </button>

                {/* External Jitsi Button */}
                <button
                  type="button"
                  onClick={() => {
                    const cleanRoom = roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    window.open(`https://meet.jit.si/${cleanRoom}`, '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: '1.5px solid #228be6',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: '#228be6',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(34, 139, 230, 0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <Share2 size={16} />
                  <span>Buka di Tab Baru (Tanpa Batas)</span>
                </button>

                {/* Exit Meeting Button */}
                <button
                  onClick={handleLeaveMeeting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#fa5252',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e03131'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fa5252'}
                >
                  <LogOut size={16} />
                  <span>Keluar Rapat</span>
                </button>
              </div>
            </div>

            {/* Grid Container for Meeting + Sidebar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: showSidebar && windowWidth >= 1024 ? '1fr 380px' : '1fr',
              gap: '24px',
              alignItems: 'start'
            }}>
              
              {/* Left Column: Meeting Frame & Tips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
                {showTimeoutWarning && (
                  <div 
                    onClick={() => {
                      const cleanRoom = roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
                      window.open(`https://meet.jit.si/${cleanRoom}`, '_blank');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #f08c00 0%, #ffc078 100%)',
                      color: '#5c3e00',
                      padding: '14px 20px',
                      borderRadius: '16px',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '1px solid #ffe066',
                      boxShadow: '0 8px 24px rgba(240, 140, 0, 0.15)'
                    }}
                  >
                    <span>⚠️ Batas waktu iframe Jitsi hampir habis (5 menit). Klik di sini untuk melanjutkan rapat di Tab Baru secara gratis & tanpa batas!</span>
                  </div>
                )}
                {/* Jitsi Meet API Frame Container */}
                <div 
                  ref={jitsiContainerRef} 
                  id="jitsi-container"
                  style={{ 
                    width: '100%', 
                    background: '#1e1e24', 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    border: '1px solid var(--border-color)',
                    minHeight: '600px'
                  }}
                />

                {/* Quick Warning / Help Tips */}
                <div style={{ display: 'grid', gridTemplateColumns: windowWidth < 768 ? '1fr' : '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Users size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      <strong>Ingin mengundang peserta lain?</strong> Klik tombol "Undang Pegiat" di atas, lalu bagikan tautannya. Mereka dapat bergabung langsung menggunakan browser apapun tanpa login.
                    </span>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <HelpCircle size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      <strong>Presentasi Layar:</strong> Klik tombol ikon layar monitor di toolbar kontrol Jitsi di bawah video untuk mempresentasikan slide atau dokumen teknis.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Minutes Sidebar */}
              {showSidebar && (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  maxHeight: '750px',
                  position: 'sticky',
                  top: '100px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
                  overflowY: 'auto'
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="var(--primary)" />
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: '800', margin: 0 }}>
                        Asisten Notulen AI 🤖
                      </h3>
                    </div>
                    {windowWidth < 1024 && (
                      <button
                        onClick={() => setShowSidebar(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        Tutup
                      </button>
                    )}
                  </div>
                  
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                    Asisten ini menggunakan Web Speech API untuk transkripsi dan Llama 3 bertenaga Groq AI untuk ringkasan rapat.
                  </p>

                  <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: 0 }} />

                  {/* Transcription Controls */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        Transkripsi Langsung
                      </span>
                      {isTranscribing && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fa5252', fontWeight: '700' }}>
                          <span className="recording-pulse-dot" /> Mendengarkan...
                        </span>
                      )}
                    </div>

                    {!isTranscribing ? (
                      <button
                        onClick={startTranscription}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'var(--primary)',
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          fontWeight: '800',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Mic size={14} />
                        <span>Mulai Transkripsi</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopTranscription}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'none',
                          border: '1.5px solid #fa5252',
                          borderRadius: '12px',
                          color: '#fa5252',
                          fontWeight: '800',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <MicOff size={14} />
                        <span>Hentikan Transkripsi</span>
                      </button>
                    )}
                  </div>

                  {/* Transcript Log Window */}
                  <div style={{
                    background: 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px',
                    height: '200px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {transcriptLines.length === 0 ? (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '80px' }}>
                        Belum ada transkripsi percakapan.
                      </div>
                    ) : (
                      transcriptLines.map((line, idx) => (
                        <div key={idx} style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                          <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>[{line.time}]</span>
                          <strong style={{ color: line.speaker === 'Sistem' || line.speaker === 'Asisten AI' ? 'var(--primary)' : 'var(--text-main)', marginRight: '4px' }}>
                            {line.speaker}:
                          </strong>
                          <span style={{ color: 'var(--text-muted)' }}>{line.text}</span>
                        </div>
                      ))
                    )}
                    <div ref={transcriptEndRef} />
                  </div>

                  {/* Manual Catatan Input */}
                  <form onSubmit={handleSendManualNote} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Masukkan catatan manual..."
                      value={manualNote}
                      onChange={(e) => setManualNote(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-color)',
                        color: 'var(--text-main)',
                        fontSize: '0.8rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(12, 166, 120, 0.1)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Send size={14} />
                    </button>
                  </form>

                  <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: 0 }} />

                  {/* Summary Section */}
                  <div>
                    <button
                      onClick={generateAiSummary}
                      disabled={isLoadingSummary}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #12b886 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(12, 166, 120, 0.2)',
                        opacity: isLoadingSummary ? 0.7 : 1
                      }}
                    >
                      <FileText size={16} />
                      <span>{isLoadingSummary ? 'Merangkum dengan AI...' : 'Buat Notulen Rapat (AI)'}</span>
                    </button>
                  </div>

                  {aiSummary && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{
                        background: 'var(--bg-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '16px',
                        maxHeight: '300px',
                        overflowY: 'auto'
                      }}>
                        {renderMarkdown(aiSummary)}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiSummary).then(() => {
                              setSummaryCopied(true);
                              setTimeout(() => setSummaryCopied(false), 2000);
                            });
                          }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: summaryCopied ? 'rgba(64, 192, 87, 0.1)' : 'var(--bg-card)',
                            border: summaryCopied ? '1px solid #40c057' : '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: summaryCopied ? '#40c057' : 'var(--text-main)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          {summaryCopied ? <Check size={12} /> : <Copy size={12} />}
                          <span>{summaryCopied ? 'Disalin!' : 'Salin Notulen'}</span>
                        </button>

                        <button
                          onClick={handleDownloadSummary}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-main)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <Download size={12} />
                          <span>Unduh Notulen</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Post Meeting / Timeout Reconnect Modal */}
      {showPostMeetingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100005,
          padding: '20px'
        }}
        onClick={() => setShowPostMeetingModal(false)}
        >
          <div style={{
            background: 'var(--bg-card, #1c1c24)',
            border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            borderRadius: '28px',
            maxWidth: '460px',
            width: '100%',
            padding: '36px 30px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            color: 'var(--text-main, #ffffff)',
            textAlign: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(12, 166, 120, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: 'var(--primary, #0ca678)',
              border: '1px solid rgba(12, 166, 120, 0.25)'
            }}>
              <Video size={32} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '850', margin: '0 0 10px 0', color: 'var(--text-main)' }}>
              Sesi Rapat Tersemat Berakhir
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #a0aec0)', lineHeight: '1.6', margin: '0 0 28px 0' }}>
              Batas durasi 5 menit untuk sesi iframe gratis telah tercapai. Sistem telah mencoba membuka tab baru secara otomatis. Jika tidak terbuka, silakan klik tombol di bawah untuk melanjutkan rapat secara gratis tanpa batas waktu.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => {
                  const cleanRoom = roomName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
                  window.open(`https://meet.jit.si/${cleanRoom}`, '_blank');
                  setShowPostMeetingModal(false);
                }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, #12b886 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(12, 166, 120, 0.25)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Video size={16} />
                <span>Gabung Rapat di Tab Baru</span>
              </button>
              
              <button
                onClick={() => setShowPostMeetingModal(false)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: 'var(--bg-color, #13131a)',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  borderRadius: '16px',
                  color: 'var(--text-main, #ffffff)',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Kembali ke Lobby Rapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BambooMeetingPage;
