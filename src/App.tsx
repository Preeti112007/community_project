import React, { useRef, useState } from 'react';

// Navigation links shown in the top bar
const NAV_ITEMS = [
  'Home',
  'Crop Advisory',
  'Pest Guide',
  'Pesticide Safety',
  'Organic Farming',
  'Soil Health',
  'About',
] as const;

type NavItem = (typeof NAV_ITEMS)[number];

// Available crop and pest options for the Get Crop Advisory form
const CROP_OPTIONS = ['Tomato', 'Rice', 'Wheat', 'Potato', 'Cotton', 'Maize'];
const SYMPTOM_OPTIONS = [
  'Leaf Spot',
  'Aphids',
  'Early Blight',
  'Powdery Mildew',
  'Fruit Borer',
  'Root Rot',
];

// Simple lookup data for crop advisory recommendations
const SYMPTOM_GUIDE: Record<
  string,
  { organic: string; chemical: string; precaution: string }
> = {
  'Leaf Spot': {
    organic:
      'Remove heavily spotted lower leaves. Spray neem oil (3 ml per liter of water) or diluted compost tea every 7 days in the morning.',
    chemical:
      'If severe, apply copper oxychloride (2.5 g per liter) or mancozeb as recommended by your local agriculture extension office.',
    precaution:
      'Avoid overhead watering in the evening, wear gloves and a mask while spraying, and observe a 7-day pre-harvest waiting period.',
  },
  Aphids: {
    organic:
      'Wash stems with a gentle water stream and apply neem oil + mild soap spray (5 ml per liter). Encourage ladybugs in the field.',
    chemical:
      'Use potassium salts of fatty acids first; only use targeted low-toxicity systemic sprays if infestation crosses threshold levels.',
    precaution:
      'Spray late in the afternoon to protect honeybees and pollinators. Never exceed the label dosage.',
  },
  'Early Blight': {
    organic:
      'Mulch soil around plants to stop soil splash. Prune lower leaves and spray Trichoderma-based bio-fungicide.',
    chemical:
      'Apply chlorothalonil or copper-based fungicide at 10-day intervals during humid weather.',
    precaution:
      'Rotate crops every season and wash tools with soap after pruning infected plants.',
  },
  'Powdery Mildew': {
    organic:
      'Spray baking soda solution (5 g baking soda + 2 ml liquid soap per liter) or wettable sulfur in cool hours.',
    chemical:
      'Apply wettable sulfur (2 g per liter of water) carefully ensuring coverage on both leaf surfaces.',
    precaution:
      'Do not apply sulfur when air temperatures exceed 32°C to avoid leaf burn.',
  },
  'Fruit Borer': {
    organic:
      'Install pheromone traps (5 per acre), pick damaged fruits manually, and spray Bacillus thuringiensis (Bt) in the evening.',
    chemical:
      'Use neem seed kernel extract (5%) first; consult an agronomist before using targeted bio-rational insecticides.',
    precaution:
      'Keep chemical containers locked away from children and wash hands thoroughly after handling.',
  },
  'Root Rot': {
    organic:
      'Improve field drainage immediately and drench the root zone with Trichoderma viride mixed in well-rotted farmyard manure.',
    chemical:
      'Treat seeds before planting and avoid waterlogging; apply targeted soil drench only on expert advice.',
    precaution:
      'Never over-irrigate heavy clay soils and sanitize nursery trays before sowing.',
  },
};

// Ideal soil pH ranges for each crop
const CROP_IDEAL_PH: Record<string, { min: number; max: number }> = {
  Tomato: { min: 6.0, max: 6.8 },
  Rice: { min: 5.5, max: 6.5 },
  Wheat: { min: 6.0, max: 7.5 },
  Potato: { min: 5.2, max: 6.4 },
  Cotton: { min: 6.0, max: 7.5 },
  Maize: { min: 5.8, max: 7.0 },
};

// Guide content shown when clicking the top nav links or the 5 feature cards
const SECTION_GUIDES: Record<
  Exclude<NavItem, 'Home' | 'Crop Advisory'>,
  {
    title: string;
    intro: string;
    cards: { heading: string; text: string }[];
  }
