import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Home from './Home'
import ProductDetail from './ProductDetail'
import Order from './Order'
import Payment from './Payment'
import PaymentConfirm from './PaymentConfirm'
import PaymentDedicated from './PaymentDedicated'
import PinkProductPage from './PinkProductPage'

function CategoryTabs() {
  const navigate = useNavigate()
  const location = useLocation()
  const current = new URLSearchParams(location.search).get('cat') || 'all'
  
  // 決済関連ページではタブを非表示
  const hideTabsOnPages = ['/payment', '/payment-dedicated', '/payment/confirm', '/order', '/complete']
  const shouldHideTabs = hideTabsOnPages.some(page => location.pathname.startsWith(page))
  
  if (shouldHideTabs) {
    return null
  }
  
  const tabs = [
    { key: 'all', label: 'すべて' },
    { key: 'tshirt', label: 'Tシャツ' },
    { key: 'soccer', label: 'サッカー' },
    { key: 'basket', label: 'バスケ' },
    { key: 'baseball', label: '野球' },
  ]
  const go = (key: string) => {
    const qs = key === 'all' ? '' : `?cat=${key}`
    navigate(`/${qs}`)
  }
  return (
    <div className="tabs" role="tablist" aria-label="カテゴリ">
      {tabs.map(t => (
        <button key={t.key} role="tab" aria-selected={current===t.key} className={`tab${current===t.key ? ' active':''}${t.key === 'tshirt' ? ' T' : ''}`} onClick={()=>go(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleHeaderClick = () => {
    navigate('/')
  }
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content" onClick={handleHeaderClick} style={{cursor: 'pointer'}}>
          <h1 className="app-title">決済専用ページ</h1>
          <p className="app-subtitle">こちらのページからお支払いください</p>
        </div>
      </header>
      <div className="container">
        <CategoryTabs />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items/:id" element={<ProductDetail />} />
            <Route path="/pink-product" element={<PinkProductPage />} />
            <Route path="/order" element={<Order />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-dedicated" element={<PaymentDedicated />} />
            <Route path="/payment/confirm" element={<PaymentConfirm />} />
            <Route path="/complete" element={<div className="form"><h1>ご注文ありがとうございました</h1><p>担当者よりご連絡いたします。</p><button className="btn primary" onClick={() => window.location.href = '/'}>新しい注文をする</button></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}