import { useNavigate } from 'react-router-dom'
import { useMemo, useEffect, useState } from 'react'
import products, { type ProductSpecification } from '../store/products'

type OrderData = {
  productId: string
  productName: string
  price: number
  unitPrice?: number
  quantities: { [key: string]: number }
  specification?: ProductSpecification
  teacherDiscount?: boolean
  totalQuantity: number
  totalPrice: number
  subtotal?: number
  discountAmount?: number
  finalPrice?: number
  designManagementNumber?: string
}

export default function Order() {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [postalCode, setPostalCode] = useState('')
  const [address, setAddress] = useState('')
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  const [designNumber, setDesignNumber] = useState('')
  
  useEffect(() => {
    const savedOrderData = sessionStorage.getItem('orderData')
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    }
  }, [])
  
  const product = useMemo(() => {
    if (!orderData) return null
    return products.find(p => p.id === orderData.productId)
  }, [orderData])
  
  if (!orderData || !product) {
    return (
      <div className="form">
        <h1>注文情報が見つかりません</h1>
        <p>商品を選択してから注文手続きを行ってください。</p>
        <button className="btn primary" onClick={() => navigate('/')}>商品一覧に戻る</button>
      </div>
    )
  }
  
  const searchAddressByPostalCode = async (code: string) => {
    if (code.length !== 7 || !/^\d{7}$/.test(code)) return
    
    setIsSearchingAddress(true)
    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`)
      const data = await response.json()
      
      if (data.status === 200 && data.results && data.results.length > 0) {
        const result = data.results[0]
        const fullAddress = `${result.address1}${result.address2}${result.address3}`
        setAddress(fullAddress)
      } else {
        alert('郵便番号に対応する住所が見つかりませんでした。')
      }
    } catch (error) {
      console.error('住所検索エラー:', error)
      alert('住所検索中にエラーが発生しました。')
    } finally {
      setIsSearchingAddress(false)
    }
  }
  
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setPostalCode(value)
    
    if (value.length === 7) {
      searchAddressByPostalCode(value)
    }
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount5') {
      const discount = Math.floor(orderData!.totalPrice * 0.05)
      setDiscountAmount(discount)
      setCouponApplied(true)
      alert('クーポンが適用されました！5%割引が適用されます。')
    } else {
      alert('無効なクーポンコードです。')
    }
  }

  const finalPrice = orderData ? orderData.totalPrice - discountAmount : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const finalOrderData = {
      ...orderData,
      totalPrice: finalPrice,
      originalPrice: orderData!.totalPrice,
      discountAmount,
      couponApplied,
      customer: {
        name: formData.get('name'),
        email: formData.get('email'),
        tel: formData.get('tel'),
        address: formData.get('address')
      },
      designManagementNumber: designNumber,
      // 商品仕様情報を明確に含める
      specification: orderData.specification,
      teacherDiscount: orderData.teacherDiscount,
      unitPrice: orderData.unitPrice,
      subtotal: orderData.unitPrice ? orderData.unitPrice * orderData.totalQuantity : orderData.totalPrice,
      finalPrice: finalPrice
    }
    // 注文データをセッションストレージに保存
    sessionStorage.setItem('orderData', JSON.stringify(finalOrderData))
    navigate('/payment')
  }
  
  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>注文フォーム</h1>
      
      {/* 注文内容の表示 */}
      <div style={{background:'#f9fafb', padding:'16px', borderRadius:'8px', margin:'16px 0'}}>
        <h3 style={{margin:'0 0 12px 0'}}>注文内容</h3>
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px'}}>
          <img src={product.image} alt={product.name} style={{width:'48px', height:'48px'}} />
          <div>
            <div style={{fontWeight:'600'}}>{product.name}</div>
            <div style={{color:'#6B7280', fontSize:'14px'}}>{product.description}</div>
          </div>
        </div>
        
        {/* 商品仕様詳細の表示 */}
        {orderData.specification && (
          <div style={{marginBottom:'12px', padding:'12px', backgroundColor:'#F0F9FF', borderRadius:'8px', border:'1px solid #E0E7FF'}}>
            <h4 style={{margin:'0 0 8px 0', fontSize:'14px', fontWeight:'600', color:'#1E40AF'}}>商品仕様:</h4>
            <div style={{display:'grid', gap:'4px', fontSize:'14px'}}>
              {orderData.specification.material && (
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>素材:</span>
                  <span style={{fontWeight:'500'}}>
                    {orderData.specification.material === 'polyester' ? 'ポリエステル' : 'コットン'}
                  </span>
                </div>
              )}
              {orderData.specification.printLocation && (
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>プリント箇所:</span>
                  <span style={{fontWeight:'500'}}>
                    {orderData.specification.printLocation === 'front' ? '前面のみ' : '両面印刷'}
                  </span>
                </div>
              )}
              {orderData.specification.backPrint && (
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>背面加工:</span>
                  <span style={{fontWeight:'500'}}>
                    {orderData.specification.backPrint === 'none' ? 'なし' : '名前・背番号あり'}
                  </span>
                </div>
              )}
              {orderData.teacherDiscount && (
                <div style={{display:'flex', justifyContent:'space-between', color:'#059669'}}>
                  <span>キャンペーン:</span>
                  <span style={{fontWeight:'500'}}>先生無料キャンペーン適用</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 色・サイズ別数量の詳細表示 */}
        <div style={{marginBottom:'12px'}}>
          <h4 style={{margin:'0 0 8px 0', fontSize:'14px', fontWeight:'600'}}>選択内容:</h4>
          <div style={{display:'grid', gap:'4px'}}>
            {Object.entries(orderData.quantities)
              .filter(([_, qty]) => qty > 0)
              .map(([key, qty]) => {
                const [color, size] = key.split('-')
                return (
                  <div key={key} style={{display:'flex', justifyContent:'space-between', fontSize:'14px'}}>
                    <span>{color} / {size}</span>
                    <span>{qty}枚</span>
                  </div>
                )
              })
            }
          </div>
        </div>
        
        <div style={{borderTop:'1px solid #e5e7eb', paddingTop:'12px'}}>
          {/* 価格詳細表示 */}
          <div style={{display:'grid', gap:'4px', fontSize:'14px', marginBottom:'8px'}}>
            {orderData.unitPrice ? (
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>単価:</span>
                <span>¥{orderData.unitPrice.toLocaleString()}</span>
              </div>
            ) : (
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>単価:</span>
                <span>¥{orderData.price.toLocaleString()}</span>
              </div>
            )}
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span>数量:</span>
              <span>{orderData.totalQuantity}枚</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', paddingTop:'4px', borderTop:'1px solid #f3f4f6'}}>
              <span>小計:</span>
              <span>¥{(orderData.unitPrice ? orderData.unitPrice * orderData.totalQuantity : orderData.totalPrice).toLocaleString()}</span>
            </div>
            {orderData.teacherDiscount && orderData.unitPrice && (
              <div style={{display:'flex', justifyContent:'space-between', color:'#059669'}}>
                <span>先生無料キャンペーン:</span>
                <span>-¥{orderData.unitPrice.toLocaleString()}</span>
              </div>
            )}
            {couponApplied && (
              <div style={{display:'flex', justifyContent:'space-between', color:'#059669'}}>
                <span>クーポン割引:</span>
                <span>-¥{discountAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'8px', borderTop:'2px solid #e5e7eb'}}>
            <span style={{fontWeight:'600', fontSize:'16px'}}>最終合計:</span>
            <span style={{fontWeight:'700', fontSize:'18px', color:'var(--accent)'}}>¥{finalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <label>お名前<input required name="name" autoComplete="name" inputMode="text" /></label>
      <label>メール<input type="email" required name="email" autoComplete="email" inputMode="email" /></label>
      <label>電話番号<input type="tel" required name="tel" autoComplete="tel" inputMode="tel" /></label>
      
      <label>
        郵便番号（7桁）
        <input 
          type="text" 
          value={postalCode} 
          onChange={handlePostalCodeChange}
          placeholder="1234567" 
          maxLength={7}
          inputMode="numeric"
          style={{marginBottom: '8px'}}
        />
        {isSearchingAddress && <div style={{fontSize: '12px', color: '#6B7280'}}>住所を検索中...</div>}
      </label>
      
      <label>
        配送先住所
        <textarea 
          required 
          rows={3} 
          name="address" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          autoComplete="street-address"
          placeholder="郵便番号を入力すると自動で住所が入力されます"
        />
      </label>
      
      <div style={{margin:'16px 0', padding:'16px', border:'1px solid #e5e7eb', borderRadius:'8px', backgroundColor:'#f9fafb'}}>
        <label style={{display:'block', marginBottom:'8px', fontWeight:'600'}}>クーポンコード</label>
        <div style={{display:'flex', gap:'8px'}}>
          <input 
            type="text" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="クーポンコードを入力"
            style={{flex:1, padding:'8px', border:'1px solid #d1d5db', borderRadius:'4px'}}
            disabled={couponApplied}
          />
          <button 
            type="button"
            onClick={applyCoupon}
            disabled={couponApplied || !couponCode.trim()}
            style={{
              padding:'8px 16px', 
              backgroundColor: couponApplied ? '#10b981' : '#3b82f6',
              color:'white', 
              border:'none', 
              borderRadius:'4px',
              cursor: couponApplied || !couponCode.trim() ? 'not-allowed' : 'pointer',
              opacity: couponApplied || !couponCode.trim() ? 0.6 : 1
            }}
          >
            {couponApplied ? '適用済み' : '適用'}
          </button>
        </div>
        {couponApplied && (
          <div style={{marginTop:'8px', color:'#059669', fontSize:'14px'}}>
            ✓ 5%割引が適用されました
          </div>
        )}
      </div>
      
      {/* デザイン入稿案内セクション */}
      <div style={{
        margin: '24px 0',
        padding: '20px',
        backgroundColor: '#F0F9FF',
        border: '2px solid #0EA5E9',
        borderRadius: '12px'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          color: '#0C4A6E',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{fontSize: '20px'}}>📱</span>
          デザインデータ入稿について
        </h3>
        
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #E0E7FF'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: '#1E40AF',
            fontSize: '14px',
            fontWeight: '600'
          }}>LINEでのデザインデータ入稿手順</h4>
          
          <ol style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#374151'
          }}>
            <li>下記LINE公式アカウントを友達登録してください</li>
            <li>注文番号とお名前を送信してください</li>
            <li>デザインデータ（AI・PSD・ PNGなど）を送信</li>
            <li>デザイン確認後、製作開始いたします</li>
          </ol>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <span style={{fontSize: '20px'}}>💬</span>
          <div>
            <div style={{fontWeight: '600', fontSize: '14px'}}>LINE公式アカウント</div>
            <div style={{fontSize: '12px', opacity: '0.9'}}>ID: @cla-tees-ec</div>
          </div>
        </div>
        
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          デザイン管理番号（任意）
        </label>
        <input
          type="text"
          value={designNumber}
          onChange={(e) => setDesignNumber(e.target.value)}
          placeholder="デザインの管理番号がある場合はこちらに入力"
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #E0E7FF',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#FFFFFF'
          }}
        />
        
        <p style={{
          margin: '12px 0 0 0',
          fontSize: '12px',
          color: '#6B7280',
          lineHeight: '1.5'
        }}>
          ※ デザインデータがない場合は、テキストやイメージの要望をLINEでお知らせください。<br/>
          当社デザイナーがオリジナルデザインを作成いたします。
        </p>
      </div>
      
      <button className="btn primary" type="submit">お支払いへ進む</button>
    </form>
  )
}