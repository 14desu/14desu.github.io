(() => {
    "use strict";

    const $ = (selector) => document.querySelector(selector);
    const form = $("#gun-range-form");
    const serverSelect = $("#gun-range-server");
    const countrySelect = $("#gun-range-country");
    const gunSelect = $("#gun-range-gun");
    const projectileSelect = $("#gun-range-projectile");
    const calculateButton = $("#gun-range-calculate");
    const status = $("#gun-range-status");
    const results = $("#gun-range-results");
    const summary = $("#gun-range-selection-summary");
    const chart = $("#gun-range-chart");
    const tableBody = $("#gun-range-table-body");

    const TEXT = {
        ko: {
            subtitle: "서버와 국가를 선택한 뒤 11인치 이상 함포와 대응 포탄을 선택하세요.",
            inputTitle: "함포 및 포탄 선택",
            serverLabel: "서버",
            countryLabel: "국가",
            gunLabel: "11인치 이상 함포",
            projectileLabel: "대응 포탄",
            calculate: "사거리 계산",
            resultTitle: "계산 결과",
            uiLabel: "UI 사거리",
            uiAngleLabel: "UI 사거리의 양각",
            maxAngleRangeLabel: "최대 양각의 사거리",
            maxAngleLabel: "최대 양각",
            chartTitle: "양각별 사거리 그래프",
            tableTitle: "1° 간격 사거리표",
            angleHeading: "양각",
            rangeHeading: "사거리",
            chartAria: "0도부터 최대 양각까지 1도 간격 사거리 그래프",
            countryPlaceholder: "국가를 선택하세요",
            gunPlaceholder: "함포를 선택하세요",
            projectilePlaceholder: "포탄을 선택하세요",
            loading: "함포 목록을 불러오는 중입니다…",
            chooseCountry: "국가를 선택하세요.",
            chooseGun: "함포를 선택하세요.",
            chooseProjectile: "포탄을 선택한 뒤 계산하세요.",
            noGuns: "이 국가에는 조건에 맞는 함포가 없습니다.",
            noProjectiles: "이 함포에 대응하는 포탄이 없습니다.",
            calculating: "사거리를 계산하는 중입니다…",
            complete: "계산이 완료되었습니다.",
            configError: "Cloudflare Worker API 주소를 설정해 주세요.",
            catalogError: "함포 목록을 불러오지 못했습니다.",
            calculationError: "사거리를 계산하지 못했습니다.",
            apiError: "API 오류",
        },
        en: {
            subtitle: "Choose a server and nation, then select a gun of 11 inches or larger and a compatible projectile.",
            inputTitle: "Gun and projectile selection",
            serverLabel: "Server",
            countryLabel: "Nation",
            gunLabel: "Guns 11 inches and above",
            projectileLabel: "Compatible projectile",
            calculate: "Calculate range",
            resultTitle: "Results",
            uiLabel: "UI range",
            uiAngleLabel: "Elevation for UI range",
            maxAngleRangeLabel: "Range at maximum elevation",
            maxAngleLabel: "Maximum elevation",
            chartTitle: "Range by elevation",
            tableTitle: "1° range table",
            angleHeading: "Elevation",
            rangeHeading: "Range",
            chartAria: "Range graph in one-degree steps from zero to maximum elevation",
            countryPlaceholder: "Select a nation",
            gunPlaceholder: "Select a gun",
            projectilePlaceholder: "Select a projectile",
            loading: "Loading the gun catalog…",
            chooseCountry: "Select a nation.",
            chooseGun: "Select a gun.",
            chooseProjectile: "Select a projectile, then calculate.",
            noGuns: "No matching guns are available for this nation.",
            noProjectiles: "No compatible projectiles are available.",
            calculating: "Calculating range…",
            complete: "Calculation complete.",
            configError: "Configure the Cloudflare Worker API URL.",
            catalogError: "Could not load the gun catalog.",
            calculationError: "Could not calculate the range.",
            apiError: "API error",
        },
    };

    const TEXT_ELEMENTS = {
        subtitle: "#gun-range-subtitle",
        inputTitle: "#gun-range-input-title",
        serverLabel: "#gun-range-server-label",
        countryLabel: "#gun-range-country-label",
        gunLabel: "#gun-range-gun-label",
        projectileLabel: "#gun-range-projectile-label",
        calculate: "#gun-range-calculate",
        resultTitle: "#gun-range-result-title",
        uiLabel: "#gun-range-ui-label",
        uiAngleLabel: "#gun-range-ui-angle-label",
        maxAngleRangeLabel: "#gun-range-max-angle-range-label",
        maxAngleLabel: "#gun-range-max-angle-label",
        chartTitle: "#gun-range-chart-title",
        tableTitle: "#gun-range-table-title",
        angleHeading: "#gun-range-angle-heading",
        rangeHeading: "#gun-range-range-heading",
    };

    const metaApiBase = document.querySelector('meta[name="gun-range-api-base"]')?.content ?? "";
    const queryApiBase = new URLSearchParams(location.search).get("api") ?? "";
    const apiBase = (queryApiBase || metaApiBase).replace(/\/$/, "");

    let catalog = null;
    let locale = "ko";
    let activeRequest = null;
    let requestSerial = 0;
    let degreeTable = [];

    function text(key) {
        return TEXT[locale][key];
    }

    function number(value) {
        return Number(value).toLocaleString(locale === "ko" ? "ko-KR" : "en-US");
    }

    function currentServer() {
        return catalog?.servers?.[serverSelect.value];
    }

    function selectedGun() {
        const meta = Number(gunSelect.value);
        return currentServer()?.guns.find((gun) => gun.meta === meta);
    }

    function selectedProjectile() {
        const meta = Number(projectileSelect.value);
        return currentServer()?.projectiles.find((projectile) => projectile.meta === meta);
    }

    function applyLocale() {
        locale = currentServer()?.language ?? (serverSelect.value === "global" ? "en" : "ko");
        document.documentElement.lang = locale;
        for (const [key, selector] of Object.entries(TEXT_ELEMENTS)) {
            const element = $(selector);
            if (element) element.textContent = text(key);
        }
        chart.setAttribute("aria-label", text("chartAria"));
    }

    function resetSelect(select, placeholder) {
        select.replaceChildren(new Option(placeholder, ""));
        select.value = "";
        select.disabled = true;
    }

    function appendOptions(select, rows, valueOf, labelOf) {
        for (const row of rows) select.add(new Option(labelOf(row), String(valueOf(row))));
        select.disabled = rows.length === 0;
    }

    function gunLabel(gun) {
        return `L${gun.requiredLevel} ${gun.mountCode} ${gun.name} ${gun.maxElevation}°`;
    }

    function projectileLabel(projectile) {
        return `${projectile.name} · HE ${number(projectile.heDamage)} · AP Bonus ${number(projectile.apBonus)}`;
    }

    function cancelRequest() {
        requestSerial += 1;
        activeRequest?.abort();
        activeRequest = null;
    }

    function clearResults(messageKey) {
        cancelRequest();
        degreeTable = [];
        results.hidden = true;
        tableBody.replaceChildren();
        status.className = "alert alert-secondary py-2";
        status.textContent = text(messageKey);
        updateCalculateButton();
    }

    function updateCalculateButton() {
        calculateButton.disabled = !(
            catalog && countrySelect.value && gunSelect.value && projectileSelect.value
        );
    }

    function populateCountries() {
        resetSelect(countrySelect, text("countryPlaceholder"));
        resetSelect(gunSelect, text("gunPlaceholder"));
        resetSelect(projectileSelect, text("projectilePlaceholder"));
        const server = currentServer();
        if (server) appendOptions(countrySelect, server.countries, (row) => row.id, (row) => row.name);
        clearResults("chooseCountry");
    }

    function populateGuns() {
        resetSelect(gunSelect, text("gunPlaceholder"));
        resetSelect(projectileSelect, text("projectilePlaceholder"));
        const nationId = Number(countrySelect.value);
        const guns = countrySelect.value
            ? currentServer().guns.filter((gun) => gun.nationId === nationId)
            : [];
        appendOptions(gunSelect, guns, (gun) => gun.meta, gunLabel);
        clearResults(guns.length ? "chooseGun" : "noGuns");
    }

    function populateProjectiles() {
        resetSelect(projectileSelect, text("projectilePlaceholder"));
        const gun = selectedGun();
        const projectiles = gun
            ? currentServer().projectiles.filter((row) => row.shellGroupId === gun.shellGroupId)
            : [];
        appendOptions(projectileSelect, projectiles, (row) => row.meta, projectileLabel);
        clearResults(projectiles.length ? "chooseProjectile" : "noProjectiles");
    }

    function apiUrl(path, parameters = {}) {
        const url = new URL(`${apiBase}${path}`);
        for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, String(value));
        return url;
    }

    async function fetchJson(url, options) {
        const response = await fetch(url, options);
        const body = await response.json().catch(() => ({}));
        if (!response.ok || body.ok === false) {
            throw new Error(body.error || `${text("apiError")} ${response.status}`);
        }
        return body;
    }

    function renderTable(rows) {
        const fragment = document.createDocumentFragment();
        for (const row of [...rows].sort((a, b) => b.angleDegrees - a.angleDegrees)) {
            const tr = document.createElement("tr");
            const angle = document.createElement("td");
            const range = document.createElement("td");
            angle.textContent = `${row.angleDegrees}°`;
            range.textContent = number(row.range);
            range.className = "text-end";
            tr.append(angle, range);
            fragment.append(tr);
        }
        tableBody.replaceChildren(fragment);
    }

    function renderChart(rows) {
        const context = chart.getContext("2d");
        const ratio = Math.max(1, window.devicePixelRatio || 1);
        const width = Math.max(320, chart.parentElement.clientWidth - 2);
        const height = 320;
        chart.width = Math.round(width * ratio);
        chart.height = Math.round(height * ratio);
        chart.style.width = `${width}px`;
        chart.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);

        if (!rows.length) return;
        const ordered = [...rows].sort((a, b) => a.angleDegrees - b.angleDegrees);
        const pad = { left: 64, right: 18, top: 20, bottom: 43 };
        const plotWidth = width - pad.left - pad.right;
        const plotHeight = height - pad.top - pad.bottom;
        const maxAngle = Math.max(1, ...ordered.map((row) => row.angleDegrees));
        const maxRange = Math.max(1, ...ordered.map((row) => row.range));
        const x = (angle) => pad.left + (angle / maxAngle) * plotWidth;
        const y = (range) => pad.top + plotHeight - (range / maxRange) * plotHeight;

        context.font = "12px sans-serif";
        context.lineWidth = 1;
        context.strokeStyle = "#d7dde3";
        context.fillStyle = "#56616d";
        context.textAlign = "right";
        context.textBaseline = "middle";
        for (let step = 0; step <= 5; step += 1) {
            const value = Math.round((maxRange * step) / 5);
            const py = y(value);
            context.beginPath();
            context.moveTo(pad.left, py);
            context.lineTo(width - pad.right, py);
            context.stroke();
            context.fillText(number(value), pad.left - 8, py);
        }

        context.textAlign = "center";
        context.textBaseline = "top";
        const angleStep = maxAngle <= 20 ? 5 : 10;
        for (let angle = 0; angle <= maxAngle; angle += angleStep) {
            context.fillText(`${angle}°`, x(angle), pad.top + plotHeight + 9);
        }
        if (maxAngle % angleStep !== 0) context.fillText(`${maxAngle}°`, x(maxAngle), pad.top + plotHeight + 9);

        context.beginPath();
        ordered.forEach((row, index) => {
            if (index === 0) context.moveTo(x(row.angleDegrees), y(row.range));
            else context.lineTo(x(row.angleDegrees), y(row.range));
        });
        context.lineWidth = 3;
        context.strokeStyle = "#0d6efd";
        context.lineJoin = "round";
        context.lineCap = "round";
        context.stroke();
    }

    function renderResult(result) {
        const gun = selectedGun();
        const projectile = selectedProjectile();
        summary.textContent = `${gunLabel(gun)} · ${projectileLabel(projectile)}`;
        $("#gun-range-ui").textContent = number(result.uiRange);
        $("#gun-range-ui-angle").textContent = `${result.uiAngleDegrees}°`;
        $("#gun-range-max-angle-range").textContent = number(result.rangeAtMaxElevation);
        $("#gun-range-max-angle").textContent = `${result.maxElevationDegrees}°`;
        degreeTable = Array.isArray(result.degreeTable) ? result.degreeTable : [];
        renderTable(degreeTable);
        results.hidden = false;
        requestAnimationFrame(() => renderChart(degreeTable));
    }

    serverSelect.addEventListener("change", () => {
        applyLocale();
        populateCountries();
    });
    countrySelect.addEventListener("change", populateGuns);
    gunSelect.addEventListener("change", populateProjectiles);
    projectileSelect.addEventListener("change", () => clearResults("chooseProjectile"));
    window.addEventListener("resize", () => {
        if (!results.hidden && degreeTable.length) renderChart(degreeTable);
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (calculateButton.disabled) return;
        cancelRequest();
        const serial = requestSerial;
        const controller = new AbortController();
        activeRequest = controller;
        calculateButton.disabled = true;
        status.className = "alert alert-info py-2";
        status.textContent = text("calculating");
        try {
            const body = await fetchJson(apiUrl("/api/gun-range", {
                server: serverSelect.value,
                gunMeta: gunSelect.value,
                projectileMeta: projectileSelect.value,
            }), { signal: controller.signal });
            if (serial !== requestSerial) return;
            renderResult(body.result);
            status.className = "alert alert-success py-2";
            status.textContent = text("complete");
        } catch (error) {
            if (error.name === "AbortError" || serial !== requestSerial) return;
            results.hidden = true;
            status.className = "alert alert-danger py-2";
            status.textContent = `${text("calculationError")} ${error.message}`;
        } finally {
            if (serial === requestSerial) {
                activeRequest = null;
                updateCalculateButton();
            }
        }
    });

    async function initialize() {
        applyLocale();
        status.textContent = text("loading");
        if (!apiBase || apiBase.includes("REPLACE_WITH_YOUR_SUBDOMAIN")) {
            status.className = "alert alert-warning py-2";
            status.textContent = text("configError");
            return;
        }
        try {
            const body = await fetchJson(apiUrl("/api/catalog"));
            catalog = body.catalog;
            const selectedServer = catalog.servers[serverSelect.value]
                ? serverSelect.value
                : Object.keys(catalog.servers)[0];
            serverSelect.value = selectedServer;
            applyLocale();
            populateCountries();
        } catch (error) {
            status.className = "alert alert-danger py-2";
            status.textContent = `${text("catalogError")} ${error.message}`;
        }
    }

    initialize();
})();
