import { Link, useLocation } from 'react-router-dom'
import products, { type Product } from '../store/products'

export default function Home() {
  const location = useLocation()
  const cat = new URLSearchParams(location.search).get('cat') || 'all'
  const list = cat === 'all' ? products : products.filter(p => p.category === cat)
  return (
    <section className="square-list">
      {list.map((p: Product) => (
        <Link key={p.id} to={`/items/${p.id}`} className="square-card">
          <div className="square-thumb">
            <img src={p.image} alt={p.name} loading="lazy" />
          </div>
          <div className="square-meta">
            <div className="name">{p.name}</div>
            <div className="price">¥{p.price.toLocaleString()}</div>
          </div>
        </Link>
      ))}
    </section>
  )
}