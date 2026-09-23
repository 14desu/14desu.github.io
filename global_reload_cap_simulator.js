import {
    calculateAbilityStages,
    calculateGlobalGunReload,
    calculateRepairAndStructuralDefense,
} from "./sailor-performance/formulas/index.js?v=20260923-rank-terms-v11";

(() => {
    "use strict";

    const GLOBAL_SERVER = "global";
    const SAILOR_CATALOG_VERSION = "20260914-2";
    const SAILOR_CATALOG_SCHEMA = 2;
    const GLOBAL_RELOAD_ABILITY_CAP = 1_860_000;
    const MAXIMUM_LEVEL = 125;
    const DEFAULT_LEVELS = [80, 90, 100, 110, 125];
    const DEFAULT_LATE_LEVELS = [80, 90, 100, 110, 125];
    const PATH_ABILITY_COLUMNS = [
        "potential", "accuracy", "reload", "torpedo", "antiAir", "repair",
        "restore", "engine", "aircraft", "fighter", "bomber",
    ];
    const DEFAULT_SAILOR_TYPE = "superEliteRepair";
    const TEXT = {
        en: {
            pageTitle: "Global Reload Cap Simulator", pageDescription: "Compare reload-cap progress across combinations of current level and delayed class-change level for Global server gunners.", serverFixed: "Global server fixed", setupTitle: "Sailor setup",
            server: "Server", nation: "Nation", pathPreset: "Class change path preset", all: "All", final: "Final", sailorPreset: "Sailor preset", enhancementItem: "Sailor enhancement item", appliedPath: "Applied class change path",
            step: "Step", className: "Class", requiredLevel: "Required Lv.", actualLevel: "Actual class change Lv.", lateApply: "Late apply", crewGrowth: "Crew growth", potential: "Potential", accuracy: "Accuracy", reload: "Reload", torpedo: "Torpedo", antiAir: "Anti-air", repair: "Repair", restore: "Restore", engine: "Engine", aircraft: "Aircraft", fighter: "Fighter", bomber: "Bomber",
            pathHelp: "By default, delayed class change applies to every stage after Lv.12 Sailor. Checked classes use the matrix row's delayed level; unchecked classes use their required level. A class can never change earlier than its preceding stage.",
            matrixTitle: "Estimation Reload cap rate & Repair speed", veterans: "Veterans", veteranHelp: "The shared Veteran count applies to every cell, and all remaining crew are treated as Experts. The Global server Veteran limit is 50% of total crew.", low: "Low", reloadCap100: "100% reload cap", unavailableHelp: "Gray cells are unavailable because the delayed class-change level exceeds the current level.",
            displayLanguage: "Display language", globalServer: "Global server", selectNation: "Select a nation", loadingNations: "Loading nations…", selectGunnerPath: "Select a gunner path", none: "None", boost20: "Premium Sailors / increase +20%", noGunnerPath: "No gunner class change path was found for this nation.", loadingCatalog: "Loading sailor catalog…", catalogUnavailable: "Catalog unavailable", loadFailed: "Failed to load sailor catalog",
            matrixLateLevel: "Matrix Late Lv.", lateClassChangeAria: (name) => `${name} late class change`, lateFlow: (level) => `Late change · matrix row (min Lv.${level})`, classChangeFlow: (level) => `Class change Lv.${level}`,
            cornerTitle: "Reload cap rate<br>Repair speed", details: "Details", detailsAria: "Show ability and personnel details", currentLevel: "Current level", columnAria: (index) => `Column ${index} current level`, lateLevel: "Late class change level", rowAria: (index) => `Row ${index} late class change level`,
            startsAt: (name, level) => `${name} starts at Lv.${level}`, lateExceedsCurrent: (late, current) => `Late Lv.${late} > Current Lv.${current}`, veteranMaximum: (maximum, entered) => `Veteran max ${maximum} / entered ${entered}`,
            reloadAbility: "Reload", repairAbility: "Repair", experts: "Experts", crew: "Crew", reloadCapAbility: "Reload cap ability",
            summaryNation: "Nation", summaryClass: "Class", summarySailor: "Sailor", summaryEnhancement: "Enhancement", enhancement20: "+20% enhancement", noEnhancement: "No enhancement",
        },
        ko: {
            pageTitle: "글로벌 연사캡 계산기", pageDescription: "글로벌 서버 포병의 현재 레벨과 늦전직 레벨 조합별 연사캡 도달률을 비교합니다.", serverFixed: "글로벌 서버 고정", setupTitle: "수병 설정",
            server: "서버", nation: "국가", pathPreset: "전직 트리 프리셋", all: "전체", final: "최종", sailorPreset: "수병 프리셋", enhancementItem: "수병 강화 아이템", appliedPath: "적용 전직 트리",
            step: "단계", className: "병종", requiredLevel: "전직 가능 Lv.", actualLevel: "실제 전직 Lv.", lateApply: "늦전직 적용", crewGrowth: "수병수 성장", potential: "잠재", accuracy: "명중", reload: "연사", torpedo: "어뢰", antiAir: "대공", repair: "수리", restore: "보수", engine: "기관", aircraft: "함재", fighter: "전투", bomber: "폭격",
            pathHelp: "기본적으로 Lv.12 수병 이후의 모든 단계에 늦전직을 적용합니다. 체크한 병종은 행렬의 늦전직 레벨을, 체크하지 않은 병종은 전직 가능 레벨을 사용합니다. 앞 단계보다 먼저 전직할 수는 없습니다.",
            matrixTitle: "연사캡 도달률 및 수리속도 예상", veterans: "사관", veteranHelp: "입력한 사관수는 모든 셀에 공통으로 적용되며, 나머지 수병은 모두 숙련병으로 계산합니다. 글로벌 서버의 사관 상한은 총수병수의 50%입니다.", low: "낮음", reloadCap100: "연사캡 100%", unavailableHelp: "회색 셀은 늦전직 레벨이 현재 레벨보다 높아 계산할 수 없습니다.",
            displayLanguage: "표시 언어", globalServer: "Global server", selectNation: "국가를 선택하세요", loadingNations: "국가 목록을 불러오는 중…", selectGunnerPath: "포병 전직 트리를 선택하세요", none: "강화 없음", boost20: "프리미엄 수병 / 전체 20% 강화", noGunnerPath: "이 국가의 포병 전직 트리를 찾지 못했습니다.", loadingCatalog: "수병 카탈로그를 불러오는 중…", catalogUnavailable: "카탈로그를 사용할 수 없습니다", loadFailed: "수병 카탈로그를 불러오지 못했습니다",
            matrixLateLevel: "Table 늦전직 Lv.", lateClassChangeAria: (name) => `${name} 늦전직`, lateFlow: (level) => `늦전직 · 행렬 행 적용 (최소 Lv.${level})`, classChangeFlow: (level) => `전직 Lv.${level}`,
            cornerTitle: "연사캡 도달률<br>수리속도", details: "상세", detailsAria: "어빌리티와 인원 상세 표시", currentLevel: "현재 레벨", columnAria: (index) => `${index}열 현재 레벨`, lateLevel: "늦전직 레벨", rowAria: (index) => `${index}행 늦전직 레벨`,
            startsAt: (name, level) => `${name}은(는) Lv.${level}부터 시작합니다`, lateExceedsCurrent: (late, current) => `늦전직 Lv.${late} > 현재 Lv.${current}`, veteranMaximum: (maximum, entered) => `사관 상한 ${maximum} / 입력 ${entered}`,
            reloadAbility: "연사", repairAbility: "수리", experts: "숙련병", crew: "수병수", reloadCapAbility: "연사캡 적용 어빌리티",
            summaryNation: "국가", summaryClass: "병종", summarySailor: "수병", summaryEnhancement: "강화", enhancement20: "전체 20% 강화", noEnhancement: "강화 없음",
        },
    };
    let selectedLanguage = "en";
    const language = () => selectedLanguage;
    const t = () => TEXT[language()];

    function globalSailorType(id, name, {
        initialLevel = 1,
        reloadGrowth = 9,
        reloadAbility = 27,
        repairGrowth = 9,
        repairAbility = 27,
        crewGrowth = 5,
        crewCount = 55,
    } = {}) {
        return {
            id, name, initialLevel, reloadGrowth, reloadAbility,
            repairGrowth, repairAbility, crewGrowth, crewCount,
        };
    }

    function eliteSailorType(id, name, specialty, specializedGrowth = 13, pairedGrowth = 9) {
        return globalSailorType(id, name, {
            reloadGrowth: specialty === "reload"
                ? specializedGrowth
                : specialty === "accuracy"
                    ? pairedGrowth
                    : 9,
            reloadAbility: specialty === "reload" ? 30 : 27,
            repairGrowth: specialty === "repair" ? specializedGrowth : 9,
            repairAbility: specialty === "repair" ? 30 : 27,
        });
    }

    function superEliteSailorType(id, name, specialty, specializedGrowth = 15, pairedGrowth = 10) {
        return globalSailorType(id, name, {
            reloadGrowth: specialty === "reload"
                ? specializedGrowth
                : specialty === "accuracy"
                    ? pairedGrowth
                    : 10,
            reloadAbility: specialty === "reload" ? 36 : 27,
            repairGrowth: specialty === "repair" ? specializedGrowth : 10,
            repairAbility: specialty === "repair" ? 36 : 27,
        });
    }

    function advancedEliteSailorType(id, name, specialty, specializedGrowth = 17) {
        return globalSailorType(id, name, {
            initialLevel: 12,
            reloadGrowth: specialty === "reload" ? specializedGrowth : 10,
            reloadAbility: specialty === "reload" ? 223 : 140,
            repairGrowth: specialty === "repair" ? specializedGrowth : 10,
            repairAbility: specialty === "repair" ? 223 : 140,
            crewCount: 110,
        });
    }

    const GLOBAL_SAILOR_TYPES = [
        globalSailorType("nfXSailor", "NF X Sailor Lv12", { initialLevel: 12, reloadGrowth: 18, reloadAbility: 251, repairGrowth: 18, repairAbility: 251, crewCount: 110 }),
        globalSailorType("advancedHero", "Advanced Hero Sailor Lv12", { initialLevel: 12, reloadGrowth: 16, reloadAbility: 212, repairGrowth: 16, repairAbility: 212, crewCount: 110 }),
        globalSailorType("heroSailor", "Hero Sailor Lv12", { initialLevel: 12, reloadGrowth: 14, reloadAbility: 184, repairGrowth: 14, repairAbility: 184, crewCount: 110 }),
        eliteSailorType("elitePotential", "Elite Potential Sailor", "potential", 16),
        eliteSailorType("eliteAccuracy", "Elite Accuracy Sailor", "accuracy", 13, 11),
        eliteSailorType("eliteReload", "Elite Reload Sailor", "reload", 13, 11),
        eliteSailorType("eliteTorpedo", "Elite Torpedo Sailor", "torpedo"),
        eliteSailorType("eliteRepair", "Elite Repair Sailor", "repair"),
        eliteSailorType("eliteRestore", "Elite Restore Sailor", "restore"),
        eliteSailorType("eliteEngine", "Elite Engine Sailor", "engine"),
        eliteSailorType("eliteFighter", "Elite Fighter Pilot", "fighter"),
        eliteSailorType("eliteBomber", "Elite Bomber Pilot", "bomber"),
        superEliteSailorType("superElitePotential", "Super Elite Potential", "potential", 18),
        superEliteSailorType("superEliteAccuracy", "Super Elite Accuracy", "accuracy", 15, 12),
        superEliteSailorType("superEliteReload", "Super Elite Reload", "reload", 15, 12),
        superEliteSailorType("superEliteTorpedo", "Super Elite Torpedo", "torpedo"),
        superEliteSailorType("superEliteRepair", "Super Elite Repair", "repair"),
        superEliteSailorType("superEliteRestore", "Super Elite Restore", "restore"),
        superEliteSailorType("superEliteEngine", "Super Elite Engine", "engine"),
        superEliteSailorType("superEliteFighter", "Super Elite Fighter", "fighter"),
        superEliteSailorType("superEliteBomber", "Super Elite Bomber", "bomber"),
        advancedEliteSailorType("advancedEliteAccuracy", "Advanced Elite Accuracy Lv12", "accuracy"),
        advancedEliteSailorType("advancedEliteReload", "Advanced Elite Reload Lv12", "reload"),
        advancedEliteSailorType("advancedEliteTorpedo", "Advanced Elite Torpedo Lv12", "torpedo"),
        advancedEliteSailorType("advancedEliteRepair", "Advanced Elite Repair Lv12", "repair"),
        advancedEliteSailorType("advancedEliteRestore", "Advanced Elite Restore Lv12", "restore"),
        advancedEliteSailorType("advancedEliteEngine", "Advanced Elite Engine Lv12", "engine"),
        advancedEliteSailorType("advancedEliteFighter", "Advanced Elite Fighter Lv12", "fighter"),
        advancedEliteSailorType("advancedEliteBomber", "Advanced Elite Bomber Lv12", "bomber"),
    ];
    const KOREAN_NATION_NAMES = {
        1: "미국", 2: "영국", 3: "일본", 4: "독일", 5: "프랑스", 6: "소련", 7: "이탈리아", 8: "중국",
    };
    const sailorTypeName = (type) => type.name;
    const nationName = (nation) => language() === "ko"
        ? (KOREAN_NATION_NAMES[Number(nation.id)] || nation.name)
        : nation.name;

    const apiBase = document.querySelector('meta[name="sailor-api-base"]')
        ?.content.replace(/\/$/, "") || "";
    const catalogUrl = `${apiBase}/catalog/sailor-catalog.json?v=${encodeURIComponent(SAILOR_CATALOG_VERSION)}`;
    const el = (selector) => document.querySelector(selector);
    const nationSelect = el("#nation");
    const presetSelect = el("#class-change-preset");
    const presetToggle = el("#class-change-preset-toggle");
    const presetMenu = el("#class-change-preset-menu");
    const sailorTypeSelect = el("#sailor-type");
    const enhancementSelect = el("#enhancement");
    const veteranCountInput = el("#veteran-count");
    const status = el("#status");
    const pathSection = el("#path-section");
    const matrixSection = el("#matrix-section");
    const matrixHead = el("#matrix-head");
    const matrixBody = el("#matrix-body");
    const pathTableBody = el("#path-table-body");
    const classChangeFlow = el("#class-change-flow");
    const numberFormatter = new Intl.NumberFormat("en-US");

    let sailorCatalog = null;
    let catalogLoadState = "loading";
    let catalogLoadError = "";
    let allClassChangePaths = [];
    let gunnerPaths = [];
    let lateStageSelections = [];
    let pathFilterMode = "final";
    let showCellDetails = true;
    const columnSettings = DEFAULT_LEVELS.map((currentLevel) => ({ currentLevel }));
    const lateLevels = [...DEFAULT_LATE_LEVELS];

    function option(value, label) {
        const item = document.createElement("option");
        item.value = value;
        item.textContent = label;
        return item;
    }

    function setStatus(message, kind = "secondary") {
        status.hidden = !message;
        status.className = `alert alert-${kind} cap-status`;
        status.textContent = message;
    }

    function integerInRange(value, fallback, minimum = 0, maximum = MAXIMUM_LEVEL) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) return fallback;
        return Math.min(maximum, Math.max(minimum, Math.floor(numericValue)));
    }

    function buildPaths(sailors) {
        const byName = new Map(sailors.map((sailor) => [sailor.name, sailor]));
        const incoming = new Set(sailors.flatMap((sailor) => sailor.classChangeTargets || []));
        const roots = sailors.filter((sailor) => !incoming.has(sailor.name));
        const paths = [];

        const walk = (sailor, path, visited) => {
            if (visited.has(sailor.name)) return;
            const nextPath = [...path, sailor];
            paths.push(nextPath);
            const nextVisited = new Set(visited).add(sailor.name);
            const targets = (sailor.classChangeTargets || [])
                .map((name) => byName.get(name))
                .filter(Boolean);
            targets.forEach((target) => walk(target, nextPath, nextVisited));
        };

        roots.forEach((root) => walk(root, [], new Set()));
        return paths;
    }

    function isGunnerPath(path) {
        return /\b(?:Gunner|Gunnery)\b/i.test(String(path.at(-1)?.name || ""));
    }

    function pathIdentity(path) {
        return path.map((stage) => stage.name).join("\u0000");
    }

    function isFinalClassChangePath(path) {
        return !allClassChangePaths.some((candidate) => candidate.length === path.length + 1
            && path.every((stage, index) => candidate[index]?.name === stage.name));
    }

    function filteredGunnerPaths() {
        const paths = allClassChangePaths.filter(isGunnerPath);
        return pathFilterMode === "all" ? paths : paths.filter(isFinalClassChangePath);
    }

    function updatePathFilterButtons() {
        document.querySelectorAll("[data-path-filter]").forEach((button) => {
            const active = button.dataset.pathFilter === pathFilterMode;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function updateVeteranPresetButtons() {
        const veteranCount = integerInRange(veteranCountInput.value, 150, 0, 9999);
        document.querySelectorAll("[data-veteran-preset]").forEach((button) => {
            const active = Number(button.dataset.veteranPreset) === veteranCount;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function pathLabel(path) {
        const finalClass = path.at(-1)?.name || "Gunner";
        const route = path.map((stage) => `Lv.${stage.requiredLevel} ${stage.name}`).join(" > ");
        return `${finalClass} · ${route}`;
    }

    function appendPresetPathContent(container, path) {
        const finalClass = document.createElement("span");
        finalClass.className = "preset-path-class";
        finalClass.textContent = path.at(-1)?.name || "Gunner";
        const route = document.createElement("span");
        route.className = "preset-path-route";
        route.textContent = path.map((stage) => `Lv.${stage.requiredLevel} ${stage.name}`).join(" > ");
        container.append(finalClass, route);
    }

    function updatePresetCustomSelection() {
        presetToggle.replaceChildren();
        const path = selectedPath();
        if (path) {
            appendPresetPathContent(presetToggle, path);
        } else {
            const placeholder = document.createElement("span");
            placeholder.className = "preset-custom-placeholder";
            placeholder.textContent = t().selectGunnerPath;
            presetToggle.append(placeholder);
        }
        presetToggle.disabled = presetSelect.disabled;
        presetMenu.querySelectorAll(".preset-path-option").forEach((button) => {
            button.classList.toggle("active", button.dataset.presetValue === presetSelect.value);
        });
    }

    function renderPresetCustomDropdown() {
        presetMenu.replaceChildren();
        gunnerPaths.forEach((path, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "dropdown-item preset-path-option";
            button.dataset.presetValue = String(index);
            appendPresetPathContent(button, path);
            button.addEventListener("click", () => {
                presetSelect.value = String(index);
                updatePresetCustomSelection();
                renderSelectedPath();
            });
            presetMenu.append(button);
        });
        updatePresetCustomSelection();
    }

    function pathReloadScore(path) {
        return path.reduce((score, stage) => score + Number(stage.abilities?.reload || 0), 0);
    }

    function selectedPath() {
        if (presetSelect.value === "") return null;
        const index = Number(presetSelect.value);
        return Number.isInteger(index) ? gunnerPaths[index] || null : null;
    }

    function selectedSailorType() {
        return GLOBAL_SAILOR_TYPES.find((type) => type.id === sailorTypeSelect.value)
            || GLOBAL_SAILOR_TYPES.find((type) => type.id === DEFAULT_SAILOR_TYPE)
            || GLOBAL_SAILOR_TYPES[0];
    }

    function renderSailorTypes(preserveSelection = false) {
        const selected = preserveSelection ? sailorTypeSelect.value : DEFAULT_SAILOR_TYPE;
        sailorTypeSelect.replaceChildren();
        GLOBAL_SAILOR_TYPES.forEach((type) => sailorTypeSelect.append(option(type.id, sailorTypeName(type))));
        sailorTypeSelect.value = GLOBAL_SAILOR_TYPES.some((type) => type.id === selected)
            ? selected
            : DEFAULT_SAILOR_TYPE;
    }

    function updateNationRequiredState() {
        nationSelect.classList.toggle("selection-required", !nationSelect.value && !nationSelect.disabled);
    }

    function renderNations() {
        const nations = sailorCatalog?.servers?.[GLOBAL_SERVER]?.nations || [];
        nationSelect.replaceChildren(option("", t().selectNation));
        nations.forEach((nation) => nationSelect.append(option(String(nation.id), nationName(nation))));
        nationSelect.disabled = nations.length === 0;
        updateNationRequiredState();
    }

    function renderPresets(preserveSelection = false) {
        const previousPathIdentity = preserveSelection && selectedPath()
            ? pathIdentity(selectedPath())
            : null;
        const selectedNation = sailorCatalog?.servers?.[GLOBAL_SERVER]?.nations
            ?.find((nation) => Number(nation.id) === Number(nationSelect.value));
        updateNationRequiredState();
        presetSelect.replaceChildren(option("", t().selectGunnerPath));
        allClassChangePaths = [];
        gunnerPaths = [];
        lateStageSelections = [];
        pathTableBody.replaceChildren();
        pathSection.hidden = true;
        matrixSection.hidden = true;

        if (!selectedNation) {
            presetSelect.disabled = true;
            renderPresetCustomDropdown();
            setStatus("");
            return;
        }

        allClassChangePaths = buildPaths(
            selectedNation.sailors.filter((sailor) => Number(sailor.requiredLevel) > 0),
        );
        gunnerPaths = filteredGunnerPaths();
        gunnerPaths.forEach((path, index) => presetSelect.append(option(String(index), pathLabel(path))));
        presetSelect.disabled = gunnerPaths.length === 0;

        if (gunnerPaths.length === 0) {
            renderPresetCustomDropdown();
            setStatus(t().noGunnerPath, "warning");
            return;
        }

        const preservedIndex = previousPathIdentity === null
            ? -1
            : gunnerPaths.findIndex((path) => pathIdentity(path) === previousPathIdentity);
        if (preservedIndex >= 0) {
            presetSelect.value = String(preservedIndex);
        } else {
            let bestPathIndex = 0;
            gunnerPaths.forEach((path, index) => {
                if (pathReloadScore(path) > pathReloadScore(gunnerPaths[bestPathIndex])) bestPathIndex = index;
            });
            presetSelect.value = String(bestPathIndex);
        }
        renderPresetCustomDropdown();
        setStatus("");
        renderSelectedPath();
    }

    function setPathFilterMode(mode) {
        if (mode !== "all" && mode !== "final" || mode === pathFilterMode) return;
        pathFilterMode = mode;
        updatePathFilterButtons();
        renderPresets(true);
    }

    function signedValue(value) {
        const numericValue = Number(value) || 0;
        return numericValue > 0 ? `+${numericValue}` : String(numericValue);
    }

    function renderPathTable(path) {
        pathTableBody.replaceChildren();
        path.forEach((stage, index) => {
            const row = document.createElement("tr");
            row.classList.toggle("path-stage-late", Boolean(lateStageSelections[index]));

            const stepCell = document.createElement("td");
            stepCell.textContent = String(index + 1);
            const classCell = document.createElement("td");
            classCell.textContent = stage.name;
            const requiredCell = document.createElement("td");
            requiredCell.textContent = String(stage.requiredLevel);
            const actualCell = document.createElement("td");
            actualCell.textContent = lateStageSelections[index] ? t().matrixLateLevel : String(stage.requiredLevel);
            const lateCell = document.createElement("td");
            const lateCheckbox = document.createElement("input");
            lateCheckbox.className = "form-check-input";
            lateCheckbox.type = "checkbox";
            lateCheckbox.checked = Boolean(lateStageSelections[index]);
            lateCheckbox.setAttribute("aria-label", t().lateClassChangeAria(stage.name));
            lateCheckbox.addEventListener("change", () => {
                lateStageSelections[index] = lateCheckbox.checked;
                row.classList.toggle("path-stage-late", lateCheckbox.checked);
                actualCell.textContent = lateCheckbox.checked ? t().matrixLateLevel : String(stage.requiredLevel);
                renderClassChangeFlow(path);
                renderMatrix();
            });
            lateCell.append(lateCheckbox);
            const crewCell = document.createElement("td");
            crewCell.textContent = String(stage.crewGrowth);
            row.append(stepCell, classCell, requiredCell, actualCell, lateCell, crewCell);

            PATH_ABILITY_COLUMNS.forEach((key) => {
                const abilityCell = document.createElement("td");
                abilityCell.textContent = signedValue(stage.abilities?.[key]);
                row.append(abilityCell);
            });
            pathTableBody.append(row);
        });
    }

    function renderClassChangeFlow(path) {
        classChangeFlow.replaceChildren();
        path.forEach((stage, index) => {
            const node = document.createElement("div");
            const isLate = Boolean(lateStageSelections[index]);
            node.className = `class-change-node${isLate ? " is-late" : ""}`;

            const name = document.createElement("span");
            name.className = "class-change-name";
            name.textContent = stage.name;

            const level = document.createElement("span");
            level.className = "class-change-level";
            level.textContent = isLate
                ? t().lateFlow(stage.requiredLevel)
                : t().classChangeFlow(stage.requiredLevel);
            node.append(name, level);
            classChangeFlow.append(node);
        });
    }

    function renderSelectedPath() {
        const path = selectedPath();
        if (!path) {
            lateStageSelections = [];
            pathTableBody.replaceChildren();
            classChangeFlow.replaceChildren();
            pathSection.hidden = true;
            matrixSection.hidden = true;
            return;
        }
        const sailorStageIndex = path.findIndex((stage) => /^sailor$/i.test(String(stage.name).trim())
            && Number(stage.requiredLevel) === 12);
        lateStageSelections = path.map((stage, index) => index > sailorStageIndex);
        renderPathTable(path);
        renderClassChangeFlow(path);

        pathSection.hidden = false;
        matrixSection.hidden = false;
        renderMatrix();
    }

    function applyClassChange(state, stage) {
        state.reloadGrowth += Number(stage.abilities?.reload || 0);
        state.repairGrowth += Number(stage.abilities?.repair || 0);
        state.crewGrowth = Number(stage.crewGrowth) || state.crewGrowth;
        state.reloadAbility += Number(stage.bonusAbilities?.reload || 0);
        state.repairAbility += Number(stage.bonusAbilities?.repair || 0);
    }

    // Match simulator.js: add the level-up growth first, then apply class-change growth at that level.
    function calculateSailor(path, currentLevel, lateLevel, enhanced) {
        const sailorType = selectedSailorType();
        const initialLevel = sailorType.initialLevel;
        const state = {
            reloadGrowth: sailorType.reloadGrowth,
            reloadAbility: sailorType.reloadAbility,
            repairGrowth: sailorType.repairGrowth,
            repairAbility: sailorType.repairAbility,
            crewGrowth: sailorType.crewGrowth,
            crewCount: sailorType.crewCount,
        };
        let previousActualLevel = 1;
        const scheduledStages = path.map((stage, index) => {
            const requiredLevel = Number(stage.requiredLevel);
            const selectedLevel = lateStageSelections[index]
                ? Math.max(requiredLevel, lateLevel)
                : requiredLevel;
            const actualLevel = Math.max(previousActualLevel, selectedLevel);
            previousActualLevel = actualLevel;
            return { stage, actualLevel };
        });
        let classChangeIndex = 0;

        while (classChangeIndex < scheduledStages.length
            && scheduledStages[classChangeIndex].actualLevel <= initialLevel) {
            applyClassChange(state, scheduledStages[classChangeIndex].stage);
            classChangeIndex += 1;
        }

        for (let nextLevel = initialLevel + 1; nextLevel <= currentLevel; nextLevel += 1) {
            state.reloadAbility += state.reloadGrowth;
            state.repairAbility += state.repairGrowth;
            state.crewCount += state.crewGrowth;
            while (classChangeIndex < scheduledStages.length
                && scheduledStages[classChangeIndex].actualLevel === nextLevel) {
                applyClassChange(state, scheduledStages[classChangeIndex].stage);
                classChangeIndex += 1;
            }
        }

        state.reloadAbility = Math.max(0, state.reloadAbility);
        state.repairAbility = Math.max(0, state.repairAbility);
        state.crewCount = Math.max(1, state.crewCount);
        if (enhanced) {
            state.reloadGrowth = Math.floor(state.reloadGrowth / 9 * 11);
            state.reloadAbility = Math.floor(state.reloadAbility / 9 * 11);
            state.repairGrowth = Math.floor(state.repairGrowth / 9 * 11);
            state.repairAbility = Math.floor(state.repairAbility / 9 * 11);
        }
        return state;
    }

    function mixColor(left, right, ratio) {
        const safeRatio = Math.min(1, Math.max(0, ratio));
        const channels = left.map((value, index) => Math.round(value + (right[index] - value) * safeRatio));
        return `rgb(${channels.join(", ")})`;
    }

    function progressColor(progress) {
        const red = [248, 212, 212];
        const yellow = [255, 240, 184];
        const green = [212, 242, 217];
        const safeProgress = Math.min(100, Math.max(0, progress));
        return safeProgress <= 50
            ? mixColor(red, yellow, safeProgress / 50)
            : mixColor(yellow, green, (safeProgress - 50) / 50);
    }

    function repairSpeedTextColor(ratio) {
        const red = [176, 42, 55];
        const yellow = [145, 105, 0];
        const green = [21, 98, 53];
        const safeRatio = Math.min(1, Math.max(0, ratio));
        return safeRatio <= 0.5
            ? mixColor(red, yellow, safeRatio * 2)
            : mixColor(yellow, green, (safeRatio - 0.5) * 2);
    }

    function applyRepairSpeedTextColors() {
        const speedElements = [...matrixBody.querySelectorAll(".cap-repair-speed[data-repair-speed]")];
        const speeds = speedElements.map((element) => Number(element.dataset.repairSpeed));
        if (speeds.length === 0) return;
        const minimum = Math.min(...speeds);
        const maximum = Math.max(...speeds);
        speedElements.forEach((element) => {
            const speed = Number(element.dataset.repairSpeed);
            if (maximum === minimum) {
                element.style.color = "#3f4d57";
                return;
            }
            element.style.color = repairSpeedTextColor((speed - minimum) / (maximum - minimum));
        });
    }

    function createNumberInput({ value, minimum, maximum, label, onChange }) {
        const input = document.createElement("input");
        input.className = "form-control form-control-sm";
        input.type = "number";
        input.inputMode = "numeric";
        input.min = String(minimum);
        input.max = String(maximum);
        input.step = "1";
        input.value = String(value);
        input.setAttribute("aria-label", label);
        input.addEventListener("change", () => {
            const normalized = integerInRange(input.value, value, minimum, maximum);
            input.value = String(normalized);
            onChange(normalized);
        });
        return input;
    }

    function renderMatrixHead() {
        const row = document.createElement("tr");
        const corner = document.createElement("th");
        corner.scope = "col";
        corner.innerHTML = `<span class="matrix-corner-title">${t().cornerTitle}</span>`;
        const detailsToggle = document.createElement("label");
        detailsToggle.className = "matrix-details-toggle";
        const detailsCheckbox = document.createElement("input");
        detailsCheckbox.className = "form-check-input";
        detailsCheckbox.type = "checkbox";
        detailsCheckbox.checked = showCellDetails;
        detailsCheckbox.setAttribute("aria-label", t().detailsAria);
        detailsCheckbox.addEventListener("change", () => {
            showCellDetails = detailsCheckbox.checked;
            updateCellDetailsVisibility();
        });
        detailsToggle.append(detailsCheckbox, document.createTextNode(t().details));
        corner.append(detailsToggle);
        row.append(corner);

        columnSettings.forEach((setting, index) => {
            const heading = document.createElement("th");
            heading.scope = "col";
            const levelLabel = document.createElement("span");
            levelLabel.className = "axis-title";
            levelLabel.textContent = t().currentLevel;
            const levelControl = document.createElement("div");
            levelControl.className = "axis-control";
            levelControl.append(createNumberInput({
                value: setting.currentLevel,
                minimum: 1,
                maximum: MAXIMUM_LEVEL,
                label: t().columnAria(index + 1),
                onChange: (value) => {
                    setting.currentLevel = value;
                    renderMatrix();
                },
            }));
            heading.append(levelLabel, levelControl);
            row.append(heading);
        });
        matrixHead.replaceChildren(row);
    }

    function updateCellDetailsVisibility() {
        matrixBody.classList.toggle("show-cell-details", showCellDetails);
    }

    function unavailableCell(message) {
        const cell = document.createElement("td");
        cell.className = "cap-cell cap-unavailable";
        const value = document.createElement("span");
        value.className = "cap-progress";
        value.textContent = "—";
        const detail = document.createElement("span");
        detail.className = "cap-detail";
        detail.textContent = message;
        cell.append(value, detail);
        return cell;
    }

    function resultCell(path, currentLevel, lateLevel, veteranCount) {
        const sailorType = selectedSailorType();
        if (currentLevel < sailorType.initialLevel) {
            return unavailableCell(t().startsAt(sailorTypeName(sailorType), sailorType.initialLevel));
        }
        if (lateStageSelections.some(Boolean) && lateLevel > currentLevel) {
            return unavailableCell(t().lateExceedsCurrent(lateLevel, currentLevel));
        }

        const enhanced = enhancementSelect.value === "all:20";
        const sailor = calculateSailor(path, currentLevel, lateLevel, enhanced);
        const maximumVeterans = Math.floor(sailor.crewCount * 0.5);
        if (veteranCount > maximumVeterans) {
            return unavailableCell(t().veteranMaximum(maximumVeterans, veteranCount));
        }

        const experts = sailor.crewCount - veteranCount;
        const abilityStages = calculateAbilityStages({
            server: GLOBAL_SERVER,
            ability: sailor.reloadAbility,
            crewCount: sailor.crewCount,
            condition: {
                veterans: veteranCount,
                experts,
                rookies: 0,
                seamanAdjustmentPercent: 0,
            },
            applySeamanAdjustment: false,
        });
        const reloadResult = calculateGlobalGunReload(
            abilityStages.serverAdjAbility,
            1,
            0,
            false,
        );
        const progress = Number(reloadResult.gunReloadAbilityCapProgressPercent) || 0;
        const repairStages = calculateAbilityStages({
            server: GLOBAL_SERVER,
            ability: sailor.repairAbility,
            crewCount: sailor.crewCount,
            condition: {
                veterans: veteranCount,
                experts,
                rookies: 0,
                seamanAdjustmentPercent: 0,
            },
            applySeamanAdjustment: false,
        });
        const repairResult = calculateRepairAndStructuralDefense(GLOBAL_SERVER, {
            repair: repairStages.seamanAdjAbility,
            restore: 0,
        });

        const cell = document.createElement("td");
        cell.className = "cap-cell";
        cell.style.backgroundColor = progressColor(progress);
        const value = document.createElement("span");
        value.className = `cap-progress${progress >= 100 ? " cap-reached" : ""}`;
        value.textContent = `${progress.toFixed(1)}%`;
        const sailorDetail = document.createElement("span");
        sailorDetail.className = "cap-detail cap-extra-detail";
        sailorDetail.textContent = `${t().reloadAbility} ${numberFormatter.format(sailor.reloadAbility)}`;
        const repairSpeedDetail = document.createElement("span");
        repairSpeedDetail.className = "cap-detail cap-repair-speed";
        repairSpeedDetail.dataset.repairSpeed = String(repairResult.repairSpeedPerSecond);
        repairSpeedDetail.textContent = `${repairResult.repairSpeedPerSecond.toFixed(1)}/s`;
        const repairAbilityDetail = document.createElement("span");
        repairAbilityDetail.className = "cap-detail cap-extra-detail";
        repairAbilityDetail.textContent = `${t().repairAbility} ${numberFormatter.format(sailor.repairAbility)}`;
        const personnelDetail = document.createElement("span");
        personnelDetail.className = "cap-detail cap-extra-detail";
        personnelDetail.textContent = `${t().veterans} ${numberFormatter.format(veteranCount)} · ${t().experts} ${numberFormatter.format(experts)}`;
        cell.title = `${t().currentLevel} Lv.${currentLevel}, ${t().lateLevel} Lv.${lateLevel}, ${t().reloadAbility} ${sailor.reloadAbility}, ${t().repairAbility} ${sailor.repairAbility}, ${t().crew} ${sailor.crewCount}, ${t().veterans} ${veteranCount}, ${t().experts} ${experts}, ${t().reloadCapAbility} ${Math.floor(abilityStages.serverAdjAbility)} / ${GLOBAL_RELOAD_ABILITY_CAP}`;
        cell.append(value, sailorDetail, repairSpeedDetail, repairAbilityDetail, personnelDetail);
        return cell;
    }

    function renderMatrixBody() {
        const path = selectedPath();
        matrixBody.replaceChildren();
        if (!path) return;
        const veteranCount = integerInRange(veteranCountInput.value, 150, 0, 9999);

        lateLevels.forEach((lateLevel, rowIndex) => {
            const row = document.createElement("tr");
            const heading = document.createElement("th");
            heading.scope = "row";
            const label = document.createElement("span");
            label.className = "axis-title";
            label.textContent = t().lateLevel;
            const control = document.createElement("div");
            control.className = "axis-control justify-content-start";
            control.append(createNumberInput({
                value: lateLevel,
                minimum: 1,
                maximum: MAXIMUM_LEVEL,
                label: t().rowAria(rowIndex + 1),
                onChange: (value) => {
                    lateLevels[rowIndex] = value;
                    renderMatrix();
                },
            }));
            heading.append(label, control);
            row.append(heading);
            columnSettings.forEach((setting) => {
                row.append(resultCell(
                    path,
                    setting.currentLevel,
                    lateLevel,
                    veteranCount,
                ));
            });
            matrixBody.append(row);
        });
        updateCellDetailsVisibility();
        applyRepairSpeedTextColors();
    }

    function renderMatrix() {
        const path = selectedPath();
        if (!path) return;
        renderMatrixHead();
        renderMatrixBody();
        const selectedNationName = nationSelect.options[nationSelect.selectedIndex]?.textContent || "Global";
        const finalClass = path.at(-1)?.name || "Gunner";
        const sailorType = selectedSailorType();
        const enhancement = enhancementSelect.value === "all:20" ? t().enhancement20 : t().noEnhancement;
        const summary = el("#matrix-summary");
        summary.replaceChildren();
        [
            [t().summaryNation, selectedNationName],
            [t().summaryClass, finalClass],
            [t().summarySailor, sailorTypeName(sailorType)],
            [t().summaryEnhancement, enhancement],
        ].forEach(([labelText, valueText]) => {
            const item = document.createElement("div");
            item.className = "matrix-summary-item";
            const label = document.createElement("span");
            label.className = "matrix-summary-label";
            label.textContent = labelText;
            const value = document.createElement("span");
            value.className = "matrix-summary-value";
            value.textContent = valueText;
            value.title = valueText;
            item.append(label, value);
            summary.append(item);
        });
    }

    function applyLanguage() {
        document.documentElement.lang = language();
        document.title = t().pageTitle;
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const value = t()[element.dataset.i18n];
            if (typeof value === "string") element.textContent = value;
        });
        document.querySelectorAll("#cap-language-switch [data-language]").forEach((button) => {
            const active = button.dataset.language === language();
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        el("#cap-language-switch").setAttribute("aria-label", t().displayLanguage);
        document.querySelector("[data-path-filter]")?.parentElement?.setAttribute("aria-label", language() === "ko" ? "전직 트리 필터" : "Class change path filter");
        document.querySelector("[data-veteran-preset]")?.parentElement?.setAttribute("aria-label", language() === "ko" ? "사관수 프리셋" : "Veteran count presets");
        el("#server").options[0].textContent = t().globalServer;

        const selectedEnhancement = enhancementSelect.value || "all:20";
        enhancementSelect.replaceChildren(
            option("none", t().none),
            option("all:20", t().boost20),
        );
        enhancementSelect.value = selectedEnhancement;
        renderSailorTypes(true);

        if (sailorCatalog) {
            const selectedNation = nationSelect.value;
            renderNations();
            nationSelect.value = selectedNation;
            updateNationRequiredState();
        } else if (nationSelect.options.length > 0) {
            const failed = catalogLoadState === "error";
            nationSelect.options[0].textContent = failed ? t().catalogUnavailable : t().loadingNations;
            setStatus(failed ? `${t().loadFailed}: ${catalogLoadError}` : t().loadingCatalog, failed ? "danger" : "secondary");
        }
        if (presetSelect.options.length > 0 && presetSelect.options[0].value === "") {
            presetSelect.options[0].textContent = t().selectGunnerPath;
        }
        renderPresetCustomDropdown();
        const path = selectedPath();
        if (path) {
            renderPathTable(path);
            renderClassChangeFlow(path);
            renderMatrix();
        } else if (sailorCatalog && nationSelect.value && gunnerPaths.length === 0) {
            setStatus(t().noGunnerPath, "warning");
        }
    }

    function setLanguage(nextLanguage) {
        if (!["ko", "en"].includes(nextLanguage) || nextLanguage === selectedLanguage) return;
        selectedLanguage = nextLanguage;
        applyLanguage();
    }

    async function loadCatalog() {
        try {
            const response = await fetch(catalogUrl, { cache: "default" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const loadedCatalog = await response.json();
            if (loadedCatalog.schemaVersion !== SAILOR_CATALOG_SCHEMA) {
                throw new Error(`Expected schema ${SAILOR_CATALOG_SCHEMA}, received ${loadedCatalog.schemaVersion || "unversioned"}`);
            }
            if (loadedCatalog.catalogVersion !== SAILOR_CATALOG_VERSION) {
                throw new Error(`Expected catalog ${SAILOR_CATALOG_VERSION}, received ${loadedCatalog.catalogVersion || "unversioned"}`);
            }
            if (!loadedCatalog.servers?.[GLOBAL_SERVER]?.nations) {
                throw new Error(language() === "ko" ? "글로벌 수병 카탈로그를 사용할 수 없습니다" : "Global sailor catalog is unavailable");
            }
            sailorCatalog = loadedCatalog;
            catalogLoadState = "loaded";
            catalogLoadError = "";
            renderNations();
            setStatus("");
        } catch (error) {
            console.error(error);
            catalogLoadState = "error";
            catalogLoadError = error.message;
            nationSelect.replaceChildren(option("", t().catalogUnavailable));
            nationSelect.disabled = true;
            updateNationRequiredState();
            presetSelect.disabled = true;
            renderPresetCustomDropdown();
            setStatus(`${t().loadFailed}: ${error.message}`, "danger");
        }
    }

    nationSelect.addEventListener("change", () => renderPresets(false));
    presetSelect.addEventListener("change", () => {
        updatePresetCustomSelection();
        renderSelectedPath();
    });
    document.querySelectorAll("[data-path-filter]").forEach((button) => {
        button.addEventListener("click", () => setPathFilterMode(button.dataset.pathFilter));
    });
    document.querySelectorAll("[data-veteran-preset]").forEach((button) => {
        button.addEventListener("click", () => {
            veteranCountInput.value = button.dataset.veteranPreset;
            updateVeteranPresetButtons();
            renderMatrix();
        });
    });
    document.querySelectorAll("#cap-language-switch [data-language]").forEach((button) => {
        button.addEventListener("click", () => setLanguage(button.dataset.language));
    });
    sailorTypeSelect.addEventListener("change", renderMatrix);
    enhancementSelect.addEventListener("change", renderMatrix);
    veteranCountInput.addEventListener("input", updateVeteranPresetButtons);
    veteranCountInput.addEventListener("change", () => {
        veteranCountInput.value = String(integerInRange(veteranCountInput.value, 150, 0, 9999));
        updateVeteranPresetButtons();
        renderMatrix();
    });
    applyLanguage();
    updatePathFilterButtons();
    updateVeteranPresetButtons();
    loadCatalog();
})();
