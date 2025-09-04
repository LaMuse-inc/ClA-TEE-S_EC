import { useLocation, useNavigate } from 'react-router-dom'
import products, { type Product } from '../store/products'

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const cat = new URLSearchParams(location.search).get('cat') || 'all'
  const list = cat === 'all' ? products : products.filter(p => p.category === cat)


  return (
    <>
      {/* モバイル最適化されたコンテナ */}
      <div className="mobile-optimized-container">
        {/* 商品一覧表示 */}
        <div className="product-list-header">
          <h2>商品一覧</h2>
        </div>
        
        <section className="mobile-product-grid">
          {list.map((p: Product) => (
            <div key={p.id} className="mobile-product-card">
              <div className="mobile-product-image">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <div className="mobile-product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-price">¥{p.price.toLocaleString()}</div>
                <div className="product-size-info">
                  <span className="size-label">サイズ:</span>
                  <span className="size-options">S / M / L / XL</span>
                </div>
                <button 
                  className="detail-button"
                  onClick={() => navigate(`/items/${p.id}`)}
                  type="button"
                >
                  詳細を見る
                </button>
              </div>
            </div>
          ))}
        </section>


      </div>
    </>
  )
}