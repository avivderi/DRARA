import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DRARA — AI Co-Founder Platform',
  description: 'Find your co-founder. Build your startup. All in one place.',
};

interface HealthStatus {
  status: 'ok' | 'error';
  service?: string;
  timestamp?: string;
  message?: string;
}

async function getApiHealth(): Promise<HealthStatus> {
  try {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/health`, {
      next: { revalidate: 30 }, // recheck every 30s
    });
    if (!res.ok) return { status: 'error', message: `HTTP ${res.status}` };
    return res.json() as Promise<HealthStatus>;
  } catch {
    return { status: 'error', message: 'API unreachable' };
  }
}

export default async function HomePage() {
  const health = await getApiHealth();

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '24px',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>
        🚀 <span style={{ color: '#a78bfa' }}>DRARA</span>
      </h1>
      <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
        AI Co-Founder &amp; Idea Protection Platform
      </p>

      <div
        style={{
          background: '#1e1e2e',
          border: '1px solid #2d2d44',
          borderRadius: '12px',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem',
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: health.status === 'ok' ? '#4ade80' : '#f87171',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span>
          API:{' '}
          <strong style={{ color: health.status === 'ok' ? '#4ade80' : '#f87171' }}>
            {health.status === 'ok' ? 'Online' : `Offline — ${health.message ?? ''}`}
          </strong>
          {health.timestamp && (
            <span style={{ color: '#64748b', marginLeft: 8 }}>
              {new Date(health.timestamp).toLocaleTimeString()}
            </span>
          )}
        </span>
      </div>

      <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>
        Module 1 — Core Infrastructure ✅
      </p>
    </main>
  );
}
