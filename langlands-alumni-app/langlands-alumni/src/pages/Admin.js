import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { supabase } from '../supabase'

const S = {
  main: { maxWidth: 960, margin: '0 auto', padding: '28px 20px' },
  topBar: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 },
  statCard: { background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px 18px', textAlign:'center' },
  statNum: { fontFamily:'Playfair Display,serif', fontSize:26, color:'var(--navy)', fontWeight:700 },
  statLabel: { fontSize:11, textTransform:'uppercase', letterSpacing:0.8, color:'var(--text-muted)', marginTop:2 },
  toolbar: { display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' },
  searchWrap: { flex:1, minWidth:200, position:'relative' },
  searchInput: { fontSize:14, padding:'10px 12px 10px 36px', border:'1px solid var(--border)', borderRadius:6, background:'var(--white)', width:'100%', outline:'none', color:'var(--text)' },
  filterSelect: { fontSize:13, padding:'10px 12px', border:'1px solid var(--border)', borderRadius:6, background:'var(--white)', color:'var(--text)', cursor:'pointer', outline:'none' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  card: { background:'var(--white)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px 18px', position:'relative', transition:'border-color 0.15s' },
  cardHead: { display:'flex', alignItems:'center', gap:12, marginBottom:10 },
  name: { fontWeight:600, fontSize:15, color:'var(--navy)' },
  batch: { fontSize:12, color:'var(--text-muted)', marginTop:1 },
  badges: { display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 },
  detail: { fontSize:13, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:5, marginTop:4 },
  btnDanger: { position:'absolute', top:10, right:10, background:'none', border:'none', cursor:'pointer', color:'#ccc', fontSize:16, padding:2 },
  btnExport: { background:'var(--gold-dark)', color:'var(--white)', border:'none', fontSize:13, fontWeight:600, padding:'9px 18px', borderRadius:6, cursor:'pointer', display:'flex', alignItems:'center', gap:7 },
  btnLogout: { background:'transparent', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.2)', fontSize:12, padding:'7px 14px', borderRadius:6, cursor:'pointer' },
  modal: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 },
  modalCard: { background:'var(--white)', borderRadius:12, maxWidth:540, width:'100%', maxHeight:'85vh', overflowY:'auto' },
  modalHead: { background:'var(--navy)', padding:'16px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0 },
}

const BADGE = { Matric:{bg:'#e8f0fb',color:'#1a4b8a'}, FSc:{bg:'#e8f5eb',color:'#1a5e2a'}, Both:{bg:'var(--gold-light)',color:'var(--gold-dark)'} }

export default function Admin() {
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterGrad, setFilterGrad] = useState('')
  const [filterField, setFilterField] = useState('')
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const fetchAlumni = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('alumni').select('*').order('created_at', { ascending: false })
    setAlumni(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAlumni() }, [fetchAlumni])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this alumni record permanently?')) return
    await supabase.from('alumni').delete().eq('id', id)
    setAlumni(a => a.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filtered = alumni.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || [a.name,a.city,a.batch_matric,a.batch_fsc,a.employer,a.job_title,a.phone,a.email].some(v=>v&&v.toLowerCase().includes(q))
    const matchGrad = !filterGrad || a.graduate === filterGrad || (filterGrad !== 'Both' && a.graduate === 'Both')
    const matchField = !filterField || a.field === filterField
    return matchSearch && matchGrad && matchField
  })

  const stats = {
    total: alumni.length,
    matric: alumni.filter(a => a.graduate === 'Matric' || a.graduate === 'Both').length,
    fsc: alumni.filter(a => a.graduate === 'FSc' || a.graduate === 'Both').length,
    abroad: alumni.filter(a => a.country && a.country !== 'Pakistan').length,
  }

  const exportCSV = () => {
    if (!alumni.length) return
    const headers = ['Name','Father','DoB','Gender','Graduate','Matric Year','FSc Year','Department','Roll No','Phone','Email','City','Country','Address','Job Title','Employer','Field','Highest Edu','Achievements','Registered On']
    const rows = alumni.map(a => [a.name,a.father_name,a.dob,a.gender,a.graduate,a.batch_matric,a.batch_fsc,a.department,a.roll_no,a.phone,a.email,a.city,a.country,a.address,a.job_title,a.employer,a.field,a.highest_edu,a.achievements,a.created_at?.slice(0,10)].map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`))
    const csv = [headers.join(','),...rows.map(r=>r.join(','))].join('\n')
    const blob = new Blob([csv],{type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download=`langlands_alumni_${new Date().toISOString().slice(0,10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const initials = (name) => (name||'').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()

  const Avatar = ({a, size=46}) => a.photo_url
    ? <img src={a.photo_url} alt={a.name} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',border:'2px solid var(--gold-light)',flexShrink:0}}/>
    : <div style={{width:size,height:size,borderRadius:'50%',background:'var(--navy)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Playfair Display,serif',fontSize:size*0.33,color:'var(--gold)',fontWeight:600,flexShrink:0}}>{initials(a.name)}</div>

  const DetailRow = ({icon, value}) => value ? (
    <div style={S.detail}><i className={`ti ti-${icon}`} style={{fontSize:13,color:'var(--gold)'}} aria-hidden="true"/>{value}</div>
  ) : null

  return (
    <>
      <Header subtitle="Admin Dashboard" />

      {/* Top bar */}
      <div style={{background:'var(--navy-mid)',borderBottom:'1px solid rgba(184,134,11,0.3)',padding:'10px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>
          <i className="ti ti-shield-check" style={{color:'var(--gold)',marginRight:6}} aria-hidden="true"/>Admin Panel
        </span>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <a href="/" target="_blank" rel="noreferrer" style={{fontSize:12,color:'rgba(255,255,255,0.5)',padding:'7px 14px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6}}>
            <i className="ti ti-external-link" style={{marginRight:5}} aria-hidden="true"/>Public Form
          </a>
          <button style={S.btnLogout} onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <main style={S.main}>
        {/* Stats */}
        <div style={S.statsGrid}>
          {[['stat-total',stats.total,'Total Alumni','users'],['stat-matric',stats.matric,'Matric Grads','school'],['stat-fsc',stats.fsc,'FSc Grads','certificate'],['stat-abroad',stats.abroad,'Abroad','world']].map(([id,num,label,icon])=>(
            <div key={id} style={S.statCard}>
              <i className={`ti ti-${icon}`} style={{fontSize:18,color:'var(--gold)',display:'block',marginBottom:4}} aria-hidden="true"/>
              <div style={S.statNum}>{num}</div>
              <div style={S.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <i className="ti ti-search" style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontSize:16}} aria-hidden="true"/>
            <input style={S.searchInput} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, city, employer, phone…"/>
          </div>
          <select style={S.filterSelect} value={filterGrad} onChange={e=>setFilterGrad(e.target.value)}>
            <option value="">All Graduates</option>
            <option>Matric</option><option>FSc</option><option>Both</option>
          </select>
          <select style={S.filterSelect} value={filterField} onChange={e=>setFilterField(e.target.value)}>
            <option value="">All Fields</option>
            {['Engineering','Medicine / Healthcare','Education / Academia','Government / Civil Service','Business / Entrepreneurship','IT / Software','Still Studying','Other'].map(f=><option key={f}>{f}</option>)}
          </select>
          <button style={S.btnExport} onClick={exportCSV}>
            <i className="ti ti-download" aria-hidden="true"/> Export CSV
          </button>
        </div>

        <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:14}}>Showing {filtered.length} of {alumni.length} alumni</p>

        {/* Grid */}
        {loading ? (
          <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-muted)'}}>
            <i className="ti ti-loader" style={{fontSize:32,display:'block',marginBottom:8}} aria-hidden="true"/>Loading alumni data…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-muted)'}}>
            <i className="ti ti-users" style={{fontSize:40,color:'var(--cream-dark)',display:'block',marginBottom:12}} aria-hidden="true"/>
            <p style={{fontSize:14}}>{alumni.length === 0 ? 'No alumni registered yet.' : 'No results match your search.'}</p>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map(a => {
              const batchInfo = [a.batch_matric&&`Matric ${a.batch_matric}`, a.batch_fsc&&`FSc ${a.batch_fsc}`].filter(Boolean).join(' · ') || '—'
              const badge = BADGE[a.graduate] || BADGE.Both
              return (
                <div key={a.id} style={S.card} onClick={()=>setSelected(a)}>
                  <button style={S.btnDanger} onClick={e=>{e.stopPropagation();handleDelete(a.id)}} title="Delete">
                    <i className="ti ti-trash" aria-hidden="true"/>
                  </button>
                  <div style={S.cardHead}>
                    <Avatar a={a}/>
                    <div>
                      <div style={S.name}>{a.name}</div>
                      <div style={S.batch}>{batchInfo}</div>
                    </div>
                  </div>
                  <div style={S.badges}>
                    <span style={{fontSize:11,fontWeight:600,padding:'3px 9px',borderRadius:20,textTransform:'uppercase',background:badge.bg,color:badge.color}}>{a.graduate}</span>
                    {a.department && <span style={{fontSize:11,fontWeight:500,padding:'3px 9px',borderRadius:20,background:'#f3f3f3',color:'#555'}}>{a.department}</span>}
                  </div>
                  {(a.job_title||a.employer) && <DetailRow icon="briefcase" value={[a.job_title,a.employer].filter(Boolean).join(' — ')}/>}
                  <DetailRow icon="map-pin" value={[a.city, a.country!=='Pakistan'?a.country:''].filter(Boolean).join(', ') || a.country}/>
                  <DetailRow icon="phone" value={a.phone}/>
                  {a.email && <DetailRow icon="mail" value={a.email}/>}
                  <p style={{fontSize:11,color:'#bbb',marginTop:8}}>Tap to view full profile</p>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selected && (
        <div style={S.modal} onClick={()=>setSelected(null)}>
          <div style={S.modalCard} onClick={e=>e.stopPropagation()}>
            <div style={S.modalHead}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <Avatar a={selected} size={40}/>
                <div>
                  <p style={{color:'var(--gold)',fontFamily:'Playfair Display,serif',fontSize:15,fontWeight:600}}>{selected.name}</p>
                  <p style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>{selected.graduate} Graduate</p>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:20,cursor:'pointer'}}>
                <i className="ti ti-x" aria-hidden="true"/>
              </button>
            </div>
            <div style={{padding:22}}>
              {[
                ['Personal', [['Father','father_name'],['Date of Birth','dob'],['Gender','gender']]],
                ['Academic', [['Graduate Level','graduate'],['Matric Year','batch_matric'],['FSc Year','batch_fsc'],['Department','department'],['Roll No','roll_no']]],
                ['Contact', [['Phone','phone'],['Email','email'],['City','city'],['Country','country'],['Address','address']]],
                ['Professional', [['Job Title','job_title'],['Employer','employer'],['Field','field'],['Highest Education','highest_edu'],['Achievements','achievements']]],
              ].map(([section, fields]) => (
                <div key={section}>
                  <p style={{fontSize:11,textTransform:'uppercase',letterSpacing:1.5,color:'var(--gold-dark)',fontWeight:600,margin:'18px 0 10px',paddingBottom:5,borderBottom:'1px solid var(--cream-dark)'}}>{section}</p>
                  {fields.map(([label, key]) => selected[key] ? (
                    <div key={key} style={{display:'flex',gap:12,marginBottom:8,fontSize:14}}>
                      <span style={{color:'var(--text-muted)',minWidth:130,flexShrink:0}}>{label}</span>
                      <span style={{color:'var(--text)',fontWeight:500}}>{selected[key]}</span>
                    </div>
                  ) : null)}
                </div>
              ))}
              <div style={{marginTop:20,display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button onClick={()=>handleDelete(selected.id)} style={{background:'var(--danger-bg)',color:'var(--danger)',border:'1px solid #fca5a5',fontSize:13,padding:'9px 16px',borderRadius:6,cursor:'pointer'}}>
                  <i className="ti ti-trash" aria-hidden="true"/> Delete
                </button>
                <button onClick={()=>setSelected(null)} style={{background:'var(--navy)',color:'var(--gold)',border:'1px solid var(--gold)',fontSize:13,padding:'9px 16px',borderRadius:6,cursor:'pointer'}}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
