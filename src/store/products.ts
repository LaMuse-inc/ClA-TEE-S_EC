export type ProductVariant = {
  color: string
  size: string
  stock: number
}

// 新しい要求定義に基づく型定義
export type ProductSpecification = {
  material?: 'polyester' | 'cotton'  // カスタム系のみ
  printLocation?: 'front' | 'both'   // カスタム系のみ
  backPrint?: 'none' | 'nameNumber'  // ユニフォーム系のみ
}

export type ProductCategory = 'custom-tshirt' | 'custom-polo' | 'soccer' | 'basketball' | 'baseball'

export type PricingRule = {
  category: ProductCategory
  specification: ProductSpecification
  unitPrice: number
}

// 後方互換性のため既存型も保持
export type ProductType = 'custom' | 'uniform'

export type SpecificationOptions = {
  materials?: ('polyester' | 'cotton')[]
  printAreas?: ('front' | 'both')[]
  backProcessing?: ('none' | 'nameNumber')[]
}

export type Product = {
  id: string
  name: string
  price: number
  basePrice: number
  image: string
  description: string
  category: 'tshirt' | 'polo' | 'soccer' | 'basket' | 'baseball' | 'volleyball'
  productType: ProductType
  colors: string[]
  sizes: string[]
  variants: ProductVariant[]
  specifications?: ProductSpecification
  availableSpecifications: SpecificationOptions
}

const colors = ['ホワイト', 'ブラック', 'ネイビー', 'レッド', 'ブルー']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// 価格計算ヘルパー関数
export function calculateProductPrice(product: Product, specification: ProductSpecification): number {
  if (product.productType === 'custom' && specification.printArea === 'front') {
    return 1500
  } else if (product.productType === 'custom' && specification.printArea === 'both') {
    return 1800
  } else if (product.productType === 'uniform' && specification.backProcessing === 'none') {
    return 1400
  } else if (product.productType === 'uniform' && specification.backProcessing === 'nameNumber') {
    return 1800
  }
  
  return product.basePrice || product.price
}

// 商品タイプ判定ヘルパー関数
export function getProductType(category: Product['category']): ProductType {
  return (category === 'tshirt' || category === 'polo') ? 'custom' : 'uniform'
}

