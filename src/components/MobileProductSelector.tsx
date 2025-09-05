import React, { useState, useMemo } from 'react'
import type { Product, ProductVariant } from '../store/products'

interface MobileProductSelectorProps {
  product: Product
  onSelectionChange: (selection: {
    color: string | null
    size: string | null
    quantity: number
    variant: ProductVariant | null
  }) => void
}

export default function MobileProductSelector({ 
  product, 
  onSelectionChange 
}: MobileProductSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null
    return product.variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    ) || null
  }, [selectedColor, selectedSize, product.variants])

  const availableStock = selectedVariant?.stock || 0

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    setSelectedSize(null)
    setQuantity(1)
    onSelectionChange({
      color,
      size: null,
      quantity: 1,
      variant: null
    })
  }

  const handleSizeSelect = (size: string) => {
    const variant = product.variants.find(
      v => v.color === selectedColor && v.size === size
    )
    if (variant && variant.stock > 0) {
      setSelectedSize(size)
      setQuantity(1)
      onSelectionChange({
        color: selectedColor,
        size,
        quantity: 1,
        variant
      })
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity)
      onSelectionChange({
        color: selectedColor,
        size: selectedSize,
        quantity: newQuantity,
        variant: selectedVariant
      })
    }
  }

  const getColorButtonClass = (color: string) => {
    return `color-option ${selectedColor === color ? 'active' : ''}`
  }

  const getSizeButtonClass = (size: string) => {
    const variant = product.variants.find(
      v => v.color === selectedColor && v.size === size
    )
    const isOutOfStock = !variant || variant.stock === 0
    const isSelected = selectedSize === size
    
    return `size-option ${isSelected ? 'active' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`
  }

  const getColorPreview = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'ホワイト': '#FFFFFF',
      'ブラック': '#000000',
      'ネイビー': '#1F2937',
      'レッド': '#DC2626',
      'ブルー': '#2563EB'
    }
    return colorMap[color] || '#E5E7EB'
  }

  return (
    <div className="mobile-product-selector">
      {/* カラー選択セクション */}
      <section className="selection-section">
        <div className="section-header">
          <h3>カラー選択</h3>
          {selectedColor && (
            <span className="selected-value">{selectedColor}</span>
          )}
        </div>
        <div className="color-grid">
          {product.colors.map(color => (
            <button
              key={color}
              className={getColorButtonClass(color)}
              onClick={() => handleColorSelect(color)}
              type="button"
            >
              <span 
                className="color-preview"
                style={{ backgroundColor: getColorPreview(color) }}
              />
              <span className="color-name">{color}</span>
            </button>
          ))}
        </div>
      </section>

      {/* サイズ選択セクション */}
      {selectedColor && (
        <section className="selection-section">
          <div className="section-header">
            <h3>サイズ選択</h3>
            {selectedSize && (
              <span className="selected-value">{selectedSize}</span>
            )}
            <button 
              className="size-chart-btn"
              onClick={() => setShowSizeChart(!showSizeChart)}
              type="button"
            >
              サイズ表
            </button>
          </div>
          <div className="size-grid">
            {product.sizes.map(size => {
              const variant = product.variants.find(
                v => v.color === selectedColor && v.size === size
              )
              const stock = variant?.stock || 0
              
              return (
                <button
                  key={size}
                  className={getSizeButtonClass(size)}
                  onClick={() => handleSizeSelect(size)}
                  disabled={stock === 0}
                  type="button"
                >
                  <span className="size-name">{size}</span>
                  <span className="stock-count">
                    {stock > 0 ? `在庫: ${stock}` : '在庫なし'}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* 数量選択セクション */}
      {selectedVariant && (
        <section className="selection-section">
          <div className="section-header">
            <h3>数量選択</h3>
            <span className="selected-value">{quantity}個</span>
          </div>
          <div className="quantity-selector">
            <button
              className="quantity-btn decrease"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              type="button"
            >
              −
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
              className="quantity-btn increase"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= availableStock}
              type="button"
            >
              +
            </button>
          </div>
        </section>
      )}

      {/* 選択内容サマリー */}
      {selectedVariant && (
        <section className="selection-summary">
          <div className="summary-row">
            <span className="summary-label">カラー</span>
            <span className="summary-value">{selectedColor}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">サイズ</span>
            <span className="summary-value">{selectedSize}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">数量</span>
            <span className="summary-value">{quantity}個</span>
          </div>
          <div className="summary-row total">
            <span className="summary-label">小計</span>
            <span className="summary-value price">
              ¥{(product.price * quantity).toLocaleString()}
            </span>
          </div>
        </section>
      )}
    </div>
  )
}