export type ProductVariant = {
  color: string
  size: string
  stock: number
}

export type Product = {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: 'tshirt' | 'polo' | 'soccer' | 'basket'
  colors: string[]
  sizes: string[]
  variants: ProductVariant[]
}

const colors = ['ホワイト', 'ブラック', 'ネイビー', 'レッド', 'ブルー']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// 全色・全サイズの組み合わせでバリアントを生成
const generateVariants = (): ProductVariant[] => {
  const variants: ProductVariant[] = []
  colors.forEach(color => {
    sizes.forEach(size => {
      variants.push({ color, size, stock: 10 }) // 初期在庫10個
    })
  })
  return variants
}

const products: Product[] = [
  // Tシャツ系
  { 
    id: 'tshirt-basic', 
    name: 'Tシャツ（ベーシック）', 
    price: 980, 
    image: '/assets/tshirt.svg', 
    description: 'クラスTの定番', 
    category: 'tshirt',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'tshirt-dry', 
    name: 'Tシャツ（ドライ）', 
    price: 1180, 
    image: '/assets/tshirt.svg', 
    description: '速乾・軽量で快適', 
    category: 'tshirt',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'tshirt-long', 
    name: 'Tシャツ（ロング）', 
    price: 1280, 
    image: '/assets/tshirt.svg', 
    description: '肌寒い時期に最適', 
    category: 'tshirt',
    colors,
    sizes,
    variants: generateVariants()
  },

  // ポロシャツ系
  { 
    id: 'polo-basic', 
    name: 'ポロシャツ（ベーシック）', 
    price: 1480, 
    image: '/assets/polo.svg', 
    description: 'きれいめで涼しい', 
    category: 'polo',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'polo-pocket', 
    name: 'ポロシャツ（ポケット付）', 
    price: 1580, 
    image: '/assets/polo.svg', 
    description: 'ちょっと便利な胸ポケット', 
    category: 'polo',
    colors,
    sizes,
    variants: generateVariants()
  },

  // サッカー系
  { 
    id: 'soccer-pro', 
    name: 'サッカーユニフォーム（PRO）', 
    price: 1980, 
    image: '/assets/soccer.svg', 
    description: '試合向け高機能モデル', 
    category: 'soccer',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'soccer-kids', 
    name: 'サッカーユニフォーム（KIDS）', 
    price: 1680, 
    image: '/assets/soccer.svg', 
    description: 'ジュニア向けサイズ', 
    category: 'soccer',
    colors,
    sizes,
    variants: generateVariants()
  },

  // バスケ系
  { 
    id: 'basket-pro', 
    name: 'バスケユニフォーム（PRO）', 
    price: 1980, 
    image: '/assets/basket.svg', 
    description: '動きやすい軽量モデル', 
    category: 'basket',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'basket-mesh', 
    name: 'バスケユニフォーム（メッシュ）', 
    price: 1880, 
    image: '/assets/basket.svg', 
    description: '通気性に優れた生地', 
    category: 'basket',
    colors,
    sizes,
    variants: generateVariants()
  },
]

export default products