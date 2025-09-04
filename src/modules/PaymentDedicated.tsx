import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function PaymentDedicated() {
  const location = useLocation()
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    // location.stateからカート情報を取得
    if (location.state) {
      setOrderData(location.state)
    } else {
      // カート情報がない場合はホームページに戻る
      navigate('/')
    }
  }, [location.state, navigate])

  if (!orderData) {
    return (
      <div className="form">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form">
      <div className="payment-dedicated-container">
        <h1 className="payment-dedicated-title">決済専用ページ</h1>
        
        {/* 注文内容の確認 */}
        <div className="order-summary">
          <h3>ご注文内容</h3>
          {orderData.products && orderData.products.map((product: any) => {
            const quantity = orderData.cart[product.id] || 0
            return (
              <div key={product.id} className="order-item">
                <div className="order-item-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="order-item-details">
                  <div className="order-item-name">{product.name}</div>
                  <div className="order-item-info">
                    <span>数量: {quantity}点</span>
                    <span>単価: ¥{product.price.toLocaleString()}</span>
                  </div>
                  <div className="order-item-subtotal">
                    小計: ¥{(product.price * quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            )
          })}
          
          <div className="order-total">
            <div className="total-items">商品数: {orderData.totalItems}点</div>
            <div className="total-amount">合計金額: ¥{orderData.totalAmount.toLocaleString()}</div>
          </div>
        </div>

        {/* 決済専用ページの説明 */}
        <div className="payment-info">
          <h3>決済について</h3>
          <p>こちらは決済専用ページです。</p>
          <p>実際の決済処理は、以下のボタンから進めることができます。</p>
        </div>

        {/* アクションボタン */}
        <div className="payment-actions">
          <button 
            className="btn secondary"
            onClick={() => navigate('/')}
          >
            商品一覧に戻る
          </button>
          <button 
            className="btn primary"
            onClick={() => navigate('/payment', { state: orderData })}
          >
            決済手続きを開始
          </button>
        </div>
      </div>
    </div>
  )
}