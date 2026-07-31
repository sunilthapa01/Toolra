import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation for favicon
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
          background: '#09090B', // Dark theme slate/charcoal background
          borderRadius: '8px',
          padding: '3px',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Horizontal crossbar of the T: Crimson Red */}
          <rect x="3" y="5" width="18" height="4.5" rx="2.25" fill="#EF4444" />
          
          {/* Vertical stem of the T: High contrast white */}
          <rect x="10" y="9.5" width="4" height="10.5" rx="2" fill="#F8FAFC" />
          
          {/* Ruler ticks: Cutouts matching dark background */}
          <rect x="12" y="11.5" width="2" height="1" fill="#09090B" />
          <rect x="12" y="14.5" width="2" height="1" fill="#09090B" />
          <rect x="12" y="17.5" width="2" height="1" fill="#09090B" />
          
          {/* Gold accent dot */}
          <circle cx="18" cy="14.5" r="1.5" fill="#FACC15" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