> = {
  'Pest Guide': {
    title: 'Common Pest Identification & Control Guide',
    intro:
      'Early detection protects crop yield and reduces the need for chemical sprays. Inspect the underside of leaves twice a week.',
    cards: [
      {
        heading: 'Sucking Pests (Aphids & Whiteflies)',
        text: 'Look for curled leaves and sticky honeydew. Use yellow sticky traps and neem oil spray early in the morning.',
      },
      {
        heading: 'Fungal Leaf Spots & Blights',
        text: 'Watch for brown rings or yellow halos after rain. Remove infected leaves and space plants for good airflow.',
      },
      {
        heading: 'Chewing Caterpillars & Borers',
        text: 'Check buds and young fruits for small entry holes. Use pheromone traps and Bt biological sprays.',
      },
    ],
  },
  'Pesticide Safety': {
    title: 'Safe Pesticide Handling, Dosage & Precautions',
    intro:
      'Always read the product label completely before opening any bottle. Use the minimum effective dose.',
    cards: [
      {
        heading: 'Protective Gear (PPE)',
        text: 'Wear full-sleeve clothing, waterproof gloves, eye protection, and a face mask when mixing or spraying.',
      },
      {
        heading: 'Correct Mixing & Weather',
        text: 'Measure dosage accurately with a measuring cap. Spray during calm mornings or evenings, never against strong wind.',
      },
      {
        heading: 'Storage & Harvest Interval',
        text: 'Keep pesticides in original labeled containers away from food and water. Follow the pre-harvest waiting days.',
      },
    ],
  },
  'Organic Farming': {
    title: 'Natural & Chemical-Free Farming Practices',
    intro:
      'Healthy living soil grows resilient crops that naturally resist pests and drought.',
    cards: [
      {
        heading: 'Botanical Sprays (Neem & Garlic)',
        text: 'Neem seed kernel extract and neem oil repel over 200 chewing and sucking insects without harming soil microbes.',
      },
      {
        heading: 'Crop Rotation & Intercropping',
        text: 'Alternate legumes with vegetables and grow marigolds on borders to attract beneficial insects and deter nematodes.',
      },
      {
        heading: 'Compost & Bio-Fertilizers',
        text: 'Use vermicompost, green manure, and Rhizobium or Azotobacter cultures to build long-term fertility.',
      },
    ],
  },
  'Soil Health': {
    title: 'Understanding Soil pH, NPK & Fertility',
    intro:
      'Balanced soil nutrition ensures roots absorb water and nutrients efficiently without waste.',
    cards: [
      {
        heading: 'Soil pH Balance (6.0 - 7.0)',
        text: 'Most vegetables thrive in slightly acidic to neutral soil. Add agricultural lime for acidic soils or gypsum/organic matter for alkaline soils.',
      },
      {
        heading: 'Primary Nutrients (N-P-K)',
        text: 'Nitrogen (N) supports leafy growth, Phosphorus (P) strengthens roots and flowers, and Potassium (K) improves fruit quality and disease resistance.',
      },
      {
        heading: 'Organic Matter & Mulching',
        text: 'Cover bare soil with dry straw or leaf mulch to retain moisture, regulate root temperature, and feed earthworms.',
      },
    ],
  },
  About: {
    title: 'About GreenKisan Crop Advisory',
    intro:
      'GreenKisan is a simple digital resource designed to help farmers and growers adopt safe pesticide habits, natural soil care, and sustainable crop management.',
    cards: [
      {
        heading: 'Our Purpose',
        text: 'Provide clear, beginner-friendly agricultural guidance that balances crop protection with environmental safety.',
      },
      {
        heading: 'Integrated Pest Management',
        text: 'We prioritize prevention, biological controls, and organic sprays before recommending chemical interventions.',
      },
      {
        heading: 'Local Guidance Reminder',
        text: 'Always verify regional crop varieties and registered chemical dosages with your local Krishi Vigyan Kendra or agricultural officer.',
      },
    ],
  },
};

