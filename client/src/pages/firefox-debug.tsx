import { useEffect, useState } from "react";

export default function FirefoxDebugPage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [autoReload, setAutoReload] = useState(5);

  useEffect(() => {
    const logs: string[] = [];
    
    // Informations système
    logs.push(`User Agent: ${navigator.userAgent}`);
    logs.push(`Screen: ${screen.width}x${screen.height}`);
    logs.push(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
    logs.push(`Connection: ${(navigator as any).connection?.effectiveType || 'Unknown'}`);
    logs.push(`Memory: ${(performance as any).memory?.usedJSHeapSize || 'N/A'} bytes`);
    logs.push(`Timestamp: ${new Date().toISOString()}`);
    
    // Test localStorage
    try {
      localStorage.setItem('test', '1');
      localStorage.removeItem('test');
      logs.push('LocalStorage: ✅ Fonctionnel');
    } catch (e) {
      logs.push(`LocalStorage: ❌ Erreur - ${e}`);
    }
    
    // Test fetch API
    logs.push('Début test API...');
    fetch('https://anime-sama-scraper.vercel.app/api/trending')
      .then(response => {
        logs.push(`API: ✅ Status ${response.status}`);
        setDebugInfo([...logs]);
      })
      .catch(error => {
        logs.push(`API: ❌ Erreur - ${error.message}`);
        setDebugInfo([...logs]);
      });
    
    setDebugInfo(logs);
    
    // Compteur auto-reload
    const timer = setInterval(() => {
      setAutoReload(prev => {
        if (prev <= 1) {
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #16213E 100%)',
      color: '#00F0FF',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '20px',
      overflow: 'auto',
      fontSize: '14px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img 
          src="/assets/atomic-logo-round.png" 
          alt="ATOMIC FLIX" 
          style={{
            width: '60px', 
            height: '60px', 
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '10px'
          }} 
        />
        <h1 style={{ fontSize: '20px', margin: '10px 0' }}>ATOMIC FLIX DEBUG</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Mode diagnostic Firefox iOS
        </p>
        <p style={{ 
          color: '#A855F7', 
          fontSize: '16px', 
          fontWeight: 'bold',
          marginTop: '20px'
        }}>
          Retour automatique dans {autoReload}s
        </p>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '16px', marginBottom: '15px', color: '#00F0FF' }}>
          📊 Informations Système
        </h2>
        {debugInfo.map((info, index) => (
          <div key={index} style={{
            padding: '5px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {info}
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'linear-gradient(90deg, #00F0FF, #A855F7)',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🏠 Retour Accueil
        </button>
        
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }}
          style={{
            background: 'linear-gradient(90deg, #FF6B6B, #FF8E53)',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🧹 Vider Cache
        </button>
        
        <button
          onClick={() => {
            const contact = 'atomictech228@gmail.com';
            const subject = 'ATOMIC FLIX - Problème Firefox iOS';
            const body = `Informations Debug:\n\n${debugInfo.join('\n')}`;
            window.location.href = `mailto:${contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }}
          style={{
            background: 'linear-gradient(90deg, #A855F7, #6366F1)',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📧 Signaler Bug
        </button>
      </div>

      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '12px'
      }}>
        Version Debug • Firefox iOS • {new Date().toLocaleString('fr-FR')}
      </div>
    </div>
  );
}