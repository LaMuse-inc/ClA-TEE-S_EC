import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

type PaymentMethod = 'stripe' | 'convenience' | 'bank'

export default function Payment() {
  const [method, setMethod] = useState<PaymentMethod>('stripe')
  const [orderData, setOrderData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
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
    if (isProcessing || !termsAgreed) return
    
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
      
      {/* 利用規約同意セクション */}
      <div style={{
        margin: '24px 0',
        padding: '20px',
        backgroundColor: '#FEF7F0',
        border: '2px solid #FB923C',
        borderRadius: '12px'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          color: '#C2410C',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{fontSize: '18px'}}>📋</span>
          利用規約の同意
        </h3>
        
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #FED7AA',
          maxHeight: '200px',
          overflowY: 'auto',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#374151'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: '#C2410C',
            fontSize: '14px',
            fontWeight: '600'
          }}>利用規約</h4>
          
          <p><strong>第1条（サービス内容）</strong></p>
          <p>本サービスは、カスタムTシャツ及びユニフォームのオンライン注文サービスです。</p>
          
          <p><strong>第2条（注文と納期）</strong></p>
          <p>注文確定後、3-5営業日で製作いたします。繁忙期は納期が延長する場合があります。</p>
          
          <p><strong>第3条（キャンセル・返品）</strong></p>
          <p>カスタム製品のため、お客様都合によるキャンセル・返品は承っておりません。</p>
          
          <p><strong>第4条（不良品対応）</strong></p>
          <p>製造上の不具合による不良品につきましては、無償で交換いたします。</p>
          
          <p><strong>第5条（個人情報の取り扱い）</strong></p>
          <p>お客様の個人情報は、注文処理・配送・アフターサービスの目的のみに使用し、第三者への提供はいたしません。</p>
        </div>
        
        <label style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none',
          padding: '12px',
          backgroundColor: termsAgreed ? '#FEF3C7' : '#FFFFFF',
          border: `2px solid ${termsAgreed ? '#F59E0B' : '#E5E7EB'}`,
          borderRadius: '8px',
          transition: 'all 0.2s ease'
        }}>
          <input
            type="checkbox"
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              marginTop: '2px',
              accentColor: '#F59E0B'
            }}
          />
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: termsAgreed ? '#92400E' : '#374151',
            lineHeight: '1.5'
          }}>
            上記利用規約に同意します。
            <br/>
            <span style={{fontSize: '12px', color: '#6B7280'}}>
              ※ 注文を完了するには、利用規約への同意が必要です。
            </span>
          </span>
        </label>
      </div>
      
      <button 
        className="btn primary" 
        onClick={handlePayment}
        disabled={isProcessing || !termsAgreed}
        style={{
          opacity: (isProcessing || !termsAgreed) ? 0.6 : 1,
          cursor: (isProcessing || !termsAgreed) ? 'not-allowed' : 'pointer',
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
        ) : !termsAgreed ? (
          '利用規約に同意してください'
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