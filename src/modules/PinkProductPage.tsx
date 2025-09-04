import React, { useState } from 'react'
import products from '../store/products'

const PinkProductPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0])
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[2]) // M size
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const sizeChart = {
    'XS': { chest: '44-48', length: '60', shoulder: '40' },
    'S': { chest: '48-52', length: '63', shoulder: '42' },
    'M': { chest: '52-56', length: '66', shoulder: '44' },
    'L': { chest: '56-60', length: '69', shoulder: '46' },
    'XL': { chest: '60-64', length: '72', shoulder: '48' },
    'XXL': { chest: '64-68', length: '75', shoulder: '50' }
  }

  const handleAddToCart = () => {
    alert(`${selectedProduct.name} (${selectedColor}, ${selectedSize}) x${quantity}個をカートに追加しました！`)
  }

  return (
    <div className="pink-product-page">
      {/* ヘッダー */}
      <header className="pink-header">
        <div className="pink-header-content">
          <button className="pink-back-btn" onClick={() => window.history.back()}>
            ← 戻る
          </button>
          <h1 className="pink-header-title">商品詳細</h1>
          <div className="pink-header-spacer"></div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="pink-main">
        {/* 商品画像 */}
        <div className="pink-product-image">
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </div>

        {/* 商品情報 */}
        <div className="pink-product-info">
          <h2 className="pink-product-name">{selectedProduct.name}</h2>
          <p className="pink-product-price">¥{selectedProduct.price.toLocaleString()}</p>
          <p className="pink-product-description">{selectedProduct.description}</p>
        </div>

        {/* カラー選択 */}
        <div className="pink-color-section">
          <h3 className="pink-section-title">カラー</h3>
          <div className="pink-color-options">
            {selectedProduct.colors.map(color => (
              <button
                key={color}
                className={`pink-color-btn ${selectedColor === color ? 'active' : ''}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* サイズ選択 */}
        <div className="pink-size-section">
          <div className="pink-size-header">
            <h3 className="pink-section-title">サイズ</h3>
            <button 
              className="pink-size-chart-btn"
              onClick={() => setShowSizeChart(!showSizeChart)}
            >
              サイズ表を見る
            </button>
          </div>
          <div className="pink-size-options">
            {selectedProduct.sizes.map(size => (
              <button
                key={size}
                className={`pink-size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* サイズ表 */}
        {showSizeChart && (
          <div className="pink-size-chart">
            <h4 className="pink-size-chart-title">サイズ表 (cm)</h4>
            <div className="pink-size-chart-table">
              <div className="pink-size-chart-header">
                <div>サイズ</div>
                <div>胸囲</div>
                <div>着丈</div>
                <div>肩幅</div>
              </div>
              {Object.entries(sizeChart).map(([size, measurements]) => (
                <div key={size} className="pink-size-chart-row">
                  <div className="pink-size-name">{size}</div>
                  <div>{measurements.chest}</div>
                  <div>{measurements.length}</div>
                  <div>{measurements.shoulder}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 数量選択 */}
        <div className="pink-quantity-section">
          <h3 className="pink-section-title">数量</h3>
          <div className="pink-quantity-controls">
            <button 
              className="pink-quantity-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="pink-quantity-display">{quantity}</span>
            <button 
              className="pink-quantity-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* 商品選択 */}
        <div className="pink-product-selector">
          <h3 className="pink-section-title">他の商品を見る</h3>
          <div className="pink-product-grid">
            {products.slice(0, 6).map(product => (
              <button
                key={product.id}
                className={`pink-product-card ${selectedProduct.id === product.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedProduct(product)
                  setSelectedColor(product.colors[0])
                  setSelectedSize(product.sizes[2])
                }}
              >
                <img src={product.image} alt={product.name} />
                <div className="pink-product-card-info">
                  <p className="pink-product-card-name">{product.name}</p>
                  <p className="pink-product-card-price">¥{product.price.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* カートに追加ボタン */}
        <div className="pink-add-to-cart">
          <button className="pink-add-to-cart-btn" onClick={handleAddToCart}>
            カートに追加 - ¥{(selectedProduct.price * quantity).toLocaleString()}
          </button>
        </div>
      </main>
    </div>
  )
}

export default PinkProductPage