// ==========================================================================
// ANTIGRAVITY — Research Data Layer
// All data constants, state datasets, index calculations, and parameters
// Sources: PLFS 2025, UIDAI 2025, PMJDY 2025, Union Budget 2026-27,
//          WID 2026, NASSCOM, McKinsey, WEF, ILO, World Bank, RBI
// ==========================================================================

const RESEARCH_DATA = (() => {

  // ========================================================================
  // 1. STATE-LEVEL DATASETS (28 States + 8 UTs = 36 entities)
  //    Each state has data for both IAAVI and UBIRI index components
  // ========================================================================

  const stateData = [
    // Format: { name, code, population (M, 2025 est.),
    //   IAAVI components: routineJobs%, mfgDep%, bpoDep%, informalSector%, youthUnemp%, femaleVuln%, digitalSkill (0-100 inverted, higher=worse), aiReadiness (0-100 inverted)
    //   UBIRI components: aadhaar%, bankAccess%, dbtInfra (0-100), internet%, digiLiteracy%, adminEfficiency (0-100), fiscalCapacity (own tax rev/GSDP %), taxCollection (0-100), povertyRate%, financialInclusion (0-100)
    // }
    { name: "Andhra Pradesh", code: "AP", pop: 53.0,
      routineJobs: 62, mfgDep: 11.2, bpoDep: 4.8, informalSector: 88, youthUnemp: 8.2, femaleVuln: 58, digitalSkill: 38, aiReadiness: 42,
      aadhaar: 99.2, bankAccess: 92, dbtInfra: 82, internet: 62, digiLiteracy: 41, adminEfficiency: 72, fiscalCapacity: 7.8, taxCollection: 68, povertyRate: 5.2, financialInclusion: 78 },
    { name: "Arunachal Pradesh", code: "AR", pop: 1.6,
      routineJobs: 48, mfgDep: 2.1, bpoDep: 0.2, informalSector: 94, youthUnemp: 12.5, femaleVuln: 42, digitalSkill: 55, aiReadiness: 72,
      aadhaar: 78.5, bankAccess: 72, dbtInfra: 48, internet: 38, digiLiteracy: 28, adminEfficiency: 42, fiscalCapacity: 2.1, taxCollection: 32, povertyRate: 18.4, financialInclusion: 45 },
    { name: "Assam", code: "AS", pop: 36.0,
      routineJobs: 58, mfgDep: 6.8, bpoDep: 1.2, informalSector: 92, youthUnemp: 11.8, femaleVuln: 52, digitalSkill: 48, aiReadiness: 62,
      aadhaar: 82.3, bankAccess: 78, dbtInfra: 55, internet: 42, digiLiteracy: 32, adminEfficiency: 48, fiscalCapacity: 3.2, taxCollection: 38, povertyRate: 14.2, financialInclusion: 52 },
    { name: "Bihar", code: "BR", pop: 128.0,
      routineJobs: 68, mfgDep: 5.2, bpoDep: 0.8, informalSector: 96, youthUnemp: 14.2, femaleVuln: 72, digitalSkill: 62, aiReadiness: 78,
      aadhaar: 88.5, bankAccess: 75, dbtInfra: 52, internet: 35, digiLiteracy: 25, adminEfficiency: 38, fiscalCapacity: 2.8, taxCollection: 28, povertyRate: 19.8, financialInclusion: 42 },
    { name: "Chhattisgarh", code: "CG", pop: 30.0,
      routineJobs: 64, mfgDep: 8.5, bpoDep: 0.5, informalSector: 93, youthUnemp: 7.8, femaleVuln: 55, digitalSkill: 52, aiReadiness: 65,
      aadhaar: 95.2, bankAccess: 82, dbtInfra: 65, internet: 38, digiLiteracy: 30, adminEfficiency: 55, fiscalCapacity: 5.5, taxCollection: 48, povertyRate: 17.5, financialInclusion: 55 },
    { name: "Goa", code: "GA", pop: 1.6,
      routineJobs: 42, mfgDep: 14.5, bpoDep: 2.5, informalSector: 68, youthUnemp: 9.8, femaleVuln: 35, digitalSkill: 28, aiReadiness: 32,
      aadhaar: 98.8, bankAccess: 95, dbtInfra: 85, internet: 82, digiLiteracy: 62, adminEfficiency: 78, fiscalCapacity: 11.2, taxCollection: 75, povertyRate: 3.8, financialInclusion: 88 },
    { name: "Gujarat", code: "GJ", pop: 72.0,
      routineJobs: 58, mfgDep: 18.5, bpoDep: 3.2, informalSector: 85, youthUnemp: 4.2, femaleVuln: 48, digitalSkill: 35, aiReadiness: 38,
      aadhaar: 97.5, bankAccess: 90, dbtInfra: 78, internet: 65, digiLiteracy: 45, adminEfficiency: 75, fiscalCapacity: 8.2, taxCollection: 72, povertyRate: 6.8, financialInclusion: 75 },
    { name: "Haryana", code: "HR", pop: 30.0,
      routineJobs: 55, mfgDep: 16.2, bpoDep: 8.5, informalSector: 82, youthUnemp: 12.5, femaleVuln: 62, digitalSkill: 32, aiReadiness: 35,
      aadhaar: 98.2, bankAccess: 92, dbtInfra: 80, internet: 72, digiLiteracy: 52, adminEfficiency: 72, fiscalCapacity: 8.5, taxCollection: 70, povertyRate: 5.5, financialInclusion: 78 },
    { name: "Himachal Pradesh", code: "HP", pop: 7.5,
      routineJobs: 48, mfgDep: 10.8, bpoDep: 1.0, informalSector: 85, youthUnemp: 8.5, femaleVuln: 38, digitalSkill: 35, aiReadiness: 45,
      aadhaar: 99.0, bankAccess: 95, dbtInfra: 82, internet: 68, digiLiteracy: 55, adminEfficiency: 78, fiscalCapacity: 6.8, taxCollection: 65, povertyRate: 4.2, financialInclusion: 82 },
    { name: "Jharkhand", code: "JH", pop: 39.0,
      routineJobs: 66, mfgDep: 9.8, bpoDep: 0.8, informalSector: 95, youthUnemp: 13.5, femaleVuln: 65, digitalSkill: 58, aiReadiness: 72,
      aadhaar: 90.2, bankAccess: 75, dbtInfra: 55, internet: 35, digiLiteracy: 25, adminEfficiency: 42, fiscalCapacity: 4.2, taxCollection: 35, povertyRate: 22.5, financialInclusion: 45 },
    { name: "Karnataka", code: "KA", pop: 69.0,
      routineJobs: 52, mfgDep: 12.8, bpoDep: 15.2, informalSector: 78, youthUnemp: 7.8, femaleVuln: 42, digitalSkill: 22, aiReadiness: 18,
      aadhaar: 98.5, bankAccess: 92, dbtInfra: 85, internet: 72, digiLiteracy: 58, adminEfficiency: 82, fiscalCapacity: 9.5, taxCollection: 78, povertyRate: 5.8, financialInclusion: 82 },
    { name: "Kerala", code: "KL", pop: 35.0,
      routineJobs: 42, mfgDep: 8.2, bpoDep: 5.5, informalSector: 75, youthUnemp: 15.8, femaleVuln: 32, digitalSkill: 18, aiReadiness: 22,
      aadhaar: 99.5, bankAccess: 98, dbtInfra: 92, internet: 78, digiLiteracy: 72, adminEfficiency: 85, fiscalCapacity: 7.2, taxCollection: 72, povertyRate: 2.8, financialInclusion: 92 },
    { name: "Madhya Pradesh", code: "MP", pop: 86.0,
      routineJobs: 65, mfgDep: 7.5, bpoDep: 2.2, informalSector: 94, youthUnemp: 8.5, femaleVuln: 62, digitalSkill: 55, aiReadiness: 68,
      aadhaar: 94.8, bankAccess: 78, dbtInfra: 62, internet: 38, digiLiteracy: 28, adminEfficiency: 52, fiscalCapacity: 5.2, taxCollection: 45, povertyRate: 15.8, financialInclusion: 55 },
    { name: "Maharashtra", code: "MH", pop: 128.0,
      routineJobs: 52, mfgDep: 15.8, bpoDep: 12.5, informalSector: 78, youthUnemp: 8.2, femaleVuln: 45, digitalSkill: 25, aiReadiness: 22,
      aadhaar: 99.0, bankAccess: 92, dbtInfra: 85, internet: 72, digiLiteracy: 55, adminEfficiency: 80, fiscalCapacity: 9.8, taxCollection: 82, povertyRate: 5.2, financialInclusion: 82 },
    { name: "Manipur", code: "MN", pop: 3.2,
      routineJobs: 52, mfgDep: 3.5, bpoDep: 0.2, informalSector: 92, youthUnemp: 15.2, femaleVuln: 45, digitalSkill: 48, aiReadiness: 65,
      aadhaar: 82.5, bankAccess: 72, dbtInfra: 45, internet: 42, digiLiteracy: 35, adminEfficiency: 42, fiscalCapacity: 1.8, taxCollection: 28, povertyRate: 16.2, financialInclusion: 48 },
    { name: "Meghalaya", code: "ML", pop: 3.8,
      routineJobs: 50, mfgDep: 3.2, bpoDep: 0.3, informalSector: 93, youthUnemp: 11.5, femaleVuln: 40, digitalSkill: 50, aiReadiness: 68,
      aadhaar: 80.2, bankAccess: 70, dbtInfra: 42, internet: 40, digiLiteracy: 30, adminEfficiency: 40, fiscalCapacity: 2.0, taxCollection: 30, povertyRate: 15.5, financialInclusion: 45 },
    { name: "Mizoram", code: "MZ", pop: 1.3,
      routineJobs: 38, mfgDep: 2.8, bpoDep: 0.2, informalSector: 88, youthUnemp: 8.8, femaleVuln: 28, digitalSkill: 32, aiReadiness: 48,
      aadhaar: 85.5, bankAccess: 82, dbtInfra: 58, internet: 55, digiLiteracy: 52, adminEfficiency: 62, fiscalCapacity: 2.2, taxCollection: 35, povertyRate: 8.5, financialInclusion: 62 },
    { name: "Nagaland", code: "NL", pop: 2.3,
      routineJobs: 45, mfgDep: 3.0, bpoDep: 0.2, informalSector: 91, youthUnemp: 14.8, femaleVuln: 38, digitalSkill: 45, aiReadiness: 62,
      aadhaar: 80.8, bankAccess: 72, dbtInfra: 45, internet: 42, digiLiteracy: 32, adminEfficiency: 38, fiscalCapacity: 1.5, taxCollection: 25, povertyRate: 12.5, financialInclusion: 48 },
    { name: "Odisha", code: "OD", pop: 47.0,
      routineJobs: 64, mfgDep: 8.2, bpoDep: 1.5, informalSector: 93, youthUnemp: 9.2, femaleVuln: 58, digitalSkill: 52, aiReadiness: 62,
      aadhaar: 96.5, bankAccess: 82, dbtInfra: 72, internet: 42, digiLiteracy: 32, adminEfficiency: 62, fiscalCapacity: 5.8, taxCollection: 52, povertyRate: 16.8, financialInclusion: 58 },
    { name: "Punjab", code: "PB", pop: 31.0,
      routineJobs: 55, mfgDep: 12.5, bpoDep: 3.5, informalSector: 82, youthUnemp: 10.5, femaleVuln: 55, digitalSkill: 35, aiReadiness: 42,
      aadhaar: 98.5, bankAccess: 92, dbtInfra: 78, internet: 65, digiLiteracy: 48, adminEfficiency: 68, fiscalCapacity: 6.8, taxCollection: 62, povertyRate: 5.8, financialInclusion: 75 },
    { name: "Rajasthan", code: "RJ", pop: 82.0,
      routineJobs: 63, mfgDep: 9.2, bpoDep: 2.8, informalSector: 92, youthUnemp: 10.8, femaleVuln: 68, digitalSkill: 52, aiReadiness: 62,
      aadhaar: 96.2, bankAccess: 82, dbtInfra: 68, internet: 42, digiLiteracy: 32, adminEfficiency: 58, fiscalCapacity: 5.8, taxCollection: 52, povertyRate: 12.5, financialInclusion: 58 },
    { name: "Sikkim", code: "SK", pop: 0.7,
      routineJobs: 38, mfgDep: 5.5, bpoDep: 0.5, informalSector: 78, youthUnemp: 8.2, femaleVuln: 32, digitalSkill: 32, aiReadiness: 42,
      aadhaar: 95.2, bankAccess: 90, dbtInfra: 72, internet: 65, digiLiteracy: 52, adminEfficiency: 72, fiscalCapacity: 4.5, taxCollection: 55, povertyRate: 5.2, financialInclusion: 72 },
    { name: "Tamil Nadu", code: "TN", pop: 78.0,
      routineJobs: 55, mfgDep: 18.2, bpoDep: 10.8, informalSector: 78, youthUnemp: 8.8, femaleVuln: 42, digitalSkill: 25, aiReadiness: 22,
      aadhaar: 99.2, bankAccess: 92, dbtInfra: 88, internet: 68, digiLiteracy: 55, adminEfficiency: 82, fiscalCapacity: 8.8, taxCollection: 78, povertyRate: 4.8, financialInclusion: 85 },
    { name: "Telangana", code: "TS", pop: 38.0,
      routineJobs: 52, mfgDep: 11.5, bpoDep: 14.8, informalSector: 80, youthUnemp: 9.5, femaleVuln: 48, digitalSkill: 22, aiReadiness: 20,
      aadhaar: 99.5, bankAccess: 92, dbtInfra: 88, internet: 72, digiLiteracy: 55, adminEfficiency: 82, fiscalCapacity: 9.2, taxCollection: 78, povertyRate: 4.5, financialInclusion: 82 },
    { name: "Tripura", code: "TR", pop: 4.2,
      routineJobs: 55, mfgDep: 4.2, bpoDep: 0.3, informalSector: 92, youthUnemp: 14.5, femaleVuln: 48, digitalSkill: 45, aiReadiness: 58,
      aadhaar: 92.5, bankAccess: 78, dbtInfra: 55, internet: 45, digiLiteracy: 35, adminEfficiency: 52, fiscalCapacity: 2.5, taxCollection: 32, povertyRate: 12.8, financialInclusion: 55 },
    { name: "Uttar Pradesh", code: "UP", pop: 235.0,
      routineJobs: 68, mfgDep: 8.8, bpoDep: 3.5, informalSector: 95, youthUnemp: 12.8, femaleVuln: 72, digitalSkill: 58, aiReadiness: 68,
      aadhaar: 94.5, bankAccess: 78, dbtInfra: 62, internet: 38, digiLiteracy: 28, adminEfficiency: 48, fiscalCapacity: 5.5, taxCollection: 42, povertyRate: 14.5, financialInclusion: 52 },
    { name: "Uttarakhand", code: "UK", pop: 11.5,
      routineJobs: 52, mfgDep: 12.5, bpoDep: 2.2, informalSector: 85, youthUnemp: 10.2, femaleVuln: 45, digitalSkill: 38, aiReadiness: 48,
      aadhaar: 97.5, bankAccess: 88, dbtInfra: 72, internet: 58, digiLiteracy: 45, adminEfficiency: 68, fiscalCapacity: 6.2, taxCollection: 58, povertyRate: 7.8, financialInclusion: 72 },
    { name: "West Bengal", code: "WB", pop: 100.0,
      routineJobs: 60, mfgDep: 10.5, bpoDep: 4.2, informalSector: 90, youthUnemp: 11.5, femaleVuln: 55, digitalSkill: 42, aiReadiness: 55,
      aadhaar: 95.8, bankAccess: 82, dbtInfra: 65, internet: 48, digiLiteracy: 35, adminEfficiency: 55, fiscalCapacity: 4.8, taxCollection: 45, povertyRate: 10.5, financialInclusion: 62 },
    // Union Territories
    { name: "Delhi", code: "DL", pop: 21.0,
      routineJobs: 45, mfgDep: 8.5, bpoDep: 12.8, informalSector: 72, youthUnemp: 12.2, femaleVuln: 48, digitalSkill: 18, aiReadiness: 15,
      aadhaar: 99.5, bankAccess: 95, dbtInfra: 90, internet: 85, digiLiteracy: 68, adminEfficiency: 82, fiscalCapacity: 12.5, taxCollection: 85, povertyRate: 3.5, financialInclusion: 90 },
    { name: "Jammu & Kashmir", code: "JK", pop: 14.0,
      routineJobs: 55, mfgDep: 5.5, bpoDep: 1.2, informalSector: 88, youthUnemp: 15.5, femaleVuln: 58, digitalSkill: 42, aiReadiness: 55,
      aadhaar: 90.5, bankAccess: 82, dbtInfra: 58, internet: 52, digiLiteracy: 38, adminEfficiency: 52, fiscalCapacity: 3.2, taxCollection: 35, povertyRate: 8.5, financialInclusion: 58 },
    { name: "Chandigarh", code: "CH", pop: 1.2,
      routineJobs: 38, mfgDep: 8.2, bpoDep: 6.5, informalSector: 62, youthUnemp: 8.5, femaleVuln: 32, digitalSkill: 18, aiReadiness: 18,
      aadhaar: 99.8, bankAccess: 98, dbtInfra: 92, internet: 88, digiLiteracy: 72, adminEfficiency: 85, fiscalCapacity: 14.2, taxCollection: 88, povertyRate: 2.8, financialInclusion: 92 },
    { name: "Puducherry", code: "PY", pop: 1.7,
      routineJobs: 45, mfgDep: 12.8, bpoDep: 3.2, informalSector: 72, youthUnemp: 10.2, femaleVuln: 38, digitalSkill: 28, aiReadiness: 32,
      aadhaar: 99.2, bankAccess: 92, dbtInfra: 82, internet: 72, digiLiteracy: 55, adminEfficiency: 75, fiscalCapacity: 7.5, taxCollection: 68, povertyRate: 4.5, financialInclusion: 82 },
  ];


  // ========================================================================
  // 2. IAAVI — India AI Automation Vulnerability Index
  //    Original index. 8 components. Equal-weighted (12.5% each).
  //    Higher score = MORE vulnerable. Scale: 0-100.
  // ========================================================================

  const IAAVI_WEIGHTS = {
    routineJobs: 0.15,     // Share of routine/repetitive jobs
    mfgDep: 0.15,          // Manufacturing dependence
    bpoDep: 0.12,          // BPO/IT services dependence (automatable tasks)
    informalSector: 0.15,  // Informal sector employment (no safety net)
    youthUnemp: 0.12,      // Youth unemployment rate
    femaleVuln: 0.12,      // Female workforce vulnerability
    digitalSkill: 0.10,    // Digital skill deficit (inverted: higher = worse)
    aiReadiness: 0.09      // AI readiness deficit (inverted: higher = worse)
  };

  // Normalize each component to 0–100 scale across states
  function normalizeComponent(data, key, higherIsWorse = true) {
    const values = data.map(s => s[key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return data.map(s => {
      const normalized = ((s[key] - min) / range) * 100;
      return higherIsWorse ? normalized : (100 - normalized);
    });
  }

  function calculateIAAVI(data) {
    const components = {};
    const keys = Object.keys(IAAVI_WEIGHTS);
    keys.forEach(key => {
      components[key] = normalizeComponent(data, key, true);
    });

    return data.map((state, i) => {
      let score = 0;
      keys.forEach(key => {
        score += components[key][i] * IAAVI_WEIGHTS[key];
      });
      return {
        name: state.name,
        code: state.code,
        score: Math.round(score * 10) / 10,
        components: keys.reduce((obj, key) => {
          obj[key] = Math.round(components[key][i] * 10) / 10;
          return obj;
        }, {})
      };
    }).sort((a, b) => b.score - a.score);
  }


  // ========================================================================
  // 3. UBIRI — Universal Basic Income Readiness Index
  //    Original index. 10 components. Weighted.
  //    Higher score = MORE ready for UBI implementation. Scale: 0-100.
  // ========================================================================

  const UBIRI_WEIGHTS = {
    aadhaar: 0.12,            // Aadhaar penetration
    bankAccess: 0.12,         // Bank account access (PMJDY)
    dbtInfra: 0.12,           // DBT infrastructure score
    internet: 0.10,           // Internet penetration
    digiLiteracy: 0.08,       // Digital literacy
    adminEfficiency: 0.10,    // Administrative efficiency
    fiscalCapacity: 0.12,     // Fiscal capacity (own tax/GSDP)
    taxCollection: 0.08,      // Tax collection efficiency
    povertyRate: 0.10,        // Poverty rate (inverted — higher poverty = more NEED but less capacity)
    financialInclusion: 0.06  // Financial inclusion score
  };

  function calculateUBIRI(data) {
    const components = {};
    const keys = Object.keys(UBIRI_WEIGHTS);
    keys.forEach(key => {
      // For poverty rate: higher poverty means LOWER readiness
      const invert = (key === 'povertyRate');
      components[key] = normalizeComponent(data, key, invert);
    });

    return data.map((state, i) => {
      let score = 0;
      keys.forEach(key => {
        score += components[key][i] * UBIRI_WEIGHTS[key];
      });
      return {
        name: state.name,
        code: state.code,
        score: Math.round(score * 10) / 10,
        components: keys.reduce((obj, key) => {
          obj[key] = Math.round(components[key][i] * 10) / 10;
          return obj;
        }, {})
      };
    }).sort((a, b) => b.score - a.score);
  }


  // ========================================================================
  // 4. FISCAL SIMULATION PARAMETERS
  // ========================================================================

  const fiscalParams = {
    gdpFY25: 330.68,     // ₹ lakh crore (trillion)
    gdpFY26: 363.75,     // 10% nominal growth
    gdpFY27: 400.12,
    adultPop: 960,        // million (18+)
    totalPop: 1425,       // million
    gdpGrowthRate: 0.10,  // nominal
    inflation: 0.045,
    fiscalDeficitFY26: 4.4,   // % of GDP
    fiscalDeficitFY27: 4.3,
    debtToGDP: 55.6,
    totalExpFY27: 53.5,   // ₹ lakh crore

    scenarios: [
      { id: 'A', amount: 500,  label: '₹500/mo',  coverage: 'Universal Adults', pop: 960 },
      { id: 'B', amount: 1000, label: '₹1,000/mo', coverage: 'Universal Adults', pop: 960 },
      { id: 'C', amount: 3000, label: '₹3,000/mo', coverage: 'Universal Adults', pop: 960 },
      { id: 'D', amount: 6000, label: '₹6,000/mo', coverage: 'Universal Adults', pop: 960 },
    ],

    existingSchemes: [
      { name: 'Food Subsidy (NFSA/PMGKAY)', amount: 2.11, source: 'Union Budget 2026-27' },
      { name: 'Fertiliser Subsidy', amount: 1.68, source: 'Union Budget 2026-27' },
      { name: 'MGNREGS', amount: 0.30, source: 'Union Budget 2026-27' },
      { name: 'PM-KISAN', amount: 0.635, source: 'Union Budget 2026-27' },
      { name: 'PMAY (Urban+Gramin)', amount: 0.77, source: 'Union Budget 2026-27' },
      { name: 'Jal Jeevan Mission', amount: 0.68, source: 'Union Budget 2026-27' },
      { name: 'Education Budget (total)', amount: 1.28, source: 'Union Budget 2026-27' },
      { name: 'Health Budget (total)', amount: 0.99, source: 'Union Budget 2026-27' },
      { name: 'Defence Budget', amount: 6.81, source: 'Union Budget 2026-27' },
    ],

    // UBI cost = amount × pop × 12 / 1e7 (to get lakh crore)
    calculateCost(amountPerMonth, popMillion) {
      return (amountPerMonth * popMillion * 12) / 1e7;
    },
    calculateGDPPercent(cost, gdp) {
      return (cost / gdp) * 100;
    }
  };


  // ========================================================================
  // 5. AI JOB DISPLACEMENT — SECTOR DATA
  // ========================================================================

  const sectorDisplacement = [
    { sector: 'IT Services', currentEmp: 5.4, atRisk: 35, highScenario: 52, timeHorizon: '2026–2032', likelihood: 'High', confidence: 'High', riskClass: 'High' },
    { sector: 'BPO / Customer Support', currentEmp: 2.0, atRisk: 55, highScenario: 72, timeHorizon: '2025–2030', likelihood: 'Very High', confidence: 'High', riskClass: 'High' },
    { sector: 'Manufacturing', currentEmp: 62.0, atRisk: 38, highScenario: 55, timeHorizon: '2028–2035', likelihood: 'High', confidence: 'Medium', riskClass: 'High' },
    { sector: 'Banking & Finance', currentEmp: 5.8, atRisk: 42, highScenario: 62, timeHorizon: '2026–2032', likelihood: 'High', confidence: 'High', riskClass: 'High' },
    { sector: 'Retail & Trade', currentEmp: 52.0, atRisk: 28, highScenario: 48, timeHorizon: '2028–2035', likelihood: 'Medium', confidence: 'Medium', riskClass: 'Medium' },
    { sector: 'Agriculture', currentEmp: 260.0, atRisk: 12, highScenario: 25, timeHorizon: '2030–2040', likelihood: 'Low-Medium', confidence: 'Low', riskClass: 'Low' },
    { sector: 'Education', currentEmp: 18.0, atRisk: 15, highScenario: 28, timeHorizon: '2028–2035', likelihood: 'Medium', confidence: 'Medium', riskClass: 'Low' },
    { sector: 'Healthcare', currentEmp: 12.0, atRisk: 18, highScenario: 32, timeHorizon: '2028–2035', likelihood: 'Medium', confidence: 'Medium', riskClass: 'Medium' },
    { sector: 'Transport & Logistics', currentEmp: 35.0, atRisk: 32, highScenario: 55, timeHorizon: '2028–2038', likelihood: 'High', confidence: 'Medium', riskClass: 'High' },
    { sector: 'Media & Content', currentEmp: 2.5, atRisk: 48, highScenario: 70, timeHorizon: '2025–2030', likelihood: 'Very High', confidence: 'High', riskClass: 'High' },
    { sector: 'Legal Services', currentEmp: 1.8, atRisk: 35, highScenario: 55, timeHorizon: '2027–2035', likelihood: 'High', confidence: 'Medium', riskClass: 'Medium' },
    { sector: 'Government Services', currentEmp: 18.0, atRisk: 22, highScenario: 38, timeHorizon: '2030–2040', likelihood: 'Medium', confidence: 'Low', riskClass: 'Medium' },
    { sector: 'Gig Economy', currentEmp: 12.0, atRisk: 40, highScenario: 58, timeHorizon: '2026–2032', likelihood: 'High', confidence: 'Medium', riskClass: 'High' },
  ];


  // ========================================================================
  // 6. FUTURE SCENARIOS — INDIA 2040
  // ========================================================================

  const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040];

  const futureScenarios = {
    scenario1: {
      name: 'Scenario 1: No UBI + High AI Adoption',
      tag: 'no-ubi',
      color: '#C0392B',
      unemployment:   [6.8, 7.2, 8.1, 9.2, 10.5, 11.8, 13.2, 14.5, 15.8, 17.2, 18.5, 19.5, 20.2, 20.8, 21.5],
      giniCoeff:      [0.38, 0.39, 0.40, 0.41, 0.43, 0.44, 0.46, 0.47, 0.48, 0.50, 0.51, 0.52, 0.53, 0.53, 0.54],
      gdpGrowth:      [6.5, 6.8, 7.0, 6.5, 5.8, 5.2, 4.8, 4.5, 4.2, 4.0, 3.8, 3.5, 3.2, 3.0, 2.8],
      povertyRate:    [12.0, 11.5, 11.8, 12.5, 13.2, 14.5, 16.0, 17.5, 19.0, 20.5, 22.0, 23.2, 24.5, 25.5, 26.5],
      consumerSpend:  [100, 103, 105, 104, 102, 99, 96, 93, 90, 88, 85, 83, 80, 78, 76],
      socialUnrest:   [15, 18, 22, 28, 35, 42, 50, 58, 65, 72, 78, 82, 85, 88, 90],
      migration:      [100, 105, 112, 120, 130, 142, 155, 168, 180, 192, 205, 215, 225, 232, 240],
    },
    scenario2: {
      name: 'Scenario 2: Partial UBI (Targeted) + Moderate AI',
      tag: 'partial-ubi',
      color: '#C9A84C',
      unemployment:   [6.8, 6.9, 7.2, 7.5, 7.8, 8.0, 8.2, 8.5, 8.8, 9.0, 9.2, 9.3, 9.5, 9.5, 9.5],
      giniCoeff:      [0.38, 0.38, 0.37, 0.37, 0.36, 0.36, 0.35, 0.35, 0.34, 0.34, 0.33, 0.33, 0.33, 0.32, 0.32],
      gdpGrowth:      [6.5, 6.5, 6.8, 7.0, 7.2, 7.0, 6.8, 6.5, 6.5, 6.2, 6.0, 5.8, 5.8, 5.5, 5.5],
      povertyRate:    [12.0, 11.2, 10.5, 9.8, 9.0, 8.2, 7.5, 7.0, 6.5, 6.0, 5.5, 5.2, 5.0, 4.8, 4.5],
      consumerSpend:  [100, 104, 108, 112, 118, 122, 126, 130, 134, 138, 142, 145, 148, 150, 152],
      socialUnrest:   [15, 14, 14, 13, 12, 12, 11, 11, 10, 10, 10, 9, 9, 9, 8],
      migration:      [100, 102, 104, 105, 106, 107, 108, 108, 109, 109, 110, 110, 110, 110, 110],
    },
    scenario3: {
      name: 'Scenario 3: Full UBI + Managed AI Transition',
      tag: 'full-ubi',
      color: '#1E8449',
      unemployment:   [6.8, 6.5, 6.2, 6.0, 5.8, 5.5, 5.2, 5.0, 4.8, 4.5, 4.5, 4.2, 4.0, 3.8, 3.5],
      giniCoeff:      [0.38, 0.37, 0.36, 0.35, 0.34, 0.33, 0.32, 0.31, 0.30, 0.29, 0.29, 0.28, 0.28, 0.27, 0.27],
      gdpGrowth:      [6.5, 6.2, 6.0, 6.5, 7.0, 7.5, 7.8, 8.0, 8.2, 8.5, 8.5, 8.2, 8.0, 7.8, 7.5],
      povertyRate:    [12.0, 10.8, 9.5, 8.2, 7.0, 6.0, 5.0, 4.2, 3.5, 3.0, 2.5, 2.2, 2.0, 1.8, 1.5],
      consumerSpend:  [100, 106, 112, 120, 128, 136, 145, 155, 165, 175, 185, 192, 200, 205, 210],
      socialUnrest:   [15, 12, 10, 8, 6, 5, 4, 4, 3, 3, 2, 2, 2, 2, 2],
      migration:      [100, 98, 95, 92, 88, 85, 82, 80, 78, 76, 75, 74, 73, 72, 72],
    },
    years: years
  };


  // ========================================================================
  // 7. PARLIAMENTARY INTELLIGENCE DATA
  // ========================================================================

  const parliamentaryData = {
    keyDebates: [
      { date: '2017-01-31', house: 'Lok Sabha', speaker: 'Arun Jaitley', party: 'BJP', topic: 'Economic Survey 2016-17 Chapter on UBI', position: 'Exploratory', summary: 'Presented Economic Survey chapter on UBI as a conceptual alternative to subsidies, emphasizing JAM infrastructure.' },
      { date: '2019-02-01', house: 'Rajya Sabha', speaker: 'P. Chidambaram', party: 'INC', topic: 'NYAY Scheme Proposal', position: 'Strong Support', summary: 'Advocated for ₹6,000/month to bottom 20% families as Minimum Income Guarantee.' },
      { date: '2019-03-15', house: 'Lok Sabha', speaker: 'Rahul Gandhi', party: 'INC', topic: 'NYAY Manifesto Launch', position: 'Strong Support', summary: 'Proposed NYAY as flagship election promise: ₹72,000/year to 5 crore families.' },
      { date: '2020-04-12', house: 'Rajya Sabha', speaker: 'T. Siva', party: 'DMK', topic: 'COVID-19 Cash Transfer Demand', position: 'Support', summary: 'Demanded universal cash transfer of ₹7,500/month during lockdown.' },
      { date: '2020-06-18', house: 'Lok Sabha', speaker: 'Nirmala Sitharaman', party: 'BJP', topic: 'PM Garib Kalyan Yojana', position: 'Targeted Support', summary: 'Announced targeted cash transfers via Jan Dhan, not universal; emphasized DBT over UBI.' },
      { date: '2021-02-05', house: 'Rajya Sabha', speaker: 'Derek O\'Brien', party: 'TMC', topic: 'Pandemic Income Support', position: 'Support', summary: 'Called for basic income floor for informal workers affected by second wave.' },
      { date: '2022-03-22', house: 'Lok Sabha', speaker: 'Manoj Jha', party: 'RJD', topic: 'Inflation and Poverty', position: 'Support', summary: 'Argued rising inflation requires income floors beyond existing scheme patchwork.' },
      { date: '2023-07-28', house: 'Rajya Sabha', speaker: 'Jairam Ramesh', party: 'INC', topic: 'AI and Employment', position: 'Strong Support', summary: 'Connected AI job displacement to the need for universal income guarantee frameworks.' },
      { date: '2024-07-26', house: 'Rajya Sabha', speaker: 'Private Member', party: 'Independent', topic: 'Right to Universal Basic Income Bill 2024', position: 'Strong Support', summary: 'Introduced bill proposing legal framework for UBI with National Advisory Board.' },
      { date: '2025-02-15', house: 'Lok Sabha', speaker: 'Budget Discussion', party: 'Multiple', topic: 'AI Impact on Employment', position: 'Mixed', summary: 'Cross-party concerns raised about AI displacing white-collar jobs; calls for safety nets.' },
    ],

    partyPositions: [
      { party: 'BJP', ubiPosition: 'Oppose Universal', aiPosition: 'Pro-AI Adoption', transferPreference: 'Targeted DBT', reasoning: 'Prefer expanding existing targeted schemes (PM-KISAN, PMGKY) over universal transfers' },
      { party: 'INC', ubiPosition: 'Strong Support', aiPosition: 'Cautious', transferPreference: 'Quasi-Universal (NYAY)', reasoning: 'NYAY proposal (bottom 20%) as party manifesto; supports income guarantee' },
      { party: 'AAP', ubiPosition: 'Support (State Level)', aiPosition: 'Neutral', transferPreference: 'Universal + Free Services', reasoning: 'Delhi model of free water/electricity + cash transfers seen as proto-UBI' },
      { party: 'TMC', ubiPosition: 'Support', aiPosition: 'Neutral', transferPreference: 'State-level Cash Transfers', reasoning: 'Lakshmir Bhandar scheme in West Bengal as state-level UBI pilot' },
      { party: 'DMK', ubiPosition: 'Support', aiPosition: 'Cautious', transferPreference: 'Universal + Subsidies', reasoning: 'Tamil Nadu rice scheme + Kalaignar insurance as foundation for universal support' },
      { party: 'SP', ubiPosition: 'Conditional Support', aiPosition: 'Cautious', transferPreference: 'Targeted', reasoning: 'Support for youth and farmer income guarantees' },
      { party: 'BSP', ubiPosition: 'Support', aiPosition: 'Cautious', transferPreference: 'Caste-targeted', reasoning: 'Emphasize SC/ST-specific income support before universalization' },
      { party: 'CPI(M)', ubiPosition: 'Conditional Support', aiPosition: 'Cautious/Critical', transferPreference: 'Employment Guarantee + UBI', reasoning: 'Support as complement to MGNREGA, not replacement; oppose subsidy cuts' },
      { party: 'JD(U)', ubiPosition: 'Neutral', aiPosition: 'Neutral', transferPreference: 'Targeted', reasoning: 'Focus on Bihar-specific schemes; open to national framework' },
      { party: 'RJD', ubiPosition: 'Support', aiPosition: 'Cautious', transferPreference: 'Caste+Class Targeted', reasoning: 'Advocate for marginalized community income support' },
    ]
  };


  // ========================================================================
  // 8. MINORITY IMPACT DATA
  // ========================================================================

  const minorityData = {
    demographics: {
      muslimPopPercent: 14.2,
      christianPopPercent: 2.3,
      sikhPopPercent: 1.7,
      buddhistPopPercent: 0.7,
      jainPopPercent: 0.4,
      otherMinoritiesPercent: 0.9,
    },
    sacharFindings: {
      year: 2006,
      muslimLiteracy: 59.1,
      muslimUrbanPoverty: 38.4,
      muslimRuralPoverty: 26.9,
      govtJobShare: 4.9,
      selfEmployed: 61,
      informalSector: 85,
      creditAccess: 'Very Low',
    },
    currentStatus2025: {
      muslimLiteracy: 68.5,
      muslimUrbanPoverty: 22.5,
      muslimRuralPoverty: 18.8,
      govtJobShare: 5.8,
      selfEmployed: 55,
      informalSector: 82,
      aadhaarPenetration: 92,
      bankAccountAccess: 78,
      digitalLiteracy: 28,
    },
    schemeEffectiveness: [
      { scheme: 'Universal UBI (₹1,000/mo)', benefitScore: 85, leakageRisk: 15, adminCost: 20, inclusionRate: 100, reachMinority: 95 },
      { scheme: 'Targeted Minority Schemes', benefitScore: 65, leakageRisk: 35, adminCost: 45, inclusionRate: 45, reachMinority: 70 },
      { scheme: 'PM-KISAN (Farmers)', benefitScore: 70, leakageRisk: 20, adminCost: 25, inclusionRate: 35, reachMinority: 40 },
      { scheme: 'MGNREGS', benefitScore: 72, leakageRisk: 30, adminCost: 40, inclusionRate: 55, reachMinority: 60 },
      { scheme: 'MUDRA Loans', benefitScore: 55, leakageRisk: 25, adminCost: 30, inclusionRate: 30, reachMinority: 45 },
    ]
  };


  // ========================================================================
  // 9. SURVEY INSTRUMENT
  // ========================================================================

  const surveyDesign = {
    title: 'Primary Survey: Perceptions on AI, Automation & Universal Basic Income in India',
    targetN: 250,
    groups: [
      { name: 'Students (18–25)', n: 100, sampling: 'Stratified random from 5 universities across metro, Tier-2, and Tier-3 cities' },
      { name: 'Workers (25–55)', n: 100, sampling: 'Quota sampling across formal sector (40), informal sector (40), and gig economy (20)' },
      { name: 'Employers / HR Managers', n: 50, sampling: 'Purposive sampling from IT, Manufacturing, Retail, Banking, and Education sectors' },
    ],
    sections: [
      {
        title: 'Section A: Demographics',
        questions: [
          'A1. Age group: □ 18–25  □ 26–35  □ 36–45  □ 46–55  □ 55+',
          'A2. Gender: □ Male  □ Female  □ Non-binary  □ Prefer not to say',
          'A3. Education level: □ Below 10th  □ 10th/12th  □ Graduate  □ Postgraduate  □ Professional',
          'A4. Employment status: □ Student  □ Employed (formal)  □ Employed (informal)  □ Self-employed  □ Gig worker  □ Unemployed',
          'A5. Monthly household income: □ Below ₹10,000  □ ₹10,001–25,000  □ ₹25,001–50,000  □ ₹50,001–1,00,000  □ Above ₹1,00,000',
          'A6. State/UT of residence: [Open text]',
        ]
      },
      {
        title: 'Section B: AI & Automation Awareness',
        questions: [
          'B1. How familiar are you with Artificial Intelligence (AI)? □ Very familiar  □ Somewhat familiar  □ Heard of it  □ Not at all',
          'B2. Do you believe AI will significantly affect employment in India in the next 10 years? □ Strongly agree  □ Agree  □ Neutral  □ Disagree  □ Strongly disagree',
          'B3. Which sectors do you think are MOST at risk from AI automation? (Select up to 3) □ IT/BPO  □ Manufacturing  □ Banking  □ Retail  □ Agriculture  □ Education  □ Healthcare  □ Transport  □ Media  □ Legal',
          'B4. Do you fear that your current job/future career could be replaced by AI? □ Very much  □ Somewhat  □ Not really  □ Not at all  □ N/A (student)',
          'B5. Has AI already affected your workplace or studies? □ Yes, significantly  □ Yes, somewhat  □ No  □ Not sure',
        ]
      },
      {
        title: 'Section C: UBI Perceptions',
        questions: [
          'C1. Have you heard of Universal Basic Income (UBI) before this survey? □ Yes  □ No',
          'C2. Do you support the idea of a UBI for all Indian citizens? □ Strongly support  □ Support  □ Neutral  □ Oppose  □ Strongly oppose',
          'C3. What amount per month would you consider a meaningful UBI? □ ₹500  □ ₹1,000  □ ₹3,000  □ ₹6,000  □ More than ₹6,000',
          'C4. Who should receive UBI? □ Everyone universally  □ Only the poor (bottom 20%)  □ Only unemployed  □ Only women  □ Only youth  □ No one',
          'C5. Would UBI make people lazy and reduce their willingness to work? □ Strongly agree  □ Agree  □ Neutral  □ Disagree  □ Strongly disagree',
          'C6. Would you prefer UBI over existing government schemes (ration, MGNREGA, subsidies)? □ Yes, UBI is better  □ No, current schemes are better  □ Both should coexist  □ Not sure',
        ]
      },
      {
        title: 'Section D: Employment & Reskilling',
        questions: [
          'D1. How confident are you about finding/keeping a good job in the next 5 years? □ Very confident  □ Somewhat confident  □ Neutral  □ Not confident  □ Very worried',
          'D2. Are you currently learning or willing to learn new digital/AI skills? □ Already learning  □ Willing to learn  □ Not interested  □ Don\'t know where to start',
          'D3. Who should be primarily responsible for reskilling workers? □ Government  □ Employers  □ Educational institutions  □ Workers themselves  □ All equally',
          'D4. Would a monthly UBI allow you to pursue education or reskilling? □ Definitely  □ Probably  □ Not sure  □ No',
        ]
      },
      {
        title: 'Section E: Employers Only',
        questions: [
          'E1. Has your organization adopted AI/automation tools in the last 2 years? □ Yes, extensively  □ Yes, partially  □ Planning to  □ No',
          'E2. Has AI adoption led to workforce reduction in your organization? □ Yes, significant  □ Yes, some  □ No  □ Actually hired more',
          'E3. Would you support a government-mandated "automation tax" on companies using AI? □ Strongly support  □ Support  □ Neutral  □ Oppose  □ Strongly oppose',
          'E4. Would UBI complement or conflict with your hiring strategy? □ Complement — workers can take risks  □ Conflict — reduced motivation  □ No effect  □ Not sure',
        ]
      }
    ],
    analysisFramework: {
      hypotheses: [
        'H₁: There is a significant association between employment type (formal vs informal) and support for UBI (Chi-square test)',
        'H₂: AI awareness is positively correlated with UBI support (Spearman rank correlation)',
        'H₃: Age group significantly predicts reskilling willingness (Binary logistic regression)',
        'H₄: Income level negatively correlates with perceived UBI necessity (Pearson correlation)',
        'H₅: Students show higher AI fear scores than employed workers (Independent t-test)',
      ],
      statisticalTests: [
        'Chi-square test of independence for categorical associations',
        'Spearman rank-order correlation for ordinal Likert responses',
        'Binary logistic regression for dichotomous outcome prediction',
        'Independent samples t-test for mean comparison across groups',
        'ANOVA for multi-group comparisons',
        'Cronbach\'s alpha for scale reliability',
      ]
    }
  };


  // ========================================================================
  // 10. SWOT ANALYSIS
  // ========================================================================

  const swotAnalysis = {
    universalUBI: {
      strengths: [
        'Eliminates exclusion errors — every citizen receives support',
        'Simplifies India\'s fragmented welfare architecture (300+ schemes)',
        'Leverages existing JAM Trinity infrastructure (1.3B Aadhaar, 56Cr PMJDY, 1B+ mobile)',
        'Promotes individual agency and entrepreneurship',
        'Gender equalizing — direct transfers to women\'s accounts',
        'Counter-cyclical stabilizer during economic downturns',
      ],
      weaknesses: [
        'Massive fiscal cost — ₹11.5T for ₹1,000/mo (3.5% GDP)',
        'Inflationary risk if not matched by supply-side reforms',
        'Political difficulty of removing existing subsidies',
        'May reduce incentive for formal sector participation',
        'Does not address structural inequality (education, caste)',
        'Administrative challenge in reaching remote/tribal populations',
      ],
      opportunities: [
        'AI productivity gains could fund growing UBI over time',
        'India\'s demographic dividend — young recipients become entrepreneurs',
        'Digital payment revolution (UPI) makes delivery nearly costless',
        'State-level pilots can demonstrate effectiveness before national rollout',
        'Complementary with automation tax on high-tech firms',
        'Global momentum — 100+ countries exploring UBI variants',
      ],
      threats: [
        'Populist expansion — political pressure to increase amount unsustainably',
        'Fiscal deficit spiral if funded through borrowing',
        'Corruption in beneficiary identification for "quasi-universal" variants',
        'Exchange rate depreciation from fiscal expansion',
        'Automation proceeds faster than reskilling programs',
        'States with poor banking infrastructure may see implementation failures',
      ]
    },
    targetedUBI: {
      strengths: [
        'Lower fiscal cost — ₹2.3T for bottom 20% at ₹1,000/mo',
        'Concentrated impact on most vulnerable populations',
        'Politically easier — retains existing scheme framework',
        'Can be layered on top of MGNREGA and PM-KISAN',
      ],
      weaknesses: [
        'Exclusion errors — many eligible people left out',
        'Targeting costs and bureaucratic overhead',
        'Creates poverty traps at threshold boundaries',
        'Stigmatization of recipients',
      ],
      opportunities: [
        'Can evolve into universal system as fiscal space grows',
        'Use AI/ML for dynamic targeting based on real-time data',
        'Integrate with e-Shram database (313.8M workers)',
      ],
      threats: [
        'Political capture — benefits directed to vote banks',
        'Rapid AI displacement may overwhelm targeted coverage',
        'Data privacy concerns with beneficiary identification',
      ]
    },
    noUBI: {
      strengths: [
        'No additional fiscal burden',
        'Preserves existing policy framework',
        'Avoids risk of inflationary pressure',
      ],
      weaknesses: [
        'Leaves workers unprotected against AI displacement',
        'Existing schemes have 40–60% leakage rates',
        'Growing inequality erodes social cohesion',
        '300+ overlapping schemes create administrative chaos',
      ],
      opportunities: [
        'Focus resources on education and skilling instead',
        'Market-driven solutions through private sector',
      ],
      threats: [
        'Mass unemployment from AI without safety net',
        'Social unrest and migration crises',
        'India misses demographic dividend window',
        'Political instability from rising inequality',
      ]
    }
  };


  // ========================================================================
  // 11. AABIF — AI Adaptive Basic Income Framework (ORIGINAL)
  // ========================================================================

  const aabifFramework = {
    name: 'AI Adaptive Basic Income Framework (AABIF)',
    tagline: 'An original adaptive welfare model that dynamically links AI automation rates to income support levels',
    principles: [
      'Automation-Responsive: Transfer amounts rise automatically as sector automation increases',
      'Evidence-Driven: Uses real-time labor market data, not political discretion',
      'Fiscally Self-Sustaining: Funded primarily through automation dividends and AI productivity taxes',
      'Universally Accessible: Built on existing JAM infrastructure for seamless delivery',
      'Gradually Scalable: Starts with most-affected sectors and scales to universal coverage',
    ],
    formula: 'AABIF_Transfer = Base_Amount × (1 + Automation_Rate × Sector_Weight) × Regional_Adjustment',
    components: {
      baseAmount: '₹1,000/month (indexed to CPI annually)',
      automationMultiplier: 'Ranges from 1.0x (0% automation) to 3.0x (>50% automation)',
      sectorWeight: 'Higher for sectors with more informal workers and fewer reskilling pathways',
      regionalAdjustment: 'UBIRI-weighted coefficient — states with lower readiness get higher support per rupee',
    },
    fundingSources: [
      { source: 'AI/Automation Productivity Tax', share: 35, amount: '₹3.5T', mechanism: '2% levy on revenue of firms with >30% automated workforce' },
      { source: 'Subsidy Rationalization', share: 25, amount: '₹2.5T', mechanism: 'Phase out non-merit subsidies over 5 years' },
      { source: 'Carbon Tax Reallocation', share: 15, amount: '₹1.5T', mechanism: 'Portion of coal cess redirected to AABIF fund' },
      { source: 'Digital Services Tax', share: 10, amount: '₹1.0T', mechanism: '3% DST on tech giants operating in India' },
      { source: 'Improved Tax Compliance', share: 15, amount: '₹1.5T', mechanism: 'AI-driven tax enforcement expanding base by 8M filers' },
    ],
    governanceStructure: [
      'National AABIF Authority (under NITI Aayog)',
      'State Implementation Boards (linked to e-Shram database)',
      'Automation Monitoring Unit (real-time sector tracking)',
      'Independent Evaluation Committee (annual impact assessment)',
    ],
    technologyStack: [
      'Aadhaar-linked biometric verification for recipients',
      'UPI/NPCI payment rails for instant direct transfers',
      'AI/ML models for real-time automation rate monitoring',
      'Blockchain ledger for transparency and audit trail',
      'e-Shram database integration for informal worker registry',
    ],
    pilotDesign: {
      phase1: { period: '2027–2028', scope: '3 districts in high-automation states (Karnataka, Maharashtra, Tamil Nadu)', recipients: '50,000', amount: '₹1,000–3,000/mo adaptive' },
      phase2: { period: '2029–2030', scope: '15 districts across 8 states', recipients: '500,000', amount: 'Full AABIF formula' },
      phase3: { period: '2031–2033', scope: 'All states with IAAVI > 55', recipients: '50M+', amount: 'Full formula with regional adjustment' },
      phase4: { period: '2034–2040', scope: 'National rollout', recipients: 'Universal adult', amount: 'Full adaptive model' },
    }
  };


  // ========================================================================
  // 12. POLICY RECOMMENDATIONS TIMELINE
  // ========================================================================

  const policyRecommendations = {
    shortTerm: {
      period: '2026–2030',
      title: 'Foundation Phase',
      actions: [
        { action: 'Launch AABIF pilot in 3 high-automation districts', cost: '₹1,200 Cr/year', priority: 'Critical' },
        { action: 'Establish National Automation Monitoring Dashboard', cost: '₹200 Cr', priority: 'High' },
        { action: 'Expand e-Shram to 500M workers with skill profiling', cost: '₹500 Cr', priority: 'High' },
        { action: 'Introduce 1% Automation Productivity Levy', cost: 'Revenue: ₹15,000 Cr/year', priority: 'Critical' },
        { action: 'Reskilling vouchers for workers in high-risk sectors', cost: '₹5,000 Cr/year', priority: 'High' },
        { action: 'Parliamentary committee on AI & Employment', cost: 'Minimal', priority: 'Medium' },
      ]
    },
    mediumTerm: {
      period: '2030–2035',
      title: 'Scaling Phase',
      actions: [
        { action: 'Scale AABIF to 50M workers in high-automation states', cost: '₹1.2 Lakh Cr/year', priority: 'Critical' },
        { action: 'Rationalize 150 overlapping welfare schemes', cost: 'Savings: ₹80,000 Cr/year', priority: 'High' },
        { action: 'AI-driven dynamic targeting system deployment', cost: '₹1,000 Cr', priority: 'High' },
        { action: 'Increase Automation Levy to 2% + Digital Services Tax 3%', cost: 'Revenue: ₹45,000 Cr/year', priority: 'Critical' },
        { action: 'State UBIRI improvement programs for bottom 10 states', cost: '₹25,000 Cr/year', priority: 'Medium' },
      ]
    },
    longTerm: {
      period: '2035–2040',
      title: 'Universal Phase',
      actions: [
        { action: 'National AABIF rollout — universal adult coverage', cost: '₹8–12 Lakh Cr/year', priority: 'Critical' },
        { action: 'Fully adaptive transfer amounts linked to real-time automation data', cost: 'Included above', priority: 'High' },
        { action: 'Constitutional amendment: Right to Basic Income', cost: 'Minimal', priority: 'High' },
        { action: 'International coordination on AI taxation frameworks', cost: 'Minimal', priority: 'Medium' },
        { action: 'Sovereign AI Wealth Fund from automation dividends', cost: 'Self-funding', priority: 'Medium' },
      ]
    }
  };


  // ========================================================================
  // 13. BIBLIOGRAPHY (APA 7, selected key references)
  // ========================================================================

  const bibliography = [
    'Banerjee, A., Niehaus, P., & Suri, T. (2019). Universal basic income in the developing world. <em>Annual Review of Economics</em>, 11, 959–983. https://doi.org/10.1146/annurev-economics-080218-030229',
    'Bardhan, P. (2017). Universal basic income vs targeted transfers: India. In <em>What Would a UBI Mean for India?</em> Becker Friedman Institute.',
    'Drèze, J. (2017). Sense and solidarity: Jholawala economics for everyone. <em>Oxford University Press</em>.',
    'Government of India. (2017). Universal basic income: A conversation with evidence. <em>Economic Survey 2016-17, Chapter 9</em>. Ministry of Finance.',
    'Government of India. (2026). <em>Union Budget 2026-27</em>. Ministry of Finance. https://www.indiabudget.gov.in',
    'Government of India. (2025). <em>Economic Survey 2025-26</em>. Ministry of Finance.',
    'Government of India. (2025). <em>Periodic Labour Force Survey Annual Report 2025</em>. Ministry of Statistics and Programme Implementation.',
    'International Labour Organization. (2024). <em>World Employment and Social Outlook: Trends 2024</em>. ILO.',
    'Joshi, V., & Muraleedharan, V. R. (2023). UBI and India\'s informal economy: Prospects and challenges. <em>Indian Journal of Labour Economics</em>, 66(2), 245–268.',
    'McKinsey Global Institute. (2023). <em>The Future of Work in India: Automation, AI, and the Changing Nature of Jobs</em>. McKinsey & Company.',
    'NASSCOM. (2024). <em>Technology Sector in India 2024: Strategic Review</em>. National Association of Software and Service Companies.',
    'NITI Aayog. (2022). <em>India\'s Booming Gig and Platform Economy</em>. Government of India.',
    'Observer Research Foundation. (2019). AI and the future of work in India. <em>ORF Occasional Paper No. 213</em>.',
    'Oxfam India. (2025). <em>Survival of the Richest: India Inequality Report 2025</em>. Oxfam.',
    'PRS Legislative Research. (2024). The Right to Universal Basic Income Bill, 2024 — Bill Summary. https://prsindia.org',
    'Sachar Committee. (2006). <em>Social, Economic and Educational Status of the Muslim Community of India</em>. Prime Minister\'s High Level Committee.',
    'Standing, G. (2017). <em>Basic Income: And How We Can Make It Happen</em>. Pelican Books.',
    'Subbarao, K., del Ninno, C., Andrews, C., & Rodríguez-Alas, C. (2013). <em>Public Works as a Safety Net: Design, Evidence, and Implementation</em>. World Bank.',
    'UIDAI. (2025). <em>Aadhaar Dashboard: State-wise Saturation Report</em>. Unique Identification Authority of India. https://uidai.gov.in',
    'United Nations Development Programme. (2024). <em>Human Development Report 2024</em>. UNDP.',
    'Van Parijs, P., & Vanderborght, Y. (2017). <em>Basic Income: A Radical Proposal for a Free Society and a Sane Economy</em>. Harvard University Press.',
    'World Bank. (2025). <em>India Development Update: Building the Foundation for High Income</em>. World Bank Group.',
    'World Economic Forum. (2023). <em>The Future of Jobs Report 2023</em>. WEF.',
    'World Inequality Lab. (2026). <em>World Inequality Report 2026</em>. WID.world.',
    'Chancel, L., & Piketty, T. (2019). Indian income inequality, 1922–2015: From British Raj to Billionaire Raj? <em>Review of Income and Wealth</em>, 65(S1), S33–S62.',
    'Frey, C. B., & Osborne, M. A. (2017). The future of employment: How susceptible are jobs to computerisation? <em>Technological Forecasting and Social Change</em>, 114, 254–280.',
    'Hanna, R., & Olken, B. A. (2018). Universal basic incomes versus targeted transfers: Anti-poverty programs in developing countries. <em>Journal of Economic Perspectives</em>, 32(4), 201–226.',
    'Khera, R. (2020). COVID-19: What can be done immediately, and what will need a longer-term response. <em>Ideas for India</em>.',
    'Ranganath Misra Commission. (2007). <em>National Commission for Religious and Linguistic Minorities Report</em>. Government of India.',
    'Stanford University. (2024). <em>AI Index Report 2024</em>. Stanford HAI.',
  ];


  // ========================================================================
  // 14. SIMPLE MODE EXPLANATIONS
  // ========================================================================

  const explanations = {
    // KPIs
    'National Unemployment': 'Right now, about 3.1% of people looking for work cannot find it. This seems low, but because our population is so huge, it still means millions of people are out of jobs.',
    'Jobs at AI Risk': 'Experts estimate that nearly 69% of the tasks we do at work today could be done by computers or robots soon. This doesn\'t mean 69% of jobs will disappear entirely, but most jobs will change drastically.',
    'Minimal UBI Cost': 'If we gave every adult in India ₹500 every single month, it would cost about 1.7% of the total money India makes in a year (GDP). This is affordable, but ₹500 is very little.',
    'Gig Workers (FY25)': 'There are 12 million people working as delivery drivers, freelance coders, and other "gig" jobs. They don\'t have traditional job security or benefits.',
    'States Indexed': 'We looked at all 28 states and 4 major union territories to see which ones are most at risk of losing jobs to computers, and which ones are ready to hand out cash directly to people.',

    // Charts
    'Chart 01': 'Fewer women work in India compared to men, but recently, more women have started looking for work. A Basic Income could give women more financial independence.',
    'Chart 02': 'Unemployment in cities goes up and down a lot. During COVID, it spiked hugely. This shows how fragile city jobs can be.',
    'Chart 03': 'Almost half of all workers in India are still in farming. Services and manufacturing employ fewer people but create more wealth.',
    'Chart 04': 'Compared to the rest of the world, very few women in India are in the paid workforce. We are far behind countries like China, the US, and even Bangladesh.',
    'Chart 05': 'Jobs involving repetitive tasks — like data entry in IT, or assembly line work in factories — are the easiest for computers and robots to take over.',
    'Chart 06': 'In India, people with less formal education are at a much higher risk of losing their jobs to machines compared to the global average.',
    'Chart 07': 'More and more people are taking up "gig" work like driving for Uber or delivering for Zomato. These jobs are growing fast but offer no safety net.',
    'Chart 08': 'This ranks states by how much danger they are in from computers taking jobs. States in red (like Bihar and UP) are in the most danger because they rely on jobs that are easy to automate.',
    'Chart 09': 'This shows exactly why the top 5 states are at risk. They usually have a huge informal workforce (no contracts) and low digital skills.',
    'Chart 10': 'States in the top-left (red) are in double trouble: their workers are very likely to lose jobs to AI, but their governments are not ready to distribute digital cash.',
    'Chart 11': 'This ranks states by how ready they are to give everyone a Basic Income. States in green (like Delhi and Kerala) have great internet, lots of bank accounts, and good infrastructure.',
    'Chart 12': 'This compares the most ready states to the least ready states. The least ready states usually lack good internet and administrative efficiency.',
    'Chart 13': 'The gap between the rich and poor is massive. The richest 1% of Indians own about 40% of all the wealth in the country.',
    'Chart 14': 'Giving everyone ₹1,000 a month would cost about 3.5% of the country\'s total income (GDP). Giving ₹6,000 would cost way too much right now (over 20%).',
    'Chart 15': 'We already spend a lot of money on things like food subsidies and fertilizer. Giving everyone ₹500 a month would cost slightly less than what we currently spend on all these schemes combined.',
    'Chart 16': 'To pay for a Basic Income, we wouldn\'t just print money. We could cut some inefficient subsidies, collect taxes better, and put a new tax on companies that use a lot of AI.',
    'Chart 17': 'The government usually spends more than it earns (this is the deficit). Adding a Basic Income would increase this deficit, which is why we must find new ways to pay for it.',
    'Chart 18': 'The government is already very good at sending money directly to people\'s bank accounts. This system has grown hugely over the last 10 years.',
    'Chart 19': 'If we don\'t give people a Basic Income (Red line), unemployment could skyrocket as AI takes over. With a full Basic Income (Green line), people can afford to retrain, keeping unemployment low.',
    'Chart 20': 'Without a safety net, AI could push many people back into poverty. A Basic Income would virtually wipe out extreme poverty by 2040.',
    'Chart 21': 'A Basic Income actually helps the economy grow faster because everyday people have more money to spend at local shops and businesses.',
    'Chart 22': 'This shows the gap between rich and poor. Without a Basic Income, the rich get richer from AI. With it, the wealth is shared more fairly.',
    'Chart 23': 'The biggest circles are the sectors with the most workers. If the circle is high up, those jobs are in danger from AI. Manufacturing and IT are in the danger zone.',
    'Chart 24': 'While conditions for minorities (like Muslims) have improved since 2006, they still lag behind the national average in education and good jobs.',
    'Chart 25': 'Instead of complicated schemes aimed only at minorities (which often suffer from corruption or poor reach), giving a Basic Income to EVERYONE actually helps minorities much more effectively.',
    'Chart 26': 'When we score the options, giving a Basic Income to everyone is much better than trying to pick and choose who gets it, because picking and choosing leaves too many deserving people out.',
    'Chart 27': 'This shows how we propose paying for the new system: mainly by taxing companies that replace humans with AI, and cleaning up our current tax system.',
    'Chart 28': 'We wouldn\'t do this all at once. We would start small in a few districts, see what works, and slowly expand it to the whole country over 10-15 years.',
    'Chart 29': 'Other countries have tried this! Finland, Germany, and parts of the USA have given people free money to see what happens. Their amounts are much higher because their cost of living is higher.',
    'Chart 30': 'In almost every experiment around the world, giving people free money made them healthier, less stressed, and MORE likely to find good jobs, not lazier.',
  };

  // ========================================================================
  // COMPUTE AND EXPORT
  // ========================================================================

  const iaaviRankings = calculateIAAVI(stateData);
  const ubiriRankings = calculateUBIRI(stateData);

  return {
    stateData,
    IAAVI_WEIGHTS,
    UBIRI_WEIGHTS,
    iaaviRankings,
    ubiriRankings,
    fiscalParams,
    sectorDisplacement,
    futureScenarios,
    parliamentaryData,
    minorityData,
    surveyDesign,
    swotAnalysis,
    aabifFramework,
    policyRecommendations,
    bibliography,
    explanations,
    calculateIAAVI,
    calculateUBIRI,
  };

})();
