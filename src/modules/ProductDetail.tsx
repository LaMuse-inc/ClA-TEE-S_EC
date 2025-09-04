import { useParams, useNavigate } from 'react-router-dom'
import products, { type ProductVariant } from '../store/products'
import { useState, useMemo } from 'react'

type QuantityGrid = {
  [key: string]: number // "color-size" をキーとして数量を保存
}

type Review = {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

// サンプルレビューデータ
const sampleReviews: Review[] = [
  {
    id: '1',
    userName: '田中太郎',
    rating: 5,
    comment: '生地の質感が良く、着心地も抜群です。サイズもぴったりでした。',
    date: '2024-01-15'
  },
  {
    id: '2',
    userName: '佐藤花子',
    rating: 4,
    comment: 'デザインが気に入りました。洗濯後の縮みも少なく満足です。',
    date: '2024-01-10'
  },
  {
    id: '3',
    userName: '山田次郎',
    rating: 5,
    comment: 'チームで注文しましたが、全員大満足です。また利用したいと思います。',
    date: '2024-01-08'
  }
]

export default function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const [quantities, setQuantities] = useState<QuantityGrid>({})
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [reviews, setReviews] = useState<Review[]>(sampleReviews)

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

  const handleReviewSubmit = () => {
    if (newReview.comment.trim()) {
      const review: Review = {
        id: Date.now().toString(),
        userName: 'ユーザー',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      }
      setReviews(prev => [review, ...prev])
      setNewReview({ rating: 5, comment: '' })
      setShowReviewForm(false)
    }
  }

  const getRelatedProducts = () => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#FFD700' : '#DDD' }}>★</span>
    ))
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  if (!product) return <div className="container">商品が見つかりませんでした。</div>

  const relatedProducts = getRelatedProducts()

  return (
    <div className="enhanced-product-detail">
      {/* 1. 商品画像を大きく表示するセクション */}
      <div className="product-image-section">
        <div className="main-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="image-thumbnails">
          {/* 複数画像がある場合のサムネイル表示用 */}
          <div className="thumbnail active">
            <img src={product.image} alt={product.name} />
          </div>
        </div>
      </div>

      {/* 2. 商品名、価格、在庫状況が明確にわかる情報エリア */}
      <div className="product-info-section">
        <h1 className="product-title">{product.name}</h1>
        <div className="product-meta">
          <div className="price-info">
            <span className="price">¥{product.price.toLocaleString()}</span>
            <span className="price-label">（税込）</span>
          </div>
          <div className="stock-status">
            <span className="stock-label">在庫状況:</span>
            <span className="stock-available">在庫あり</span>
          </div>
          <div className="rating-info">
            <div className="stars">{renderStars(Math.round(averageRating))}</div>
            <span className="rating-text">({averageRating.toFixed(1)}) {reviews.length}件のレビュー</span>
          </div>
        </div>
        <p className="short-description">{product.description}</p>
      </div>

      {/* 3. 商品説明文を詳細に表示するセクション */}
      <div className="product-description-section">
        <h2>商品詳細</h2>
        <div className="description-content">
          <p>この{product.name}は、高品質な素材を使用し、快適な着心地を実現しています。</p>
          <ul>
            <li>素材: 綿100%（一部商品は混紡）</li>
            <li>製法: 高品質プリント技術使用</li>
            <li>洗濯: 家庭用洗濯機で洗濯可能</li>
            <li>サイズ展開: XS〜XXLまで豊富なサイズ</li>
            <li>カラー展開: 5色からお選びいただけます</li>
          </ul>
          <p>チームウェアやイベント用途に最適で、長時間の着用でも快適さを保ちます。</p>
        </div>
      </div>

      {/* 4. 購入ボタンと数量選択機能 */}
       <div className="purchase-section">
         <h2>数量選択</h2>
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

         <div className="purchase-summary">
           <div className="summary-info">
             <div>選択中: {product.name} × {totalQuantity}枚</div>
             <div className="total-price">合計: ¥{totalPrice.toLocaleString()}</div>
           </div>
           <button 
             className="btn primary purchase-btn" 
             onClick={handleOrder}
             disabled={totalQuantity === 0}
           >
             購入手続きへ
           </button>
         </div>
       </div>


     </div>
   )
 }