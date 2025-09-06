import React from 'react'

export default function CustomerSupport() {
  return (
    <div className="form">
      <h1>顧客サポート</h1>
      
      <div className="legal-content">
        <section className="legal-section">
          <h2>お問い合わせについて</h2>
          <p>商品に関するご質問、ご注文に関するお問い合わせ、その他ご不明な点がございましたら、下記のメールアドレスまでお気軽にお問い合わせください。</p>
        </section>

        <section className="legal-section support-contact">
          <h2>顧客サポート専用メールアドレス</h2>
          <div className="contact-info">
            <p className="email-address">
              <span className="email-icon">📧</span>
              <strong>contact@la-muse.org</strong>
            </p>
          </div>
        </section>

        <section className="legal-section">
          <h2>お問い合わせの際のお願い</h2>
          <ul>
            <li>お名前（フルネーム）</li>
            <li>ご注文番号（ご注文に関するお問い合わせの場合）</li>
            <li>お問い合わせ内容の詳細</li>
            <li>ご連絡先（お電話番号またはメールアドレス）</li>
          </ul>
          <p>上記の情報をご記載いただくことで、より迅速で正確な対応が可能となります。</p>
        </section>

        <section className="legal-section">
          <h2>対応時間</h2>
          <p>平日 9:00〜18:00（土日祝日を除く）</p>
          <p>※お問い合わせの内容によっては、回答までにお時間をいただく場合がございます。予めご了承ください。</p>
        </section>

        <section className="legal-section">
          <h2>よくあるご質問</h2>
          <div className="faq-item">
            <h3>Q. 注文後のキャンセルは可能ですか？</h3>
            <p>A. オーダーメイド商品の特性上、お客様都合によるキャンセル・返品はお受けできません。ただし、製造上の不具合がある場合は交換対応いたします。</p>
          </div>
          <div className="faq-item">
            <h3>Q. 配送にはどのくらい時間がかかりますか？</h3>
            <p>A. ご注文確定後、通常2〜3週間程度でお届けいたします。詳細な納期については、ご注文時にご案内いたします。</p>
          </div>
          <div className="faq-item">
            <h3>Q. サイズ交換は可能ですか？</h3>
            <p>A. オーダーメイド商品のため、サイズ交換はお受けできません。ご注文前にサイズ表をよくご確認ください。</p>
          </div>
        </section>
      </div>
    </div>
  )
}