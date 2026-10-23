import { buildSearchIndex, colorScale, escapeHtml as esc, initializeShell, loadStatistics,
    normalize, number as n, searchEntries, searchHref, tierBadge, tierFor, tr, setLanguage, translatePage } from "./players_statistics_core.js?v=20261023-1";
import { updateReference } from "./players_statistics_reference.js?v=20261023-1";

const input = document.getElementById("player-search");
const suggestions = document.getElementById("search-suggestions");
const result = document.getElementById("search-result");
const status = document.getElementById("data-status");
let data, entries = [], matches = [], active = -1, currentGroup = null, selection = null;
let sortKey = "xRating", sortDirection = -1;
const typeLabels = { account: "Account", fleet: "Fleet", squadron: "Squadron" };

translatePage();
initializeShell();

function closeSuggestions() {
    suggestions.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
}

function showSuggestions() {
    matches = searchEntries(entries, input.value);
    active = -1;
    if (!input.value.trim()) return closeSuggestions();
    suggestions.innerHTML = matches.length ? matches.map((entry, i) => `<li role="option" id="suggestion-${i}" aria-selected="false" data-index="${i}">
        <span class="ps-kind">${typeLabels[entry.type]}</span><span class="ps-suggest-name">${esc(entry.name)}
        <span class="ps-suggest-meta">${entry.type === 'squadron' ? `${esc(entry.fleet || tr('함대 없음', 'No fleet'))} · ` : ''}${entry.type === 'account' ? esc(entry.members[0].fleet || tr('함대 없음', 'No fleet')) : `${n(entry.members.length)}${tr('개 계정', ' accounts')}`}</span></span></li>`).join("")
        : `<li role="option" aria-disabled="true">${tr('일치하는 계정·함대·전대가 없습니다.', 'No matching accounts, fleets or squadrons.')}</li>`;
    suggestions.hidden = false;
    input.setAttribute("aria-expanded", "true");
}

function setActive(index) {
    active = index;
    [...suggestions.querySelectorAll("[data-index]")].forEach((element, i) => element.setAttribute("aria-selected", String(i === index)));
    const element = document.getElementById(`suggestion-${index}`);
    if (element) { input.setAttribute("aria-activedescendant", element.id); element.scrollIntoView({ block: "nearest" }); }
}

function navigate(entry) {
    const href = searchHref(entry.type, entry.name, entry.fleet);
    history.pushState(null, "", href);
    input.value = entry.name;
    closeSuggestions();
    renderSelection(entry);
}

function renderFromUrl() {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "account";
    const query = params.get("q") || "";
    const hasFleet = params.has("fleet");
    const candidates = entries.filter(entry => entry.type === type && entry.key === normalize(query)
        && (type !== "squadron" || !hasFleet || normalize(entry.fleet) === normalize(params.get("fleet"))));
    input.value = query;
    if (candidates.length === 1) return renderSelection(candidates[0]);
    currentGroup = null;
    selection = null;
    updateReference(data);
    if (query) {
        result.innerHTML = `<section class="card sailor-card ps-panel"><div class="card-body ps-empty"><h3>${candidates.length > 1 ? tr('같은 이름의 전대가 여러 함대에 있습니다.', 'Several fleets have a squadron with this name.') : tr('검색 결과가 없습니다.', 'No results found.')}</h3><p class="ps-muted">${tr('자동완성에서 원하는 계정·함대·전대를 선택하세요.', 'Choose an account, fleet or squadron from the suggestions.')}</p></div></section>`;
        showSuggestions();
    } else {
        result.innerHTML = `<section class="card sailor-card ps-panel"><div class="card-body ps-empty"><h3>${tr('이름으로 전적을 찾아보세요.', 'Find an account, fleet or squadron.')}</h3><p class="ps-muted">${tr(`${n(data.accountCount)}개 계정의 공식 전적 · ${n(data.ratedAccountCount)}개 계정의 레이팅`, `${n(data.accountCount)} official account records · ${n(data.ratedAccountCount)} rated accounts`)}</p><div class="ps-quick-links">${[["account", "fv304"], ["account", "la2gajaltmot"], ["fleet", "TEAM PRO BOTS"]].map(([type, name]) => `<a class="btn btn-outline-secondary btn-sm ps-button" href="${searchHref(type, name)}">${esc(name)}</a>`).join("")}</div></div></section>`;
    }
    document.title = tr('전적 검색 · NF Player Statistics', 'Player Statistics · Navyfield');
}

function entityLink(type, name, fleet) {
    return name ? `<a href="${esc(searchHref(type, name, fleet))}">${esc(name)}</a>` : tr('없음', 'None');
}

