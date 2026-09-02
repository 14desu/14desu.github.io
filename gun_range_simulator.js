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

    const TEXT = {
        ko: {
            subtitle: "서버와 국가를 선택한 뒤 6인치 이상·최대고각 60도 이하 함포와 대응 포탄을 선택하세요.",
            inputTitle: "함포 및 포탄 선택",
            serverLabel: "서버",
            countryLabel: "국가",
            gunLabel: "6인치 이상 함포",
            projectileLabel: "대응 포탄",
            calculate: "쉽야드 사거리 보기",
            resultTitle: "계산 결과",
            uiLabel: "쉽야드 사거리",
            uiAngleLabel: "쉽야드 사거리의 양각",
            maxAngleRangeLabel: "최대 양각의 계산 사거리",
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
            complete: "불러오기 완료되었습니다.",
            configError: "Cloudflare Worker API 주소를 설정해 주세요.",
            catalogError: "함포 목록을 불러오지 못했습니다.",
            calculationError: "사거리를 계산하지 못했습니다.",
            apiError: "API 오류",
        },
        en: {
            subtitle: "Choose a server and nation, then select a gun of 6 inches or larger with a maximum angle of 60 degrees or less.",
            inputTitle: "Gun and projectile selection",
            serverLabel: "Server",
            countryLabel: "Nation",
            gunLabel: "Guns 6 inches and above",
            projectileLabel: "Compatible projectile",
            calculate: "Show Shipyard range",
            resultTitle: "Results",
            uiLabel: "Shipyard range",
            uiAngleLabel: "Elevation for Shipyard range",
            maxAngleRangeLabel: "Calculated range at maximum elevation",
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
            complete: "Loading complete.",
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
    const CATALOG_URL = `${apiBase}/catalog/gun-shipyard-catalog.json`;
    const NATIONS = {
        korea: [[1, "미국"], [2, "영국"], [3, "일본"], [4, "독일"], [5, "프랑스"], [6, "소련"], [7, "이탈리아"]],
        global: [[1, "United States"], [2, "United Kingdom"], [3, "Japan"], [4, "Germany"], [5, "France"], [6, "Soviet Union"], [7, "Italy"], [8, "China"]],
    };

    let catalog = null;
    let locale = "ko";

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
        return currentServer()?.guns.find((gun) => gun.catalogKey === gunSelect.value);
    }

    function selectedProjectile() {
        return selectedGun()?.projectiles.find(
            (projectile) => projectile.catalogKey === projectileSelect.value,
        );
    }

    function applyLocale() {
        locale = currentServer()?.language ?? (serverSelect.value === "global" ? "en" : "ko");
        document.documentElement.lang = locale;
        for (const [key, selector] of Object.entries(TEXT_ELEMENTS)) {
            const element = $(selector);
            if (element) element.textContent = text(key);
        }
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
        const level = Number(gun.requirements?.[0]?.level) || 0;
        return `L${level} ${gun.model} ${gun.maxAngle}°`;
    }

    function projectileLabel(projectile) {
        return `${projectile.shellType} · HE ${number(projectile.heDamage)} · AP Bonus ${number(projectile.apBonus)}`;
    }

    function clearResults(messageKey) {
        results.hidden = true;
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
        appendOptions(gunSelect, guns, (gun) => gun.catalogKey, gunLabel);
        clearResults(guns.length ? "chooseGun" : "noGuns");
    }

    function populateProjectiles() {
        resetSelect(projectileSelect, text("projectilePlaceholder"));
        const gun = selectedGun();
        const projectiles = gun?.projectiles || [];
        appendOptions(projectileSelect, projectiles, (row) => row.catalogKey, projectileLabel);
        clearResults(projectiles.length ? "chooseProjectile" : "noProjectiles");
    }

    function renderResult(projectile) {
        const gun = selectedGun();
        summary.textContent = `${gunLabel(gun)} · ${projectileLabel(projectile)}`;
        $("#gun-range-ui").textContent = number(projectile.shipyardRange);
        results.hidden = false;
    }

    serverSelect.addEventListener("change", () => {
        applyLocale();
        populateCountries();
    });
    countrySelect.addEventListener("change", populateGuns);
    gunSelect.addEventListener("change", populateProjectiles);
    projectileSelect.addEventListener("change", () => clearResults("chooseProjectile"));

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (calculateButton.disabled) return;
        const projectile = selectedProjectile();
        if (!Number.isFinite(Number(projectile?.shipyardRange))) return;
        renderResult(projectile);
        status.className = "alert alert-success py-2";
        status.textContent = text("complete");
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
            const response = await fetch(CATALOG_URL, { cache: "default" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const staticCatalog = await response.json();
            catalog = {
                servers: Object.fromEntries(Object.entries(staticCatalog.servers || {}).map(
                    ([serverId, source]) => [serverId, {
                        ...source,
                        countries: (NATIONS[serverId] || []).map(([id, name]) => ({ id, name })),
                        guns: (source.guns || [])
                            .map((gun, gunIndex) => ({
                                ...gun,
                                catalogKey: String(gunIndex),
                                projectiles: (gun.projectiles || [])
                                    .filter((projectile) => Number.isFinite(Number(projectile.shipyardRange)))
                                    .map((projectile, projectileIndex) => ({
                                        ...projectile,
                                        catalogKey: String(projectileIndex),
                                    })),
                            }))
                            .filter((gun) => gun.projectiles.length > 0),
                    }],
                )),
            };
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
