import { useNavigate } from 'react-router-dom'

export default function Order() {
  const navigate = useNavigate()
  return (
    <form className="form" onSubmit={(e)=>{e.preventDefault(); navigate('/payment')}}>
      <h1>注文フォーム</h1>
      <label>お名前<input required name="name" autoComplete="name" inputMode="text" /></label>
      <label>メール<input type="email" required name="email" autoComplete="email" inputMode="email" /></label>
      <label>電話番号<input type="tel" required name="tel" autoComplete="tel" inputMode="tel" /></label>
      <label>配送先住所<textarea required rows={3} name="address" autoComplete="street-address" /></label>
      <button className="btn primary" type="submit">確認へ</button>
    </form>
  )
}