function scoreCard(label, value, percentile, description, primary = false) {
    const tier = tierFor(percentile, data.tiers);
    return `<div class="ps-score-card${primary ? ' ps-primary-score' : ''}" style="--tier:${tier?.color || '#b9c5d0'}"><div class="ps-score-label">${label}</div>
        <div class="ps-score-value">${value == null ? '—' : n(value, 2)}</div>${tierBadge(percentile, data.tiers)}
        ${percentile == null ? '' : colorScale(data.tiers, percentile, label === 'Rating' ? 'xRating' : label)}<small>${description}</small></div>`;
}

function renderPlayer(player) {
    currentGroup = null;
    const rating = player.rating;
    const officialUrl = player.officialId ? `https://www.navyfield.com/Community/Ranking/View.aspx?category=1&server=1&num=${player.officialId}` : data.sources.official;
    result.innerHTML = `<section class="card sailor-card ps-panel"><div class="card-header">${tr('계정 전적 / Account Statistics', 'Account Statistics')}</div><div class="card-body">
        <div class="ps-identity"><div><p class="ps-eyebrow">${tr('공식 순위', 'Official rank')} #${n(player.rank)}</p><h2>${esc(player.account)}</h2><p class="ps-muted">Fleet ${entityLink('fleet', player.fleet)} &nbsp;·&nbsp; Squadron ${entityLink('squadron', player.squadron, player.fleet)}</p></div><a class="btn btn-outline-secondary btn-sm ps-button" href="#rating-reference">${tr('그래프에서 내 위치 보기 ↓', 'View position in charts ↓')}</a></div>
        <div class="ps-score-grid">${scoreCard('xRating', rating?.xRating, rating?.xRating, rating ? tr(`상위 약 ${n(100 - rating.xRating, 2)}% · 종합 백분위`, `Top ~${n(100 - rating.xRating, 2)}% · overall percentile`) : tr(`${data.minBattles}전 이상부터 산정`, `Requires ${data.minBattles}+ battles`), true)}
            ${scoreCard('xWin', rating?.xWin, rating?.xWin, tr('승률의 백분위', 'Win rate percentile'))}
            ${scoreCard('xSunk', rating?.xSunk, rating?.xSunk, tr('평균 CV+BB+SS 격침의 백분위', 'Average CV+BB+SS sunk percentile'))}</div>
        ${rating ? '' : `<p class="ps-muted mt-3">${tr(`현재 ${n(player.battles)}전으로 레이팅 산정 대상이 아닙니다. 공식 전적은 아래에서 확인할 수 있습니다.`, `Unrated: ${n(player.battles)} battles. Official statistics are available below.`)}</p>`}
        <dl class="ps-major-grid"><div><dt>${tr('승률 · WinRate', 'Win rate')}</dt><dd>${n(player.winRate, 2)}${player.winRate == null ? '' : '%'}</dd><small>${n(player.win)}${tr('승', ' wins')}</small></div>
            <div><dt>${tr('전투 수 · Battles', 'Battles')}</dt><dd>${n(player.battles)}</dd><small>${tr('누적 전투', 'Lifetime battles')}</small></div>
            <div><dt>${tr('평균 주요함급 격침 · AvgSunk', 'Average major ships sunk')}</dt><dd>${n(player.avgSunk, 3)}</dd><small>CV+BB+SS · ${tr('격침수/판', 'sunk/battle')}</small></div>
            <div><dt>${tr('누적 주요함급 격침', 'Total major ships sunk')}</dt><dd>${n(player.majorSunk)}</dd><small>CV+BB+SS · ${tr('격침수', 'sunk')}</small></div></dl>
        <p class="ps-muted mb-0">${tr('공식 갱신일', 'Issue date')} ${esc(data.issueDate)} &nbsp;·&nbsp; ${tr('마지막 접속', 'Last connected')} ${esc(player.lastConnected || tr('기록 없음', 'Unknown'))} &nbsp;·&nbsp; ${esc(data.server)}</p>
        </div></section><section class="card sailor-card ps-panel"><details class="ps-detail" open><summary class="card-header">${tr('공식 전적 상세 정보', 'Detailed official statistics')}</summary><div class="card-body"><div class="ps-detail-grid">
            <div><span>${tr('공식 순위', 'Official rank')}</span><strong>${n(player.rank)}</strong></div><div><span>${tr('Overall Rankings 점수', 'Overall score')}</span><strong>${n(player.overallScore)}</strong></div><div><span>Tonnage Sunken</span><strong>${n(player.tonnageSunken)}</strong></div></div>
            <h3 class="h6 mb-3">${tr('함종별 격침 수', 'Ships sunk by class')}</h3><div class="ps-sunk-grid">${['ff','dd','cl','ca','cv','bb','ss'].map(kind => `<div><span>${kind.toUpperCase()} Sunk</span><strong>${n(player[`${kind}Sunk`])}</strong></div>`).join('')}</div>
            ${player.tonnageSunken < 0 ? `<p class="ps-muted mt-3">${tr('Tonnage Sunken의 음수는 공식 표시값을 보존한 것이며 레이팅에 사용하지 않습니다.', 'Negative tonnage is preserved from the official source and is not used in ratings.')}</p>` : ''}
            <p class="mt-3 mb-0"><a href="${esc(officialUrl)}" target="_blank" rel="noopener">${tr('공식 홈페이지 전적 보기 ↗', 'View official statistics ↗')}</a></p></div></details></section>`;
    document.title = `${player.account} · ${tr('NF 전적 검색', 'NF Player Statistics')}`;
}

