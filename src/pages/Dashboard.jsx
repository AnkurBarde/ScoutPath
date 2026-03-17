function Dashboard() {
  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2a3a 0%, #2ecc71 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚜️</div>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '800',
          letterSpacing: '-1px',
          marginBottom: '16px'
        }}>
          ScoutPath
        </h1>
        <p style={{
          fontSize: '20px',
          fontWeight: '400',
          opacity: '0.85',
          maxWidth: '480px',
          margin: '0 auto 32px'
        }}>
          Know where you are. Know what's next. Get to Eagle.
        </p>
        <a href="/rank-tracker" style={{
          backgroundColor: 'white',
          color: '#1a2a3a',
          padding: '14px 32px',
          borderRadius: '30px',
          fontWeight: '800',
          fontSize: '16px',
          textDecoration: 'none',
          display: 'inline-block',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          Get Started →
        </a>
      </div>

      {/* Feature Cards */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: '800',
          marginBottom: '40px',
          color: '#1a2a3a'
        }}>
          Everything you need to reach Eagle
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {[
            { emoji: '🏅', title: 'Rank Tracker', desc: 'Check off requirements and see your progress toward the next rank.', href: '/rank-tracker' },
            { emoji: '🎖️', title: 'Merit Badges', desc: 'Track required and elective badges. See exactly how many you need.', href: '/badges' },
            { emoji: '🤖', title: 'AI Advisor', desc: 'Get personalized suggestions on the easiest requirements to knock out next.', href: '/advisor' },
            { emoji: '🦅', title: 'Eagle Roadmap', desc: 'A full timeline from your current rank to Eagle with every step laid out.', href: '/eagle' },
            { emoji: '🏕️', title: 'Activity Log', desc: 'Log campouts, hikes, and service hours. Generate a printable summary.', href: '/log' },
            { emoji: '👥', title: 'Leader Tools', desc: 'Export your progress as a PDF to share with your Scoutmaster.', href: '/leader' },
          ].map(card => (
            <a
              key={card.title}
              href={card.href}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '28px 24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                height: '100%'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{card.emoji}</div>
                <h3 style={{ fontWeight: '800', fontSize: '18px', marginBottom: '8px', color: '#1a2a3a' }}>{card.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{card.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '30px',
        color: '#999',
        fontSize: '13px'
      }}>
        ScoutPath — built for Scouts, by a Scout
      </div>

    </div>
  )
}

export default Dashboard