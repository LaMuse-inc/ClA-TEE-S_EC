export type Product = {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: 'tshirt' | 'polo' | 'soccer' | 'basket'
}

const products: Product[] = [
  // Tシャツ系
  { id: 'tshirt-basic', name: 'Tシャツ（ベーシック）', price: 980, image: '/assets/tshirt.svg', description: 'クラスTの定番', category: 'tshirt' },
  { id: 'tshirt-dry', name: 'Tシャツ（ドライ）', price: 1180, image: '/assets/tshirt.svg', description: '速乾・軽量で快適', category: 'tshirt' },
  { id: 'tshirt-long', name: 'Tシャツ（ロング）', price: 1280, image: '/assets/tshirt.svg', description: '肌寒い時期に最適', category: 'tshirt' },

  // ポロシャツ系
  { id: 'polo-basic', name: 'ポロシャツ（ベーシック）', price: 1480, image: '/assets/polo.svg', description: 'きれいめで涼しい', category: 'polo' },
  { id: 'polo-pocket', name: 'ポロシャツ（ポケット付）', price: 1580, image: '/assets/polo.svg', description: 'ちょっと便利な胸ポケット', category: 'polo' },

  // サッカー系
  { id: 'soccer-pro', name: 'サッカーユニフォーム（PRO）', price: 1980, image: '/assets/soccer.svg', description: '試合向け高機能モデル', category: 'soccer' },
  { id: 'soccer-kids', name: 'サッカーユニフォーム（KIDS）', price: 1680, image: '/assets/soccer.svg', description: 'ジュニア向けサイズ', category: 'soccer' },

  // バスケ系
  { id: 'basket-pro', name: 'バスケユニフォーム（PRO）', price: 1980, image: '/assets/basket.svg', description: '動きやすい軽量モデル', category: 'basket' },
  { id: 'basket-mesh', name: 'バスケユニフォーム（メッシュ）', price: 1880, image: '/assets/basket.svg', description: '通気性に優れた生地', category: 'basket' },
]

export default products