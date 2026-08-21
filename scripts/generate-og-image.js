import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#002b2b" />
      <stop offset="50%" stop-color="#004c4c" />
      <stop offset="100%" stop-color="#006666" />
    </linearGradient>

    <radialGradient id="glowTopRight" cx="85%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#00b3b3" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#002b2b" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="glowBottomLeft" cx="15%" cy="85%" r="50%">
      <stop offset="0%" stop-color="#008080" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#002b2b" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2dd4bf" />
      <stop offset="100%" stop-color="#99f6e4" />
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.12)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.04)" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#glowTopRight)" />
  <rect width="1200" height="630" fill="url(#glowBottomLeft)" />

  <!-- Subtle Decorative Grid Pattern -->
  <g opacity="0.08" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="90" x2="1200" y2="90" />
    <line x1="0" y1="180" x2="1200" y2="180" />
    <line x1="0" y1="270" x2="1200" y2="270" />
    <line x1="0" y1="360" x2="1200" y2="360" />
    <line x1="0" y1="450" x2="1200" y2="450" />
    <line x1="0" y1="540" x2="1200" y2="540" />

    <line x1="120" y1="0" x2="120" y2="630" />
    <line x1="240" y1="0" x2="240" y2="630" />
    <line x1="360" y1="0" x2="360" y2="630" />
    <line x1="480" y1="0" x2="480" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="720" y1="0" x2="720" y2="630" />
    <line x1="840" y1="0" x2="840" y2="630" />
    <line x1="960" y1="0" x2="960" y2="630" />
    <line x1="1080" y1="0" x2="1080" y2="630" />
  </g>

  <!-- Container Box / Card Border -->
  <rect x="60" y="50" width="1080" height="530" rx="24" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />

  <!-- Top Pill / Status Tag -->
  <g transform="translate(100, 95)">
    <rect width="280" height="38" rx="19" fill="#003636" stroke="#2dd4bf" stroke-width="1.5" />
    <circle cx="22" cy="19" r="5" fill="#2dd4bf" />
    <text x="36" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#2dd4bf" letter-spacing="1.5">ACADEMIC PORTFOLIO</text>
  </g>

  <!-- Monogram Crest -->
  <g transform="translate(1010, 95)">
    <rect width="70" height="70" rx="18" fill="#003636" stroke="#2dd4bf" stroke-width="2" />
    <text x="35" y="44" text-anchor="middle" font-family="'Source Serif 4', Georgia, serif" font-size="24" font-weight="800" fill="#ffffff">MRH</text>
  </g>

  <!-- Main Heading: Name -->
  <text x="100" y="235" font-family="'Source Serif 4', Georgia, serif" font-size="54" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
    Muhammad Rezaul Haider
  </text>

  <!-- Subtitle -->
  <text x="100" y="285" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" fill="#99f6e4">
    Economics Researcher · Applied Econometrician
  </text>

  <!-- Affiliation Line -->
  <text x="100" y="325" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="400" fill="#ccfbf1">
    International Program for Islamic Economics &amp; Finance (IPIEF) · Universitas Muhammadiyah Yogyakarta
  </text>

  <!-- Divider Line -->
  <line x1="100" y1="365" x2="1100" y2="365" stroke="rgba(255, 255, 255, 0.18)" stroke-width="1.5" />

  <!-- Research Specializations Badges -->
  <g transform="translate(100, 395)">
    <!-- Badge 1 -->
    <rect x="0" y="0" width="240" height="42" rx="10" fill="rgba(0, 43, 43, 0.75)" stroke="rgba(45, 212, 191, 0.5)" stroke-width="1.2" />
    <text x="120" y="26" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#ffffff">Applied Panel Econometrics</text>

    <!-- Badge 2 -->
    <rect x="255" y="0" width="165" height="42" rx="10" fill="rgba(0, 43, 43, 0.75)" stroke="rgba(45, 212, 191, 0.5)" stroke-width="1.2" />
    <text x="337" y="26" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#ffffff">Labor Economics</text>

    <!-- Badge 3 -->
    <rect x="435" y="0" width="180" height="42" rx="10" fill="rgba(0, 43, 43, 0.75)" stroke="rgba(45, 212, 191, 0.5)" stroke-width="1.2" />
    <text x="525" y="26" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#ffffff">Gender Economics</text>

    <!-- Badge 4 -->
    <rect x="630" y="0" width="215" height="42" rx="10" fill="rgba(0, 43, 43, 0.75)" stroke="rgba(45, 212, 191, 0.5)" stroke-width="1.2" />
    <text x="737" y="26" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#ffffff">South &amp; Southeast Asia</text>
  </g>

  <!-- Toolkit & Methodology Row -->
  <g transform="translate(100, 460)">
    <text x="0" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#99f6e4" letter-spacing="1">QUANTITATIVE TOOLKIT:</text>
    <text x="210" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400" fill="#ffffff">STATA · EViews · R Studio · Python · Fixed Effects · 2SLS IV · Panel GMM</text>
  </g>

  <!-- Bottom Bar with Domain and Highlights -->
  <g transform="translate(100, 525)">
    <circle cx="8" cy="8" r="6" fill="#2dd4bf" />
    <text x="24" y="13" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#2dd4bf">rezaulhaider.vercel.app</text>
    <text x="1000" y="13" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#ccfbf1">Publications · Fellowships · Working Papers · CV</text>
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'og-image.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log(`Generated high-resolution OG image banner at ${outputPath}`);
}

generate().catch(console.error);
