import { useNavigate } from 'react-router-dom'
import { useMemo, useEffect, useState } from 'react'
import products from '../store/products'

type OrderData = {
  productId: string
  productName: string
  price: number
  quantities: { [key: string]: number }
  totalQuantity: number
  totalPrice: number
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
      }
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
        
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #e5e7eb', paddingTop:'8px'}}>
          <span>¥{orderData.price.toLocaleString()} × {orderData.totalQuantity}枚</span>
          <div style={{textAlign:'right'}}>
            {couponApplied && (
              <div style={{fontSize:'14px', color:'#059669', marginBottom:'4px'}}>
                割引: -¥{discountAmount.toLocaleString()}
              </div>
            )}
            <span style={{fontWeight:'700', fontSize:'18px'}}>合計: ¥{finalPrice.toLocaleString()}</span>
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
      
      <p style={{fontSize:'14px', color:'#6B7280', margin:'16px 0'}}>
        ※ 色、テキスト、画像などの詳細なカスタマイズについては、ご注文後にLINEにてご相談ください。
      </p>
      
      <button className="btn primary" type="submit">お支払いへ進む</button>
    </form>
  )
}