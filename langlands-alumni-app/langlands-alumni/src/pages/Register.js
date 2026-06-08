import React, { useState } from 'react'
import Header from '../components/Header'
import { supabase } from '../supabase'

const S = {
  main: { maxWidth: 860, margin: '0 auto', padding: '32px 24px' },
  card: { background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' },
  cardHead: { background: 'var(--navy)', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 10 },
  cardHeadTitle: { fontFamily: 'Playfair Display,serif', fontSize: 16, color: 'var(--white)', fontWeight: 600 },
  body: { padding: '24px' },
  sectionTitle: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--gold-dark)', fontWeight: 600, margin: '24px 0 12px', paddingBottom: 6, borderBottom: '1px solid var(--cream-dark)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { fontSize: 14, color: 'var(--text)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', outline: 'none', width: '100%' },
  select: { fontSize: 14, color: 'var(--text)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', outline: 'none', width: '100%', cursor: 'pointer' },
  textarea: { fontSize: 14, color: 'var(--text)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', outline: 'none', width: '100%', minHeight: 70, resize: 'vertical' },
  radioGroup: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 },
  btnPrimary: { background: 'var(--navy)', color: 'var(--gold)', border: '1px solid var(--gold)', fontSize: 14, fontWeight: 600, letterSpacing: 0.5, padding: '11px 28px', borderRadius: 6, cursor: 'pointer', textTransform: 'uppercase' },
  btnSecondary: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--cream-dark)', fontSize: 13, padding: '11px 20px', borderRadius: 6, cursor: 'pointer' },
  successBox: { background: 'var(--success-bg)', border: '1px solid #b2d9c3', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--success)' },
  errorBox: { background: 'var(--danger-bg)', border: '1px solid #fca5a5', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--danger)' },
}

const INITIAL = { name:'', father_name:'', dob:'', gender:'', graduate:'', batch_matric:'', batch_fsc:'', department:'', roll_no:'', phone:'', email:'', city:'', country:'Pakistan', address:'', job_title:'', employer:'', field:'', highest_edu:'', achievements:'' }

