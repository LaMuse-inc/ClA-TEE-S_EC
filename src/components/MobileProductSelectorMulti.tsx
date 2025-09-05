import React, { useState, useMemo } from 'react'
import type { Product, ProductVariant, ProductSpecification } from '../store/products'
import { calculateProductPrice } from '../store/products'

interface MobileProductSelectorMultiProps {
  product: Product
  onSelectionChange: (selection: {
    color: string | null
    quantities: { [size: string]: number }
    specification: ProductSpecification
    totalQuantity: number
    totalPrice: number
    unitPrice: number
    teacherDiscount: boolean
  }) => void
}

export default function MobileProductSelectorMulti({ 
  product, 
  onSelectionChange 
}: MobileProductSelectorMultiProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<{ [size: string]: number }>({})
  const [specification, setSpecification] = useState<ProductSpecification>({})
  const [teacherDiscount, setTeacherDiscount] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const totalQuantity = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  }, [quantities])

  const unitPrice = useMemo(() => {
    return calculateProductPrice(product, specification)
  }, [product, specification])

  const subtotal = useMemo(() => {
    return unitPrice * totalQuantity
  }, [unitPrice, totalQuantity])

  const discountAmount = useMemo(() => {
    return teacherDiscount ? unitPrice : 0
  }, [teacherDiscount, unitPrice])

  const totalPrice = useMemo(() => {
    return Math.max(0, subtotal - discountAmount)
  }, [subtotal, discountAmount])

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    setQuantities({})
    updateSelection(color, {}, specification, teacherDiscount)
  }

  const handleQuantityChange = (size: string, quantity: number) => {
    const newQuantity = Math.max(0, quantity)
    
    const newQuantities = {
      ...quantities,
      [size]: newQuantity
    }
    
    if (newQuantity === 0) {
      delete newQuantities[size]
    }
    
    setQuantities(newQuantities)
    updateSelection(selectedColor, newQuantities, specification, teacherDiscount)
  }

  const getColorButtonClass = (color: string) => {
    return `color-option ${selectedColor === color ? 'active' : ''}`
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

  const updateSelection = (color: string | null, quantities: { [size: string]: number }, spec: ProductSpecification, discount: boolean) => {
    const total = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
    const unit = calculateProductPrice(product, spec)
    const sub = unit * total
    const discAmount = discount ? unit : 0
    const finalPrice = Math.max(0, sub - discAmount)
    
    onSelectionChange({
      color,
      quantities,
      specification: spec,
      totalQuantity: total,
      totalPrice: finalPrice,
      unitPrice: unit,
      teacherDiscount: discount
    })
  }

  const handleSpecificationChange = (key: keyof ProductSpecification, value: any) => {
    const newSpec = { ...specification, [key]: value }
    setSpecification(newSpec)
    updateSelection(selectedColor, quantities, newSpec, teacherDiscount)
  }

  const handleTeacherDiscountChange = (discount: boolean) => {
    setTeacherDiscount(discount)
    updateSelection(selectedColor, quantities, specification, discount)
  }

  const isCustomProduct = product.productType === 'custom'
  const isUniformProduct = product.productType === 'uniform'


  return (
    <div className="mobile-product-selector-multi">
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

      {/* 商品仕様選択セクション */}
      {selectedColor && (
        <section className="selection-section">
          <div className="section-header">
            <h3>商品仕様選択</h3>
          </div>
          
          {/* カスタム系（クラT・ポロ）の仕様選択 */}
          {isCustomProduct && (
            <div className="specification-options">
              <div className="spec-group">
                <h4>素材選択</h4>
                <div className="spec-buttons">
                  <button
                    className={`spec-option ${specification.material === 'polyester' ? 'active' : ''}`}
                    onClick={() => handleSpecificationChange('material', 'polyester')}
                    type="button"
                  >
                    ポリエステル
                  </button>
                  <button
                    className={`spec-option ${specification.material === 'cotton' ? 'active' : ''}`}
                    onClick={() => handleSpecificationChange('material', 'cotton')}
                    type="button"
                  >
                    コットン
                  </button>
                </div>
              </div>
              
              <div className="spec-group">
                <h4>プリント箇所</h4>
                <div className="spec-buttons">
                  <button
                    className={`spec-option ${specification.printArea === 'front' ? 'active' : ''}`}
                    onClick={() => handleSpecificationChange('printArea', 'front')}
                    type="button"
                  >
                    <div className="spec-label">前面のみ</div>
                    <div className="spec-price">¥1,500</div>
                  </button>
                  <button
                    className={`spec-option ${specification.printArea === 'both' ? 'active' : ''}`}
                    onClick={() => handleSpecificationChange('printArea', 'both')}
                    type="button"
                  >
                    <div className="spec-label">両面印刷</div>
                    <div className="spec-price">¥1,800</div>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* ユニフォーム系の仕様選択 */}
          {isUniformProduct && (
            <div className="specification-options">
              <div className="spec-group">
                <h4>背面加工</h4>
                <div className="spec-buttons">
                  <button
                    className={`spec-option ${specification.backProcessing === 'none' ? 'active' : ''}`}
                    onClick={() => handleSpecificationChange('backProcessing', 'none')}
                    type="button"
                  >
                    <div className="spec-label">なし</div>
                    <div className="spec-price">¥1,400</div>
                  </button>
                  <button
                    className={`spec-option ${specification.backProcessing === 'nameNumber' ? 'active' : ''}`}
                    onClick={() => handleSpecificationChange('backProcessing', 'nameNumber')}
                    type="button"
                  >
                    <div className="spec-label">名前・背番号あり</div>
                    <div className="spec-price">¥1,800</div>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 先生無料キャンペーン */}
          <div className="campaign-section">
            <label className="campaign-checkbox">
              <input
                type="checkbox"
                checked={teacherDiscount}
                onChange={(e) => handleTeacherDiscountChange(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="campaign-text">先生無料キャンペーン適用（1枚無料）</span>
            </label>
          </div>
        </section>
      )}

      {/* サイズごとの数量選択セクション */}
      {selectedColor && (
        <section className="selection-section">
          <div className="section-header">
            <h3>サイズと数量を選択</h3>
            <button 
              className="size-chart-btn"
              onClick={() => setShowSizeChart(!showSizeChart)}
              type="button"
            >
              サイズ表
            </button>
          </div>
          <div className="size-quantity-list">
            {product.sizes.map(size => {
              const quantity = quantities[size] || 0
              
              return (
                <div key={size} className="size-quantity-item">
                  <div className="size-info">
                    <span className="size-name">{size}</span>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn decrease"
                      onClick={() => handleQuantityChange(size, quantity - 1)}
                      disabled={quantity <= 0}
                      type="button"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(size, parseInt(e.target.value) || 0)}
                      min="0"
                    />
                    <button
                      className="quantity-btn increase"
                      onClick={() => handleQuantityChange(size, quantity + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 選択内容サマリー */}
      {totalQuantity > 0 && (
        <section className="selection-summary">
          <h4>選択内容</h4>
          <div className="summary-details">
            <div className="summary-row">
              <span className="summary-label">カラー</span>
              <span className="summary-value">{selectedColor}</span>
            </div>
            
            {/* 仕様情報 */}
            {isCustomProduct && (
              <>
                {specification.material && (
                  <div className="summary-row">
                    <span className="summary-label">素材</span>
                    <span className="summary-value">
                      {specification.material === 'polyester' ? 'ポリエステル' : 'コットン'}
                    </span>
                  </div>
                )}
                {specification.printArea && (
                  <div className="summary-row">
                    <span className="summary-label">プリント箇所</span>
                    <span className="summary-value">
                      {specification.printArea === 'front' ? '前面のみ' : '両面印刷'}
                    </span>
                  </div>
                )}
              </>
            )}
            
            {isUniformProduct && specification.backProcessing && (
              <div className="summary-row">
                <span className="summary-label">背面加工</span>
                <span className="summary-value">
                  {specification.backProcessing === 'none' ? 'なし' : '名前・背番号あり'}
                </span>
              </div>
            )}
            
            {/* サイズ別数量 */}
            {Object.entries(quantities).map(([size, qty]) => 
              qty > 0 && (
                <div key={size} className="summary-row size-detail">
                  <span className="summary-label">{size}サイズ</span>
                  <span className="summary-value">{qty}枚</span>
                </div>
              )
            )}
            
            {/* 価格計算詳細 */}
            <div className="summary-row">
              <span className="summary-label">単価</span>
              <span className="summary-value">¥{unitPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">合計数量</span>
              <span className="summary-value">{totalQuantity}枚</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">小計</span>
              <span className="summary-value">¥{subtotal.toLocaleString()}</span>
            </div>
            
            {teacherDiscount && (
              <div className="summary-row discount">
                <span className="summary-label">先生無料キャンペーン</span>
                <span className="summary-value">-¥{discountAmount.toLocaleString()}</span>
              </div>
            )}
            
            <div className="summary-row total">
              <span className="summary-label">最終合計</span>
              <span className="summary-value price">
                ¥{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}