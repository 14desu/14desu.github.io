export const CATALOG_VERSION = "20260910-1";
export const API_URL = `https://navyfield-simulator-api.14desu.workers.dev/catalog/global_player_statistics.json?v=${CATALOG_VERSION}`;
let pending;
const preferredLanguage = globalThis.navigator?.languages?.[0] || globalThis.navigator?.language || '';
let language = /^ko(?:-|$)/i.test(String(preferredLanguage).trim()) ? 'ko' : 'en';
try {
    const saved = globalThis.localStorage?.getItem('nfPlayersLanguage');
    if (saved === 'ko' || saved === 'en') language = saved;
} catch { /* Use browser language when storage is unavailable. */ }
export const getLanguage = () => language;
export const tr = (ko, en) => language === 'en' ? en : ko;
export function setLanguage(value) {
    language = value === 'en' ? 'en' : 'ko';
    try { globalThis.localStorage?.setItem('nfPlayersLanguage', language); } catch { /* Keep the session preference. */ }
}
export function translatePage() {
    document.documentElement.lang = language;
    for (const element of document.querySelectorAll('[data-ko][data-en]')) element.textContent = element.dataset[language];
    for (const element of document.querySelectorAll('[data-placeholder-ko]')) element.placeholder = element.dataset[language === 'en' ? 'placeholderEn' : 'placeholderKo'];
    for (const element of document.querySelectorAll('[data-aria-ko]')) element.setAttribute('aria-label', element.dataset[language === 'en' ? 'ariaEn' : 'ariaKo']);
    for (const button of document.querySelectorAll('[data-language]')) {
        button.classList.toggle('active', button.dataset.language === language);
        button.setAttribute('aria-pressed', String(button.dataset.language === language));
    }
}

export const normalize = value => String(value ?? "").trim().toLocaleLowerCase("en-US");
export const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const number = (value, digits = 0) => value == null ? "—" : new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ko-KR', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
export const tierFor = (value, tiers) => value == null ? null : [...tiers].reverse().find(t => value >= t.min) || tiers[0];

export function loadStatistics() {
    if (!pending) pending = (async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.schemaVersion !== 1 || data.catalogVersion !== CATALOG_VERSION
            || !Array.isArray(data.players) || data.players.length !== data.accountCount
            || !Array.isArray(data.tiers) || data.tiers.length !== 8) throw new Error("전적 데이터의 버전이 맞지 않습니다.");
        return data;
    })().catch(error => { pending = null; throw error; });
    return pending;
}

export function searchHref(type, value, fleet) {
    const query = new URLSearchParams({ type, q: value });
    if (type === "squadron") query.set("fleet", fleet ?? "");
    return `global_player_statistics.html?${query}`;
}

export function buildSearchIndex(players) {
    const entries = [], fleets = new Map(), squadrons = new Map();
    for (const player of players) {
        entries.push({ type: "account", name: player.account, key: normalize(player.account), members: [player] });
        if (player.fleet) {
            const key = normalize(player.fleet);
            if (!fleets.has(key)) fleets.set(key, { type: "fleet", name: player.fleet, key, members: [] });
            fleets.get(key).members.push(player);
        }
        if (player.squadron) {
            const key = `${normalize(player.fleet)}\0${normalize(player.squadron)}`;
            if (!squadrons.has(key)) squadrons.set(key, { type: "squadron", name: player.squadron,
                key: normalize(player.squadron), fleet: player.fleet, members: [] });
            squadrons.get(key).members.push(player);
        }
    }
    return entries.concat([...fleets.values()], [...squadrons.values()]);
}

export function searchEntries(entries, query, perType = 5) {
    const key = normalize(query);
    if (!key) return [];
    const priority = entry => entry.key === key ? 0 : entry.key.startsWith(key) ? 1 : 2;
    const results = [];
    for (const type of ["account", "fleet", "squadron"]) {
        results.push(...entries.filter(e => e.type === type && e.key.includes(key))
            .sort((a, b) => priority(a) - priority(b) || a.name.localeCompare(b.name)).slice(0, perType));
    }
    return results.sort((a, b) => priority(a) - priority(b));
}

export function tierBadge(value, tiers) {
    const tier = tierFor(value, tiers);
    return tier ? `<span class="ps-tier" style="--tier:${tier.color}">${escapeHtml(tier.name)}</span>` : `<span class="ps-unrated">${tr('미산정', 'Unrated')}</span>`;
}

export function colorScale(tiers, value = null, label = "백분위") {
    return `<div class="ps-scale" role="img" aria-label="${escapeHtml(label)}${value == null ? '' : ` ${number(value, 2)}${tr('점', ' points')}`}">
        ${tiers.map(t => `<span style="width:${t.max - t.min}%;background:${t.color}" title="${escapeHtml(t.name)} ${t.min}–${t.max}"></span>`).join("")}
        ${value == null ? '' : `<i style="left:${Math.max(0, Math.min(100, value))}%"></i>`}
        </div><div class="ps-scale-ticks"><span>0</span><span>50</span><span>100</span></div>`;
}

export function legend(tiers) {
    return `<div class="ps-legend">${[...tiers].reverse().map(t => `<div><span class="ps-swatch" style="background:${t.color}"></span><strong>${escapeHtml(t.name)}</strong><small>${t.min} ≤ x ${t === tiers[tiers.length - 1] ? '≤' : '<'} ${t.max}</small></div>`).join("")}</div>`;
}

export async function initializeShell() {
    const stylesheetUrl = new URL('./players_statistics.css?v=20261021-12', import.meta.url);
    let stylesheet = [...document.querySelectorAll('link[rel="stylesheet"]')]
        .find(link => new URL(link.href).pathname === stylesheetUrl.pathname);
    if (!stylesheet) {
        stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        document.head.append(stylesheet);
    }
    if (stylesheet.href !== stylesheetUrl.href) stylesheet.href = stylesheetUrl.href;
    for (const [id, file] of [["navbar", "navbar.html"], ["sidenavAccordion", "sidebar.html"]]) {
        try {
            const response = await fetch(`../common/${file}?v=20261021-12`, { cache: 'no-cache' });
            if (response.ok) document.getElementById(id).innerHTML = await response.text();
        } catch { /* The record page remains usable if shared navigation is unavailable. */ }
    }
}
