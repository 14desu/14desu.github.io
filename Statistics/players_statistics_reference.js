import { escapeHtml as esc, legend, tr,
    number as n, searchHref, tierBadge, tierFor } from "./players_statistics_core.js?v=20261021-9";
let data, rated = [], selected = null, charts = [];

class ReferenceChart {
    constructor(kind, battleMetric = null) {
        this.kind = kind;
        this.battleMetric = battleMetric;
        this.canvas = document.getElementById(`${kind}-chart`);
        this.context = this.canvas.getContext('2d');
        this.tooltip = document.getElementById(`${kind}-tooltip`);
        this.info = document.getElementById(`${kind}-point`);
        this.slider = document.getElementById(`${kind}-percentile`);
        this.rows = [...rated].sort((a, b) => this.x(a) - this.x(b));
        this.xMaximum = battleMetric ? Math.ceil(Math.max(1, ...this.rows.map(player => player.battles)) / 10000) * 10000 : 100;
        this.slider.max = String(this.xMaximum);
        this.focused = selected?.rating ? selected : this.nearestX(this.xMaximum / 2);
        this.points = [];
        this.onMove = event => this.pointer(event);
        this.onLeave = () => { this.tooltip.hidden = true; };
        this.onClick = event => {
            const point = this.nearestPointer(event);
            if (point) window.dispatchEvent(new CustomEvent('nf-select-account', { detail: point.player.account }));
        };
        this.onSlide = () => { this.focused = this.nearestX(Number(this.slider.value)); this.updateInfo(); this.draw(); };
        this.canvas.addEventListener('pointermove', this.onMove);
        this.canvas.addEventListener('pointerleave', this.onLeave);
        this.canvas.addEventListener('click', this.onClick);
        this.slider.addEventListener('input', this.onSlide);
        this.resizeObserver = new ResizeObserver(() => this.draw());
        this.resizeObserver.observe(this.canvas);
        this.updateInfo();
        this.draw();
    }
    x(player) { return this.battleMetric ? player.battles : player.rating[this.kind === 'win' ? 'xWin' : 'xSunk']; }
    y(player) {
        if (this.battleMetric) return player.rating[this.battleMetric];
        if (this.kind === 'win') return player.winRate;
        return document.getElementById('sunk-mode').value === 'total' ? player.majorSunk : player.avgSunk;
    }
    get log() { return this.kind === 'sunk' && document.getElementById('sunk-log').checked; }
    transform(value) { return this.log ? Math.log1p(value) : value; }
    tierValue(player) { return this.battleMetric ? this.y(player) : this.x(player); }
    get xLabel() { return this.battleMetric ? 'Battles' : this.kind === 'win' ? 'xWin' : 'xSunk'; }
    get yLabel() {
        if (this.battleMetric) return this.battleMetric;
        if (this.kind === 'win') return tr('승률 (%)', 'WinRate (%)');
        return document.getElementById('sunk-mode').value === 'average' ? 'CV+BB+SS / Battles' : 'CV+BB+SS Sunk';
    }
    nearestX(value) {
        if (!this.rows.length) return null;
        let low = 0, high = this.rows.length;
        while (low < high) {
            const middle = (low + high) >> 1;
            if (this.x(this.rows[middle]) < value) low = middle + 1; else high = middle;
        }
        const a = this.rows[Math.min(low, this.rows.length - 1)], b = this.rows[Math.max(0, low - 1)];
        return Math.abs(this.x(a) - value) < Math.abs(this.x(b) - value) ? a : b;
    }
    updateInfo() {
        const player = this.focused;
        if (!player) return;
        if (this.battleMetric) {
            this.info.innerHTML = `<a href="${searchHref('account', player.account)}">${esc(player.account)}</a> · Battles <strong>${n(player.battles)}</strong> · ${this.battleMetric} <strong>${n(this.y(player), 2)}</strong><br>${tierBadge(this.y(player), data.tiers)}`;
            this.slider.value = String(player.battles);
            return;
        }
        const average = this.kind === 'sunk' && document.getElementById('sunk-mode').value === 'average';
        const metric = this.kind === 'win' ? tr('승률', 'WinRate') : average ? tr('평균 CV+BB+SS 격침', 'Average CV+BB+SS Sunk') : 'CV+BB+SS Sunk';
        this.info.innerHTML = `<a href="${searchHref('account', player.account)}">${esc(player.account)}</a> · ${this.kind === 'win' ? 'xWin' : 'xSunk'} <strong>${n(this.x(player), 2)}</strong> · ${metric} <strong>${n(this.y(player), average ? 3 : this.kind === 'win' ? 2 : 0)}${this.kind === 'win' ? '%' : average ? tr(' 격침수/판', ' sunk/battle') : tr(' 격침수', ' sunk')}</strong><br>${tierBadge(this.x(player), data.tiers)} · ${n(player.battles)}${tr('전', ' battles')}`;
        this.slider.value = String(this.x(player));
    }
    draw() {
        const rect = this.canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.round(rect.width * dpr);
        this.canvas.height = Math.round(rect.height * dpr);
        const ctx = this.context;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const w = rect.width, h = rect.height;
        const left = 60, right = 17, top = 22, bottom = 46;
        const pw = w - left - right, ph = h - top - bottom;
        this.geometry = { left, top, pw, ph };
        const rawMax = this.battleMetric || this.kind === 'win' ? 100 : Math.max(...this.rows.map(player => this.y(player))) * 1.04 || 1;
        const maximum = this.transform(rawMax);
        const px = value => left + value / this.xMaximum * pw;
        const py = value => top + ph - this.transform(value) / maximum * ph;
        ctx.clearRect(0, 0, w, h);
        for (const tier of data.tiers) {
            ctx.fillStyle = tier.color;
            ctx.globalAlpha = .09;
            if (this.battleMetric) ctx.fillRect(left, py(tier.max), pw, (tier.max - tier.min) / 100 * ph);
            else ctx.fillRect(px(tier.min), top, (tier.max - tier.min) / 100 * pw, ph);
            ctx.globalAlpha = 1;
        }
        ctx.font = '11px system-ui, sans-serif';
        for (let i = 0; i <= 5; i++) {
            const value = maximum * i / 5;
            const original = this.log ? Math.expm1(value) : value;
            const y = top + ph - ph * i / 5;
            ctx.strokeStyle = '#dce5ec'; ctx.lineWidth = .7;
            ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + pw, y); ctx.stroke();
            ctx.fillStyle = '#5c748a'; ctx.textAlign = 'right';
            const label = original >= 10000 ? `${n(original / 1000, 0)}k` : n(original, this.kind === 'win' || original >= 100 ? 0 : 2);
            ctx.fillText(label, left - 8, y + 4);
            const xValue = this.xMaximum * i / 5;
            const x = px(xValue);
            ctx.textAlign = 'center'; ctx.fillText(xValue >= 10000 ? `${n(xValue / 1000, 0)}k` : n(xValue), x, top + ph + 20);
        }
        for (const tier of data.tiers.slice(1)) {
            ctx.strokeStyle = '#758da450'; ctx.setLineDash([2, 4]);
            ctx.beginPath();
            if (this.battleMetric) { ctx.moveTo(left, py(tier.min)); ctx.lineTo(left + pw, py(tier.min)); }
            else { ctx.moveTo(px(tier.min), top); ctx.lineTo(px(tier.min), top + ph); }
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.strokeStyle = '#91a6b7';
        ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, top + ph); ctx.lineTo(left + pw, top + ph); ctx.stroke();
        ctx.fillStyle = '#48647b'; ctx.textAlign = 'left';
        ctx.fillText(this.yLabel, left, 12);
        ctx.textAlign = 'center'; ctx.fillText(this.xLabel, left + pw / 2, h - 5);
        this.points = this.rows.map(player => ({ player, x: px(this.x(player)), y: py(this.y(player)) }));
        ctx.globalAlpha = .56;
        for (const point of this.points) {
            ctx.fillStyle = tierFor(this.tierValue(point.player), data.tiers).color;
            ctx.beginPath(); ctx.arc(point.x, point.y, 1.65, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        this.canvas.dataset.selectedAccount = selected?.rating ? selected.account : '';
        if (selected?.rating) {
            const x = px(this.x(selected)), y = py(this.y(selected));
            ctx.strokeStyle = '#212529'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
            ctx.beginPath(); ctx.moveTo(x, top + ph); ctx.lineTo(x, y); ctx.lineTo(left, y); ctx.stroke();
            ctx.setLineDash([]); ctx.fillStyle = '#111'; ctx.font = 'bold 11px system-ui, sans-serif';
            ctx.textAlign = this.x(selected) > this.xMaximum / 2 ? 'right' : 'left';
            ctx.fillText(selected.account, x + (this.x(selected) > this.xMaximum / 2 ? -8 : 8), Math.max(top + 12, y - 12));
        }
        const emphasize = (player, radius, color) => {
            if (!player?.rating) return;
            const x = px(this.x(player)), y = py(this.y(player));
            ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
        };
        emphasize(this.focused, 4, '#244c70');
        emphasize(selected, 6, '#102435');
    }
    nearestPointer(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        const g = this.geometry;
        if (!g || x < g.left || x > g.left + g.pw || y < g.top || y > g.top + g.ph) return null;
        let nearest = null, distance = 18 * 18;
        for (const point of this.points) {
            const delta = (point.x - x) ** 2 + (point.y - y) ** 2;
            if (delta < distance) { distance = delta; nearest = point; }
        }
        return nearest;
    }
    pointer(event) {
        const point = this.nearestPointer(event);
        if (!point) { this.tooltip.hidden = true; return; }
        this.focused = point.player;
        this.updateInfo();
        this.tooltip.textContent = this.battleMetric
            ? `${point.player.account} · Battles ${n(point.player.battles)} · ${this.battleMetric} ${n(this.y(point.player), 2)}`
            : `${point.player.account} · ${this.kind === 'win' ? 'xWin' : 'xSunk'} ${n(this.x(point.player), 2)} · ${n(this.y(point.player), this.kind === 'win' ? 2 : document.getElementById('sunk-mode').value === 'average' ? 3 : 0)}${this.kind === 'win' ? '%' : ''}`;
        this.tooltip.hidden = false;
        this.draw();
    }
    destroy() {
        this.tooltip.hidden = true;
        this.resizeObserver.disconnect();
        this.canvas.removeEventListener('pointermove', this.onMove);
        this.canvas.removeEventListener('pointerleave', this.onLeave);
        this.canvas.removeEventListener('click', this.onClick);
        this.slider.removeEventListener('input', this.onSlide);
    }
}

function renderTierTable() {
    const range = (players, getter, digits) => players.length
        ? `${n(Math.min(...players.map(getter)), digits)}–${n(Math.max(...players.map(getter)), digits)}` : '—';
    document.getElementById('tier-reference').innerHTML = [...data.tiers].reverse().map(tier => {
        const inTier = value => tierFor(value, data.tiers) === tier;
        const overall = rated.filter(player => inTier(player.rating.xRating));
        const wins = rated.filter(player => inTier(player.rating.xWin));
        const sunk = rated.filter(player => inTier(player.rating.xSunk));
        return `<tr><td>${tierBadge(tier.min, data.tiers)}</td><td>${tier.min}–${tier.max}</td><td>${n(overall.length)}</td>
            <td>${range(overall, p => p.rating.Rating, 2)}</td><td>${range(wins, p => p.winRate, 2)}%</td><td>${range(sunk, p => p.avgSunk, 3)}</td></tr>`;
    }).join('');
}

export function updateReference(payload, player = null) {
    data = payload;
    rated = data.players.filter(player => player.rating);
    selected = player;
    document.getElementById('reference-status').textContent = tr(
        `${data.server} · 공식 갱신일 ${data.issueDate} · ${data.minBattles}전 이상 ${n(rated.length)}개 계정`,
        `${data.server} · Issue date ${data.issueDate} · ${n(rated.length)} accounts with ${data.minBattles}+ battles`);
    document.getElementById('rating-legend').innerHTML = legend(data.tiers);
    const selectedElement = document.getElementById('selected-player');
    selectedElement.hidden = !selected;
    selectedElement.innerHTML = selected ? `<strong>${tr('선택 계정', 'Selected account')}: ${esc(selected.account)}</strong> · ${selected.rating ? `xRating ${n(selected.rating.xRating, 2)} · ${tierBadge(selected.rating.xRating, data.tiers)}` : tr(`${data.minBattles}전 미만으로 기준 그래프에 포함되지 않습니다.`, `Not plotted: fewer than ${data.minBattles} battles.`)}` : '';
    charts.forEach(chart => chart.destroy());
    charts = [new ReferenceChart('win'), new ReferenceChart('sunk'),
        new ReferenceChart('battles-rating', 'xRating'), new ReferenceChart('battles-win', 'xWin'), new ReferenceChart('battles-sunk', 'xSunk')];
    renderTierTable();
}
for (const id of ['sunk-mode','sunk-log']) document.getElementById(id).addEventListener('change', () => {
    const chart = charts.find(item => item.kind === 'sunk');
    if (chart) { chart.updateInfo(); chart.draw(); }
});
