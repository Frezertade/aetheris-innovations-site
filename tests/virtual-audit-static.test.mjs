import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const pagePath = new URL('../virtual-company-audit.html', import.meta.url);
const apiPath = new URL('../api/virtual-audit.js', import.meta.url);
const vitePath = new URL('../vite.config.js', import.meta.url);

assert.ok(existsSync(pagePath), 'virtual-company-audit.html should exist');
assert.ok(existsSync(apiPath), 'api/virtual-audit.js should exist');

const page = readFileSync(pagePath, 'utf8');
assert.match(page, /Virtual AI Revenue Audit/i, 'page should position the offer');
assert.match(page, /record/i, 'page should disclose recording');
assert.match(page, /consent/i, 'page should include recording/transcript consent');
assert.match(page, /\/api\/virtual-audit/, 'page form should post to virtual audit API');
assert.match(page, /key_people/i, 'page should collect key people to interview');
assert.match(page, /approval/i, 'page should mention Frezer/internal approval workflow');

const api = readFileSync(apiPath, 'utf8');
assert.match(api, /Virtual(%20| )Audits!A:Z:append/, 'API should append to Virtual Audits sheet tab');
assert.match(api, /INTAKE_SHEET_ID/, 'API should use intake sheet id');
assert.match(api, /recording_consent/, 'API should require/store recording consent');
assert.match(api, /sendOwnerEmail/, 'API should notify owner');
assert.match(api, /runAiAudit/, 'API should create AI analysis');

const vite = readFileSync(vitePath, 'utf8');
assert.match(vite, /virtualCompanyAudit/, 'vite config should include virtual audit page input');
