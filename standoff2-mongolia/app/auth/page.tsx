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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMsg(error.message)
      return
    }

    router.replace('/home')
  }

  async function signUp() {
    setLoading(true)
    setMsg('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMsg(error.message)
      return
    }

    setMsg('Account created. Now press LOGIN.')
  }

  async function google() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/home`,
      },
    })
  }

  return (
    <main style={styles.main}>
      <p style={styles.kicker}>COMPETITIVE MOBILE MATCHES</p>

      <h1 style={styles.title}>
        STANDOFF 2<br />
        MONGOLIA
      </h1>

      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading} onClick={signIn} style={styles.redBtn}>
          LOGIN
        </button>

        <button disabled={loading} onClick={signUp} style={styles.darkBtn}>
          CREATE ACCOUNT
        </button>

        <button onClick={google} style={styles.whiteBtn}>
          CONTINUE WITH GOOGLE
        </button>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#080A0F',
    color: 'white',
    padding: '72px 20px',
    fontFamily: 'Arial, sans-serif',
  },
  kicker: {
    color: '#FF3A2F',
    fontWeight: 900,
    fontSize: 18,
    letterSpacing: 1,
  },
  title: {
    fontSize: 56,
    lineHeight: 0.95,
    fontWeight: 900,
    marginTop: 28,
    marginBottom: 40,
  },
  card: {
    background: '#10141D',
    borderRadius: 28,
    padding: 18,
    border: '1px solid rgba(255,255,255,.08)',
  },
  input: {
    width: '100%',
    padding: 18,
    marginBottom: 14,
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,.18)',
    background: '#111723',
    color: 'white',
    fontSize: 16,
    outline: 'none',
  },
  redBtn: {
    width: '100%',
    padding: 18,
    marginBottom: 14,
    borderRadius: 20,
    border: 0,
    background: '#FF3A2F',
    color: 'white',
    fontWeight: 900,
    fontSize: 16,
  },
  darkBtn: {
    width: '100%',
    padding: 18,
    marginBottom: 14,
    borderRadius: 20,
    border: 0,
    background: '#171D29',
    color: 'white',
    fontWeight: 900,
    fontSize: 16,
  },
  whiteBtn: {
    width: '100%',
    padding: 18,
    marginBottom: 14,
    borderRadius: 20,
    border: 0,
    background: 'white',
    color: 'black',
    fontWeight: 900,
    fontSize: 16,
  },
  msg: {
    color: '#FF3A2F',
    fontSize: 16,
    marginTop: 14,
  },
} as const
