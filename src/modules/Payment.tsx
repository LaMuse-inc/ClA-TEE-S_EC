import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Payment() {
  const [method, setMethod] = useState<'convenience' | 'bank'>('convenience')
  const navigate = useNavigate()
  return (
    <div className="form">
      <h1>お支払い方法</h1>
      <label style={{display:'flex',alignItems:'center',gap:8,padding:8,border:'1px solid #e5e7eb',borderRadius:8}}>
        <input type="radio" name="pay" checked={method==='convenience'} onChange={()=>setMethod('convenience')} />
        コンビニ決済
      </label>
      <label style={{display:'flex',alignItems:'center',gap:8,padding:8,border:'1px solid #e5e7eb',borderRadius:8}}>
        <input type="radio" name="pay" checked={method==='bank'} onChange={()=>setMethod('bank')} />
        銀行振込
      </label>
      <button className="btn primary" onClick={()=>navigate(`/payment/confirm?method=${method}`)}>支払い手続きへ</button>
    </div>
  )
}