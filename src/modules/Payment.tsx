import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

type PaymentMethod = 'stripe' | 'convenience' | 'bank'

export default function Payment() {
  const [method, setMethod] = useState<PaymentMethod>('stripe')
  const [orderData, setOrderData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    // Homeコンポーネントから渡されたデータを取得
    if (location.state) {
      setOrderData(location.state)
    } else {
      // セッションストレージからも確認
      const savedOrderData = sessionStorage.getItem('orderData')
      if (savedOrderData) {
        setOrderData(JSON.parse(savedOrderData))
      } else {
        // 注文データがない場合はホームに戻る
        navigate('/')
      }
    }
  }, [location.state, navigate])
  
  if (!orderData) {
    return <div className="form">読み込み中...</div>
  }
  
  const handlePayment = async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      if (method === 'stripe') {
        // Stripe決済の処理
        await handleStripePayment()
      } else {
        // 従来の決済方法
        navigate(`/payment/confirm?method=${method}`)
      }
    } catch (error) {
      alert('決済処理中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStripePayment = async () => {
    // 実際のStripe実装では、ここでStripe APIを呼び出します
    // 今回はデモ用の処理
    const paymentData = {
      ...orderData,
      paymentMethod: 'stripe',
      paymentId: 'demo_payment_' + Date.now(),
      timestamp: new Date().toISOString()
    }
    
    // 決済処理のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 決済完了後の処理
    sessionStorage.setItem('paymentResult', JSON.stringify(paymentData))
    alert(`決済が完了しました！\n合計金額: ¥${orderData.totalAmount.toLocaleString()}\n商品数: ${orderData.totalItems}点`)
    navigate('/')
  }
  
  return (
    <div className="form">
      <h1>お支払い方法</h1>
      
      {/* 注文内容の確認 */}
      <div style={{background:'#f9fafb', padding:'16px', borderRadius:'8px', margin:'16px 0'}}>
        <h3 style={{margin:'0 0 12px 0'}}>注文内容</h3>
        {orderData.products && orderData.products.map((product: any) => {
          const quantity = orderData.cart[product.id] || 0
          return (
            <div key={product.id} style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px', padding:'8px', background:'white', borderRadius:'6px'}}>
              <img src={product.image} alt={product.name} style={{width:'48px', height:'48px', objectFit:'contain'}} />
              <div style={{flex:1}}>
                <div style={{fontWeight:'600'}}>{product.name}</div>
                <div style={{color:'#6B7280', fontSize:'14px'}}>数量: {quantity}点 × ¥{product.price.toLocaleString()}</div>
              </div>
              <div style={{fontWeight:'600', color:'var(--primary)'}}>
                ¥{(product.price * quantity).toLocaleString()}
              </div>
            </div>
          )
        })}
        <div style={{textAlign:'right', marginTop:'12px', paddingTop:'12px', borderTop:'1px solid #e5e7eb'}}>
          <div style={{fontSize:'14px', color:'#6B7280', marginBottom:'4px'}}>商品数: {orderData.totalItems}点</div>
          <span style={{fontWeight:'700', fontSize:'20px', color:'var(--accent)'}}>合計: ¥{orderData.totalAmount.toLocaleString()}</span>
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
      
      <button 
        className="btn primary" 
        onClick={handlePayment}
        disabled={isProcessing}
        style={{
          opacity: isProcessing ? 0.6 : 1,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          position: 'relative'
        }}
      >
        {isProcessing ? (
          <>
            <span style={{opacity: 0.7}}>処理中...</span>
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </>
        ) : (
          method === 'stripe' ? 'カード決済を開始' : '支払い手続きへ'
        )}
      </button>
      
      <style>{`
        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}