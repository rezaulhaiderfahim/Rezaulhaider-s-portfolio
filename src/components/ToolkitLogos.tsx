import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * Official Python Logo
 * Dual blue (#3776AB) & yellow (#FFD43B) interlocking snakes
 */
export const PythonLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 110 110"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Python Logo"
  >
    <path
      d="M54.5 5.5c-27 0-25.3 11.7-25.3 11.7l.1 12.1h25.7v3.7H19.5S5.5 31.4 5.5 58.4c0 27 12.2 26.1 12.2 26.1h7.3v-10.2s-.4-12.2 12-12.2h25.5s11.5-.2 11.5-11.3V17S76 5.5 54.5 5.5zm-14.7 8.2c2.4 0 4.4 2 4.4 4.4s-2 4.4-4.4 4.4-4.4-2-4.4-4.4 2-4.4 4.4-4.4z"
      fill="#3776AB"
    />
    <path
      d="M55.5 104.5c27 0 25.3-11.7 25.3-11.7l-.1-12.1H55v-3.7h35.5s14 1.6 14-25.4c0-27-12.2-26.1-12.2-26.1h-7.3v10.2s.4 12.2-12 12.2H47.5s-11.5.2-11.5 11.3V93s-2 11.5 19.5 11.5zm14.7-8.2c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4 2 4.4 4.4-2 4.4-4.4 4.4z"
      fill="#FFD43B"
    />
  </svg>
);

/**
 * Official R Project Logo
 * Distinctive blue ellipse ring (#226CB5 / #163B66) with silver-gray 'R'
 */
export const RLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 724 561"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="R Logo"
  >
    <defs>
      <linearGradient id="r-grad-grey" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CBCDD2" />
        <stop offset="100%" stopColor="#85878B" />
      </linearGradient>
      <linearGradient id="r-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#226CB5" />
        <stop offset="100%" stopColor="#163B66" />
      </linearGradient>
    </defs>
    <path
      d="M362.4 0C162.3 0 0 125.6 0 280.5c0 154.9 162.3 280.5 362.4 280.5 200.2 0 362.5-125.6 362.5-280.5C724.9 125.6 562.6 0 362.4 0zm58.1 487.6c-175.7 0-318.1-92.7-318.1-207.1S244.8 73.4 420.5 73.4c175.6 0 318.1 92.7 318.1 207.1s-142.5 207.1-318.1 207.1z"
      fill="url(#r-grad-blue)"
    />
    <path
      d="M569.2 278.4c-9.1-13.8-24.9-23.7-47.5-29.6 19.3-8 32.7-18.7 40.1-32.2 7.4-13.5 11.1-29.7 11.1-48.6 0-31.5-10.7-56-32.2-73.4-21.5-17.4-52.6-26.1-93.2-26.1H273v386.9h95.9v-138h52.7l77.4 138h112.5l-92.3-152.2c22.5-6.6 39.2-14.8 50-24.8zm-119.5-67.6c-7.6 6.3-18.4 9.5-32.3 9.5h-48.5V161h48.5c13.9 0 24.7 3.2 32.3 9.5 7.6 6.3 11.4 15.3 11.4 26.9 0 11.6-3.8 20.7-11.4 27z"
      fill="url(#r-grad-grey)"
    />
  </svg>
);

/**
 * Official Stata Software Logo
 * Navy Blue (#0C4A7A) rounded emblem with bold Stata brand lettering & signature orange rule bar (#E26D24)
 */
export const StataLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Stata Logo"
  >
    <rect width="100" height="100" rx="20" fill="#0C4A7A" />
    <text
      x="50"
      y="54"
      fill="#FFFFFF"
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      fontWeight="900"
      fontSize="23"
      letterSpacing="1"
      textAnchor="middle"
    >
      STATA
    </text>
    <rect x="16" y="65" width="68" height="6" rx="3" fill="#E26D24" />
  </svg>
);

/**
 * Official EViews Logo
 * Crimson Red (#C8102E) emblem with stylized 'e' and econometric time-series forecast wave in gold (#FFC72C)
 */
export const EViewsLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="EViews Logo"
  >
    <rect width="100" height="100" rx="20" fill="#C8102E" />
    <path
      d="M50 20 C34.5 20 23 31.5 23 47 C23 62.5 34.5 74 50 74 C62 74 71.5 66.5 75 57.5 L64 57.5 C61.5 62 56.5 65.5 50 65.5 C39.5 65.5 32.5 57.5 31.8 49.5 L76.5 49.5 C77 47 77 44.5 76.5 42 C75 29.5 64 20 50 20 Z M32.2 42.5 C33.5 35 40.5 28.5 50 28.5 C59 28.5 65.5 34.5 67.2 42.5 L32.2 42.5 Z"
      fill="#FFFFFF"
    />
    <path
      d="M16 66 Q 32 50, 48 58 T 80 34"
      fill="none"
      stroke="#FFC72C"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <circle cx="80" cy="34" r="4" fill="#FFC72C" />
  </svg>
);

/**
 * Official IBM SPSS Statistics Logo
 * IBM Blue (#0F62FE) emblem with faceted statistical data analytics prism in IBM cobalt/ice tones
 */
export const SPSSLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="IBM SPSS Statistics Logo"
  >
    <rect width="100" height="100" rx="20" fill="#0F62FE" />
    <polygon points="50,18 80,36 50,54 20,36" fill="#82CFFF" />
    <polygon points="20,36 50,54 50,82 20,64" fill="#002D9C" />
    <polygon points="50,54 80,36 80,64 50,82" fill="#0043CE" />
    <polygon points="50,30 70,42 50,54 30,42" fill="#BAE6FF" opacity="0.85" />
  </svg>
);

/**
 * Universal Toolkit Logo Selector
 */
export const ToolkitLogo: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-6 h-6',
}) => {
  const normalized = name.trim().toLowerCase();

  if (normalized.includes('stata')) {
    return <StataLogo className={className} />;
  }
  if (normalized.includes('eviews')) {
    return <EViewsLogo className={className} />;
  }
  if (normalized === 'r' || normalized.includes('r project') || normalized.includes('r-lang')) {
    return <RLogo className={className} />;
  }
  if (normalized.includes('python') || normalized.includes('py')) {
    return <PythonLogo className={className} />;
  }
  if (normalized.includes('spss')) {
    return <SPSSLogo className={className} />;
  }

  // Fallback if custom
  return (
    <div className={`rounded-md bg-[#004c4c] text-white flex items-center justify-center font-bold text-[10px] ${className}`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};
