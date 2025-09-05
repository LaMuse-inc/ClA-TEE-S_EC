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

// 価格ルールの定義
const pricingRules: PricingRule[] = [
  { category: 'custom-tshirt', specification: { printLocation: 'front' }, unitPrice: 1500 },
  { category: 'custom-tshirt', specification: { printLocation: 'both' }, unitPrice: 1800 },
  { category: 'custom-polo', specification: { printLocation: 'front' }, unitPrice: 1500 },
  { category: 'custom-polo', specification: { printLocation: 'both' }, unitPrice: 1800 },
  { category: 'soccer', specification: { backPrint: 'none' }, unitPrice: 1400 },
  { category: 'soccer', specification: { backPrint: 'nameNumber' }, unitPrice: 1800 },
  { category: 'basketball', specification: { backPrint: 'none' }, unitPrice: 1400 },
  { category: 'basketball', specification: { backPrint: 'nameNumber' }, unitPrice: 1800 },
  { category: 'baseball', specification: { backPrint: 'none' }, unitPrice: 1400 },
  { category: 'baseball', specification: { backPrint: 'nameNumber' }, unitPrice: 1800 }
]

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
  productCategory: ProductCategory // 新しい価格計算用カテゴリ
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
  try {
    const rule = pricingRules.find(r => 
      r.category === product.productCategory && 
      JSON.stringify(r.specification) === JSON.stringify(specification)
    )
    
    return rule ? rule.unitPrice : (product.basePrice || product.price)
  } catch (error) {
    console.warn('Price calculation error:', error)
    return product.basePrice || product.price
  }
}

// 価格計算（先生無料キャンペーン対応）
export function calculateTotalPrice(
  product: Product, 
  specification: ProductSpecification, 
  totalQuantity: number, 
  teacherCampaign: boolean = false
): { unitPrice: number; subtotal: number; discount: number; finalPrice: number } {
  try {
    const unitPrice = calculateProductPrice(product, specification)
    const subtotal = unitPrice * Math.max(0, totalQuantity)
    const discount = teacherCampaign ? unitPrice : 0
    const finalPrice = Math.max(0, subtotal - discount)
    
    return { unitPrice, subtotal, discount, finalPrice }
  } catch (error) {
    console.warn('Total price calculation error:', error)
    const fallbackPrice = product.basePrice || product.price
    const subtotal = fallbackPrice * Math.max(0, totalQuantity)
    return { 
      unitPrice: fallbackPrice, 
      subtotal, 
      discount: 0, 
      finalPrice: subtotal 
    }
  }
}

// 商品タイプ判定ヘルパー関数
export function getProductType(category: Product['category']): ProductType {
  return (category === 'tshirt' || category === 'polo') ? 'custom' : 'uniform'
}

// 新しい商品カテゴリ判定ヘルパー関数
export function getProductCategory(category: Product['category']): ProductCategory {
  switch (category) {
    case 'tshirt': return 'custom-tshirt'
    case 'polo': return 'custom-polo'
    case 'soccer': return 'soccer'
    case 'basket': return 'basketball'
    case 'baseball': return 'baseball'
    default: return 'custom-tshirt'
  }
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('tshirt'),
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
    productCategory: getProductCategory('baseball'),
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
    productCategory: getProductCategory('baseball'),
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
    productCategory: getProductCategory('baseball'),
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
    productCategory: getProductCategory('baseball'),
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
    productCategory: getProductCategory('baseball'),
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
    productCategory: getProductCategory('baseball'),
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
    productCategory: getProductCategory('baseball'),
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
    productCategory: getProductCategory('baseball'),
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
    productCategory: getProductCategory('basket'),
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
    productCategory: getProductCategory('basket'),
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
    productCategory: getProductCategory('basket'),
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
    productCategory: getProductCategory('basket'),
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
    productCategory: getProductCategory('basket'),
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
    productCategory: getProductCategory('basket'),
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
    productCategory: getProductCategory('soccer'),
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
    productCategory: getProductCategory('soccer'),
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
    productCategory: getProductCategory('soccer'),
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
    productCategory: getProductCategory('soccer'),
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
    productCategory: getProductCategory('soccer'),
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
    productCategory: getProductCategory('soccer'),
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
    productCategory: getProductCategory('volleyball'),
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
    productCategory: getProductCategory('volleyball'),
    productType: getProductType('volleyball'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('volleyball'))
  },
  {
    id: 'polo-basic-1',
    name: 'ベーシックポロシャツ（タイプ1）',
    price: 1800,
    basePrice: 1800,
    image: '/クラT画像/ポロ1.png',
    description: 'シンプルで使いやすいポロシャツ',
    category: 'polo',
    productCategory: getProductCategory('polo'),
    productType: getProductType('polo'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('polo'))
  },
  {
    id: 'polo-basic-2',
    name: 'ベーシックポロシャツ（タイプ2）',
    price: 1800,
    basePrice: 1800,
    image: '/クラT画像/ポロ2.png',
    description: 'エレガントなデザインのポロシャツ',
    category: 'polo',
    productCategory: getProductCategory('polo'),
    productType: getProductType('polo'),
    colors,
    sizes,
    variants: generateVariants(),
    availableSpecifications: getAvailableSpecifications(getProductType('polo'))
  }
]

export default products