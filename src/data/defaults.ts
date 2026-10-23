// Default official vector icons, flags, logos, stamps, and signatures for Benishangul Gumuz Police System

// 1. Ethiopian National Flag SVG (Data URL)
export const DEFAULT_ETHIOPIA_FLAG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
  <rect width="900" height="200" fill="#009a44"/>
  <rect y="200" width="900" height="200" fill="#fed100"/>
  <rect y="400" width="900" height="200" fill="#ef2b2d"/>
  <circle cx="450" cy="300" r="130" fill="#0033a0"/>
  <g fill="#fed100">
    <polygon points="450,195 466,245 518,245 476,276 492,326 450,295 408,326 424,276 382,245 434,245"/>
    <circle cx="450" cy="300" r="105" fill="none" stroke="#fed100" stroke-width="10"/>
    <line x1="450" y1="180" x2="450" y2="420" stroke="#0033a0" stroke-width="6"/>
    <line x1="330" y1="300" x2="570" y2="300" stroke="#0033a0" stroke-width="6"/>
    <line x1="365" y1="215" x2="535" y2="385" stroke="#0033a0" stroke-width="6"/>
    <line x1="365" y1="385" x2="535" y2="215" stroke="#0033a0" stroke-width="6"/>
  </g>
</svg>
`)}`;

// 2. Benishangul Gumuz Regional State Flag SVG (Data URL)
export const DEFAULT_REGION_FLAG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
  <!-- Horizontal Stripes: Black, Gold, Green -->
  <rect width="900" height="200" fill="#111111"/>
  <rect y="200" width="900" height="200" fill="#ffcc00"/>
  <rect y="400" width="900" height="200" fill="#008837"/>
  <!-- Red Triangle on Hoist -->
  <polygon points="0,0 350,300 0,600" fill="#da291c"/>
  <!-- Regional Emblem: White Star on Red Triangle -->
  <g transform="translate(110,300) scale(0.65)" fill="#ffffff">
    <polygon points="0,-90 26,-28 92,-28 38,12 59,74 0,35 -59,74 -38,12 -92,-28 -26,-28"/>
  </g>
</svg>
`)}`;

// 3. Benishangul Gumuz Police College Logo SVG (Data URL)
export const DEFAULT_COMMISSION_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff2a8"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#8a6d1c"/>
    </radialGradient>
    <radialGradient id="blueGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1d3557"/>
      <stop offset="100%" stop-color="#0a192f"/>
    </radialGradient>
    <path id="textArcTop" d="M 50,200 A 150,150 0 1,1 350,200" />
  </defs>

  <!-- Outer Ring with Gold Border -->
  <circle cx="200" cy="200" r="190" fill="url(#blueGrad)" stroke="url(#goldGrad)" stroke-width="12"/>
  <circle cx="200" cy="200" r="168" fill="none" stroke="#d4af37" stroke-width="3" stroke-dasharray="6,4"/>

  <!-- Inner Ethiopian Tricolor Ring -->
  <circle cx="200" cy="200" r="158" fill="none" stroke="#009a44" stroke-width="6"/>
  <circle cx="200" cy="200" r="150" fill="none" stroke="#fed100" stroke-width="6"/>
  <circle cx="200" cy="200" r="142" fill="none" stroke="#ef2b2d" stroke-width="6"/>

  <!-- Gold Star Background Shield -->
  <polygon points="200,65 220,110 268,110 230,140 244,185 200,155 156,185 170,140 132,110 180,110" fill="url(#goldGrad)"/>

  <!-- Center Police Emblem (Scale of Justice + Laurel + Star) -->
  <circle cx="200" cy="235" r="75" fill="#0a192f" stroke="url(#goldGrad)" stroke-width="5"/>
  
  <!-- Scale of Justice -->
  <path d="M 200,185 L 200,265 M 160,205 L 240,205 M 160,205 L 145,245 M 160,205 L 175,245 M 240,205 L 225,245 M 240,205 L 255,245" stroke="#d4af37" stroke-width="4" stroke-linecap="round"/>
  <path d="M 135,245 Q 160,260 185,245 M 215,245 Q 240,260 265,245" fill="none" stroke="#d4af37" stroke-width="4"/>
  
  <!-- Laurel Wreath Around -->
  <path d="M 100,230 Q 110,290 170,310 M 300,230 Q 290,290 230,310" fill="none" stroke="url(#goldGrad)" stroke-width="7" stroke-linecap="round"/>

  <!-- Circular Amharic Text -->
  <text font-family="sans-serif" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="middle">
    <textPath href="#textArcTop" startOffset="50%">
      የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ
    </textPath>
  </text>
  
  <!-- English Subtext in Center/Bottom -->
  <text x="200" y="340" font-family="sans-serif" font-weight="bold" font-size="13" fill="#d4af37" text-anchor="middle" letter-spacing="1">
    BGR POLICE COLLEGE
  </text>
  <text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">
    ACADEMY &amp; TRAINING DIVISION
  </text>
</svg>
`)}`;