// 利用可能な仕様オプション取得
export function getAvailableSpecifications(productType: ProductType): SpecificationOptions {
  if (productType === 'custom') {
    return {
      materials: ['polyester', 'cotton'],
      printAreas: ['front', 'both']
    }
  } else {
    return {
      backProcessing: ['none', 'nameNumber']
    }
  }
}

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
    id: 'tshirt-class-6', 
    name: 'クラスTシャツ（タイプ6）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/クラスT6.png', 
    description: 'クラスTシャツデザイン', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-class-7', 
    name: 'クラスTシャツ（タイプ7）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/クラスT7.png', 
    description: 'クラスTシャツデザイン', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-class-8', 
    name: 'クラスTシャツ（タイプ8）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/クラスT8.png', 
    description: 'クラスTシャツデザイン', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-class-9', 
    name: 'クラスTシャツ（タイプ9）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/クラsT9.png', 
    description: 'クラスTシャツデザイン', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-class-10', 
    name: 'クラスTシャツ（タイプ10）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/クラスT10.png', 
    description: 'クラスTシャツデザイン', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-class-11', 
    name: 'クラスTシャツ（タイプ11）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/クラスT11.png', 
    description: 'クラスTシャツデザイン', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-class-12', 
    name: 'クラスTシャツ（タイプ12）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/クラスT12.png', 
    description: 'クラスTシャツデザイン', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-class-13', 
    name: 'クラスTシャツ（タイプ13）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/クラスT13.png', 
    description: 'クラスTシャツデザイン', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-7', 
    name: 'クラスTシャツ（けんしんタイプ7）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/7けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-8', 
    name: 'クラスTシャツ（けんしんタイプ8）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/8けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-9', 
    name: 'クラスTシャツ（けんしんタイプ9）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/9けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-10', 
    name: 'クラスTシャツ（けんしんタイプ10）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/10けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-11', 
    name: 'クラスTシャツ（けんしんタイプ11）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/11けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-12', 
    name: 'クラスTシャツ（けんしんタイプ12）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/12けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-13', 
    name: 'クラスTシャツ（けんしんタイプ13）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/13けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-14', 
    name: 'クラスTシャツ（けんしんタイプ14）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/14けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'tshirt-kenshin-15', 
    name: 'クラスTシャツ（けんしんタイプ15）', 
    price: 1480, 
    basePrice: 1480,
    image: '/クラT画像/15けんしんくんのやつ.png', 
    description: 'けんしんくんデザインのクラスTシャツ', 
    category: 'tshirt',
    productType: getProductType('tshirt'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('tshirt'))
  },
  { 
    id: 'baseball-classic', 
    name: 'ベースボールシャツ（クラシック）', 
    price: 1980, 
    basePrice: 1980,
    image: '/クラT画像/1.png', 
    description: 'レトロなデザインのベースボールシャツ', 
    category: 'baseball',
    productType: getProductType('baseball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('baseball'))
  },
  { 
    id: 'baseball-1', 
    name: 'ベースボールユニフォーム（タイプ1）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/野球.png', 
    description: 'スタンダードなベースボールユニフォーム', 
    category: 'baseball',
    productType: getProductType('baseball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('baseball'))
  },
  { 
    id: 'baseball-2', 
    name: 'ベースボールユニフォーム（タイプ2）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/野球2.png', 
    description: 'モダンなベースボールユニフォーム', 
    category: 'baseball',
    productType: getProductType('baseball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('baseball'))
  },
  { 
    id: 'baseball-3', 
    name: 'ベースボールユニフォーム（タイプ3）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/野球3.png', 
    description: 'クラシックなベースボールユニフォーム', 
    category: 'baseball',
    productType: getProductType('baseball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('baseball'))
  },
  { 
    id: 'baseball-4', 
    name: 'ベースボールユニフォーム（タイプ4）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/野球4.png', 
    description: 'プロフェッショナルなベースボールユニフォーム', 
    category: 'baseball',
    productType: getProductType('baseball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('baseball'))
  },
  { 
    id: 'baseball-5', 
    name: 'ベースボールユニフォーム（タイプ5）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/野球5.png', 
    description: 'エレガントなベースボールユニフォーム', 
    category: 'baseball',
    productType: getProductType('baseball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('baseball'))
  },
  { 
    id: 'baseball-7', 
    name: 'ベースボールユニフォーム（タイプ7）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/野球7.png', 
    description: 'ダイナミックなベースボールユニフォーム', 
    category: 'baseball',
    productType: getProductType('baseball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('baseball'))
  },
  { 
    id: 'baseball-8', 
    name: 'ベースボールユニフォーム（タイプ8）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/野球8.png', 
    description: 'スタイリッシュなベースボールユニフォーム', 
    category: 'baseball',
    productType: getProductType('baseball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('baseball'))
  },
  { 
    id: 'basket-1', 
    name: 'バスケットボールユニフォーム（タイプ1）', 
    price: 1580, 
    basePrice: 1580,
    image: '/クラT画像/バスケ1.png', 
    description: 'スタンダードなバスケットボールユニフォーム', 
    category: 'basket',
    productType: getProductType('basket'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('basket'))
  },
  { 
    id: 'basket-4', 
    name: 'バスケットボールユニフォーム（タイプ4）', 
    price: 1580, 
    basePrice: 1580,
    image: '/クラT画像/バスケ4.png', 
    description: 'モダンなバスケットボールユニフォーム', 
    category: 'basket',
    productType: getProductType('basket'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('basket'))
  },
  { 
    id: 'basket-5', 
    name: 'バスケットボールユニフォーム（タイプ5）', 
    price: 1580, 
    basePrice: 1580,
    image: '/クラT画像/バスケ5.png', 
    description: 'プロフェッショナルなバスケットボールユニフォーム', 
    category: 'basket',
    productType: getProductType('basket'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('basket'))
  },
  { 
    id: 'basket-6', 
    name: 'バスケットボールユニフォーム（タイプ6）', 
    price: 1580, 
    basePrice: 1580,
    image: '/クラT画像/バスケ6.png', 
    description: 'エレガントなバスケットボールユニフォーム', 
    category: 'basket',
    productType: getProductType('basket'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('basket'))
  },
  { 
    id: 'basket-7', 
    name: 'バスケットボールユニフォーム（タイプ7）', 
    price: 1580, 
    basePrice: 1580,
    image: '/クラT画像/バスケ7.png', 
    description: 'ダイナミックなバスケットボールユニフォーム', 
    category: 'basket',
    productType: getProductType('basket'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('basket'))
  },
  { 
    id: 'basket-8', 
    name: 'バスケットボールユニフォーム（タイプ8）', 
    price: 1580, 
    basePrice: 1580,
    image: '/クラT画像/バスケ8.png', 
    description: 'スタイリッシュなバスケットボールユニフォーム', 
    category: 'basket',
    productType: getProductType('basket'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('basket'))
  },
   { 
     id: 'soccer-2', 
    name: 'サッカーユニフォーム（タイプ2）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/サッカー2.png', 
    description: 'スタイリッシュなデザインのサッカーユニフォーム', 
    category: 'soccer',
    productType: getProductType('soccer'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('soccer'))
  },
  { 
    id: 'soccer-3', 
    name: 'サッカーユニフォーム（タイプ3）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/サッカー3.png', 
    description: 'クラシックなデザインのサッカーユニフォーム', 
    category: 'soccer',
    productType: getProductType('soccer'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('soccer'))
  },
  { 
    id: 'soccer-4', 
    name: 'サッカーユニフォーム（タイプ4）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/サッカー4.png', 
    description: 'モダンなデザインのサッカーユニフォーム', 
    category: 'soccer',
    productType: getProductType('soccer'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('soccer'))
  },
  { 
    id: 'soccer-5', 
    name: 'サッカーユニフォーム（タイプ5）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/サッカー5.png', 
    description: 'エレガントなデザインのサッカーユニフォーム', 
    category: 'soccer',
    productType: getProductType('soccer'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('soccer'))
  },
  { 
    id: 'soccer-7', 
    name: 'サッカーユニフォーム（タイプ7）', 
    price: 1680, 
    basePrice: 1680,
    image: '/クラT画像/サッカー7.png', 
    description: 'ダイナミックなデザインのサッカーユニフォーム', 
    category: 'soccer',
    productType: getProductType('soccer'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('soccer'))
  },
  { 
    id: 'soccer-dry', 
    name: 'ドライサッカーシャツ', 
    price: 1880, 
    basePrice: 1880,
    image: '/クラT画像/ドライサッカーシャツ.png', 
    description: '速乾性に優れたドライサッカーシャツ', 
    category: 'soccer',
    productType: getProductType('soccer'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('soccer'))
  },
  { 
    id: 'volleyball-1', 
    name: 'バレーボールユニフォーム（タイプ1）', 
    price: 1580, 
    basePrice: 1580,
    image: '/クラT画像/バレー.png', 
    description: 'スタンダードなバレーボールユニフォーム', 
    category: 'volleyball',
    productType: getProductType('volleyball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('volleyball'))
  },
  { 
    id: 'volleyball-2', 
    name: 'バレーボールユニフォーム（タイプ2）', 
    price: 1580, 
    basePrice: 1580,
    image: '/クラT画像/バレ-2.png', 
    description: 'モダンなデザインのバレーボールユニフォーム', 
    category: 'volleyball',
    productType: getProductType('volleyball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('volleyball'))
  },
]

export default products