import React from 'react'

export default function Header({ subtitle }) {
  return (
    <header style={{background:'var(--navy)',position:'relative',overflow:'hidden'}}>
      <div style={{
        position:'absolute',top:0,left:0,right:0,bottom:0,
        backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(184,134,11,0.04) 20px,rgba(184,134,11,0.04) 21px)'
      }}/>
      <div style={{position:'relative',display:'flex',alignItems:'center',gap:16,padding:'22px 28px',maxWidth:860,margin:'0 auto'}}>
        <div style={{width:58,height:58,background:'var(--gold)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:'3px solid rgba(255,255,255,0.12)'}}>
          <i className="ti ti-school" style={{fontSize:26,color:'var(--navy)'}} aria-hidden="true"/>
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
