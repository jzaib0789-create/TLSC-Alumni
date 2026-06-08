import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter email and password.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError('Invalid email or password.'); setLoading(false); return }
    navigate('/admin')
  }

  const inputStyle = { fontSize:14, color:'var(--text)', background:'var(--cream)', border:'1px solid var(--border)', borderRadius:6, padding:'12px 14px', outline:'none', width:'100%' }

  return (
    <>
      <Header subtitle="Admin Login" />
      <main style={{maxWidth:420, margin:'60px auto', padding:'0 24px'}}>
        <div style={{background:'var(--white)',borderRadius:'var(--radius)',border:'1px solid var(--border)',overflow:'hidden'}}>
          <div style={{background:'var(--navy)',padding:'18px 24px',display:'flex',alignItems:'center',gap:10}}>
            <i className="ti ti-lock" style={{color:'var(--gold)',fontSize:20}} aria-hidden="true"/>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:16,color:'var(--white)',fontWeight:600}}>Admin Access</h2>
          </div>
          <div style={{padding:28, display:'flex', flexDirection:'column', gap:16}}>
            {error && (
              <div style={{background:'var(--danger-bg)',border:'1px solid #fca5a5',borderRadius:6,padding:'12px 16px',color:'var(--danger)',fontSize:13,display:'flex',alignItems:'center',gap:8}}>
                <i className="ti ti-alert-circle" aria-hidden="true"/> {error}
              </div>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:0.5}}>Email</label>
              <input type="email" style={inputStyle} value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@langlands.edu.pk" onKeyDown={e=>e.key==='Enter'&&handleLogin()}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              <label style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:0.5}}>Password</label>
              <input type="password" style={inputStyle} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleLogin()}/>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{background:'var(--navy)',color:'var(--gold)',border:'1px solid var(--gold)',fontSize:14,fontWeight:600,letterSpacing:0.5,padding:'12px',borderRadius:6,cursor:'pointer',textTransform:'uppercase',marginTop:4,opacity:loading?0.7:1}}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </div>
        <p style={{textAlign:'center',fontSize:12,color:'var(--text-muted)',marginTop:16}}>
          <a href="/" style={{color:'var(--gold-dark)'}}>← Back to Registration Form</a>
        </p>
      </main>
    </>
  )
}
