import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, Database, Sparkles, FileText, RefreshCw } from 'lucide-react';
import BackButton from '../../components/BackButton';
import { composeRagAnswer, getApprovedKnowledgeItems, searchKnowledge } from '../../utils/knowledgeService';
import { useLanguage } from '../../context/LanguageContext';

const starterPrompts = [
  'Apa sumber terverifikasi tentang bambu petung?',
  'Ringkas riset yang membahas karbon bambu',
  'Ada data tentang konstruksi bambu laminasi?',
  'Cari sumber tentang taksonomi bambu Indonesia'
];

const BambooBotPage = () => {
  const { language } = useLanguage();
  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Halo, saya BambuBot RAG. Saya menjawab dengan mencari sumber yang sudah diverifikasi admin di Knowledge Library.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const approvedItems = await getApprovedKnowledgeItems();
        setItems(approvedItems);
      } catch (error) {
        console.error('Failed to load approved knowledge:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const stats = useMemo(() => {
    const species = new Set(items.map((item) => item.species).filter(Boolean));
    return { sources: items.length, species: species.size };
  }, [items]);

  const askBot = async (question = input) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    setMessages((prev) => [...prev, { role: 'user', text: cleanQuestion }]);
    setInput('');
    setIsThinking(true);

    const results = await searchKnowledge(items, cleanQuestion, 5);
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

    let apiKey = openaiApiKey;
    
    // 🛡️ --- INTEGRASI AI SHIELD (VPS CONTABO) ---
    // Ganti endpoint ke IP server Anda untuk mengharuskan prompt melewati filter keamanan (PII & Prompt Injection).
    // let endpoint = 'http://62.169.23.77:8088/v1/firewall/analyze';
    let endpoint = 'http://62.169.23.77:8011/v1/chat/completions'; // 🛡️ AI Shield Proxy
    
    let model = 'gpt-4o-mini';

    const isOpenAiActive = (openaiApiKey && openaiApiKey !== 'PASTE_OPENAI_KEY_DISINI') || (groqApiKey && groqApiKey.startsWith('sk-'));
    const isGroqActive = groqApiKey && groqApiKey !== 'PASTE_GROQ_KEY_DISINI' && !groqApiKey.startsWith('sk-');

    if (isOpenAiActive) {
      if (groqApiKey && groqApiKey.startsWith('sk-')) {
        apiKey = groqApiKey;
      }
    } else if (isGroqActive) {
      apiKey = groqApiKey;
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      model = 'llama-3.3-70b-versatile';
    } else {
      apiKey = null;
    }

    let finalAnswer = '';
    let confidence = 'rendah';

    if (apiKey && results.length > 0) {
      try {
        const contextText = results.map(({ item, snippet }, idx) => {
          const authorInfo = [item.author, item.year].filter(Boolean).join(', ');
          return `[Konteks ${idx + 1}] Sumber: "${item.title}" ${authorInfo ? `(${authorInfo})` : ''}\nIsi Dokumen: ${snippet}\n`;
        }).join('\n');

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: language === 'id' 
                  ? 'Anda adalah BambuBot RAG, asisten kecerdasan buatan terverifikasi untuk Yayasan Sabumi Nusantara Jaya. Tugas Anda adalah menjawab pertanyaan pengguna secara ringkas, profesional, dan akurat dalam Bahasa Indonesia menggunakan konteks dokumen/sumber terverifikasi yang disediakan.\n\nAturan penting:\n1. Jawab HANYA menggunakan informasi dari konteks yang diberikan.\n2. Cantumkan rujukan secara eksplisit dalam kurung siku, misalnya [1] atau [2], merujuk pada nomor konteks sumber.\n3. Jika informasi tidak ada dalam konteks, katakan bahwa Anda tidak memiliki informasi yang cukup dalam Knowledge Library.\n4. Jawab dengan gaya bahasa ilmiah, edukatif, dan ramah.'
                  : `You are BambuBot RAG, a verified AI assistant for Sabumi Nusantara Jaya Foundation. Your task is to answer user questions concisely, professionally, and accurately in ${language === 'jp' ? 'Japanese' : 'English'} using the provided verified document/source context.\n\nImportant rules:\n1. Answer ONLY using the information from the provided context.\n2. Include references explicitly in square brackets, e.g., [1] or [2], referring to the source context number.\n3. If the information is not in the context, say that you do not have enough information in the Knowledge Library.\n4. Answer in a scientific, educational, and friendly tone.`
              },
              {
                role: 'user',
                content: language === 'id'
                  ? `Konteks Sumber:\n${contextText}\n\nPertanyaan: ${cleanQuestion}\n\nJawablah dengan merujuk konteks di atas secara ringkas:`
                  : `Source Context:\n${contextText}\n\nQuestion: ${cleanQuestion}\n\nAnswer referencing the context above concisely:`
              }
            ],
            temperature: 0.2,
            max_tokens: 800
          })
        });

        if (response.ok) {
          const data = await response.json();
          finalAnswer = data.choices[0].message.content;
          confidence = results[0].score >= 8 ? 'tinggi' : 'sedang';
        } else {
          throw new Error(`API returned status ${response.status}`);
        }
      } catch (err) {
        console.warn('[BambuBot] Groq LLM API failed. Falling back to static lexical answer:', err);
        const fallbackResponse = composeRagAnswer(cleanQuestion, results);
        finalAnswer = fallbackResponse.answer;
        confidence = fallbackResponse.confidence;
      }
    } else {
      const fallbackResponse = composeRagAnswer(cleanQuestion, results);
      finalAnswer = fallbackResponse.answer;
      confidence = fallbackResponse.confidence;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text: finalAnswer,
        confidence: confidence,
        sources: results.map(({ item, score }) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          fileUrl: item.fileUrl,
          sourceUrl: item.sourceUrl,
          score
        }))
      }
    ]);
    setIsThinking(false);
  };

  const reloadKnowledge = async () => {
    setIsLoading(true);
    try {
      setItems(await getApprovedKnowledgeItems());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="container" style={{ padding: '40px 24px 100px', maxWidth: '1100px' }}>
        <BackButton to="/bambupedia" />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '24px', marginTop: '24px', alignItems: 'start' }}>
          <aside style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '22px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(12,166,120,0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Bot size={28} />
            </div>
            <h1 style={{ fontSize: '1.7rem', margin: '0 0 8px', color: 'var(--text-main)' }}>BambuBot RAG</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
              Jawaban diambil dari Knowledge Library yang disetujui admin & divalidasi otomatis oleh AI (Sosial Media & Data Global).
            </p>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
              <div style={statStyle}><Database size={18} /> {stats.sources} sumber verified</div>
              <div style={statStyle}><Sparkles size={18} /> {stats.species} spesies berlabel</div>
            </div>
            <button onClick={reloadKnowledge} disabled={isLoading} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: '800', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={16} /> {isLoading ? 'Memuat...' : 'Muat Ulang Knowledge'}
            </button>

            <div style={{ marginTop: '22px' }}>
              <div style={{ fontWeight: '900', color: 'var(--text-main)', marginBottom: '10px' }}>Prompt cepat</div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {starterPrompts.map((prompt) => (
                  <button key={prompt} onClick={() => askBot(prompt)} style={{ textAlign: 'left', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-main)', cursor: 'pointer' }}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden', minHeight: '640px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <div style={{ fontWeight: '900', color: 'var(--text-main)' }}>Percakapan Berbasis Sumber</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>MVP lokal: lexical retrieval + kutipan sumber terverifikasi.</div>
              </div>
              <span style={{ padding: '6px 10px', borderRadius: '999px', background: items.length ? '#ebfbee' : '#fff9db', color: items.length ? '#2b8a3e' : '#e67700', fontWeight: '900', fontSize: '0.75rem' }}>
                {items.length ? 'READY' : 'EMPTY KB'}
              </span>
            </div>

            <div style={{ flex: 1, padding: '22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((message, index) => (
                <div key={index} style={{ alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: message.role === 'user' ? 'var(--primary)' : 'var(--bg-secondary)',
                    color: message.role === 'user' ? 'white' : 'var(--text-main)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                  }}>
                    {message.text}
                  </div>

                  {message.confidence && (
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Confidence: <strong>{message.confidence}</strong>
                    </div>
                  )}

                  {message.sources?.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'grid', gap: '6px' }}>
                      {message.sources.map((source) => (
                        <a key={source.id} href={source.fileUrl || source.sourceUrl || '#'} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '800' }}>
                          <FileText size={14} /> {source.title} <span style={{ color: 'var(--text-muted)' }}>score {source.score}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isThinking && (
                <div style={{ alignSelf: 'flex-start', padding: '12px 14px', borderRadius: '16px', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  Mencari sumber terverifikasi...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={(event) => { event.preventDefault(); askBot(); }} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tanyakan sesuatu tentang bambu..." style={{ flex: 1, padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }} />
              <button type="submit" disabled={isThinking || isLoading} style={{ width: '52px', borderRadius: '14px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={20} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

const statStyle = {
  padding: '12px',
  borderRadius: '12px',
  background: 'var(--bg-secondary)',
  color: 'var(--text-main)',
  fontWeight: '800',
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
};

export default BambooBotPage;

