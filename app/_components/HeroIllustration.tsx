// Static SVG injected as raw markup to preserve the hand-authored illustration verbatim.
const SVG = `
<svg viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="skinG" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#F5CBA7"/><stop offset="100%" stop-color="#DC9A6A"/>
    </radialGradient>
    <radialGradient id="bellyG" cx="45%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#FDEBD0"/><stop offset="100%" stop-color="#E8956B"/>
    </radialGradient>
    <radialGradient id="wombG" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="rgba(255,240,245,0.9)"/>
      <stop offset="70%" stop-color="rgba(201,123,90,0.3)"/>
      <stop offset="100%" stop-color="rgba(156,175,136,0.25)"/>
    </radialGradient>
    <radialGradient id="babyG" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FDEBD0"/><stop offset="100%" stop-color="#DFA86E"/>
    </radialGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="4" in="SourceAlpha" result="shadow"/>
      <feOffset dx="0" dy="3"/>
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInner"/>
      <feFlood flood-color="rgba(220,120,100,0.3)" result="color"/>
      <feComposite in="color" in2="shadowInner" operator="in" result="shadow"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <ellipse cx="150" cy="32" rx="38" ry="24" fill="#2C1810"/>
  <path d="M112 55 Q100 85 104 120 Q108 140 112 155" stroke="#2C1810" stroke-width="14" stroke-linecap="round" fill="none"/>
  <path d="M188 55 Q200 85 196 120 Q192 140 188 155" stroke="#2C1810" stroke-width="14" stroke-linecap="round" fill="none"/>
  <ellipse cx="113" cy="62" rx="12" ry="32" fill="#2C1810"/>
  <ellipse cx="187" cy="62" rx="12" ry="32" fill="#2C1810"/>
  <ellipse cx="150" cy="62" rx="37" ry="43" fill="url(#skinG)"/>
  <path d="M127 50 Q136 46 143 50" stroke="#5C3020" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M157 50 Q164 46 173 50" stroke="#5C3020" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <ellipse cx="137" cy="60" rx="7" ry="6" fill="#1A0F0A"/>
  <ellipse cx="163" cy="60" rx="7" ry="6" fill="#1A0F0A"/>
  <circle cx="139" cy="58" r="2.5" fill="white"/>
  <circle cx="165" cy="58" r="2.5" fill="white"/>
  <circle cx="140" cy="57.5" r="1" fill="white" opacity="0.8"/>
  <path d="M147 68 Q150 74 153 68" stroke="#C8856C" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M140 78 Q150 85 160 78" stroke="#C8856C" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="126" cy="70" rx="9" ry="6" fill="rgba(201,123,90,0.3)"/>
  <ellipse cx="174" cy="70" rx="9" ry="6" fill="rgba(201,123,90,0.3)"/>
  <ellipse cx="113" cy="66" rx="7" ry="10" fill="#DC9A6A"/>
  <ellipse cx="187" cy="66" rx="7" ry="10" fill="#DC9A6A"/>
  <rect x="136" y="100" width="28" height="26" rx="10" fill="url(#skinG)"/>
  <path d="M110 118 Q88 135 75 165 Q68 195 65 225 Q62 270 65 360 Q100 378 150 376 Q200 378 235 360 Q238 270 235 225 Q232 195 225 165 Q212 135 190 118 Q175 112 150 110 Q125 112 110 118Z" fill="rgba(201,123,90,0.6)" stroke="rgba(201,123,90,0.5)" stroke-width="1.2"/>
  <path d="M120 114 Q150 126 180 114" stroke="rgba(255,255,255,0.6)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M75 185 Q58 220 62 260 Q68 285 82 296" stroke="#DC9A6A" stroke-width="24" stroke-linecap="round" fill="none"/>
  <ellipse cx="88" cy="300" rx="18" ry="13" fill="#DC9A6A" transform="rotate(-15,88,300)"/>
  <path d="M78 298 Q88 294 98 298" stroke="rgba(180,100,60,0.4)" stroke-width="1" fill="none"/>
  <path d="M76 303 Q88 299 100 303" stroke="rgba(180,100,60,0.4)" stroke-width="1" fill="none"/>
  <path d="M225 185 Q242 220 238 260 Q232 285 218 296" stroke="#DC9A6A" stroke-width="24" stroke-linecap="round" fill="none"/>
  <ellipse cx="212" cy="300" rx="18" ry="13" fill="#DC9A6A" transform="rotate(15,212,300)"/>
  <path d="M202 298 Q212 294 222 298" stroke="rgba(180,100,60,0.4)" stroke-width="1" fill="none"/>
  <path d="M200 303 Q212 299 224 303" stroke="rgba(180,100,60,0.4)" stroke-width="1" fill="none"/>
  <ellipse cx="150" cy="248" rx="76" ry="72" fill="url(#bellyG)" stroke="rgba(220,154,106,0.3)" stroke-width="1.5"/>
  <ellipse cx="134" cy="224" rx="26" ry="20" fill="rgba(255,255,255,0.2)" transform="rotate(-18,134,224)"/>
  <ellipse cx="150" cy="222" rx="5" ry="4" fill="rgba(180,100,60,0.25)" filter="url(#innerShadow)"/>
  <ellipse cx="150" cy="252" rx="54" ry="52" fill="none" stroke="rgba(201,123,90,0.55)" stroke-width="1.8" stroke-dasharray="5 3.5" opacity="0.9"/>
  <ellipse cx="150" cy="252" rx="48" ry="46" fill="rgba(255,245,248,0.7)" stroke="rgba(201,123,90,0.45)" stroke-width="1.2"/>
  <ellipse cx="150" cy="252" rx="46" ry="44" fill="url(#wombG)"/>
  <ellipse cx="138" cy="238" rx="20" ry="14" fill="rgba(255,255,255,0.2)" transform="rotate(-22,138,238)"/>
  <ellipse cx="162" cy="264" rx="14" ry="9" fill="rgba(255,255,255,0.12)" transform="rotate(10,162,264)"/>
  <ellipse cx="158" cy="258" rx="24" ry="20" fill="url(#babyG)" filter="url(#softGlow)"/>
  <circle cx="143" cy="238" r="15" fill="url(#babyG)" filter="url(#softGlow)"/>
  <path d="M138 236 Q140.5 234 143 236" stroke="#C07040" stroke-width="1.3" stroke-linecap="round" fill="none"/>
  <path d="M144 236 Q146.5 234 149 236" stroke="#C07040" stroke-width="1.3" stroke-linecap="round" fill="none"/>
  <circle cx="143" cy="239" r="1.3" fill="#C07040" opacity="0.5"/>
  <path d="M140 243 Q143 245 146 243" stroke="#C07040" stroke-width="1.1" stroke-linecap="round" fill="none"/>
  <path d="M162 248 Q172 240 170 232 Q167 226 161 229" stroke="#DFA86E" stroke-width="6" stroke-linecap="round" fill="none" filter="url(#softGlow)"/>
  <path d="M170 264 Q180 274 176 283 Q171 288 164 283" stroke="#DFA86E" stroke-width="6" stroke-linecap="round" fill="none" filter="url(#softGlow)"/>
  <ellipse cx="161" cy="285" rx="9" ry="7" fill="#DFA86E" transform="rotate(-10,161,285)" filter="url(#softGlow)"/>
  <path d="M150 276 Q146 286 148 294" stroke="rgba(201,123,90,0.75)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M102 252 L116 252 L122 238 L128 266 L135 252 L148 252" stroke="rgba(201,123,90,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <g opacity="0.8">
    <circle cx="76" cy="148" r="3" fill="#C97B5A"/>
    <line x1="76" y1="141" x2="76" y2="145" stroke="#C97B5A" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="76" y1="151" x2="76" y2="155" stroke="#C97B5A" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="69" y1="148" x2="73" y2="148" stroke="#C97B5A" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="79" y1="148" x2="83" y2="148" stroke="#C97B5A" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  <g opacity="0.7">
    <circle cx="224" cy="162" r="2.2" fill="#9CAF88"/>
    <line x1="224" y1="157" x2="224" y2="160" stroke="#9CAF88" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="224" y1="164" x2="224" y2="167" stroke="#9CAF88" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="219" y1="162" x2="222" y2="162" stroke="#9CAF88" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="226" y1="162" x2="229" y2="162" stroke="#9CAF88" stroke-width="1.3" stroke-linecap="round"/>
  </g>
  <circle cx="92" cy="318" r="2" fill="#C97B5A" opacity="0.5"/>
  <circle cx="208" cy="310" r="1.6" fill="#9CAF88" opacity="0.5"/>
  <circle cx="240" cy="240" r="1.4" fill="#C97B5A" opacity="0.4"/>
</svg>`;

export default function HeroIllustration() {
  return <div className="hero-illustration" dangerouslySetInnerHTML={{ __html: SVG }} />;
}
