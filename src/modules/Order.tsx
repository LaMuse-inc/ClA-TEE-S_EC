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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const finalOrderData = {
      ...orderData,
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
          <span style={{fontWeight:'700', fontSize:'18px'}}>合計: ¥{orderData.totalPrice.toLocaleString()}</span>
        </div>
      </div>
      
      <label>お名前<input required name="name" autoComplete="name" inputMode="text" /></label>
      <label>メール<input type="email" required name="email" autoComplete="email" inputMode="email" /></label>
      <label>電話番号<input type="tel" required name="tel" autoComplete="tel" inputMode="tel" /></label>
      <label>配送先住所<textarea required rows={3} name="address" autoComplete="street-address" /></label>
      
      <p style={{fontSize:'14px', color:'#6B7280', margin:'16px 0'}}>
        ※ 色、テキスト、画像などの詳細なカスタマイズについては、ご注文後にLINEにてご相談ください。
      </p>
      
      <button className="btn primary" type="submit">お支払いへ進む</button>
    </form>
  )
}