import { useParams, useNavigate } from 'react-router-dom'
import products, { type ProductVariant } from '../store/products'
import { useState, useMemo } from 'react'

type QuantityGrid = {
  [key: string]: number // "color-size" をキーとして数量を保存
}

export default function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const [quantities, setQuantities] = useState<QuantityGrid>({})

  const totalQuantity = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  }, [quantities])

  const totalPrice = useMemo(() => {
    return product ? product.price * totalQuantity : 0
  }, [product, totalQuantity])

  const handleQuantityChange = (color: string, size: string, value: string) => {
    const numValue = parseInt(value) || 0
    const key = `${color}-${size}`
    setQuantities(prev => ({
      ...prev,
      [key]: numValue
    }))
  }

  const getQuantity = (color: string, size: string): number => {
    const key = `${color}-${size}`
    return quantities[key] || 0
  }

  const getStock = (color: string, size: string): number => {
    const variant = product?.variants.find(v => v.color === color && v.size === size)
    return variant?.stock || 0
  }

  const handleOrder = () => {
    const orderData = {
      productId: product?.id,
      productName: product?.name,
      price: product?.price,
      quantities,
      totalQuantity,
      totalPrice
    }
    // URLパラメータとして渡すのではなく、sessionStorageに保存
    sessionStorage.setItem('orderData', JSON.stringify(orderData))
    navigate('/order')
  }

  if (!product) return <div className="container">商品が見つかりませんでした。</div>

  return (
    <div className="stripe-bg" style={{padding:"12px", borderRadius:8}}>
      <div className="detail" style={{gridTemplateColumns:'1fr'}}>
        <div className="square-thumb" style={{maxWidth:420, margin:'0 auto'}}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className="panel">
          <h1 style={{margin:'8px 0'}}>{product.name}</h1>
          <p style={{margin:'8px 0', color:'#6B7280'}}>{product.description}</p>
          <div className="step">
            <label>単価: ¥{product.price.toLocaleString()}</label>
          </div>
          
          {/* 色・サイズ別数量入力グリッド */}
          <div className="step">
            <label>数量選択（色・サイズ別）</label>
            <div className="quantity-grid">
              <div className="grid-header">
                <div className="grid-cell header-cell">色\サイズ</div>
                {product.sizes.map(size => (
                  <div key={size} className="grid-cell header-cell">{size}</div>
                ))}
              </div>
              {product.colors.map(color => (
                <div key={color} className="grid-row">
                  <div className="grid-cell color-cell">{color}</div>
                  {product.sizes.map(size => {
                    const stock = getStock(color, size)
                    const quantity = getQuantity(color, size)
                    return (
                      <div key={`${color}-${size}`} className="grid-cell input-cell">
                        <input
                          type="number"
                          min="0"
                          max={stock}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(color, size, e.target.value)}
                          className="quantity-input"
                          disabled={stock === 0}
                          title={stock === 0 ? '在庫なし' : `在庫: ${stock}個`}
                        />
                        <div className="stock-info">{stock === 0 ? '×' : stock}</div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="summary" style={{gridTemplateColumns:'1fr'}}>
            <div>選択中: {product.name} × {totalQuantity}枚</div>
            <div className="total">合計: ¥{totalPrice.toLocaleString()}</div>
          </div>
          <div>
            <button 
              className="btn primary" 
              onClick={handleOrder}
              disabled={totalQuantity === 0}
            >
              購入手続きへ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}