export default function Footer() {
  return (
    <footer
      style={{
        padding: '50px 80px 56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
      }}
    >
      <nav style={{ display: 'flex', gap: '56px' }}>
        {['Features', 'How It Works', 'Pricing', 'About', 'Contact'].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              color: '#1C1917',
              textDecoration: 'none',
              fontSize: '17px',
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      <div style={{ display: 'flex', gap: '22px' }}>
        {/* Facebook */}
        <a
          href="#"
          aria-label="Facebook"
          style={{
            color: '#1C1917',
            display: 'inline-flex',
            width: '30px',
            height: '30px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
          </svg>
        </a>

        {/* X */}
        <a
          href="#"
          aria-label="X"
          style={{
            color: '#1C1917',
            display: 'inline-flex',
            width: '30px',
            height: '30px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="#"
          aria-label="Instagram"
          style={{
            color: '#1C1917',
            display: 'inline-flex',
            width: '30px',
            height: '30px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="#"
          aria-label="LinkedIn"
          style={{
            color: '#1C1917',
            display: 'inline-flex',
            width: '30px',
            height: '30px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.02 5.42 6.95V22h-4.55v-6.49c0-1.55-.03-3.55-2.16-3.55-2.16 0-2.49 1.69-2.49 3.43V22H7.62V8z" />
          </svg>
        </a>
      </div>
    </footer>
  )
}
