'use client'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  const generateReply = async () => {
    if (!email.trim()) {
      alert('Please paste an email first!')
      return
    }
    setLoading(true)
    setReply('')
    
    try {
      const res = await fetch('/api/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setReply(data.reply || 'Error: Failed to generate reply')
    } catch (e) {
      setReply('Error: Cannot connect to server')
    }
    setLoading(false)
  }

  return (
    <main style={{maxWidth: '700px', margin: '50px auto', padding: '20px', fontFamily: 'Arial'}}>
      <h1 style={{textAlign: 'center'}}>📧 Outlook AI Reply Generator</h1>
      <p style={{textAlign: 'center', color: '#666'}}>100% Free - Try it now</p>
      
      <textarea 
        placeholder="Paste your Outlook email here..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{width: '100%', height: '150px', padding: '12px', fontSize