export default function App() {
  // Active navigation tab state
  const [activeTab, setActiveTab] = useState<NavItem>('Home');

  // Form states matching the screenshot defaults (Tomato, Leaf Spot, 6.5)
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedSymptom, setSelectedSymptom] = useState('Leaf Spot');
  const [soilPh, setSoilPh] = useState('6.5');

  // Stores the submitted recommendation to display below the form
  const [recommendation, setRecommendation] = useState<{
    crop: string;
    symptom: string;
    phText: string;
    organic: string;
    chemical: string;
    precaution: string;
  } | null>(null);

  const cropSelectRef = useRef<HTMLSelectElement>(null);

  // Handles clicking a navbar link or one of the 5 feature cards
  function handleSelectTab(tab: NavItem) {
    setActiveTab(tab);

    if (tab === 'Crop Advisory') {
      cropSelectRef.current?.focus();
      cropSelectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Computes soil pH message and builds crop advisory recommendation
  function handleGetRecommendation(event: React.FormEvent) {
    event.preventDefault();

    const guide = SYMPTOM_GUIDE[selectedSymptom] || SYMPTOM_GUIDE['Leaf Spot'];
    const ideal = CROP_IDEAL_PH[selectedCrop] || { min: 6.0, max: 7.0 };
    const parsedPh = parseFloat(soilPh);

    let phText = `No soil pH entered. Ideal range for ${selectedCrop} is ${ideal.min} - ${ideal.max}.`;

    if (soilPh.trim() !== '') {
      if (Number.isNaN(parsedPh) || parsedPh < 0 || parsedPh > 14) {
        phText = `Entered soil pH ("${soilPh}") is not a valid 0-14 pH value. Ideal range for ${selectedCrop} is ${ideal.min} - ${ideal.max}.`;
      } else if (parsedPh < ideal.min) {
        phText = `Soil pH ${parsedPh} is slightly acidic for ${selectedCrop} (ideal: ${ideal.min} - ${ideal.max}). Add compost or agricultural lime gradually.`;
      } else if (parsedPh > ideal.max) {
        phText = `Soil pH ${parsedPh} is slightly alkaline for ${selectedCrop} (ideal: ${ideal.min} - ${ideal.max}). Incorporate organic compost or elemental sulfur.`;
      } else {
        phText = `Soil pH ${parsedPh} is optimal for ${selectedCrop} (ideal: ${ideal.min} - ${ideal.max}).`;
      }
    }

    setRecommendation({
      crop: selectedCrop,
      symptom: selectedSymptom,
      phText,
      organic: guide.organic,
      chemical: guide.chemical,
      precaution: guide.precaution,
    });
  }

  const activeGuide =
    activeTab !== 'Home' && activeTab !== 'Crop Advisory'
      ? SECTION_GUIDES[activeTab]
      : null;

  return (
    <div>
      {/* Header Navigation Bar */}
      <header className="site-header">
        <div className="header-inner">
          <button
            type="button"
            className="brand-logo"
            onClick={() => handleSelectTab('Home')}
          >
            {/* Simple Two-Leaf GreenKisan Logo */}
            <svg
              width="34"
              height="30"
              viewBox="0 0 36 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M18 28C18 16 10 8 3 6C3 17 9 25 18 28Z"
                fill="#204a2b"
              />
              <path
                d="M18 28C18 15 26 7 33 4C33 16 27 24 18 28Z"
                fill="#5a9c36"
              />
              <path
                d="M18 28C14 21 10 15 6 11"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M18 28C22 20 26 14 30 9"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <span>GreenKisan</span>
          </button>

          <nav className="nav-links" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelectTab(item)}
                className={`nav-button ${activeTab === item ? 'active' : ''}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="main-content">
        {/* Hero Banner */}
        <section className="hero-section">
          <img
            src="/images/hero-field.jpg"
            alt="Green agricultural crop field under a bright sky"
            className="hero-image"
          />
          <div className="hero-overlay-box">
            <h1 className="hero-title">
              A Digital Guide for Safe Pesticide Usage and Organic Agriculture
            </h1>
            <p className="hero-subtitle">
              Crop-specific guidance, pest management, pesticide safety and
              sustainable farming practices.
            </p>
          </div>
        </section>

        {/* 5 Feature Cards Row */}
        <section className="cards-grid" aria-label="Advisory topics">
          {/* Card 1: Crop Advisory */}
          <button
            type="button"
            className={`feature-card ${activeTab === 'Crop Advisory' ? 'selected' : ''}`}
            onClick={() => handleSelectTab('Crop Advisory')}
          >
            <div className="card-icon">
              <svg width="52" height="46" viewBox="0 0 56 48" fill="none" aria-hidden="true">
                <ellipse cx="28" cy="41" rx="22" ry="5" fill="#6b4423" />
                <path d="M12 41C16 33 40 33 44 41H12Z" fill="#59361a" />
                <path d="M28 36V18" stroke="#4d7c0f" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 24C21 24 14 19 13 11C21 11 27 16 28 24Z" fill="#65a30d" />
                <path d="M28 21C35 21 42 16 43 8C35 8 29 13 28 21Z" fill="#76b818" />
              </svg>
            </div>
            <h3 className="card-title">Crop Advisory</h3>
            <p className="card-description">
              Get management suggestions for your crop.
            </p>
          </button>

          {/* Card 2: Pest Guide */}
          <button
            type="button"
            className={`feature-card ${activeTab === 'Pest Guide' ? 'selected' : ''}`}
            onClick={() => handleSelectTab('Pest Guide')}
          >
            <div className="card-icon">
              <svg width="48" height="46" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <path d="M20 11L16 5M28 11L32 5" stroke="#3f6212" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M16 19L9 14M15 26L8 26M16 33L10 39" stroke="#3f6212" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M32 19L39 14M33 26L40 26M32 33L38 39" stroke="#3f6212" strokeWidth="1.8" strokeLinecap="round" />
                <ellipse cx="24" cy="14" rx="5" ry="4" fill="#3f6212" />
                <ellipse cx="24" cy="28" rx="9" ry="12" fill="#65a30d" stroke="#3f6212" strokeWidth="1.5" />
                <path d="M24 17V40" stroke="#3f6212" strokeWidth="1.5" />
                <path d="M16 21C20 23 28 23 32 21" stroke="#3f6212" strokeWidth="1.4" />
              </svg>
            </div>
            <h3 className="card-title">Pest Guide</h3>
            <p className="card-description">
              Identify common pests and control measures.
            </p>
          </button>

          {/* Card 3: Pesticide Safety */}
          <button
            type="button"
            className={`feature-card ${activeTab === 'Pesticide Safety' ? 'selected' : ''}`}
            onClick={() => handleSelectTab('Pesticide Safety')}
          >
            <div className="card-icon">
              <svg width="46" height="46" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <path d="M19 8H31L33 13H19V8Z" fill="#4d7c0f" />
                <path d="M19 9L14 11V14L19 12" fill="#65a30d" />
                <path d="M31 11L35 16" stroke="#4d7c0f" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="20" y="13" width="8" height="4" fill="#3f6212" />
                <path
                  d="M20 17H28L33 25V41C33 42.5 31.8 43.5 30.5 43.5H17.5C16.2 43.5 15 42.5 15 41V25L20 17Z"
                  fill="#ffffff"
                  stroke="#4d7c0f"
                  strokeWidth="1.8"
                />
                <path
                  d="M24 37C24 31 28 27 30 26C30 31 27 35 24 37Z"
                  fill="#65a30d"
                />
                <path
                  d="M24 37C24 32 20 29 18 28C18 32 21 35 24 37Z"
                  fill="#4d7c0f"
                />
              </svg>
            </div>
            <h3 className="card-title">Pesticide Safety</h3>
            <p className="card-description">
              Learn safe handling, dosage and precautions.
            </p>
          </button>

          {/* Card 4: Organic Farming */}
          <button
            type="button"
            className={`feature-card ${activeTab === 'Organic Farming' ? 'selected' : ''}`}
            onClick={() => handleSelectTab('Organic Farming')}
          >
            <div className="card-icon">
              <svg width="52" height="46" viewBox="0 0 56 48" fill="none" aria-hidden="true">
                <path d="M27 42V22" stroke="#4d7c0f" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M27 29C17 29 10 21 9 11C19 11 26 18 27 29Z" fill="#76b818" />
                <path d="M27 27C37 27 45 19 46 8C36 8 28 16 27 27Z" fill="#5b9e2d" />
                <path d="M27 29C22 23 17 18 13 15" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M27 27C33 21 38 16 42 12" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="card-title">Organic Farming</h3>
            <p className="card-description">
              Explore natural and chemical-free farming methods.
            </p>
          </button>

          {/* Card 5: Soil Health */}
          <button
            type="button"
            className={`feature-card ${activeTab === 'Soil Health' ? 'selected' : ''}`}
            onClick={() => handleSelectTab('Soil Health')}
          >
            <div className="card-icon">
              <svg width="56" height="46" viewBox="0 0 60 48" fill="none" aria-hidden="true">
                <path d="M6 42C12 28 48 28 54 42H6Z" fill="#6b4423" />
                <path d="M13 42C18 33 42 33 47 42H13Z" fill="#4a2e16" />
                <circle cx="20" cy="38" r="1.5" fill="#8b5a2b" />
                <circle cx="38" cy="37" r="1.5" fill="#8b5a2b" />
                <path d="M30 32V16" stroke="#4d7c0f" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M30 22C23 22 17 17 16 9C23 9 29 14 30 22Z" fill="#65a30d" />
                <path d="M30 19C37 19 43 14 44 6C37 6 31 11 30 19Z" fill="#76b818" />
              </svg>
            </div>
            <h3 className="card-title">Soil Health</h3>
            <p className="card-description">
              Understand soil pH, NPK and improve soil fertility.
            </p>
          </button>
        </section>

        {/* Bottom Two-Column Section: Advisory Form + Tomato Photo */}
        <section className="bottom-section">
          {/* Left Column: Get Crop Advisory Form */}
          <div className="advisory-card">
            <div className="advisory-header">
              <h2>Get Crop Advisory</h2>
            </div>

            <form className="advisory-form" onSubmit={handleGetRecommendation}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="crop-select">Select Crop :</label>
                  <select
                    id="crop-select"
                    ref={cropSelectRef}
                    className="form-control"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                  >
                    {CROP_OPTIONS.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="symptom-select">Pest / Symptom :</label>
                  <select
                    id="symptom-select"
                    className="form-control"
                    value={selectedSymptom}
                    onChange={(e) => setSelectedSymptom(e.target.value)}
                  >
                    {SYMPTOM_OPTIONS.map((symptom) => (
                      <option key={symptom} value={symptom}>
                        {symptom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="soil-ph">Soil pH (Optional) :</label>
                  <input
                    id="soil-ph"
                    type="text"
                    className="form-control"
                    value={soilPh}
                    onChange={(e) => setSoilPh(e.target.value)}
                    placeholder="6.5"
                  />
                </div>
              </div>

              <div className="button-row">
                <button type="submit" className="submit-button">
                  Get Recommendation
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Tomato Plant Photo */}
          <div className="tomato-photo-box">
            <img
              src="/images/tomatoes.jpg"
              alt="Ripe red and green tomatoes growing on a healthy plant vine"
              className="tomato-photo"
            />
          </div>
        </section>

        {/* Advisory Recommendation Panel (shown after clicking Get Recommendation) */}
        {recommendation && (
          <section className="info-panel" aria-live="polite">
            <div className="info-panel-header">
              <h3>
                Advisory Recommendation: {recommendation.crop} —{' '}
                {recommendation.symptom}
              </h3>
              <button
                type="button"
                className="close-button"
                onClick={() => setRecommendation(null)}
              >
                Close
              </button>
            </div>
            <div className="info-panel-body">
              <p>
                <strong>Soil pH Note:</strong> {recommendation.phText}
              </p>
              <div className="info-grid">
                <div className="info-box">
                  <h4>Organic Control</h4>
                  <p>{recommendation.organic}</p>
                </div>
                <div className="info-box">
                  <h4>Targeted Spray Guidance</h4>
                  <p>{recommendation.chemical}</p>
                </div>
                <div className="info-box">
                  <h4>Safety Precautions</h4>
                  <p>{recommendation.precaution}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Active Topic Guide Panel (shown when selecting Pest Guide, Safety, Organic, Soil Health, or About) */}
        {activeGuide && (
          <section className="info-panel" aria-live="polite">
            <div className="info-panel-header">
              <h3>{activeGuide.title}</h3>
              <button
                type="button"
                className="close-button"
                onClick={() => setActiveTab('Home')}
              >
                Back to Home
              </button>
            </div>
            <div className="info-panel-body">
              <p>{activeGuide.intro}</p>
              <div className="info-grid">
                {activeGuide.cards.map((card) => (
                  <div key={card.heading} className="info-box">
                    <h4>{card.heading}</h4>
                    <p>{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
