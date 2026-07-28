import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7F2EA', // Cream background to match PrologueLearn paper style
          borderRadius: '8px',
          padding: '4px',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Horizontal crossbar of the T: Vermillion */}
          <rect x="3" y="5" width="18" height="4.5" rx="2.25" fill="#C0392B" />
          
          {/* Vertical stem of the T: Ink/Charcoal */}
          <rect x="10" y="9.5" width="4" height="10.5" rx="2" fill="#1C1917" />
          
          {/* Ruler ticks: Cream background color */}
          <rect x="12" y="11.5" width="2" height="1" fill="#F7F2EA" />
          <rect x="12" y="14.5" width="2" height="1" fill="#F7F2EA" />
          <rect x="12" y="17.5" width="2" height="1" fill="#F7F2EA" />
          
          {/* Gold accent dot */}
          <circle cx="18" cy="14.5" r="1.5" fill="#FFD500" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
