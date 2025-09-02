import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function PaymentConfirm() {
  const q = useQuery()
  const method = (q.get('method') as 'convenience' | 'bank') ?? 'convenience'
  const navigate = useNavigate()

  return (
    <div className="form">
      <h1>お支払い手続き</h1>
      {method === 'convenience' ? (
        <div>
          <p>コンビニでのお支払い手続きを行います。</p>
          <p>お支払い番号は以下です：</p>
          <div style={{border:'1px solid #e5e7eb',padding:'12px',borderRadius:6,margin:'8px 0',fontWeight:700}}>1234-5678-9012</div>
          <p>発行から3日以内にお支払いください。</p>
        </div>
      ) : (
        <div>
          <p>銀行振込でのお支払い手続きを行います。</p>
          <p>お振込先：</p>
          <div style={{border:'1px solid #e5e7eb',padding:'12px',borderRadius:6,margin:'8px 0'}}>
            銀行名：ミニマル銀行 本店営業部<br/>
            口座種別：普通<br/>
            口座番号：1234567<br/>
            口座名義：カ）クラティーズ
          </div>
          <p>振込手数料はご負担ください。</p>
        </div>
      )}
      <button className="btn primary" onClick={()=> navigate('/complete')}>完了する</button>
    </div>
  )
}