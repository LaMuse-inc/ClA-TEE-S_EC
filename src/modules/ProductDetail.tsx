import { useParams, Link } from 'react-router-dom'
import products from '../store/products'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  if (!product) return <div className="container">商品が見つかりませんでした。</div>
  return (
    <div className="detail">
      <img src={product.image} alt={product.name} className="detail-img" />
      <div className="detail-body">
        <h1>{product.name}</h1>
        <p className="desc">{product.description}</p>
        <p className="price">¥{product.price.toLocaleString()}〜</p>
        <div className="actions">
          <Link to="/simulator" className="btn primary">デザインする</Link>
        </div>
      </div>
    </div>
  )
}