const columns = [
    ['account', 'Account'], ['fleet', 'Fleet'], ['squadron', 'Squadron'], ['battles', 'Battles'], ['winRate', 'WinRate'],
    ['avgSunk', 'AvgSunk'], ['xRating', 'xRating'], ['xWin', 'xWin'], ['xSunk', 'xSunk'], ['lastConnected', 'Last connected']
];
function sortValue(player, key) {
    return ['xWin','xSunk','Rating','xRating'].includes(key) ? player.rating?.[key] ?? null : player[key];
}

function renderGroup(entry) {
    currentGroup = entry;
    const members = [...entry.members].sort((a, b) => {
        const av = sortValue(a, sortKey), bv = sortValue(b, sortKey);
        if (av == null && bv != null) return 1;
        if (bv == null && av != null) return -1;
        const order = typeof av === 'string' ? av.localeCompare(bv ?? '') : (av ?? 0) - (bv ?? 0);
        return order * sortDirection || a.account.localeCompare(b.account);
    });
    const rated = members.filter(player => player.rating).length;
    result.innerHTML = `<section class="card sailor-card ps-panel"><div class="card-header">${typeLabels[entry.type]} · ${tr('소속 계정 전적', 'Member statistics')}</div><div class="card-body"><div class="ps-identity"><div><p class="ps-eyebrow">${typeLabels[entry.type].toUpperCase()}</p><h2>${esc(entry.name)}</h2><p class="ps-muted">${entry.type === 'squadron' ? `Fleet ${entityLink('fleet', entry.fleet)} · ` : ''}${tr(`소속 ${n(members.length)}개 Account · 레이팅 산정 ${n(rated)}개`, `${n(members.length)} accounts · ${n(rated)} rated`)}</p></div></div>
        <div class="ps-table-toolbar"><p class="ps-muted mb-0">${tr('소속 계정을 모두 표시합니다. 표 제목으로 정렬하고 계정명을 선택해 상세 전적을 확인하세요.', 'All members are shown. Select a column to sort or an account to view details.')}</p></div>
        <div class="ps-table-wrap"><table class="table table-bordered table-sm ps-table"><caption>${esc(entry.name)} · ${tr('소속 계정 주요 전적 · 평균 주요함급 격침은 CV+BB+SS 격침수/판', 'Member statistics · AvgSunk = CV+BB+SS sunk/battle')}</caption><thead><tr>${columns.map(([key,label]) => `<th scope="col" aria-sort="${sortKey === key ? (sortDirection === 1 ? 'ascending' : 'descending') : 'none'}"><button type="button" data-sort="${key}">${key === 'battles' ? tr('전투 수', label) : key === 'winRate' ? tr('승률', label) : key === 'avgSunk' ? tr('평균 주요함급 격침', label) : key === 'lastConnected' ? tr('마지막 접속', label) : label}${sortKey === key ? sortDirection === 1 ? ' ↑' : ' ↓' : ''}</button></th>`).join('')}</tr></thead><tbody>${members.map(player => `<tr>
            <td><a href="${searchHref('account', player.account)}">${esc(player.account)}</a></td><td>${entityLink('fleet', player.fleet)}</td><td>${entityLink('squadron', player.squadron, player.fleet)}</td><td>${n(player.battles)}</td><td>${n(player.winRate, 2)}${player.winRate == null ? '' : '%'}</td><td>${n(player.avgSunk, 3)}</td>
            ${['xRating','xWin','xSunk'].map(key => `<td class="ps-rating-cell">${n(player.rating?.[key], 2)}${key === 'xRating' ? `<br>${tierBadge(player.rating?.xRating, data.tiers)}` : ''}</td>`).join('')}
            <td>${esc(player.lastConnected || '—')}</td></tr>`).join('')}</tbody></table></div>
        <p class="ps-muted mb-0">${tr('공식 갱신일', 'Issue date')} ${esc(data.issueDate)} · ${tr(`${data.minBattles}전 미만은 레이팅 미산정입니다. 티어는 xRating 기준입니다.`, `Accounts below ${data.minBattles} battles are unrated. Tiers use xRating.`)}</p></div></section>`;
    document.title = `${entry.name} · NF ${typeLabels[entry.type]}`;
}

