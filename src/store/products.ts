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
  category: 'tshirt' | 'polo' | 'soccer' | 'basket' | 'baseball'
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
  { 
    id: 'baseball-classic', 
    name: 'ベースボールシャツ（クラシック）', 
    price: 1980, 
    image: '/クラT画像/1.png', 
    description: 'レトロなデザインのベースボールシャツ', 
    category: 'baseball',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'basket-1', 
    name: 'バスケットボールユニフォーム（タイプ1）', 
    price: 1580, 
    image: '/クラT画像/バスケ1.png', 
    description: 'スタンダードなバスケットボールユニフォーム', 
    category: 'basket',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'basket-4', 
    name: 'バスケットボールユニフォーム（タイプ4）', 
    price: 1580, 
    image: '/クラT画像/バスケ4.png', 
    description: 'モダンなバスケットボールユニフォーム', 
    category: 'basket',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'basket-5', 
    name: 'バスケットボールユニフォーム（タイプ5）', 
    price: 1580, 
    image: '/クラT画像/バスケ5.png', 
    description: 'プロフェッショナルなバスケットボールユニフォーム', 
    category: 'basket',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'basket-6', 
    name: 'バスケットボールユニフォーム（タイプ6）', 
    price: 1580, 
    image: '/クラT画像/バスケ6.png', 
    description: 'エレガントなバスケットボールユニフォーム', 
    category: 'basket',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'basket-7', 
    name: 'バスケットボールユニフォーム（タイプ7）', 
    price: 1580, 
    image: '/クラT画像/バスケ7.png', 
    description: 'ダイナミックなバスケットボールユニフォーム', 
    category: 'basket',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'basket-8', 
    name: 'バスケットボールユニフォーム（タイプ8）', 
    price: 1580, 
    image: '/クラT画像/バスケ8.png', 
    description: 'スタイリッシュなバスケットボールユニフォーム', 
    category: 'basket',
    colors,
    sizes,
    variants: generateVariants()
  },
   { 
     id: 'soccer-2', 
    name: 'サッカーユニフォーム（タイプ2）', 
    price: 1680, 
    image: '/クラT画像/サッカー2.png', 
    description: 'スタイリッシュなデザインのサッカーユニフォーム', 
    category: 'soccer',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'soccer-3', 
    name: 'サッカーユニフォーム（タイプ3）', 
    price: 1680, 
    image: '/クラT画像/サッカー3.png', 
    description: 'クラシックなデザインのサッカーユニフォーム', 
    category: 'soccer',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'soccer-4', 
    name: 'サッカーユニフォーム（タイプ4）', 
    price: 1680, 
    image: '/クラT画像/サッカー4.png', 
    description: 'モダンなデザインのサッカーユニフォーム', 
    category: 'soccer',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'soccer-5', 
    name: 'サッカーユニフォーム（タイプ5）', 
    price: 1680, 
    image: '/クラT画像/サッカー5.png', 
    description: 'エレガントなデザインのサッカーユニフォーム', 
    category: 'soccer',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'soccer-7', 
    name: 'サッカーユニフォーム（タイプ7）', 
    price: 1680, 
    image: '/クラT画像/サッカー7.png', 
    description: 'ダイナミックなデザインのサッカーユニフォーム', 
    category: 'soccer',
    colors,
    sizes,
    variants: generateVariants()
  },
  { 
    id: 'soccer-dry', 
    name: 'ドライサッカーシャツ', 
    price: 1880, 
    image: '/クラT画像/ドライサッカーシャツ.png', 
    description: '速乾性に優れたドライサッカーシャツ', 
    category: 'soccer',
    colors,
    sizes,
    variants: generateVariants()
  },
]

export default products