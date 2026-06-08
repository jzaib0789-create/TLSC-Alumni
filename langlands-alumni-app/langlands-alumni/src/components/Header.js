 import React from 'react'

export default function Header({ subtitle }) {
  return (
    <header style={{background:'var(--navy)',position:'relative',overflow:'hidden'}}>
      <div style={{
        position:'absolute',top:0,left:0,right:0,bottom:0,
        backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(184,134,11,0.04) 20px,rgba(184,134,11,0.04) 21px)'
      }}/>
      <div style={{position:'relative',display:'flex',alignItems:'center',gap:16,padding:'22px 28px',maxWidth:860,margin:'0 auto'}}>
        <div style={{width:62,height:62,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'2px solid var(--gold)',background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <img src="/logo.jpg" alt="Langlands School Logo" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </div>
        <div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:20,color:'var(--gold)',letterSpacing:0.5}}>
            Langlands School &amp; College
          </h1>
          <p style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:2,letterSpacing:1,textTransform:'uppercase',fontWeight:300}}>
            {subtitle || 'Alumni Registry — Chitral'}
          </p>
        </div>
      </div>
    </header>
  )
}
