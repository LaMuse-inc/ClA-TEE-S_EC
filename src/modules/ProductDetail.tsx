import { useParams, useNavigate } from 'react-router-dom'
import products from '../store/products'
import { useState, useMemo } from 'react'

export default function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const [qty, setQty] = useState(1)

  const total = useMemo(()=> product ? product.price * qty : 0, [product, qty])

  if (!product) return <div className="container">商品が見つかりませんでした。</div>

  return (
    <div className="stripe-bg" style={{padding:"12px", borderRadius:8}}>
      <div className="detail" style={{gridTemplateColumns:'1fr'}}> {/* 正方形プレビューだけ */}
        <div className="square-thumb" style={{maxWidth:420, margin:'0 auto'}}>
          {/* 受領済みデザインのためテンプレートやテキスト、画像は不要。商品画像のみ参照 */}
          <img src={product.image} alt={product.name} />
        </div>
        <div className="panel">
          <h1 style={{margin:'8px 0'}}>{product.name}</h1>
          <p style={{margin:'8px 0', color:'#6B7280'}}>{product.description}</p>
          <div className="step">
            <label>単価: ¥{product.price.toLocaleString()}</label>
          </div>
          <div className="step">
            <label>数量</label>
            <div className="stepper" aria-label="数量">
              <button type="button" onClick={()=>setQty(q=>Math.max(1,q-1))} aria-label="減らす">−</button>
              <div className="value" aria-live="polite">{qty}</div>
              <button type="button" onClick={()=>setQty(q=>q+1)} aria-label="増やす">＋</button>
            </div>
          </div>
          <div className="summary" style={{gridTemplateColumns:'1fr'}}>
            <div>選択中: {product.name} × {qty}枚</div>
            <div className="total">合計: ¥{total.toLocaleString()}</div>
          </div>
          <div>
            <button className="btn primary" onClick={()=>navigate(`/order?product=${product.id}&qty=${qty}`)}>購入手続きへ</button>
          </div>
        </div>
      </div>
    </div>
  )
}