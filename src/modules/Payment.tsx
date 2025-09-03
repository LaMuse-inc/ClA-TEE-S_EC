import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type PaymentMethod = 'stripe' | 'convenience' | 'bank'

export default function Payment() {
  const [method, setMethod] = useState<PaymentMethod>('stripe')
  const [orderData, setOrderData] = useState<any>(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    const savedOrderData = sessionStorage.getItem('orderData')
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    } else {
      // 注文データがない場合はホームに戻る
      navigate('/')
    }
  }, [])
  
  if (!orderData) {
    return <div className="form">読み込み中...</div>
  }
  
  const handlePayment = () => {
    if (method === 'stripe') {
      // Stripe決済の処理
      handleStripePayment()
    } else {
      // 従来の決済方法
      navigate(`/payment/confirm?method=${method}`)
    }
  }
  
  const handleStripePayment = async () => {
    try {
      // 実際のStripe実装では、ここでStripe APIを呼び出します
      // 今回はデモ用の処理
      const paymentData = {
        ...orderData,
        paymentMethod: 'stripe',
        paymentId: 'demo_payment_' + Date.now()
      }
      
      // 決済処理のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 決済完了後の処理
      sessionStorage.setItem('paymentResult', JSON.stringify(paymentData))
      navigate('/complete')
    } catch (error) {
      alert('決済処理中にエラーが発生しました。もう一度お試しください。')
    }
  }
  
  return (
    <div className="form">
      <h1>お支払い方法</h1>
      
      {/* 注文内容の確認 */}
      <div style={{background:'#f9fafb', padding:'16px', borderRadius:'8px', margin:'16px 0'}}>
        <h3 style={{margin:'0 0 12px 0'}}>注文内容</h3>
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px'}}>
          <img src={orderData.product.image} alt={orderData.product.name} style={{width:'48px', height:'48px'}} />
          <div>
            <div style={{fontWeight:'600'}}>{orderData.product.name}</div>
            <div style={{color:'#6B7280', fontSize:'14px'}}>数量: {orderData.qty}枚</div>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <span style={{fontWeight:'700', fontSize:'18px'}}>合計: ¥{orderData.total.toLocaleString()}</span>
        </div>
      </div>
      
      {/* 決済方法選択 */}
      <div style={{margin:'24px 0'}}>
        <label style={{display:'flex',alignItems:'center',gap:8,padding:12,border:'1px solid #e5e7eb',borderRadius:8,marginBottom:8,cursor:'pointer',backgroundColor: method==='stripe' ? '#f0f9ff' : 'white'}}>
          <input type="radio" name="pay" checked={method==='stripe'} onChange={()=>setMethod('stripe')} />
          <div>
            <div style={{fontWeight:'600'}}>クレジットカード決済（Stripe）</div>
            <div style={{fontSize:'14px', color:'#6B7280'}}>即座に決済完了・最も便利</div>
          </div>
        </label>
        
        <label style={{display:'flex',alignItems:'center',gap:8,padding:12,border:'1px solid #e5e7eb',borderRadius:8,marginBottom:8,cursor:'pointer',backgroundColor: method==='convenience' ? '#f0f9ff' : 'white'}}>
          <input type="radio" name="pay" checked={method==='convenience'} onChange={()=>setMethod('convenience')} />
          <div>
            <div style={{fontWeight:'600'}}>コンビニ決済</div>
            <div style={{fontSize:'14px', color:'#6B7280'}}>お近くのコンビニでお支払い</div>
          </div>
        </label>
        
        <label style={{display:'flex',alignItems:'center',gap:8,padding:12,border:'1px solid #e5e7eb',borderRadius:8,cursor:'pointer',backgroundColor: method==='bank' ? '#f0f9ff' : 'white'}}>
          <input type="radio" name="pay" checked={method==='bank'} onChange={()=>setMethod('bank')} />
          <div>
            <div style={{fontWeight:'600'}}>銀行振込</div>
            <div style={{fontSize:'14px', color:'#6B7280'}}>指定口座への振込</div>
          </div>
        </label>
      </div>
      
      <button className="btn primary" onClick={handlePayment}>
        {method === 'stripe' ? 'カード決済を開始' : '支払い手続きへ'}
      </button>
    </div>
  )
}