export default function Register() {
  const [form, setForm] = useState(INITIAL)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Please enter your full name.'); return }
    if (!form.phone.trim()) { setError('Please enter your phone number.'); return }
    if (!form.graduate) { setError('Please select your graduate level.'); return }
    setError('')
    setSubmitting(true)

    try {
      let photo_url = null
      if (photo) {
        const ext = photo.name.split('.').pop()
        const fileName = `${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('alumni-photos').upload(fileName, photo, { upsert: true })
        if (!uploadError) {
          const { data } = supabase.storage.from('alumni-photos').getPublicUrl(fileName)
          photo_url = data.publicUrl
        }
      }

      const { error: insertError } = await supabase.from('alumni').insert([{ ...form, photo_url }])
      if (insertError) throw insertError

      setSuccess(true)
      setForm(INITIAL)
      setPhoto(null)
      setPhotoPreview(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      setError('Submission failed: ' + (err.message || 'Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const radioStyle = (val) => ({
    display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, cursor: 'pointer',
    padding: '9px 14px', border: `1px solid ${form.graduate === val ? 'var(--gold-dark)' : 'var(--border)'}`,
    borderRadius: 6, background: form.graduate === val ? 'var(--gold-light)' : 'var(--cream)',
    color: form.graduate === val ? 'var(--gold-dark)' : 'var(--text)', fontWeight: form.graduate === val ? 600 : 400
  })

  return (
    <>
      <Header subtitle="Alumni Registration — Chitral" />
      <main style={S.main}>
        {success && (
          <div style={S.successBox}>
            <i className="ti ti-circle-check" style={{fontSize:22}} aria-hidden="true"/>
            <div>
              <strong>Registration successful!</strong>
              <p style={{fontSize:13,marginTop:2}}>Your record has been saved. Thank you for registering.</p>
            </div>
          </div>
        )}
        {error && (
          <div style={S.errorBox}>
            <i className="ti ti-alert-circle" style={{fontSize:22}} aria-hidden="true"/>
            <p style={{fontSize:14}}>{error}</p>
          </div>
        )}

        <div style={S.card}>
          <div style={S.cardHead}>
            <i className="ti ti-id-badge" style={{color:'var(--gold)',fontSize:20}} aria-hidden="true"/>
            <h2 style={S.cardHeadTitle}>Alumni Registration Form</h2>
          </div>
          <div style={S.body}>

            <p style={{...S.sectionTitle, marginTop:0}}>Personal Information</p>
            <div style={S.grid}>
              <div style={S.field}>
                <label style={S.label}>Full Name *</label>
                <input style={S.input} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Ahmad Shah"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Father's Name</label>
                <input style={S.input} value={form.father_name} onChange={e=>set('father_name',e.target.value)} placeholder="e.g. Noor Mohammad"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Date of Birth</label>
                <input type="date" style={S.input} value={form.dob} onChange={e=>set('dob',e.target.value)}/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Gender</label>
                <select style={S.select} value={form.gender} onChange={e=>set('gender',e.target.value)}>
                  <option value="">— Select —</option>
                  <option>Male</option><option>Female</option><option>Prefer not to say</option>
                </select>
              </div>
              <div style={{...S.field, gridColumn:'1/-1'}}>
                <label style={S.label}>Profile Photo</label>
                <label style={{border:'2px dashed var(--border)',borderRadius:'var(--radius)',padding:20,textAlign:'center',cursor:'pointer',display:'block',background:'var(--cream)'}}>
                  {photoPreview
                    ? <img src={photoPreview} alt="preview" style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',border:'3px solid var(--gold)',display:'block',margin:'0 auto 8px'}}/>
                    : <i className="ti ti-camera" style={{fontSize:28,color:'var(--gold)',display:'block',marginBottom:6}} aria-hidden="true"/>
                  }
                  <p style={{fontSize:13,color:'var(--text-muted)'}}>{photo ? photo.name : 'Tap to upload a photo'}</p>
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{display:'none'}}/>
                </label>
              </div>
            </div>

            <p style={S.sectionTitle}>Academic Details</p>
            <div style={S.grid}>
              <div style={{...S.field, gridColumn:'1/-1'}}>
                <label style={S.label}>Graduate Level *</label>
                <div style={S.radioGroup}>
                  {['Matric','FSc','Both'].map(v=>(
                    <label key={v} style={radioStyle(v)} onClick={()=>set('graduate',v)}>
                      <input type="radio" name="graduate" value={v} checked={form.graduate===v} onChange={()=>set('graduate',v)} style={{accentColor:'var(--gold)'}}/> {v === 'Both' ? 'Both (Matric & FSc)' : `${v} Graduate`}
                    </label>
                  ))}
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>Matric Passing Year</label>
                <input type="number" style={S.input} value={form.batch_matric} onChange={e=>set('batch_matric',e.target.value)} placeholder="e.g. 2015" min="1950" max="2030"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>FSc Passing Year</label>
                <input type="number" style={S.input} value={form.batch_fsc} onChange={e=>set('batch_fsc',e.target.value)} placeholder="e.g. 2017" min="1950" max="2030"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Department / Stream</label>
                <select style={S.select} value={form.department} onChange={e=>set('department',e.target.value)}>
                  <option value="">— Select —</option>
                  <option>Science (Pre-Medical)</option><option>Science (Pre-Engineering)</option>
                  <option>Computer Science</option><option>Arts / Humanities</option>
                  <option>Commerce</option><option>General Science</option><option>Other</option>
                </select>
              </div>
              <div style={S.field}>
                <label style={S.label}>Roll Number (if known)</label>
                <input style={S.input} value={form.roll_no} onChange={e=>set('roll_no',e.target.value)} placeholder="e.g. 12345"/>
              </div>
            </div>

            <p style={S.sectionTitle}>Contact Information</p>
            <div style={S.grid}>
              <div style={S.field}>
                <label style={S.label}>Phone / WhatsApp *</label>
                <input type="tel" style={S.input} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="e.g. 0300-1234567"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Email Address</label>
                <input type="email" style={S.input} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="e.g. ahmad@email.com"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Current City</label>
                <input style={S.input} value={form.city} onChange={e=>set('city',e.target.value)} placeholder="e.g. Chitral, Peshawar"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Country</label>
                <select style={S.select} value={form.country} onChange={e=>set('country',e.target.value)}>
                  {['Pakistan','UAE','Saudi Arabia','UK','USA','Canada','Germany','Turkey','China','Other'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{...S.field, gridColumn:'1/-1'}}>
                <label style={S.label}>Full Address</label>
                <textarea style={S.textarea} value={form.address} onChange={e=>set('address',e.target.value)} placeholder="House, street, area, city…"/>
              </div>
            </div>

            <p style={S.sectionTitle}>Professional Information</p>
            <div style={S.grid}>
              <div style={S.field}>
                <label style={S.label}>Job Title / Designation</label>
                <input style={S.input} value={form.job_title} onChange={e=>set('job_title',e.target.value)} placeholder="e.g. Civil Engineer"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Employer / Organization</label>
                <input style={S.input} value={form.employer} onChange={e=>set('employer',e.target.value)} placeholder="e.g. WAPDA, AKF"/>
              </div>
              <div style={S.field}>
                <label style={S.label}>Professional Field</label>
                <select style={S.select} value={form.field} onChange={e=>set('field',e.target.value)}>
                  <option value="">— Select —</option>
                  {['Engineering','Medicine / Healthcare','Education / Academia','Government / Civil Service','Military / Police / Defence','Business / Entrepreneurship','Banking / Finance','IT / Software','Law','Media / Journalism','Agriculture','Still Studying','Other'].map(f=><option key={f}>{f}</option>)}
                </select>
              </div>
              <div style={S.field}>
                <label style={S.label}>Highest Education</label>
                <select style={S.select} value={form.highest_edu} onChange={e=>set('highest_edu',e.target.value)}>
                  <option value="">— Select —</option>
                  {["Matric","FSc / FA / ICS","Bachelor's","Master's","MPhil","PhD","Diploma / Certificate"].map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
              <div style={{...S.field, gridColumn:'1/-1'}}>
                <label style={S.label}>Notable Achievements (optional)</label>
                <textarea style={S.textarea} value={form.achievements} onChange={e=>set('achievements',e.target.value)} placeholder="Awards, publications, community work…"/>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:28}}>
              <button style={S.btnSecondary} onClick={()=>setForm(INITIAL)}>Clear</button>
              <button style={{...S.btnPrimary, opacity: submitting ? 0.7 : 1}} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting…' : <><i className="ti ti-check" aria-hidden="true"/> Submit Registration</>}
              </button>
            </div>
          </div>
        </div>

        <p style={{textAlign:'center',fontSize:12,color:'var(--text-muted)',marginTop:20}}>
          Langlands School &amp; College, Chitral &nbsp;·&nbsp; Admin? <a href="/admin/login" style={{color:'var(--gold-dark)',fontWeight:600}}>Sign in here</a>
        </p>
      </main>
    </>
  )
}