function renderSelection(entry) {
    selection = entry;
    if (entry.type === 'account') renderPlayer(entry.members[0]); else renderGroup(entry);
    updateReference(data, entry.type === 'account' ? entry.members[0] : null, entry.type === 'account' ? null : entry);
}

input.addEventListener('input', showSuggestions);
input.addEventListener('focus', () => { if (input.value.trim()) showSuggestions(); });
input.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Escape') { closeSuggestions(); return; }
    if (['ArrowDown','ArrowUp'].includes(event.key)) {
        event.preventDefault();
        if (suggestions.hidden) showSuggestions();
        if (matches.length) setActive((active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length);
    }
});
suggestions.addEventListener('mousedown', event => event.preventDefault());
suggestions.addEventListener('click', event => {
    const option = event.target.closest('[data-index]');
    if (option) navigate(matches[Number(option.dataset.index)]);
});
document.addEventListener('click', event => { if (!event.target.closest('#search-form')) closeSuggestions(); });
input.addEventListener('blur', closeSuggestions);
document.getElementById('search-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!data) return;
    if (active >= 0 && matches[active]) return navigate(matches[active]);
    const found = searchEntries(entries, input.value);
    const exact = found.filter(entry => entry.key === normalize(input.value));
    if (exact.length === 1) navigate(exact[0]);
    else if (found.length === 1) navigate(found[0]);
    else { showSuggestions(); if (matches.length) setActive(0); }
});
result.addEventListener('click', event => {
    const sort = event.target.closest('[data-sort]');
    if (sort && currentGroup) {
        sortDirection = sortKey === sort.dataset.sort ? -sortDirection : sort.dataset.sort === 'account' ? 1 : -1;
        sortKey = sort.dataset.sort; renderGroup(currentGroup);
    }
});
window.addEventListener('popstate', () => { closeSuggestions(); if (data) renderFromUrl(); });

document.addEventListener('click', event => {
    const button = event.target.closest('[data-language]');
    if (button) {
        setLanguage(button.dataset.language); translatePage(); closeSuggestions(); updateStatus();
        if (!data) return;
        if (selection) {
            if (selection.type === 'account') renderPlayer(selection.members[0]); else renderGroup(selection);
            updateReference(data, selection.type === 'account' ? selection.members[0] : null, selection.type === 'account' ? null : selection);
        } else renderFromUrl();
        return;
    }
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.searchParams.has('q')) {
        event.preventDefault(); history.pushState(null, '', url); closeSuggestions(); renderFromUrl();
    }
});
window.addEventListener('nf-select-account', event => {
    const entry = entries.find(e => e.type === 'account' && e.name === event.detail);
    if (entry) navigate(entry);
});

function updateStatus() {
    if (data) status.textContent = tr(
        `${data.server} · 공식 갱신일 ${data.issueDate} · ${n(data.accountCount)}개 Account · ${data.minBattles}전 이상 ${n(data.ratedAccountCount)}개 평가`,
        `${data.server} · Issue date ${data.issueDate} · ${n(data.accountCount)} accounts · ${n(data.ratedAccountCount)} rated (${data.minBattles}+ battles)`);
    else status.textContent = document.getElementById('retry-data').hidden
        ? tr('공식 전적과 레이팅 데이터를 불러오는 중입니다.', 'Loading official statistics and ratings…')
        : tr('전적 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', 'Unable to load statistics. Please try again.');
}

async function start() {
    const retry = document.getElementById('retry-data');
    retry.hidden = true;
    updateStatus();
    status.classList.remove('ps-error');
    try {
        data = await loadStatistics();
        entries = buildSearchIndex(data.players);
        updateStatus();
        input.disabled = false;
        document.getElementById('search-submit').disabled = false;
        renderFromUrl();
    } catch {
        status.classList.add('ps-error');
        retry.hidden = false;
        updateStatus();
    }
}
document.getElementById('retry-data').addEventListener('click', start);
start();
