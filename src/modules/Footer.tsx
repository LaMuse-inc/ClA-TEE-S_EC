import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-copyright">&copy; 2024 Cla-T-ees by 株式会社LaMuse. All Rights Reserved.</p>
        <div className="footer-links">
          <Link to="/tokushoho" className="footer-link">
            <span className="footer-link-icon">📋</span>
            特定商取引法に基づく表記
          </Link>
          <span className="footer-link-separator">|</span>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="footer-link">
            <span className="footer-link-icon">📄</span>
            利用規約
          </a>
        </div>
      </div>
    </footer>
  )
}