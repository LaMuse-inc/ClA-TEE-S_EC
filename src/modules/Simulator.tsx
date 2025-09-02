import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_PRICE = 980

export default function Simulator() {
  const navigate = useNavigate()
  const [template, setTemplate] = useState('tshirt')
  const [text, setText] = useState('CLASS 3-A')
  const [color, setColor] = useState('#1A237E')
  const [qty, setQty] = useState(10)
  const [image, setImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState(300)

  const total = useMemo(() => Math.max(qty, 0) * BASE_PRICE, [qty])

  const onFile = (f: File | null) => {
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(f)
  }

  // 親要素幅に応じてキャンバスサイズとDPRを調整
  useEffect(() => {
    const el = previewRef.current
    const canvas = canvasRef.current
    if (!el || !canvas) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const width = el.clientWidth || 300
      const size = Math.max(240, Math.min(width, 480)) // 画面に合わせて可変（最小240px, 最大480px）
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      canvas.width = Math.floor(size * dpr)
      canvas.height = Math.floor(size * dpr)
      setCanvasSize(size)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    // 論理座標系をCSSピクセルにする
    // @ts-ignore
    if (ctx.resetTransform) ctx.resetTransform()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const W = canvasSize, H = canvasSize
    ctx.clearRect(0, 0, W, H)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.decoding = 'async'
        img.src = src
      })

    const draw = async () => {
      try {
        const base = await loadImage(`/assets/${template}.svg`)
        const scale = Math.min(W / base.width, H / base.height) * 0.8
        const bw = base.width * scale
        const bh = base.height * scale
        const bx = (W - bw) / 2
        const by = (H - bh) / 2
        ctx.drawImage(base, bx, by, bw, bh)

        if (image) {
          const logo = await loadImage(image)
          const maxW = W * 0.5
          const maxH = H * 0.3
          const s = Math.min(maxW / logo.width, maxH / logo.height)
          const lw = logo.width * s
          const lh = logo.height * s
          const lx = (W - lw) / 2
          const ly = by + bh * 0.35 - lh / 2
          ctx.drawImage(logo, lx, ly, lw, lh)
        }

        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const fontSize = Math.max(14, Math.min(28, Math.floor(W / 12)))
        ctx.font = `700 ${fontSize}px system-ui, -apple-system, Arial`
        ctx.fillText(text, W / 2, by + bh * 0.65)

        ctx.strokeStyle = '#e5e7eb'
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1)
      } catch (e) {
        ctx.strokeStyle = '#e5e7eb'
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1)
      }
    }

    void draw()
  }, [template, text, color, image, canvasSize])

  return (
    <div className="simulator">
      <div className="preview" ref={previewRef}>
        <canvas ref={canvasRef} style={{ background: '#fff', border: '1px solid #e5e7eb', display: 'block' }} />
      </div>
      <div className="panel">
        <div className="step">
          <label>テンプレート</label>
          <select value={template} onChange={e => setTemplate(e.target.value)}>
            <option value="tshirt">Tシャツ</option>
            <option value="polo">ポロシャツ</option>
            <option value="soccer">サッカーユニフォーム</option>
            <option value="basket">バスケユニフォーム</option>
          </select>
        </div>
        <div className="step">
          <label>テキスト</label>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="文字を入力" />
          <label>色</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="step">
          <label>画像アップロード</label>
          <input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0] ?? null)} />
        </div>
        <div className="summary">
          <label>枚数</label>
          <input type="number" min={0} value={qty} onChange={e => setQty(Number(e.target.value))} />
          <div className="total">合計: ¥{total.toLocaleString()}</div>
          <button className="btn primary" onClick={() => navigate('/order')}>カートに追加</button>
        </div>
      </div>
    </div>
  )
}