// 4. Police Chest Badge / Metallic Shield SVG (Data URL)
export const DEFAULT_CHEST_BADGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320">
  <defs>
    <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff4b8"/>
      <stop offset="30%" stop-color="#e6c657"/>
      <stop offset="70%" stop-color="#b8860b"/>
      <stop offset="100%" stop-color="#664d03"/>
    </linearGradient>
    <radialGradient id="centerBadgeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </radialGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- 7-Point Police Star Background -->
  <g filter="url(#dropShadow)" fill="url(#shieldGold)" stroke="#3a2a02" stroke-width="2">
    <!-- Star Rays -->
    <path d="M 150,10 L 170,60 L 220,20 L 210,75 L 275,60 L 235,105 L 290,135 L 235,160 L 280,210 L 215,200 L 225,260 L 180,225 L 150,285 L 120,225 L 75,260 L 85,200 L 20,210 L 65,160 L 10,135 L 65,105 L 25,60 L 90,75 L 80,20 L 130,60 Z"/>
  </g>

  <!-- Eagle / Crest Top Header -->
  <g transform="translate(150,55) scale(0.8)" text-anchor="middle">
    <!-- Shield Outline -->
    <path d="M -80,-10 L 80,-10 L 90,60 C 90,120 0,160 0,160 C 0,160 -90,120 -90,60 Z" fill="#0a192f" stroke="url(#shieldGold)" stroke-width="6"/>
    
    <!-- Amharic POLICE Header Banner -->
    <rect x="-70" y="5" width="140" height="30" rx="4" fill="url(#shieldGold)"/>
    <text x="0" y="26" font-family="sans-serif" font-weight="900" font-size="18" fill="#0a192f" letter-spacing="2">
      ፖሊስ POLICE
    </text>

    <!-- Center Ethiopian Star Emblem -->
    <circle cx="0" cy="80" r="38" fill="url(#centerBadgeGlow)" stroke="url(#shieldGold)" stroke-width="4"/>
    <polygon points="0,52 9,72 30,72 13,84 19,104 0,91 -19,104 -13,84 -30,72 -9,72" fill="url(#shieldGold)"/>

    <!-- Bottom Ribbon text -->
    <path d="M -65,130 Q 0,145 65,130" fill="none" stroke="url(#shieldGold)" stroke-width="12" stroke-linecap="round"/>
    <text x="0" y="134" font-family="sans-serif" font-weight="bold" font-size="8.5" fill="#0a192f" letter-spacing="1">
      ቤኒሻንጉል ጉሙዝ ፖሊስ ኮሌጅ
    </text>
  </g>
</svg>
`)}`;

// 5. Official Circular Police Stamp SVG (Data URL) - Red/Blue High Security Ink
export const DEFAULT_OFFICIAL_STAMP = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <defs>
    <path id="stampTextPath" d="M 35,150 A 115,115 0 1,1 265,150 A 115,115 0 1,1 35,150"/>
  </defs>
  <!-- Outer Rough Stamp Ring -->
  <circle cx="150" cy="150" r="140" fill="none" stroke="#1d4ed8" stroke-width="5" stroke-opacity="0.85"/>
  <circle cx="150" cy="150" r="132" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-dasharray="8,4" stroke-opacity="0.85"/>
  <circle cx="150" cy="150" r="100" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-opacity="0.85"/>

  <!-- Circular Text -->
  <text font-family="sans-serif" font-weight="900" font-size="13" fill="#1d4ed8" fill-opacity="0.9" letter-spacing="1.1">
    <textPath href="#stampTextPath" startOffset="0%">
      ★ የቤኒሻንጉል ጉሙዝ ክልል ፖሊስ ኮሌጅ ★ BGR POLICE COLLEGE ★
    </textPath>
  </text>

  <!-- Center Emblem in Stamp -->
  <g transform="translate(150, 150)" stroke="#1d4ed8" fill="none" stroke-width="2" stroke-opacity="0.9">
    <!-- Star -->
    <polygon points="0,-35 9,-11 33,-11 14,3 21,26 0,13 -21,26 -14,3 -33,-11 -9,-11" fill="#1d4ed8" fill-opacity="0.2"/>
    <!-- Stamp Text -->
    <text x="0" y="38" font-family="sans-serif" font-weight="bold" font-size="12" fill="#1d4ed8" text-anchor="middle">
      ትክክለኛ ማህተም
    </text>
    <text x="0" y="52" font-family="sans-serif" font-weight="bold" font-size="10" fill="#1d4ed8" text-anchor="middle">
      OFFICIAL SEAL
    </text>
  </g>
</svg>
`)}`;

// 6. Authorized Commissioner Signature SVG (Data URL)
export const DEFAULT_OFFICIAL_SIGNATURE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120">
  <!-- Handwritten Calligraphic Signature Path -->
  <path d="M 20,70 C 40,20 60,110 80,40 C 90,10 110,90 130,50 C 140,30 150,80 170,40 C 190,10 200,90 230,60 Q 250,40 280,50 M 40,80 L 260,80 M 110,65 C 130,50 170,85 190,70" fill="none" stroke="#0a192f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Date stamp under signature -->
  <text x="150" y="105" font-family="monospace" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">
    የኮሌጁ ኮማንዳንት / COLLEGE COMMANDANT
  </text>
</svg>
`)}`;
