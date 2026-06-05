'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function signIn() {
    setLoading(true)
    setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setMsg(error.message)
    router.replace('/home')
  }

  async function signUp() {
    setLoading(true)
    setMsg('')
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) return setMsg(error.message)
    setMsg('Account created. Now press LOGIN.')
  }

  async function google() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/home` },
    })
  }

  return (
    <main style={{ minHeight: '100vh', background: '#080A0F', color: 'white', padding: 20 }}>
      <p style={{ color: '#FF3A2F', fontWeight: 800 }}>COMPETITIVE MOBILE MATCHES</p>
      <h1 style={{ fontSize: 48, lineHeight: 1, fontWeight: 900 }}>
        STANDOFF 2<br />MONGOLIA
      </h1>

      <div style={{ marginTop: 30, background: '#10141D', borderRadius: 22, padding: 16 }}>
        <input style={input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

        <button style={redBtn} disabled={loading} onClick={signIn}>LOGIN</button>
        <button style={darkBtn} disabled={loading} onClick={signUp}>CREATE ACCOUNT</button>
        <button style={whiteBtn} onClick={google}>CONTINUE WITH GOOGLE</button>

        {msg && <p style={{ color: '#FF3A2F' }}>{msg}</p>}
      </div>
    </main>
  )
}

const input = {
  width: '100%',
  padding: 14,
  marginBottom: 10,
  borderRadius: 14,
  border: '1px solid #333',
  background: '#111723',
  color: 'white',
} as const

const redBtn = {
  width: '100%',
  padding: 14,
  marginBottom: 10,
  borderRadius: 14,
  border: 0,
  background: '#FF3A2F',
  color: 'white',
  fontWeight: 900,
} as const

const darkBtn = {
  ...redBtn,
  background: '#171D29',
}

const whiteBtn = {
  ...redBtn,
  background: 'white',
  color: 'black',
}
