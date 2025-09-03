import { useNavigate, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import products from '../store/products'

export default function Order() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const orderInfo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const productId = params.get('product')
    const qty = parseInt(params.get('qty') || '1')
    const product = products.find(p => p.id === productId)
    
    if (!product) return null
    
    return {
      product,
      qty,
      total: product.price * qty
    }
  }, [location.search])
  
  if (!orderInfo) {
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
    const orderData = {
      product: orderInfo.product,
      qty: orderInfo.qty,
      total: orderInfo.total,
      customer: {
        name: formData.get('name'),
        email: formData.get('email'),
        tel: formData.get('tel'),
        address: formData.get('address')
      }
    }
    // 注文データをセッションストレージに保存
    sessionStorage.setItem('orderData', JSON.stringify(orderData))
    navigate('/payment')
  }
  
  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>注文フォーム</h1>
      
      {/* 注文内容の表示 */}
      <div style={{background:'#f9fafb', padding:'16px', borderRadius:'8px', margin:'16px 0'}}>
        <h3 style={{margin:'0 0 12px 0'}}>注文内容</h3>
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px'}}>
          <img src={orderInfo.product.image} alt={orderInfo.product.name} style={{width:'48px', height:'48px'}} />
          <div>
            <div style={{fontWeight:'600'}}>{orderInfo.product.name}</div>
            <div style={{color:'#6B7280', fontSize:'14px'}}>{orderInfo.product.description}</div>
          </div>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span>¥{orderInfo.product.price.toLocaleString()} × {orderInfo.qty}枚</span>
          <span style={{fontWeight:'700', fontSize:'18px'}}>合計: ¥{orderInfo.total.toLocaleString()}</span>
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