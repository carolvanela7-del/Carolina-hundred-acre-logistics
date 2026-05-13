import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleLogin = async () => {
    setError(''); setLoading(true);
    try {
      const data = await authService.login(email, password);
      navigate(data.role === 'Admin' ? '/admin' : '/driver');
    } catch {
      setError('Email o contraseña incorrectos');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#FFF5E6', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:"'Helvetica Neue', Arial, sans-serif", fontWeight:300 }}>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          40% { transform: translateY(-12px); }
          60% { transform: translateY(-6px); }
        }
        @keyframes bearPeek {
          0%, 60% { transform: translateY(30px); opacity: 0; }
          75%, 100% { transform: translateY(0px); opacity: 1; }
        }
      `}</style>

      <div style={{ background:'white', borderRadius:16, padding:32, width:300, boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ position:'relative', height:70, display:'flex', alignItems:'flex-end', justifyContent:'center', marginBottom:8 }}>
            <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', zIndex:2, overflow:'hidden', height:36, width:40 }}>
              <div style={{ fontSize:24, lineHeight:1, animation:'bearPeek 3s ease-in-out infinite' }}>🐻</div>
            </div>
            <div style={{ fontSize:48, animation:'bounce 3s ease-in-out infinite', zIndex:1, lineHeight:1 }}>🍯</div>
          </div>
          <p style={{ margin:'8px 0 4px', fontSize:19, color:'#412402', fontWeight:300, letterSpacing:'0.3px' }}>Hundred Acre Logistics</p>
          <p style={{ color:'#aaa', fontSize:12, margin:0, fontWeight:300 }}>Ingresa al sistema del bosque</p>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, color:'#aaa', fontWeight:300, display:'block', marginBottom:5 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="rabbit@hundredacre.com"
            style={{ width:'100%', padding:'10px 12px', border:'1px solid #e8e8e8', borderRadius:8, fontSize:13, fontWeight:300, boxSizing:'border-box', background:'#f9fbff', outline:'none' }}
          />
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, color:'#aaa', fontWeight:300, display:'block', marginBottom:5 }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            style={{ width:'100%', padding:'10px 12px', border:'1px solid #e8e8e8', borderRadius:8, fontSize:13, fontWeight:300, boxSizing:'border-box', background:'#f9fbff', outline:'none' }}
          />
        </div>

        {error && <p style={{ color:'red', fontSize:12, margin:'0 0 10px', textAlign:'center' }}>{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width:'100%', padding:12, background:'#EF9F27', color:'white', border:'none', borderRadius:8, fontWeight:300, fontSize:14, textAlign:'center', letterSpacing:'0.3px', cursor:'pointer' }}>
          {loading ? 'Entrando...' : 'Entrar al bosque 🌳'}
        </button>

        <div style={{ marginTop:16, padding:12, background:'#FAEEDA', borderRadius:8, fontSize:11, color:'#633806', fontWeight:300, lineHeight:2, textAlign:'center' }}>
          Demo:<br/>
          🐰 rabbit@hundredacre.com / honey123<br/>
          🐯 tigger@hundredacre.com / honey123
        </div>

        <p style={{ textAlign:'center', marginTop:14, fontSize:11, color:'#aaa', fontWeight:300 }}>
          ¿Sos cliente?{' '}
          <span onClick={() => navigate('/')} style={{ color:'#EF9F27', cursor:'pointer' }}>
            Rastreá tu paquete
          </span>
        </p>
      </div>
    </div>
  );
}