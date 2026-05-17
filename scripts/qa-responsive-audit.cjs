const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const outDir = path.resolve(process.cwd(), 'qa-output');
fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });

const routes = [
  '/', '/products/', '/products/aetheris-flow/', '/products/aetheris-scale/', '/products/aetheris-build/',
  '/online-presence.html', '/lead-leak-audit.html', '/virtual-company-audit.html', '/ai-search-optimization.html',
  '/home-services-ai-scheduling/', '/blog/', '/blog/best-ai-chatbot-for-small-business.html',
  '/solutions/ai-automation-for-hvac-contractors/', '/solutions/ai-automation-for-roofing-companies/',
  '/privacy.html', '/terms.html', '/404.html'
];
const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 }
];
function slug(s) { return s.replace(/^\//,'root-').replace(/[^a-z0-9]+/gi,'-').replace(/-$/,'') || 'root'; }

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const route of routes) {
    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
      const consoleErrors = [];
      page.on('console', msg => { if (['error','warning'].includes(msg.type())) consoleErrors.push(`${msg.type()}: ${msg.text()}`); });
      page.on('pageerror', err => consoleErrors.push(`pageerror: ${err.message}`));
      let status = null, navError = null;
      try { const resp = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 20000 }); status = resp && resp.status(); }
      catch (e) { navError = e.message; }
      await page.waitForTimeout(500);
      const metrics = await page.evaluate(() => {
        const issues = [];
        const vw = window.innerWidth, vh = window.innerHeight, doc = document.documentElement, body = document.body;
        const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
        const overflowNodes = [...document.querySelectorAll('*')].map(el => {
          if (el.closest('.marquee-container,[aria-hidden="true"],#cursor-glow')) return null;
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed' && cs.pointerEvents === 'none') return null;
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && (r.width > vw + 8 || r.left < -8 || r.right > vw + 8)) {
            return { tag: el.tagName, id: el.id, cls: String(el.className).slice(0,60), x: Math.round(r.x), w: Math.round(r.width) };
          }
        }).filter(Boolean).slice(0,5);
        if (overflowNodes.length) issues.push(`horizontal overflow elements: ${JSON.stringify(overflowNodes)}`);
        const h1 = document.querySelector('h1');
        if (!h1) issues.push('missing h1');
        if (h1) {
          const r = h1.getBoundingClientRect();
          const centerX = Math.min(Math.max(r.left + r.width/2, 1), vw-1);
          const centerY = Math.min(Math.max(r.top + Math.min(r.height/2, 32), 1), vh-1);
          const el = document.elementFromPoint(centerX, centerY);
          if (el && !h1.contains(el) && !el.contains(h1)) issues.push(`h1 may be overlapped by ${el.tagName}.${el.className || ''}#${el.id || ''}`);
          if (r.top < -2) issues.push(`h1 starts above viewport: ${Math.round(r.top)}px`);
        }
        const criticalTargets = [...document.querySelectorAll('button,input,select,textarea,[role="button"],.btn,.btn-primary,.btn-secondary,.nav-links a,.navlinks a')].filter(el => {
          const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) return false;
          return r.width < 36 || r.height < 36;
        }).slice(0,6).map(el => ({ tag: el.tagName, cls: String(el.className).slice(0,50), text:(el.innerText||el.value||el.getAttribute('aria-label')||'').trim().slice(0,50), w:Math.round(el.getBoundingClientRect().width), h:Math.round(el.getBoundingClientRect().height) }));
        if (criticalTargets.length) issues.push(`critical tap targets <36px: ${JSON.stringify(criticalTargets)}`);
        const visibleTiny = [...document.querySelectorAll('p,li,label,button,input,select,textarea,.btn,.nav-links a')].filter(el => {
          const s = getComputedStyle(el), r = el.getBoundingClientRect();
          return r.width > 20 && r.height > 0 && parseFloat(s.fontSize) < 12 && r.top < vh * 2;
        }).slice(0,5).map(el => ({ tag: el.tagName, cls:String(el.className).slice(0,40), font:getComputedStyle(el).fontSize, text:(el.innerText||el.value||'').trim().slice(0,40)}));
        if (visibleTiny.length) issues.push(`visible tiny text <12px: ${JSON.stringify(visibleTiny)}`);
        return { title: document.title, vw, vh, scrollW, issues };
      });
      const screenshot = path.join(outDir, 'screenshots', `${slug(route)}__${vp.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: false });
      results.push({ route, viewport: vp.name, status, navError, screenshot, consoleErrors: consoleErrors.filter(e => !e.includes('Failed to load resource: the server responded with a status of 404')).slice(0,8), ...metrics });
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, 'responsive-audit.json'), JSON.stringify(results, null, 2));
  let md = `# Aetheris responsive QA audit\n\nBase: ${base}\n\n`;
  for (const r of results) if ((r.issues && r.issues.length) || (r.consoleErrors && r.consoleErrors.length) || r.navError || r.status >= 400) {
    md += `## ${r.route} — ${r.viewport}\n- Status: ${r.status || 'ERR'} ${r.navError || ''}\n`;
    for (const i of r.issues || []) md += `- Issue: ${i}\n`;
    for (const e of r.consoleErrors || []) md += `- Console: ${e}\n`;
    md += `- Screenshot: ${r.screenshot}\n\n`;
  }
  fs.writeFileSync(path.join(outDir, 'responsive-audit.md'), md);
  console.log(JSON.stringify({ total: results.length, withIssues: results.filter(r => r.issues.length || r.consoleErrors.length || r.navError || r.status >= 400).length, report: path.join(outDir, 'responsive-audit.md') }, null, 2));
})();
