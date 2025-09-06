import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="form">
      <h1>プライバシーポリシー</h1>
      
      <div className="legal-content">
        <section className="legal-section">
          <h2>1. 個人情報の収集について</h2>
          <p>当サイトでは、お客様からのお問い合わせやご注文の際に、以下の個人情報を収集させていただく場合があります。</p>
          <ul>
            <li>氏名</li>
            <li>メールアドレス</li>
            <li>電話番号</li>
            <li>住所</li>
            <li>その他、サービス提供に必要な情報</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. 個人情報の利用目的</h2>
          <p>収集した個人情報は、以下の目的で利用いたします。</p>
          <ul>
            <li>商品の発送およびサービスの提供</li>
            <li>お客様からのお問い合わせへの対応</li>
            <li>商品・サービスに関する情報のご案内</li>
            <li>アフターサービス、メンテナンスのご案内</li>
            <li>新商品・サービスに関する情報のご案内</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. 個人情報の第三者提供</h2>
          <p>当社は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません。</p>
          <ul>
            <li>お客様の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. 個人情報の管理</h2>
          <p>当社は、お客様の個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備・社員教育の徹底等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行います。</p>
        </section>

        <section className="legal-section">
          <h2>5. 個人情報の開示・訂正・削除</h2>
          <p>お客様ご本人が個人情報の照会・修正・削除などをご希望される場合には、ご本人であることを確認の上、対応させていただきます。</p>
        </section>

        <section className="legal-section">
          <h2>6. Cookieの使用について</h2>
          <p>当サイトでは、より良いサービス提供のため、Cookieを使用する場合があります。Cookieの使用を希望されない場合は、ブラウザの設定でCookieを無効にすることができます。</p>
        </section>

        <section className="legal-section">
          <h2>7. プライバシーポリシーの変更</h2>
          <p>当社は、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。修正された最新のプライバシーポリシーは常に本ページにて開示いたします。</p>
        </section>

        <section className="legal-section">
          <h2>8. お問い合わせ</h2>
          <p>本ポリシーに関するお問い合わせは、下記の連絡先までお願いいたします。</p>
          <p><strong>株式会社LaMuse</strong><br />
          メール：privacy@lamuse.co.jp</p>
        </section>

        <div className="legal-footer">
          <p>制定日：2025年1月1日<br />
          最終更新日：2025年1月1日</p>
        </div>
      </div>
    </div>
  )
}