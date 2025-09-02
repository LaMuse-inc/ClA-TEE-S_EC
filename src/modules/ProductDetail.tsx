import { useParams, Link, useNavigate } from 'react-router-dom'
import products from '../store/products'
import { useState, useMemo } from 'react'

const COLORS = ['#111827','#1A237E','#FF6F00','#10B981','#EF4444','#6B7280']
const SIZES = ['XS','S','M','L','XL'] as const
const UNIT_PRICE = 1000

type Size = typeof SIZES[number]

export default function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const [color, setColor] = useState(COLORS[1])
  const [size, setSize] = useState<Size>('M')
  const [qty, setQty] = useState(1)

  const total = useMemo(()=> UNIT_PRICE * qty, [qty])

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
          <div className="step">
            <label>カラー</label>
            <div className="swatches" role="radiogroup" aria-label="カラー">
              {COLORS.map(c => (
                <button key={c} className="swatch" role="radio" aria-checked={color===c} aria-label={c}
                  style={{background:c}} onClick={()=>setColor(c)} />
              ))}
            </div>
          </div>
          <div className="step">
            <label>サイズ</label>
            <select value={size} onChange={e=>setSize(e.target.value as Size)}>
              {SIZES.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="step">
            <label>数量</label>
            <div className="stepper" aria-label="数量">
              <button type="button" onClick={()=>setQty(q=>Math.max(0,q-1))} aria-label="減らす">−</button>
              <div className="value" aria-live="polite">{qty}</div>
              <button type="button" onClick={()=>setQty(q=>q+1)} aria-label="増やす">＋</button>
            </div>
          </div>
          <div className="summary" style={{gridTemplateColumns:'1fr'}}>
            <div>選択中: {product.name} / 色: <span style={{display:'inline-block',width:12,height:12,background:color,border:'1px solid #e5e7eb',verticalAlign:'middle'}}></span> / サイズ: {size} / 数量: {qty}</div>
            <div className="total">合計: ¥{total.toLocaleString()}</div>
          </div>
          <div>
            <button className="btn primary" onClick={()=>navigate('/order')}>購入手続きへ</button>
          </div>
        </div>
      </div>
    </div>
  )
}