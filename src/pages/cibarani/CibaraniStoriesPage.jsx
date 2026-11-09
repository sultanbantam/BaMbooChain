import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, User, Share2, Sparkles, ArrowRight, 
  CheckCircle2, Compass, Heart
} from 'lucide-react';
import CibaraniNavHeader from '../../components/cibarani/CibaraniNavHeader';
import { useCibaraniStore } from '../../services/cibarani/cibaraniStore';
import SocialInteractions from '../../components/SocialInteractions';

const CibaraniStoriesPage = () => {
  const navigate = useNavigate();
  const { stories } = useCibaraniStore();
  const [selectedStory, setSelectedStory] = useState(stories[0]);

  return (
    <div style={{ background: 'var(--bg-color, #f8fafc)', minHeight: '100vh', color: 'var(--text-main, #0f172a)', paddingBottom: '60px' }}>
      <CibaraniNavHeader />

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 16px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#047857', letterSpacing: '1px', textTransform: 'uppercase' }}>
            EDITORIAL & KISAH KEARIFAN
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '6px 0 10px' }}>
            Cerita & Dokumentasi Budaya Cibarani
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
            Membuka lembaran pengetahuan luhur tentang kedaulatan pangan, tradisi padi huma, dan filosofi hidup selaras dengan alam.
          </p>
        </div>

        {/* FEATURED STORY */}
        {selectedStory && (
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '28px',
            overflow: 'hidden',
            border: '1.5px solid var(--border-color, #cbd5e1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            marginBottom: '40px'
          }}>
            <div style={{ height: '360px', position: 'relative' }}>
              <img
                src={selectedStory.coverImage}
                alt={selectedStory.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '28px'
              }}>
                <div>
                  <span style={{ background: '#fbbf24', color: '#78350f', fontSize: '0.75rem', fontWeight: '900', padding: '4px 10px', borderRadius: '6px' }}>
                    {selectedStory.category}
                  </span>
                  <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '900', color: '#ffffff', margin: '10px 0 6px' }}>
                    {selectedStory.title}
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: '#d1fae5', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <span>Penulis: {selectedStory.author}</span>
                    <span>• {selectedStory.date}</span>
                    <span>• {selectedStory.readTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'var(--text-main, #1e293b)',
                whiteSpace: 'pre-line',
                marginBottom: '28px'
              }}>
                {selectedStory.content}
              </div>

              {/* SOCIAL INTERACTION PER STORY */}
              <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '20px' }}>
                <SocialInteractions
                  entityId={`cibarani_story_${selectedStory.id}`}
                  customShareTitle={`${selectedStory.title} - Cerita Cibarani`}
                  customShareUrl={`https://bamboochain.id/#/cibarani/stories`}
                />
              </div>
            </div>
          </div>
        )}

        {/* OTHER STORIES GRID */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', marginBottom: '16px' }}>
          Dokumentasi Lainnya
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {stories.map((st) => (
            <div
              key={st.id}
              onClick={() => setSelectedStory(st)}
              style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '20px',
                overflow: 'hidden',
                border: selectedStory?.id === st.id ? '2px solid #047857' : '1.5px solid var(--border-color, #cbd5e1)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ height: '160px', overflow: 'hidden' }}>
                <img
                  src={st.coverImage}
                  alt={st.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#047857', marginBottom: '4px' }}>
                  {st.category}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main, #0f172a)', margin: '0 0 6px' }}>
                  {st.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: '0 0 12px', flex: 1 }}>
                  {st.summary}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)', borderTop: '1px solid var(--border-color, #f1f5f9)', paddingTop: '8px' }}>
                  {st.date} • {st.readTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CibaraniStoriesPage;

