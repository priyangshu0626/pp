// ==========================================================================
// PROJECT ARTHA — Premium Research Platform Application Logic
// 30 Charts · Fiscal Calculator · Scenario Engine · Interactive Components
// Enhanced with: Loading Screen · Scroll Reveal · Glassmorphism Support
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const D = RESEARCH_DATA;
  const state = {
    theme: localStorage.getItem('theme') || 'light',
    activeTab: 'executive',
    activeScenario: 'all',
    activeSwot: 'universalUBI',
    isCitizenMode: false
  };
  const charts = {};

  // ======================================================================
  // LOADING SCREEN
  // ======================================================================
  function initLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger scroll reveals after load
        setTimeout(() => initScrollReveal(), 300);
      }, 2000);
    }
  }

  // ======================================================================
  // SCROLL REVEAL (Intersection Observer)
  // ======================================================================
  function initScrollReveal() {
    // Add reveal class to all chart cards, KPI cards, and key sections
    const revealTargets = document.querySelectorAll(
      '.chart-card-wrapper, .kpi-card, .roadmap-phase, .scenario-compare-card, ' +
      '.swot-quadrant, .survey-overview-card, .survey-section-card, .principle-card, ' +
      '.aabif-detail-card, .ranking-table-wrapper, .prose-section, .insight-card, ' +
      '.methodology-panel, .simulator-card, .timeline-item'
    );
    
    revealTargets.forEach(el => {
      el.classList.add('reveal-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => observer.observe(el));
  }

  // Initialize all modules
  initLoadingScreen();
  initTheme();
  initNavigation();
  initKPICountup();
  initProseToggles();
  initMethodologyToggles();
  initCharts();
  initFiscalCalculator();
  initScenarioSelector();
  initSwotDisplay();
  initSurveyDisplay();
  initAABIFDisplay();
  initRoadmapDisplay();
  initParliamentaryDisplay();
  initDisplacementTable();
  initRankingTables();
  initBibliography();
  initSearch();
  initPrint();
  initCitizenMode();
  // NOTE: initFutureSimulator() is NOT called here because citizen sections
  // are hidden at page load (display:none). Charts can only render on visible
  // canvases. They are initialized when citizen mode is activated.

  // ======================================================================
  // THEME
  // ======================================================================
  function initTheme() {
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
      setTheme(state.theme === 'light' ? 'dark' : 'light');
    });
    setTheme(state.theme);
  }

  function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Enhanced Chart.js global defaults
    Chart.defaults.color = theme === 'dark' ? '#9ca3af' : '#5a6474';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    Chart.defaults.font.weight = 500;
    Chart.defaults.elements.bar.borderRadius = 6;
    Chart.defaults.elements.line.tension = 0.35;
    Chart.defaults.elements.point.hoverBorderWidth = 3;
    Chart.defaults.plugins.tooltip.backgroundColor = theme === 'dark' ? 'rgba(10, 15, 30, 0.95)' : 'rgba(15, 23, 42, 0.92)';
    Chart.defaults.plugins.tooltip.titleFont = { family: "'Outfit', sans-serif", size: 13, weight: 700 };
    Chart.defaults.plugins.tooltip.bodyFont = { family: "'Outfit', sans-serif", size: 12, weight: 400 };
    Chart.defaults.plugins.tooltip.padding = 14;
    Chart.defaults.plugins.tooltip.cornerRadius = 10;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.boxPadding = 4;
    Chart.defaults.animation = { duration: 800, easing: 'easeOutQuart' };
    
    updateAllChartColors(theme);
  }

  function C(theme) {
    const dk = (theme || state.theme) === 'dark';
    return {
      text: dk ? '#9ca3af' : '#5a6474',
      textP: dk ? '#f3f4f6' : '#0D1B2A',
      grid: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      primary: dk ? '#E8C97A' : '#152238',
      blue: dk ? '#60a5fa' : '#2563EB',
      gold: '#D6AF36', goldL: '#E8C97A',
      red: dk ? '#fb7185' : '#DC2626',
      green: dk ? '#34d399' : '#16A34A',
      orange: dk ? '#fb923c' : '#EA580C',
      teal: dk ? '#2dd4bf' : '#0D9488',
      purple: dk ? '#c084fc' : '#7C3AED',
      grey: dk ? '#9ca3af' : '#6B7280',
      card: dk ? '#1e293b' : '#ffffff',
    };
  }

  // ======================================================================
  // CITIZEN SIMULATOR LAZY INITIALIZER
  // Waits for the canvas to have real dimensions before creating charts
  // ======================================================================
  function waitForCanvas(canvasId, callback, maxAttempts) {
    maxAttempts = maxAttempts || 30;
    let attempts = 0;
    function check() {
      const el = document.getElementById(canvasId);
      if (el && el.clientWidth > 0 && el.clientHeight > 0) {
        callback(el);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 100);
      }
    }
    check();
  }

  function initCitizenSimForTab(tab) {
    switch (tab) {
      case 'cit-future':
        if (_simFutureChart) { _simFutureChart.destroy(); _simFutureChart = null; }
        waitForCanvas('c-sim-future', function() { initFutureSimulator(); });
        break;
      case 'cit-job':
        if (_simJobChart) { _simJobChart.destroy(); _simJobChart = null; }
        waitForCanvas('c-sim-job-gauge', function() { initJobRiskSimulator(); });
        break;
      case 'cit-budget':
        if (_simBudgetChart) { _simBudgetChart.destroy(); _simBudgetChart = null; }
        waitForCanvas('c-sim-budget', function() { initBudgetSimulator(); });
        break;
      case 'cit-state':
        if (_simStateAiChart) { _simStateAiChart.destroy(); _simStateAiChart = null; }
        if (_simStateUbiChart) { _simStateUbiChart.destroy(); _simStateUbiChart = null; }
        waitForCanvas('c-sim-state-ai', function() { initStateSimulator(); });
        break;
      case 'cit-equality':
        if (_simEqualityChart) { _simEqualityChart.destroy(); _simEqualityChart = null; }
        waitForCanvas('c-sim-equality', function() { initEqualitySimulator(); });
        break;
      case 'cit-reskill':
        if (_simReskillChart) { _simReskillChart.destroy(); _simReskillChart = null; }
        waitForCanvas('c-sim-reskill', function() { initReskillSimulator(); });
        break;
    }
  }

  // ======================================================================
  // NAVIGATION
  // ======================================================================
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        navItems.forEach(b => b.classList.remove('active'));
        item.classList.add('active');
        state.activeTab = tab;
        sections.forEach(s => {
          s.classList.toggle('active', s.id === `section-${tab}`);
        });
        
        // Re-trigger scroll reveal for newly visible elements
        setTimeout(() => {
          Object.values(charts).forEach(ch => { if (ch) { ch.resize(); ch.update('none'); } });
          
          // Lazy-init citizen simulators when their tab becomes visible
          initCitizenSimForTab(tab);

          // Re-observe elements in the active section for reveal animation
          const activeSection = document.getElementById(`section-${tab}`);
          if (activeSection) {
            const revealTargets = activeSection.querySelectorAll(
              '.chart-card-wrapper, .kpi-card, .roadmap-phase, .scenario-compare-card, ' +
              '.swot-quadrant, .survey-overview-card, .principle-card, .ranking-table-wrapper, ' +
              '.prose-section, .methodology-panel, .simulator-card, .timeline-item'
            );
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('revealed');
                  observer.unobserve(entry.target);
                }
              });
            }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
            
            revealTargets.forEach(el => {
              if (!el.classList.contains('revealed')) {
                el.classList.add('reveal-on-scroll');
                observer.observe(el);
              }
            });
          }
        }, 120);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // ======================================================================
  // KPI COUNT-UP (with easeOutExpo for snappier feel)
  // ======================================================================
  function initKPICountup() {
    document.querySelectorAll('.kpi-value').forEach(kpi => {
      const target = parseFloat(kpi.getAttribute('data-target'));
      const prefix = kpi.getAttribute('data-prefix') || '';
      const suffix = kpi.getAttribute('data-suffix') || '';
      const decimals = parseInt(kpi.getAttribute('data-decimals')) || 0;
      const start = 0, duration = 1800, startTime = performance.now();
      (function update(now) {
        const p = Math.min((now - startTime) / duration, 1);
        // easeOutExpo for snappy count-up
        const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        kpi.textContent = prefix + (start + ease * (target - start)).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(update);
      })(performance.now());
    });
  }

  // ======================================================================
  // TOGGLES (Prose & Methodology)
  // ======================================================================
  function initProseToggles() {
    document.querySelectorAll('.prose-toggle-header').forEach(header => {
      header.addEventListener('click', () => {
        const target = document.getElementById(header.getAttribute('data-target'));
        header.classList.toggle('open');
        target.classList.toggle('open');
      });
    });
  }

  function initMethodologyToggles() {
    document.querySelectorAll('.methodology-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('data-target'));
        target.classList.toggle('open');
      });
    });
    // Populate weight grids
    populateWeightGrid('iaavi-weights', D.IAAVI_WEIGHTS);
    populateWeightGrid('ubiri-weights', D.UBIRI_WEIGHTS);
  }

  function populateWeightGrid(containerId, weights) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = Object.entries(weights).map(([k, v]) =>
      `<div class="weight-item"><span class="weight-name">${k.replace(/([A-Z])/g, ' $1')}</span><span class="weight-val">${(v * 100).toFixed(0)}%</span></div>`
    ).join('');
  }

  // ======================================================================
  // CHARTS — ALL 30
  // ======================================================================
  function initCharts() {
    const c = C();

    // Helper: common scales with premium styling
    const commonOpts = (yTitle) => ({
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: "'Outfit', sans-serif", size: 11, weight: 500 },
            usePointStyle: true, boxWidth: 6, padding: 16, color: c.text
          }
        }
      },
      scales: {
        y: { title: { display: !!yTitle, text: yTitle, font: { weight: 600 } }, grid: { color: c.grid, drawBorder: false }, ticks: { color: c.text, padding: 8 } },
        x: { grid: { display: false, drawBorder: false }, ticks: { color: c.text, padding: 8 } }
      }
    });

    // ─── C1: LFPR Trends ──────────────────────────────────────────
    // ─── C1: LFPR Trends (with gradient fill on Female LFPR) ─────
    const c1Canvas = document.getElementById('c1');
    const c1Ctx = c1Canvas.getContext('2d');
    const goldGrad = c1Ctx.createLinearGradient(0, 0, 0, 300);
    goldGrad.addColorStop(0, c.gold + '30'); goldGrad.addColorStop(1, c.gold + '00');
    
    charts.c1 = new Chart(c1Canvas, {
      type: 'line',
      data: {
        labels: ['2017-18','2018-19','2019-20','2020-21','2021-22','2022-23','2023-24','2024-25'],
        datasets: [
          { label: 'Overall', data: [49.8,50.2,53.5,54.9,55.2,57.9,60.1,59.3], borderColor: c.primary, borderWidth: 3, fill: false, tension: 0.35, pointRadius: 4, pointBackgroundColor: c.primary, pointBorderColor: '#fff', pointBorderWidth: 2 },
          { label: 'Male', data: [75.8,75.5,76.0,77.2,77.8,78.5,78.8,79.2], borderColor: c.blue, borderWidth: 2.5, fill: false, tension: 0.35, pointRadius: 3, pointBackgroundColor: c.blue },
          { label: 'Female', data: [23.3,24.5,30.0,32.5,32.8,37.0,41.7,40.0], borderColor: c.gold, borderWidth: 3, fill: true, backgroundColor: goldGrad, tension: 0.35, pointRadius: 5, pointBackgroundColor: c.gold, pointBorderColor: '#fff', pointBorderWidth: 2 }
        ]
      },
      options: { ...commonOpts('% of Population (15+)'), scales: { ...commonOpts('').scales, y: { min: 15, max: 90, title: { display: true, text: '% (15+)', font: { weight: 600 } }, grid: { color: c.grid, drawBorder: false }, ticks: { color: c.text, padding: 8 } } } }
    });

    // ─── C2: Urban Unemployment (with gradient fill) ─────────────
    const c2Canvas = document.getElementById('c2');
    const c2Ctx = c2Canvas.getContext('2d');
    const redGrad = c2Ctx.createLinearGradient(0, 0, 0, 300);
    redGrad.addColorStop(0, c.red + '25'); redGrad.addColorStop(1, c.red + '00');
    
    charts.c2 = new Chart(c2Canvas, {
      type: 'line',
      data: {
        labels: ['Jan19','Apr19','Jul19','Oct19','Jan20','Apr20','Jul20','Oct20','Jan21','Apr21','Jul21','Oct21','Jan22','Apr22','Jul22','Oct22','Jan23','Apr23','Jul23','Oct23','Jan24','Apr24','Jul24','Oct24','Jan25','Apr25'],
        datasets: [{ label: 'Urban Unemployment %', data: [7.2,7.6,8.4,7.9,7.4,23.5,10.9,7.2,6.5,14.7,8.3,7.4,7.5,7.8,7.1,7.5,7.9,8.5,8.1,7.8,7.5,8.9,8.2,7.6,7.1,6.5], borderColor: c.red, borderWidth: 2.5, fill: true, backgroundColor: redGrad, tension: 0.35, pointRadius: 2, pointBackgroundColor: c.red }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { title: { display: true, text: 'Rate (%)', font: { weight: 600 } }, grid: { color: c.grid, drawBorder: false }, ticks: { color: c.text } }, x: { ticks: { maxTicksLimit: 10, color: c.text }, grid: { display: false } } } }
    });

    // ─── C3: Sector Doughnut (Enhanced) ────────────────────────────
    charts.c3 = new Chart(document.getElementById('c3'), {
      type: 'doughnut',
      data: {
        labels: ['Agriculture','Manufacturing','Construction','Trade & Retail','Transport','IT/Services','Education & Health','Other'],
        datasets: [{ data: [44,12,12,13,4,3,6,6], backgroundColor: [c.green,c.blue,c.orange,c.gold,c.teal,c.primary,c.red,c.grey], borderColor: c.card, borderWidth: 3, hoverOffset: 8, hoverBorderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, padding: 10, font: { size: 11, weight: 500 }, color: c.text } } } }
    });

    // ─── C4: Female LFPR International ────────────────────────────
    charts.c4 = new Chart(document.getElementById('c4'), {
      type: 'bar',
      data: {
        labels: ['Iceland','Norway','Sweden','Germany','China','USA','Brazil','S.Korea','Bangladesh','India','Pakistan'],
        datasets: [{ label: 'Female LFPR %', data: [72.8,67.5,64.9,55.8,61.0,55.3,53.1,53.3,38.6,30.5,22.0], backgroundColor: [72.8,67.5,64.9,55.8,61.0,55.3,53.1,53.3,38.6,30.5,22.0].map(v => v === 30.5 ? c.gold : v < 35 ? c.red : c.blue), borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { max: 80, grid: { color: c.grid }, ticks: { color: c.text } }, y: { grid: { display: false }, ticks: { color: c.text } } } }
    });

    // ─── C5: Automation Risk by Sector ────────────────────────────
    charts.c5 = new Chart(document.getElementById('c5'), {
      type: 'bar',
      data: {
        labels: ['Media','Manufacturing','IT/BPO','Banking','Retail','Transport','Legal','Agriculture','Healthcare','Education'],
        datasets: [
          { label: 'Low Speed', data: [35,45,35,30,25,25,20,10,10,8], backgroundColor: 'rgba(201,168,76,0.6)', borderRadius: 4 },
          { label: 'High Speed', data: [70,75,65,65,60,60,50,35,30,25], backgroundColor: c.primary, borderRadius: 4 }
        ]
      },
      options: commonOpts('% Tasks Susceptible')
    });

    // ─── C6: India vs Global Automation Risk ─────────────────────
    charts.c6 = new Chart(document.getElementById('c6'), {
      type: 'bar',
      data: {
        labels: ['No Formal Ed.','Primary Ed.','Secondary Ed.','Vocational','Graduate+','Formal Sector','Informal','Gig Workers'],
        datasets: [
          { label: 'India', data: [72,69,58,45,28,41,69,62], backgroundColor: c.gold, borderRadius: 4 },
          { label: 'Global Avg', data: [65,58,48,38,24,38,60,55], backgroundColor: c.primary, borderRadius: 4 }
        ]
      },
      options: { ...commonOpts('% at High Risk'), indexAxis: 'y', scales: { x: { max: 100, grid: { color: c.grid }, ticks: { color: c.text } }, y: { grid: { display: false }, ticks: { color: c.text, font: { size: 10 } } } } }
    });

    // ─── C7: Gig Economy ─────────────────────────────────────────
    charts.c7 = new Chart(document.getElementById('c7'), {
      type: 'line',
      data: {
        labels: ['2019','2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030'],
        datasets: [
          { label: 'Actual (M)', data: [5.0,5.5,6.2,7.7,9.8,11.0,12.0,null,null,null,null,null], borderColor: c.primary, borderWidth: 3, pointRadius: 4, pointBackgroundColor: c.primary },
          { label: 'Projected (M)', data: [null,null,null,null,null,null,12.0,14.5,17.2,19.8,21.8,23.5], borderColor: c.gold, borderWidth: 2.5, borderDash: [6,4], pointRadius: 3, pointBackgroundColor: c.gold }
        ]
      },
      options: commonOpts('Million Workers')
    });

    // ─── C8: IAAVI Rankings ──────────────────────────────────────
    const iaaviTop = D.iaaviRankings.slice(0, 20);
    charts['c-iaavi-rank'] = new Chart(document.getElementById('c-iaavi-rank'), {
      type: 'bar',
      data: {
        labels: iaaviTop.map(s => s.name),
        datasets: [{ label: 'IAAVI Score', data: iaaviTop.map(s => s.score), backgroundColor: iaaviTop.map(s => s.score > 60 ? c.red : s.score > 40 ? c.gold : c.green), borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { max: 100, title: { display: true, text: 'IAAVI Score (0-100)' }, grid: { color: c.grid }, ticks: { color: c.text } }, y: { grid: { display: false }, ticks: { color: c.text, font: { size: 10 } } } } }
    });

    // ─── C9: IAAVI Radar Top 5 ───────────────────────────────────
    const top5IAAVI = D.iaaviRankings.slice(0, 5);
    const iaaviKeys = Object.keys(D.IAAVI_WEIGHTS);
    const radarColors = [c.red, c.orange, c.gold, c.purple, c.teal];
    charts['c-iaavi-radar'] = new Chart(document.getElementById('c-iaavi-radar'), {
      type: 'radar',
      data: {
        labels: iaaviKeys.map(k => k.replace(/([A-Z])/g, ' $1')),
        datasets: top5IAAVI.map((s, i) => ({
          label: s.name, data: iaaviKeys.map(k => s.components[k]),
          borderColor: radarColors[i], backgroundColor: radarColors[i] + '15', borderWidth: 2, pointRadius: 3
        }))
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10 }, color: c.text } } }, scales: { r: { min: 0, max: 100, angleLines: { color: c.grid }, grid: { color: c.grid }, pointLabels: { color: c.text, font: { size: 9 } }, ticks: { stepSize: 25, backdropColor: 'transparent', color: c.text, font: { size: 8 } } } } }
    });

    // ─── C10: Cross Scatter IAAVI vs UBIRI ────────────────────────
    const scatterData = D.iaaviRankings.map(iaavi => {
      const ubiri = D.ubiriRankings.find(u => u.code === iaavi.code);
      return { x: iaavi.score, y: ubiri ? ubiri.score : 50, label: iaavi.name };
    });
    charts['c-cross-scatter'] = new Chart(document.getElementById('c-cross-scatter'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'States',
          data: scatterData,
          backgroundColor: scatterData.map(d => d.x > 55 && d.y < 50 ? c.red : d.x < 40 && d.y > 60 ? c.green : c.gold),
          pointRadius: 6, pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw.label}: IAAVI=${ctx.raw.x}, UBIRI=${ctx.raw.y}` } } },
        scales: {
          x: { title: { display: true, text: 'IAAVI (Vulnerability →)' }, grid: { color: c.grid }, ticks: { color: c.text } },
          y: { title: { display: true, text: 'UBIRI (Readiness →)' }, grid: { color: c.grid }, ticks: { color: c.text } }
        }
      }
    });

    // ─── C11: UBIRI Rankings ─────────────────────────────────────
    const ubiriTop = D.ubiriRankings.slice(0, 20);
    charts['c-ubiri-rank'] = new Chart(document.getElementById('c-ubiri-rank'), {
      type: 'bar',
      data: {
        labels: ubiriTop.map(s => s.name),
        datasets: [{ label: 'UBIRI Score', data: ubiriTop.map(s => s.score), backgroundColor: ubiriTop.map(s => s.score > 65 ? c.green : s.score > 40 ? c.gold : c.red), borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { max: 100, title: { display: true, text: 'UBIRI Score (0-100)' }, grid: { color: c.grid }, ticks: { color: c.text } }, y: { grid: { display: false }, ticks: { color: c.text, font: { size: 10 } } } } }
    });

    // ─── C12: UBIRI Radar Top5 vs Bottom5 ─────────────────────────
    const top3UBIRI = D.ubiriRankings.slice(0, 3);
    const bot3UBIRI = D.ubiriRankings.slice(-3);
    const ubiriKeys = ['aadhaar','bankAccess','dbtInfra','internet','digiLiteracy','adminEfficiency','fiscalCapacity','financialInclusion'];
    charts['c-ubiri-radar'] = new Chart(document.getElementById('c-ubiri-radar'), {
      type: 'radar',
      data: {
        labels: ubiriKeys.map(k => k.replace(/([A-Z])/g, ' $1')),
        datasets: [
          ...top3UBIRI.map((s, i) => ({ label: s.name + ' (Top)', data: ubiriKeys.map(k => s.components[k]), borderColor: [c.green, c.teal, c.blue][i], backgroundColor: [c.green, c.teal, c.blue][i] + '10', borderWidth: 2, pointRadius: 3 })),
          ...bot3UBIRI.map((s, i) => ({ label: s.name + ' (Bottom)', data: ubiriKeys.map(k => s.components[k]), borderColor: [c.red, c.orange, c.gold][i], backgroundColor: [c.red, c.orange, c.gold][i] + '10', borderWidth: 2, borderDash: [4,4], pointRadius: 3 }))
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { boxWidth: 8, font: { size: 9 }, color: c.text } } }, scales: { r: { min: 0, max: 100, angleLines: { color: c.grid }, grid: { color: c.grid }, pointLabels: { color: c.text, font: { size: 8 } }, ticks: { stepSize: 25, backdropColor: 'transparent', color: c.text, font: { size: 7 } } } } }
    });

    // ─── C13: Wealth Distribution ─────────────────────────────────
    charts.c13 = new Chart(document.getElementById('c13'), {
      type: 'bar',
      data: {
        labels: ['Bottom 10%','10-20%','20-30%','30-40%','40-50%','50-60%','60-70%','70-80%','80-90%','90-99%','Top 1%'],
        datasets: [{ label: 'Wealth Share %', data: [-0.5,0.1,0.3,0.6,1.0,1.5,2.2,3.5,6.8,24.5,40.0], backgroundColor: [c.red,c.red,c.orange,c.orange,c.gold,c.green,c.teal,c.blue,c.blue,c.primary,c.primary], borderRadius: 4 }]
      },
      options: { ...commonOpts('% of Total Wealth'), plugins: { legend: { display: false } } }
    });

    // ─── C14: UBI Cost Scenarios ──────────────────────────────────
    const ubiPct = [1.74, 3.48, 10.45, 20.9];
    charts.c8 = new Chart(document.getElementById('c8'), {
      type: 'bar',
      data: {
        labels: ['₹500/mo','₹1,000/mo','₹3,000/mo','₹6,000/mo'],
        datasets: [{ label: '% of GDP', data: ubiPct, backgroundColor: ubiPct.map(v => v < 3 ? c.green : v < 6 ? c.gold : v < 12 ? c.orange : c.red), borderRadius: 4 }]
      },
      options: { ...commonOpts('% of GDP (FY25)'), plugins: { legend: { display: false } }, scales: { ...commonOpts('').scales, y: { max: 25, ticks: { callback: v => v + '%', color: c.text }, grid: { color: c.grid } } } }
    });

    // ─── C15: UBI vs Welfare ─────────────────────────────────────
    charts.c9 = new Chart(document.getElementById('c9'), {
      type: 'bar',
      data: {
        labels: ['Food Subsidy','Fertiliser','MGNREGS','PM-KISAN','PMAY','Jal Jeevan','UBI ₹500/mo','Total Welfare'],
        datasets: [{ label: '₹ Trillion', data: [2.11,1.68,0.30,0.635,0.77,0.68,5.76,6.275], backgroundColor: [c.blue,c.green,c.red,c.purple,c.orange,c.teal,c.gold,c.primary], borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: '₹ Trillion' }, grid: { color: c.grid }, ticks: { color: c.text } }, y: { grid: { display: false }, ticks: { color: c.text, font: { size: 10 } } } } }
    });

    // ─── C16: Funding Mix Pie ────────────────────────────────────
    charts.c10 = new Chart(document.getElementById('c10'), {
      type: 'pie',
      data: {
        labels: ['Subsidy Rationalisation','GST Compliance','Income Tax Reform','AI/Digital Surcharge','Wealth Tax'],
        datasets: [{ data: [43,17,18,9,13], backgroundColor: [c.primary,c.blue,c.green,c.gold,c.red], borderColor: c.card, borderWidth: 2 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 }, color: c.text } } } }
    });

    // ─── C17: Fiscal Deficit Impact ──────────────────────────────
    charts['c-fiscal-deficit'] = new Chart(document.getElementById('c-fiscal-deficit'), {
      type: 'bar',
      data: {
        labels: ['Current','+ ₹500/mo','+ ₹1,000/mo','+ ₹3,000/mo','+ ₹6,000/mo'],
        datasets: [
          { label: 'Base Deficit', data: [4.3,4.3,4.3,4.3,4.3], backgroundColor: c.blue, borderRadius: 4 },
          { label: 'UBI Addition', data: [0,1.74,3.48,10.45,20.9], backgroundColor: c.red, borderRadius: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, grid: { display: false }, ticks: { color: c.text } }, y: { stacked: true, title: { display: true, text: 'Fiscal Deficit (% GDP)' }, grid: { color: c.grid }, ticks: { color: c.text } } }, plugins: { legend: { position: 'top' } } }
    });

    // ─── C18: DBT Growth ─────────────────────────────────────────
    charts.c14 = new Chart(document.getElementById('c14'), {
      type: 'bar',
      data: {
        labels: ['FY15','FY16','FY17','FY18','FY19','FY20','FY21','FY22','FY23','FY24','FY25'],
        datasets: [
          { label: 'DBT (₹T)', type: 'bar', data: [0.61,0.98,1.40,1.90,2.48,3.02,5.55,5.69,6.94,6.30,6.60], backgroundColor: c.primary, borderRadius: 4, yAxisID: 'y' },
          { label: 'Schemes', type: 'line', data: [42,106,142,177,223,252,268,290,311,320,327], borderColor: c.gold, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: c.gold, yAxisID: 'y1' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { title: { display: true, text: '₹ Trillion' }, position: 'left', grid: { color: c.grid }, ticks: { color: c.text } }, y1: { title: { display: true, text: 'Schemes' }, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: c.text } }, x: { grid: { display: false }, ticks: { color: c.text } } } }
    });

    // ─── SCENARIO CHARTS ─────────────────────────────────────────
    const sc = D.futureScenarios;
    const yrs = sc.years;

    function makeScenarioChart(canvasId, key, ylabel) {
      return new Chart(document.getElementById(canvasId), {
        type: 'line',
        data: {
          labels: yrs,
          datasets: [
            { label: 'No UBI', data: sc.scenario1[key], borderColor: sc.scenario1.color, borderWidth: 2.5, tension: 0.3, pointRadius: 2 },
            { label: 'Partial UBI', data: sc.scenario2[key], borderColor: sc.scenario2.color, borderWidth: 2.5, tension: 0.3, pointRadius: 2 },
            { label: 'Full UBI', data: sc.scenario3[key], borderColor: sc.scenario3.color, borderWidth: 2.5, tension: 0.3, pointRadius: 2 }
          ]
        },
        options: commonOpts(ylabel)
      });
    }

    charts['c-sc-unemployment'] = makeScenarioChart('c-sc-unemployment', 'unemployment', 'Unemployment %');
    charts['c-sc-poverty'] = makeScenarioChart('c-sc-poverty', 'povertyRate', 'Poverty Rate %');
    charts['c-sc-gdp'] = makeScenarioChart('c-sc-gdp', 'gdpGrowth', 'GDP Growth %');
    charts['c-sc-gini'] = makeScenarioChart('c-sc-gini', 'giniCoeff', 'Gini Coefficient');

    // ─── Displacement Bubble ─────────────────────────────────────
    const sectorData = D.sectorDisplacement;
    charts['c-displacement-bubble'] = new Chart(document.getElementById('c-displacement-bubble'), {
      type: 'bubble',
      data: {
        datasets: sectorData.map((s, i) => ({
          label: s.sector,
          data: [{ x: Math.min(s.currentEmp, 100), y: s.atRisk, r: Math.sqrt(s.currentEmp * s.atRisk / 100) * 3 + 4 }],
          backgroundColor: [c.red, c.red, c.red, c.red, c.gold, c.green, c.green, c.gold, c.red, c.red, c.gold, c.gold, c.red][i] + '88',
          borderColor: [c.red, c.red, c.red, c.red, c.gold, c.green, c.green, c.gold, c.red, c.red, c.gold, c.gold, c.red][i]
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => { const s = sectorData[ctx.datasetIndex]; return `${s.sector}: ${s.currentEmp}M workers, ${s.atRisk}% at risk`; } } } },
        scales: {
          x: { title: { display: true, text: 'Current Employment (M, capped 100)' }, grid: { color: c.grid }, ticks: { color: c.text } },
          y: { title: { display: true, text: '% Tasks at Risk' }, grid: { color: c.grid }, ticks: { color: c.text } }
        }
      }
    });

    // ─── Minority Progress ───────────────────────────────────────
    charts['c-minority-progress'] = new Chart(document.getElementById('c-minority-progress'), {
      type: 'bar',
      data: {
        labels: ['Literacy Rate','Urban Poverty','Govt Job Share','Self-Employed','Informal Sector'],
        datasets: [
          { label: 'Sachar 2006', data: [59.1,38.4,4.9,61,85], backgroundColor: c.red, borderRadius: 4 },
          { label: 'Current 2025', data: [68.5,22.5,5.8,55,82], backgroundColor: c.green, borderRadius: 4 }
        ]
      },
      options: commonOpts('%')
    });

    // ─── Minority Effectiveness Radar ────────────────────────────
    const minEff = D.minorityData.schemeEffectiveness;
    charts['c-minority-effectiveness'] = new Chart(document.getElementById('c-minority-effectiveness'), {
      type: 'radar',
      data: {
        labels: ['Benefit Score','Low Leakage','Low Admin Cost','Inclusion Rate','Minority Reach'],
        datasets: minEff.map((s, i) => ({
          label: s.scheme, data: [s.benefitScore, 100-s.leakageRisk, 100-s.adminCost, s.inclusionRate, s.reachMinority],
          borderColor: [c.green, c.orange, c.blue, c.red, c.purple][i],
          backgroundColor: [c.green, c.orange, c.blue, c.red, c.purple][i] + '10',
          borderWidth: 2, pointRadius: 3
        }))
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { boxWidth: 8, font: { size: 9 }, color: c.text } } }, scales: { r: { min: 0, max: 100, angleLines: { color: c.grid }, grid: { color: c.grid }, pointLabels: { color: c.text, font: { size: 9 } }, ticks: { stepSize: 25, backdropColor: 'transparent', color: c.text, font: { size: 7 } } } } }
    });

    // ─── Decision Matrix ─────────────────────────────────────────
    charts['c-decision-matrix'] = new Chart(document.getElementById('c-decision-matrix'), {
      type: 'bar',
      data: {
        labels: ['Fiscal Viability','Inclusion','Political Feasibility','Poverty Impact','Implementation','Scalability','Equity','Sustainability'],
        datasets: [
          { label: 'Universal UBI', data: [40,95,35,90,65,85,90,70], backgroundColor: c.green, borderRadius: 4 },
          { label: 'Targeted UBI', data: [75,55,70,65,55,60,50,65], backgroundColor: c.gold, borderRadius: 4 },
          { label: 'No UBI', data: [95,20,80,15,90,10,15,30], backgroundColor: c.red, borderRadius: 4 }
        ]
      },
      options: commonOpts('Score (0-100)')
    });

    // ─── AABIF Funding Pie ───────────────────────────────────────
    const funding = D.aabifFramework.fundingSources;
    charts['c-aabif-funding'] = new Chart(document.getElementById('c-aabif-funding'), {
      type: 'doughnut',
      data: {
        labels: funding.map(f => f.source),
        datasets: [{ data: funding.map(f => f.share), backgroundColor: [c.primary, c.gold, c.teal, c.blue, c.green], borderColor: c.card, borderWidth: 2 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '55%', plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 }, color: c.text } } } }
    });

    // ─── AABIF Timeline ──────────────────────────────────────────
    const pilot = D.aabifFramework.pilotDesign;
    const phases = [pilot.phase1, pilot.phase2, pilot.phase3, pilot.phase4];
    charts['c-aabif-timeline'] = new Chart(document.getElementById('c-aabif-timeline'), {
      type: 'bar',
      data: {
        labels: phases.map((p, i) => `Phase ${i+1}`),
        datasets: [{ label: 'Recipients', data: [50000, 500000, 50000000, 960000000], backgroundColor: [c.blue, c.teal, c.gold, c.green], borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => { const p = phases[ctx.dataIndex]; return `${p.period}: ${p.recipients} recipients`; } } } }, scales: { y: { type: 'logarithmic', title: { display: true, text: 'Recipients (log scale)' }, grid: { color: c.grid }, ticks: { color: c.text, callback: v => v >= 1e6 ? (v/1e6)+'M' : v >= 1e3 ? (v/1e3)+'K' : v } }, x: { grid: { display: false }, ticks: { color: c.text } } } }
    });

    // ─── Global Pilots ───────────────────────────────────────────
    charts.c11 = new Chart(document.getElementById('c11'), {
      type: 'bar',
      data: {
        labels: ['Finland','Stockton USA','Wales UK','Germany','Ontario','Namibia','India MP','GiveDirectly','NYAY (proposed)'],
        datasets: [{ label: 'USD/month (PPP)', data: [620,500,390,1330,985,105,45,22,80], backgroundColor: [c.blue,c.green,c.teal,c.purple,c.primary,c.orange,c.gold,c.red,c.grey], borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'USD/month (PPP)' }, grid: { color: c.grid }, ticks: { color: c.text } }, y: { grid: { display: false }, ticks: { color: c.text, font: { size: 10 } } } } }
    });

    // ─── Pilot Outcomes Radar ────────────────────────────────────
    charts.c12 = new Chart(document.getElementById('c12'), {
      type: 'radar',
      data: {
        labels: ['Mental Health','Food Security','Employment','Education','Health','Financial Stability','Entrepreneurship'],
        datasets: [
          { label: 'Finland', data: [85,45,60,40,70,75,35], borderColor: c.blue, backgroundColor: c.blue+'10', borderWidth: 2, pointRadius: 3 },
          { label: 'GiveDirectly', data: [55,90,58,75,70,80,72], borderColor: c.green, backgroundColor: c.green+'10', borderWidth: 2, pointRadius: 3 },
          { label: 'Stockton', data: [72,68,70,52,65,82,60], borderColor: c.gold, backgroundColor: c.gold+'10', borderWidth: 2, pointRadius: 3 },
          { label: 'India MP', data: [60,88,55,80,72,65,55], borderColor: c.red, backgroundColor: c.red+'10', borderWidth: 2, pointRadius: 3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { boxWidth: 8, font: { size: 10 }, color: c.text } } }, scales: { r: { min: 0, max: 100, angleLines: { color: c.grid }, grid: { color: c.grid }, pointLabels: { color: c.text, font: { size: 9 } }, ticks: { stepSize: 25, backdropColor: 'transparent', color: c.text, font: { size: 8 } } } } }
    });
  }

  // ======================================================================
  // UPDATE CHART COLORS ON THEME CHANGE
  // ======================================================================
  function updateAllChartColors(theme) {
    const c = C(theme);
    Object.values(charts).forEach(chart => {
      if (!chart) return;
      if (chart.options.scales) {
        Object.values(chart.options.scales).forEach(scale => {
          if (scale.grid) scale.grid.color = c.grid;
          if (scale.ticks) scale.ticks.color = c.text;
          if (scale.angleLines) scale.angleLines.color = c.grid;
          if (scale.pointLabels) scale.pointLabels.color = c.text;
        });
      }
      if (chart.options.plugins?.legend?.labels) chart.options.plugins.legend.labels.color = c.text;
      chart.update();
    });
  }

  // ======================================================================
  // FISCAL CALCULATOR
  // ======================================================================
  function initFiscalCalculator() {
    const amountSlider = document.getElementById('ubi-amount-slider');
    const coverageSlider = document.getElementById('ubi-coverage-slider');
    if (!amountSlider || !coverageSlider) return;

    function updateCalc() {
      const amount = parseInt(amountSlider.value);
      const coveragePct = parseInt(coverageSlider.value);
      const pop = D.fiscalParams.adultPop * (coveragePct / 100);
      const cost = D.fiscalParams.calculateCost(amount, pop);
      const gdpPct = D.fiscalParams.calculateGDPPercent(cost, D.fiscalParams.gdpFY25);
      const budgetPct = (cost / D.fiscalParams.totalExpFY27) * 100;
      const newDeficit = D.fiscalParams.fiscalDeficitFY27 + gdpPct;

      document.getElementById('ubi-amount-display').textContent = `₹${amount.toLocaleString()}`;
      document.getElementById('ubi-coverage-display').textContent = `${coveragePct}% (${Math.round(pop)}M)`;
      document.getElementById('calc-annual-cost').textContent = `₹${cost.toFixed(2)}T`;
      document.getElementById('calc-gdp-pct').textContent = `${gdpPct.toFixed(2)}%`;
      document.getElementById('calc-budget-pct').textContent = `${budgetPct.toFixed(1)}%`;
      document.getElementById('calc-deficit').textContent = `${newDeficit.toFixed(2)}%`;
    }

    amountSlider.addEventListener('input', updateCalc);
    coverageSlider.addEventListener('input', updateCalc);
    updateCalc();
  }

  // ======================================================================
  // SCENARIO SELECTOR
  // ======================================================================
  function initScenarioSelector() {
    document.querySelectorAll('.scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Toggle visibility of datasets
        const scenario = btn.getAttribute('data-scenario');
        ['c-sc-unemployment','c-sc-poverty','c-sc-gdp','c-sc-gini'].forEach(key => {
          const chart = charts[key];
          if (!chart) return;
          chart.data.datasets.forEach((ds, i) => {
            if (scenario === 'all') ds.hidden = false;
            else ds.hidden = (i !== ['scenario1','scenario2','scenario3'].indexOf(scenario));
          });
          chart.update();
        });
      });
    });
  }

  // ======================================================================
  // SWOT DISPLAY
  // ======================================================================
  function initSwotDisplay() {
    function renderSwot(key) {
      const data = D.swotAnalysis[key];
      ['strengths','weaknesses','opportunities','threats'].forEach(q => {
        const ul = document.getElementById(`swot-${q}`);
        ul.innerHTML = (data[q] || []).map(item => `<li>${item}</li>`).join('');
      });
    }
    renderSwot('universalUBI');
    document.querySelectorAll('.swot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.swot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSwot(btn.getAttribute('data-swot'));
      });
    });
  }

  // ======================================================================
  // SURVEY DISPLAY
  // ======================================================================
  function initSurveyDisplay() {
    const container = document.getElementById('survey-sections-container');
    if (!container) return;
    container.innerHTML = D.surveyDesign.sections.map((section, i) => `
      <div class="survey-section-card">
        <div class="survey-section-header" onclick="this.nextElementSibling.classList.toggle('open')">
          ${section.title}
          <span style="font-size:12px;color:var(--accent-gold)">▼</span>
        </div>
        <div class="survey-section-body${i === 0 ? ' open' : ''}">
          ${section.questions.map(q => `<div class="survey-question">${q}</div>`).join('')}
        </div>
      </div>
    `).join('');

    const hypList = document.getElementById('hypotheses-list');
    if (hypList) {
      hypList.innerHTML = D.surveyDesign.analysisFramework.hypotheses.map(h => {
        const parts = h.split(':');
        return `<div class="hypothesis-item"><strong>${parts[0]}:</strong> ${parts.slice(1).join(':')}</div>`;
      }).join('');
    }
  }

  // ======================================================================
  // AABIF DISPLAY
  // ======================================================================
  function initAABIFDisplay() {
    const grid = document.getElementById('aabif-principles-grid');
    if (grid) {
      grid.innerHTML = D.aabifFramework.principles.map(p => {
        const [title, ...rest] = p.split(':');
        return `<div class="principle-card"><strong>${title}:</strong>${rest.join(':')}</div>`;
      }).join('');
    }
    const tech = document.getElementById('aabif-tech-list');
    if (tech) tech.innerHTML = D.aabifFramework.technologyStack.map(t => `<li>${t}</li>`).join('');
    const gov = document.getElementById('aabif-gov-list');
    if (gov) gov.innerHTML = D.aabifFramework.governanceStructure.map(g => `<li>${g}</li>`).join('');
  }

  // ======================================================================
  // ROADMAP
  // ======================================================================
  function initRoadmapDisplay() {
    const container = document.getElementById('roadmap-display');
    if (!container) return;
    const phases = [D.policyRecommendations.shortTerm, D.policyRecommendations.mediumTerm, D.policyRecommendations.longTerm];
    container.innerHTML = phases.map(phase => `
      <div class="roadmap-phase">
        <div class="roadmap-phase-header">
          <span class="phase-period">${phase.period}</span>
          <span class="phase-title">${phase.title}</span>
        </div>
        <div class="roadmap-actions">
          ${phase.actions.map(a => `
            <div class="roadmap-action">
              <div class="priority-dot ${a.priority.toLowerCase()}"></div>
              <div class="roadmap-action-text">${a.action}</div>
              <div class="roadmap-action-cost">${a.cost}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // ======================================================================
  // PARLIAMENTARY DISPLAY
  // ======================================================================
  function initParliamentaryDisplay() {
    const timeline = document.getElementById('debate-timeline-content');
    if (timeline) {
      timeline.innerHTML = D.parliamentaryData.keyDebates.map(d => {
        const posColor = d.position.includes('Strong Support') ? 'var(--accent-green)' : d.position.includes('Support') ? 'var(--accent-blue)' : d.position.includes('Oppose') ? 'var(--accent-red)' : 'var(--accent-gold)';
        return `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-date">${d.date} · ${d.house}</span>
              <span class="timeline-speaker">${d.speaker}</span><span class="timeline-party">${d.party}</span>
              <p class="timeline-summary">${d.summary}</p>
              <span class="timeline-position" style="background:${posColor}22;color:${posColor}">${d.position}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    const matrix = document.getElementById('party-matrix-body');
    if (matrix) {
      matrix.innerHTML = D.parliamentaryData.partyPositions.map(p => {
        const ubiColor = p.ubiPosition.includes('Strong Support') ? 'low' : p.ubiPosition.includes('Support') ? 'medium' : 'high';
        return `<tr>
          <td><strong>${p.party}</strong></td>
          <td><span class="risk-badge ${ubiColor}">${p.ubiPosition}</span></td>
          <td>${p.aiPosition}</td>
          <td>${p.transferPreference}</td>
          <td style="font-size:12px">${p.reasoning}</td>
        </tr>`;
      }).join('');
    }
  }

  // ======================================================================
  // DISPLACEMENT TABLE
  // ======================================================================
  function initDisplacementTable() {
    const tbody = document.getElementById('displacement-table-body');
    if (!tbody) return;
    tbody.innerHTML = D.sectorDisplacement.map(s => `
      <tr>
        <td><strong>${s.sector}</strong></td>
        <td>${s.currentEmp}M</td>
        <td>${s.atRisk}%</td>
        <td>${s.highScenario}%</td>
        <td style="font-family:var(--font-family-mono);font-size:11px">${s.timeHorizon}</td>
        <td>${s.likelihood}</td>
        <td><span class="risk-badge ${s.riskClass.toLowerCase().replace(' ','-')}">${s.riskClass}</span></td>
      </tr>
    `).join('');
  }

  // ======================================================================
  // RANKING TABLES (IAAVI & UBIRI)
  // ======================================================================
  function initRankingTables() {
    // IAAVI
    const iaaviBody = document.getElementById('iaavi-table-body');
    if (iaaviBody) {
      iaaviBody.innerHTML = D.iaaviRankings.map((s, i) => {
        const cls = s.score > 60 ? 'high' : s.score > 40 ? 'medium' : 'low';
        const label = s.score > 60 ? 'High Risk' : s.score > 40 ? 'Medium Risk' : 'Low Risk';
        return `<tr>
          <td style="font-weight:700;color:var(--accent-gold)">#${i + 1}</td>
          <td><strong>${s.name}</strong></td>
          <td style="font-family:var(--font-family-mono);font-weight:700">${s.score}</td>
          <td><span class="risk-badge ${cls}">${label}</span></td>
          <td><div class="score-bar-container"><div class="score-bar ${cls}" style="width:${s.score}%;animation:scoreBarFill 1.5s ease"></div></div></td>
        </tr>`;
      }).join('');
    }
    // UBIRI
    const ubiriBody = document.getElementById('ubiri-table-body');
    if (ubiriBody) {
      ubiriBody.innerHTML = D.ubiriRankings.map((s, i) => {
        const cls = s.score > 65 ? 'ready-high' : s.score > 40 ? 'ready-medium' : 'ready-low';
        const label = s.score > 65 ? 'High Ready' : s.score > 40 ? 'Moderate' : 'Low Ready';
        return `<tr>
          <td style="font-weight:700;color:var(--accent-gold)">#${i + 1}</td>
          <td><strong>${s.name}</strong></td>
          <td style="font-family:var(--font-family-mono);font-weight:700">${s.score}</td>
          <td><span class="risk-badge ${s.score > 65 ? 'low' : s.score > 40 ? 'medium' : 'high'}">${label}</span></td>
          <td><div class="score-bar-container"><div class="score-bar ${cls}" style="width:${s.score}%;animation:scoreBarFill 1.5s ease"></div></div></td>
        </tr>`;
      }).join('');
    }
  }

  // ======================================================================
  // BIBLIOGRAPHY
  // ======================================================================
  function initBibliography() {
    const container = document.getElementById('bibliography-content');
    if (!container) return;
    container.innerHTML = D.bibliography.map(ref => `<div class="bib-entry">${ref}</div>`).join('');
  }

  // ======================================================================
  // SEARCH
  // ======================================================================
  function initSearch() {
    const input = document.getElementById('dashboard-search');
    const clearBtn = document.getElementById('clear-search');
    const cards = document.querySelectorAll('.chart-card-wrapper');

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      clearBtn.style.display = q ? 'flex' : 'none';
      cards.forEach(card => {
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();
        const h3 = card.querySelector('h3');
        const match = !q || tags.includes(q) || (h3 && h3.textContent.toLowerCase().includes(q));
        card.classList.toggle('filtered-out', !match);
      });
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      cards.forEach(card => card.classList.remove('filtered-out'));
    });
  }

  // ======================================================================
  // PRINT
  // ======================================================================
  function initPrint() {
    const btn = document.getElementById('print-report-btn');
    if (btn) btn.addEventListener('click', () => window.print());
  }

  // ======================================================================
  // CITIZEN MODE & MODAL
  // ======================================================================
  function initCitizenMode() {
    const btn = document.getElementById('mode-toggle-btn');
    const banner = document.getElementById('citizen-banner');
    const sections = document.querySelectorAll('.dashboard-section');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Force-destroy all citizen simulator chart instances so they can be
    // recreated fresh on visible canvases.
    function destroyAllSimCharts() {
      if (_simFutureChart) { _simFutureChart.destroy(); _simFutureChart = null; }
      if (_simJobChart) { _simJobChart.destroy(); _simJobChart = null; }
      if (_simBudgetChart) { _simBudgetChart.destroy(); _simBudgetChart = null; }
      if (_simStateAiChart) { _simStateAiChart.destroy(); _simStateAiChart = null; }
      if (_simStateUbiChart) { _simStateUbiChart.destroy(); _simStateUbiChart = null; }
      if (_simEqualityChart) { _simEqualityChart.destroy(); _simEqualityChart = null; }
      if (_simReskillChart) { _simReskillChart.destroy(); _simReskillChart = null; }
    }

    function updateMode() {
      if (state.isCitizenMode) {
        document.body.classList.add('citizen-mode');
        if (btn) {
          btn.querySelector('.mode-text').textContent = '📊 Expert Mode';
          btn.style.backgroundColor = 'var(--accent-blue)';
        }
        if (banner) banner.style.display = 'flex';

        // Switch to a citizen tab if currently on an expert tab
        if (!state.activeTab.startsWith('cit-')) {
          switchTab('cit-future');
        }
      } else {
        document.body.classList.remove('citizen-mode');
        if (btn) {
          btn.querySelector('.mode-text').textContent = '🧑‍🏫 Citizen Mode';
          btn.style.backgroundColor = 'var(--accent-gold)';
        }
        if (banner) banner.style.display = 'none';

        // Switch to an expert tab if currently on a citizen tab
        if (state.activeTab.startsWith('cit-')) {
          switchTab('executive');
        }
      }
      // Resize expert-mode charts
      setTimeout(() => {
        Object.values(charts).forEach(ch => { if (ch) { ch.resize(); ch.update('none'); } });
      }, 100);
      // Initialize the active citizen simulator (waitForCanvas handles timing)
      if (state.isCitizenMode) {
        initCitizenSimForTab(state.activeTab);
      }
    }

    function switchTab(tabId) {
      state.activeTab = tabId;
      navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
      });
      sections.forEach(s => {
        s.classList.toggle('active', s.id === `section-${tabId}`);
      });
    }

    if (btn) {
      btn.addEventListener('click', () => {
        state.isCitizenMode = !state.isCitizenMode;
        updateMode();
      });
    }

    // Modal elements
    const modal = document.getElementById('explanation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeBtn = document.getElementById('modal-close-btn');

    function openModal(title, text) {
      if (!modal) return;
      modalTitle.textContent = title;
      modalText.textContent = text || "Explanation coming soon...";
      modal.classList.add('active');
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    // Attach click events to cards
    document.querySelectorAll('.kpi-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!state.isCitizenMode) return;
        e.preventDefault(); e.stopPropagation();
        const label = card.querySelector('.kpi-label').textContent.trim();
        const expl = D.explanations[label] || `Explanation for ${label}`;
        openModal(label, expl);
      });
    });

    document.querySelectorAll('.chart-card-wrapper').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!state.isCitizenMode) return;
        e.preventDefault(); e.stopPropagation();
        const h3 = card.querySelector('h3');
        const code = card.querySelector('.chart-code');
        const title = h3 ? h3.textContent.trim() : 'Chart';
        const key = code ? code.textContent.trim().replace(':', '') : '';
        const expl = D.explanations[key] || `Explanation for ${title}`;
        openModal(title, expl);
      });
    });

    // Run on load
    updateMode();
  }

  // ======================================================================
  // CITIZEN SIMULATOR CHART INSTANCES (stored at module scope to persist across calls)
  // ======================================================================
  let _simFutureChart = null;
  let _simJobChart = null;
  let _simBudgetChart = null;
  let _simStateAiChart = null;
  let _simStateUbiChart = null;
  let _simEqualityChart = null;
  let _simReskillChart = null;
  let _simListenersAttached = false;

  // ======================================================================
  // 1. MACROECONOMIC PROJECTION MODEL (FUTURE SIMULATOR)
  // ======================================================================
  function initFutureSimulator() {
    const aiSlider = document.getElementById('sim-ai-speed');
    const ubiSlider = document.getElementById('sim-ubi-amount');
    const canvas = document.getElementById('c-sim-future');
    
    if (!aiSlider || !ubiSlider || !canvas) return;

    const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040];
    const aiLabels = { 1: 'Low', 2: 'Baseline', 3: 'High' };
    const ubiLabels = { 0: 'Zero', 1: '₹500/mo', 2: '₹1,000/mo', 3: '₹3,000/mo' };

    function updateSimulation() {
      const aiSpeed = parseInt(aiSlider.value);
      const ubiAmount = parseInt(ubiSlider.value);

      document.getElementById('sim-ai-val').textContent = aiLabels[aiSpeed];
      document.getElementById('sim-ubi-val').textContent = ubiLabels[ubiAmount];

      let unemp = 6.8, poverty = 12.0, growth = 6.5;
      const unempArr = [], povertyArr = [], growthArr = [];

      for (let i = 0; i < years.length; i++) {
        unempArr.push(unemp); povertyArr.push(poverty); growthArr.push(growth);
        let unempInc = (aiSpeed === 3) ? 0.9 : (aiSpeed === 2 ? 0.4 : 0.1);
        let ubiMitigation = ubiAmount * 0.15;
        unemp = Math.max(3, Math.min(25, unemp + unempInc - ubiMitigation));
        poverty = Math.max(1, Math.min(35, poverty + (unempInc * 0.5) - (ubiAmount * 1.5)));
        growth = Math.max(2, Math.min(10, growth + (aiSpeed * 0.1) + (ubiAmount * 0.05)));
      }

      document.getElementById('val-poverty').textContent = povertyArr[povertyArr.length-1].toFixed(1) + '%';
      document.getElementById('val-unemp').textContent = unempArr[unempArr.length-1].toFixed(1) + '%';
      document.getElementById('val-growth').textContent = (growthArr.reduce((a, b) => a + b) / growthArr.length).toFixed(1) + '%';
      
      const desc = document.getElementById('sim-desc-future');
      if (aiSpeed === 3 && ubiAmount === 0) desc.textContent = 'High automation velocity without capital distribution leads to severe structural unemployment and poverty spikes.';
      else if (aiSpeed === 3 && ubiAmount === 3) desc.textContent = 'Aggressive UBI deployment successfully absorbs the shock of rapid automation, compressing poverty to near-zero.';
      else if (ubiAmount > 0 && ubiAmount < 3) desc.textContent = 'Baseline UBI buffers the immediate shock, but structural displacement requires further fiscal intervention.';
      else if (aiSpeed < 3 && ubiAmount === 0) desc.textContent = 'Low automation delays severe impact, but lack of capital distribution widens inequality incrementally.';
      else desc.textContent = 'Controlled automation and baseline UBI facilitate a stable, managed macroeconomic transition.';

      const colors = C();
      if (_simFutureChart) {
        _simFutureChart.data.datasets[0].data = povertyArr;
        _simFutureChart.data.datasets[1].data = unempArr;
        _simFutureChart.data.datasets[2].data = growthArr;
        _simFutureChart.update();
      } else {
        const ctx = canvas.getContext('2d');
        const gradientP = ctx.createLinearGradient(0, 0, 0, 400);
        gradientP.addColorStop(0, `${colors.red}33`); gradientP.addColorStop(1, `${colors.red}00`);
        _simFutureChart = new Chart(canvas, {
          type: 'line',
          data: {
            labels: years,
            datasets: [
              { label: 'Poverty Rate (%)', data: povertyArr, borderColor: colors.red, backgroundColor: gradientP, fill: true, borderWidth: 2, tension: 0.4, pointRadius: 0, pointHitRadius: 10 },
              { label: 'Unemployment (%)', data: unempArr, borderColor: colors.gold, backgroundColor: 'transparent', borderWidth: 2, borderDash: [5, 5], tension: 0.4, pointRadius: 0, pointHitRadius: 10 },
              { label: 'GDP Growth (%)', data: growthArr, borderColor: colors.green, backgroundColor: 'transparent', borderWidth: 2, tension: 0.4, pointRadius: 0, pointHitRadius: 10 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { position: 'top', labels: { color: colors.text, usePointStyle: true, boxWidth: 6, font: { family: "'Outfit', sans-serif", size: 13 } } },
              tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleFont: { size: 14 }, bodyFont: { size: 13 }, padding: 12, cornerRadius: 8 }
            },
            scales: {
              x: { grid: { color: colors.grid, drawBorder: false }, ticks: { color: colors.text } },
              y: { grid: { color: colors.grid, drawBorder: false }, ticks: { color: colors.text }, min: 0, max: 35 }
            }
          }
        });
      }
    }

    if (!_simListenersAttached) {
      aiSlider.addEventListener('input', updateSimulation);
      ubiSlider.addEventListener('input', updateSimulation);
      _simListenersAttached = true;
    }
    
    // Destroy and recreate if chart exists but canvas was hidden (zero dimensions)
    if (_simFutureChart && canvas.clientWidth === 0) {
      _simFutureChart.destroy(); _simFutureChart = null;
    }
    updateSimulation();
    // NOTE: Other simulators are NOT called here. Each is lazy-initialized
    // when its own tab becomes active via initCitizenSimForTab().
  }

  // ======================================================================
  // 2. SECTORAL DISPLACEMENT MATRIX
  // ======================================================================
  function initJobRiskSimulator() {
    const select = document.getElementById('sim-job-select');
    const canvas = document.getElementById('c-sim-job-gauge');
    if (!select || !canvas) return;

    function update() {
      const val = select.value;
      const sector = D.sectorDisplacement.find(s => s.sector === val) || D.sectorDisplacement[0];
      const risk = sector.atRisk;
      
      document.getElementById('val-job-risk').textContent = risk + '%';
      document.getElementById('val-job-safe').textContent = (100 - risk) + '%';
      
      const desc = document.getElementById('sim-desc-job');
      if (risk > 45) desc.textContent = `Analysis indicates high vulnerability. Generative AI and robotics are projected to automate highly structured tasks within this sector.`;
      else if (risk > 30) desc.textContent = `Moderate vulnerability. Automation will primarily augment workflows rather than fully displace human capital.`;
      else desc.textContent = `Low vulnerability. This sector relies on complex human interaction, unstructured physical presence, or high-level creative synthesis.`;

      const colors = C();
      if (_simJobChart) {
        _simJobChart.data.datasets[0].data = [risk, 100 - risk];
        _simJobChart.update();
      } else {
        _simJobChart = new Chart(canvas, {
          type: 'doughnut',
          data: {
            labels: ['Automatable Tasks', 'Retained Human Tasks'],
            datasets: [{ data: [risk, 100 - risk], backgroundColor: [colors.gold, 'rgba(156, 163, 175, 0.2)'], borderWidth: 0, hoverOffset: 4 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '75%',
            plugins: { legend: { position: 'bottom', labels: { color: colors.text, usePointStyle: true, boxWidth: 8 } }, tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)' } }
          }
        });
      }
    }
    if (!select._simListenerAttached) { select.addEventListener('change', update); select._simListenerAttached = true; }
    if (_simJobChart && canvas.clientWidth === 0) { _simJobChart.destroy(); _simJobChart = null; }
    update();
  }

  // ======================================================================
  // 3. FISCAL FEASIBILITY STRESS TEST
  // ======================================================================
  function initBudgetSimulator() {
    const ubiSlider = document.getElementById('sim-bud-ubi');
    const taxSlider = document.getElementById('sim-bud-tax');
    const subSlider = document.getElementById('sim-bud-sub');
    const canvas = document.getElementById('c-sim-budget');
    if (!ubiSlider || !canvas) return;

    const gdp = 330;

    function update() {
      const ubi = parseInt(ubiSlider.value);
      const tax = parseInt(taxSlider.value);
      const sub = parseInt(subSlider.value);

      document.getElementById('sim-bud-ubi-val').textContent = `₹${ubi}`;
      document.getElementById('sim-bud-tax-val').textContent = `${tax}%`;
      document.getElementById('sim-bud-sub-val').textContent = sub === 0 ? 'None' : (sub === 1 ? 'Partial' : 'Complete');

      const ubiCost = (ubi * 960 * 12) / 1e5;
      const taxRevenue = (tax / 100) * gdp * 0.1;
      const subSavings = sub === 0 ? 0 : (sub === 1 ? 2.5 : 5.0);
      const currentDeficit = 15;
      const newDeficit = currentDeficit + ubiCost - taxRevenue - subSavings;
      const deficitPercent = (newDeficit / gdp) * 100;

      document.getElementById('val-bud-cost').textContent = ubiCost.toFixed(2);
      document.getElementById('val-bud-rev').textContent = (taxRevenue + subSavings).toFixed(2);
      document.getElementById('val-bud-def').textContent = deficitPercent.toFixed(2) + '%';

      const desc = document.getElementById('sim-desc-bud');
      if (deficitPercent > 7) { desc.textContent = `Critical fiscal imbalance detected. A deficit exceeding 7% of GDP risks severe inflationary pressure and currency devaluation.`; document.getElementById('val-bud-def').style.color = C().red; }
      else if (deficitPercent < 4) { desc.textContent = `Fiscal surplus model achieved. The macroeconomic environment remains highly stable with robust sovereign liquidity.`; document.getElementById('val-bud-def').style.color = C().green; }
      else { desc.textContent = `Budget remains within acceptable macroeconomic thresholds. Inflationary risk is contained.`; document.getElementById('val-bud-def').style.color = C().text; }

      const colors = C();
      if (_simBudgetChart) {
        _simBudgetChart.data.datasets[0].data = [ubiCost, 0];
        _simBudgetChart.data.datasets[1].data = [currentDeficit, 0];
        _simBudgetChart.data.datasets[2].data = [0, taxRevenue + subSavings];
        _simBudgetChart.data.datasets[3].data = [0, newDeficit];
        _simBudgetChart.update();
      } else {
        _simBudgetChart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Total Expenditures', 'Revenue & Deficit'],
            datasets: [
              { label: 'UBI Outlay', data: [ubiCost, 0], backgroundColor: colors.blue },
              { label: 'Base Sovereign Spending', data: [currentDeficit, 0], backgroundColor: 'rgba(156, 163, 175, 0.4)' },
              { label: 'Total Revenue (Taxes + Savings)', data: [0, taxRevenue + subSavings], backgroundColor: colors.green },
              { label: 'Sovereign Deficit', data: [0, newDeficit], backgroundColor: colors.red }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, max: 40, grid: { color: colors.grid, drawBorder: false }, ticks: { color: colors.text } } },
            plugins: { legend: { position: 'top', labels: { color: colors.text, usePointStyle: true, boxWidth: 6 } }, tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)' } }
          }
        });
      }
    }
    if (!ubiSlider._simListenerAttached) {
      ubiSlider.addEventListener('input', update); taxSlider.addEventListener('input', update); subSlider.addEventListener('input', update);
      ubiSlider._simListenerAttached = true;
    }
    if (_simBudgetChart && canvas.clientWidth === 0) { _simBudgetChart.destroy(); _simBudgetChart = null; }
    update();
  }

  // ======================================================================
  // 4. REGIONAL READINESS HEATMAP
  // ======================================================================
  function initStateSimulator() {
    const select = document.getElementById('sim-state-select');
    const cAi = document.getElementById('c-sim-state-ai');
    const cUbi = document.getElementById('c-sim-state-ubi');
    if (!select || !cAi) return;

    if (select.options.length <= 1) {
      select.innerHTML = '';
      D.stateData.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.code; opt.textContent = s.name;
        select.appendChild(opt);
      });
    }

    function update() {
      const code = select.value;
      const iaavi = D.iaaviRankings.find(r => r.code === code)?.score || 50;
      const ubiri = D.ubiriRankings.find(r => r.code === code)?.score || 50;
      
      document.getElementById('val-state-ai').textContent = iaavi.toFixed(1);
      document.getElementById('val-state-ubi').textContent = ubiri.toFixed(1);
      
      const desc = document.getElementById('sim-desc-state');
      if (iaavi > 60 && ubiri < 40) desc.textContent = `Critical structural mismatch. High susceptibility to automation paired with severe deficits in digital and financial distribution infrastructure.`;
      else if (iaavi < 50 && ubiri > 60) desc.textContent = `High resilience detected. The state exhibits robust institutional capacity to execute direct benefit transfers while maintaining low automation risk.`;
      else desc.textContent = `Moderate readiness profile. Institutional capacity aligns adequately with projected automation penetration.`;

      const colors = C();
      if (_simStateAiChart) { _simStateAiChart.data.datasets[0].data = [iaavi, 100-iaavi]; _simStateAiChart.update(); }
      else {
        _simStateAiChart = new Chart(cAi, {
          type: 'doughnut',
          data: { labels: ['AI Risk Index', 'Baseline'], datasets: [{ data: [iaavi, 100-iaavi], backgroundColor: [colors.gold, 'rgba(156, 163, 175, 0.2)'], borderWidth:0 }] },
          options: { responsive:true, maintainAspectRatio:false, cutout: '70%', plugins: { legend: {display:false}, title: {display:true, text:'IAAVI Sub-Index', color:colors.text, font:{size:14, family:"'Outfit', sans-serif"}} } }
        });
      }
      if (_simStateUbiChart) { _simStateUbiChart.data.datasets[0].data = [ubiri, 100-ubiri]; _simStateUbiChart.update(); }
      else if (cUbi) {
        _simStateUbiChart = new Chart(cUbi, {
          type: 'doughnut',
          data: { labels: ['UBIRI Index', 'Gap'], datasets: [{ data: [ubiri, 100-ubiri], backgroundColor: [colors.blue, 'rgba(156, 163, 175, 0.2)'], borderWidth:0 }] },
          options: { responsive:true, maintainAspectRatio:false, cutout: '70%', plugins: { legend: {display:false}, title: {display:true, text:'UBIRI Sub-Index', color:colors.text, font:{size:14, family:"'Outfit', sans-serif"}} } }
        });
      }
    }
    if (!select._simListenerAttached) { select.addEventListener('change', update); select._simListenerAttached = true; }
    if (_simStateAiChart && cAi.clientWidth === 0) { _simStateAiChart.destroy(); _simStateAiChart = null; }
    if (_simStateUbiChart && cUbi && cUbi.clientWidth === 0) { _simStateUbiChart.destroy(); _simStateUbiChart = null; }
    update();
  }

  // ======================================================================
  // 5. GINI & WEALTH DISTRIBUTION MODELER
  // ======================================================================
  function initEqualitySimulator() {
    const slider = document.getElementById('sim-eq-slider');
    const badge = document.getElementById('sim-eq-val');
    const canvas = document.getElementById('c-sim-equality');
    if (!slider || !canvas) return;

    function update() {
      const val = parseInt(slider.value);
      badge.textContent = val === 0 ? 'Baseline' : `₹${val * 50}/mo`;

      const top1 = 40 - (val * 0.15);
      const middle40 = 40 + (val * 0.05);
      const bottom50 = 20 + (val * 0.10);
      const newGini = 0.45 - (val * 0.001);

      document.getElementById('val-eq-top').textContent = top1.toFixed(1) + '%';
      document.getElementById('val-eq-bot').textContent = bottom50.toFixed(1) + '%';
      document.getElementById('val-eq-gini').textContent = newGini.toFixed(3);

      const colors = C();
      if (_simEqualityChart) {
        _simEqualityChart.data.datasets[0].data = [top1, middle40, bottom50];
        _simEqualityChart.update();
      } else {
        _simEqualityChart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Top 1% Decile', 'Middle 40% Stratum', 'Bottom 50% Stratum'],
            datasets: [{ label: 'Wealth Concentration (%)', data: [top1, middle40, bottom50], backgroundColor: [colors.red, 'rgba(156, 163, 175, 0.4)', colors.green], borderRadius: 4 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { min: 0, max: 60, grid: { color: colors.grid, drawBorder: false }, ticks: { color: colors.text } }, x: { grid: { display: false }, ticks: { color: colors.text } } },
            plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)' } }
          }
        });
      }
    }
    if (!slider._simListenerAttached) { slider.addEventListener('input', update); slider._simListenerAttached = true; }
    if (_simEqualityChart && canvas.clientWidth === 0) { _simEqualityChart.destroy(); _simEqualityChart = null; }
    update();
  }

  // ======================================================================
  // 6. LABOR TRANSITION TRAJECTORY
  // ======================================================================
  function initReskillSimulator() {
    const slider = document.getElementById('sim-reskill-slider');
    const badge = document.getElementById('sim-reskill-val');
    const canvas = document.getElementById('c-sim-reskill');
    if (!slider || !canvas) return;

    const yrs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    function update() {
      const effort = parseInt(slider.value);
      badge.textContent = effort === 0 ? 'Zero' : (effort > 7 ? 'High' : 'Moderate');

      const ubiOnly = yrs.map(y => 1000 + (y * 20));
      const reskilled = yrs.map(y => 1000 + (y * 20) + (y * effort * 500));
      const finalBase = ubiOnly[10], finalSkill = reskilled[10], delta = finalSkill - finalBase;

      document.getElementById('val-reskill-base').textContent = `₹${finalBase.toLocaleString()}`;
      document.getElementById('val-reskill-skill').textContent = `₹${finalSkill.toLocaleString()}`;
      document.getElementById('val-reskill-delta').textContent = `+₹${delta.toLocaleString()}`;

      const desc = document.getElementById('sim-desc-reskill');
      if (effort === 0) { desc.textContent = 'Zero reskilling utilization results in wage stagnation, heavily relying on the UBI floor as the primary income source.'; document.getElementById('val-reskill-delta').style.color = C().text; }
      else { desc.textContent = `High upskilling utilization leverages UBI as a risk-buffer, allowing transition into high-value cognitive roles, generating a significant wage delta.`; document.getElementById('val-reskill-delta').style.color = C().green; }

      const colors = C();
      if (_simReskillChart) {
        _simReskillChart.data.datasets[0].data = ubiOnly;
        _simReskillChart.data.datasets[1].data = reskilled;
        _simReskillChart.update();
      } else {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, `${colors.blue}33`); gradient.addColorStop(1, `${colors.blue}00`);
        _simReskillChart = new Chart(canvas, {
          type: 'line',
          data: {
            labels: yrs.map(y => `Yr ${y}`),
            datasets: [
              { label: 'Baseline Trajectory', data: ubiOnly, borderColor: 'rgba(156, 163, 175, 0.5)', borderDash: [5, 5], backgroundColor: 'transparent', borderWidth: 2, pointRadius: 0, pointHitRadius: 10 },
              { label: 'Upskilled Trajectory', data: reskilled, borderColor: colors.blue, backgroundColor: gradient, fill: true, borderWidth: 3, pointRadius: 0, pointHitRadius: 10 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: { y: { min: 0, grid: { color: colors.grid, drawBorder: false }, ticks: { color: colors.text } }, x: { grid: { display: false }, ticks: { color: colors.text } } },
            plugins: { legend: { position: 'top', labels: { color: colors.text, usePointStyle: true, boxWidth: 6 } }, tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)' } }
          }
        });
      }
    }
    if (!slider._simListenerAttached) { slider.addEventListener('input', update); slider._simListenerAttached = true; }
    if (_simReskillChart && canvas.clientWidth === 0) { _simReskillChart.destroy(); _simReskillChart = null; }
    update();
  }

});
