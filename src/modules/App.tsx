import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Home from './Home'
import Simulator from './Simulator'
import ProductDetail from './ProductDetail'
import Order from './Order'
import Payment from './Payment'
import PaymentConfirm from './PaymentConfirm'

function CategoryTabs() {
  const navigate = useNavigate()
  const location = useLocation()
  const current = new URLSearchParams(location.search).get('cat') || 'all'
  const tabs = [
    { key: 'all', label: 'すべて' },
    { key: 'tshirt', label: 'Tシャツ' },
    { key: 'polo', label: 'ポロシャツ' },
    { key: 'soccer', label: 'サッカー' },
    { key: 'basket', label: 'バスケ' },
  ]
  const go = (key: string) => {
    const qs = key === 'all' ? '' : `?cat=${key}`
    navigate(`/${qs}`)
  }
  return (
    <div className="tabs" role="tablist" aria-label="カテゴリ">
      {tabs.map(t => (
        <button key={t.key} role="tab" aria-selected={current===t.key} className={`tab${current===t.key ? ' active':''}`} onClick={()=>go(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <div className="container">
      {/* 以前のヘッダー（ロゴ・セクション）は削除 */}
      <CategoryTabs />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items/:id" element={<ProductDetail />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/order" element={<Order />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/confirm" element={<PaymentConfirm />} />
          <Route path="/complete" element={<div className="form"><h1>ご注文ありがとうございました</h1><p>担当者よりご連絡いたします。</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}