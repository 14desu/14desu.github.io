import {
    calculateAbilityStages,
    calculateRepairAndStructuralDefense,
    calculateSonarPerformance,
    SONAR_ABILITY_CAP,
} from "./sailor-performance/formulas/index.js?v=20260926-sonar-v12";

(() => {
    "use strict";

    const CATALOG_VERSION = "20261002-1";
    const CATALOG_SCHEMA = 2;
    const PATH_ABILITY_COLUMNS = [
        "potential", "accuracy", "reload", "torpedo", "antiAir", "repair",
        "restore", "engine", "aircraft", "fighter", "bomber",
    ];
    const SERVER_STORAGE_KEY = "navyfield-simulator-server";
    const NATION_NAMES = {
        ko: { 1: "미국", 2: "영국", 3: "일본", 4: "독일", 5: "프랑스", 6: "소련", 7: "이탈리아", 8: "중국" },
        en: { 1: "United States", 2: "United Kingdom", 3: "Japan", 4: "Germany", 5: "France", 6: "Soviet Union", 7: "Italy", 8: "China" },
    };
    const TEXT = {
        ko: {
            pageTitle: "음탐캡 시뮬레이터", pageDescription: "한국·글로벌 서버 음탐병의 현재 레벨과 늦전직 레벨 조합별 음탐 수병범위를 비교합니다.", serverBadge: "한국어 · 한국 서버", languageName: "한국어", setupTitle: "수병 설정",
            server: "서버", nation: "국가", pathPreset: "전직 트리 프리셋", all: "전체", final: "최종", sailorPreset: "수병 프리셋", enhancementItem: "수병 강화 아이템", appliedPath: "적용 전직 트리",
            step: "단계", className: "병종", requiredLevel: "전직 가능 Lv.", actualLevel: "실제 전직 Lv.", lateApply: "늦전직 적용", crewGrowth: "수병수 성장", potential: "잠재", accuracy: "명중", reload: "연사", torpedo: "어뢰", antiAir: "대공", repair: "수리", restore: "보수", engine: "기관", aircraft: "함재", fighter: "전투", bomber: "폭격",
            pathHelp: "체크한 병종은 행렬의 늦전직 레벨을 사용합니다. 기본 적용에서 보조병/Support Sailor는 제외되며, 한국 서버의 수병 다음 첫 전직은 Lv.25를 넘길 수 없습니다. 개근·전설 수병은 늦전직을 적용할 수 없습니다.", matrixTitle: "음탐 수병범위 및 수리속도 예상",
            veterans: "사관", veteranHelp: "입력한 사관수는 모든 셀에 공통 적용되고, 나머지는 숙련병으로 계산합니다. 한국 서버 사관 상한은 45%, 글로벌 서버는 50%입니다.", low: "낮음", sonarRange100: "음탐 수병범위 100%", unavailableHelp: "회색 셀은 해당 조건을 계산할 수 없습니다.",
            targetMatrixTitle: "음탐 수병범위 100% 최소 사관수 및 수리속도", targetMatrixHelp: "서버별 사관 한도 안에서 음탐 수병범위 100%를 달성하는 최소 사관수를 찾습니다. 나머지는 모두 숙련병으로 계산합니다.", targetCornerTitle: "최소 사관수<br>수리속도", minimumVeterans: "사관", veteranLimitExceeded: "사관 상한 내 100% 불가",
            displayLanguage: "표시 언어", koreaServer: "한국 서버", globalServer: "Global server", selectNation: "국가를 선택하세요", loadingNations: "국가 목록을 불러오는 중…", selectSonarPath: "음탐병 전직 트리를 선택하세요", none: "강화 없음", boost20: "전체 20% 강화", potentialPlus1: "잠재 1강", potentialPlus2: "잠재 2강", repairPlus1: "수리 1강", repairPlus2: "수리 2강", noSonarPath: "이 국가의 음탐병 전직 트리를 찾지 못했습니다.", loadingCatalog: "수병 카탈로그를 불러오는 중…", catalogUnavailable: "카탈로그를 사용할 수 없습니다", loadFailed: "수병 카탈로그를 불러오지 못했습니다",
            matrixLateLevel: "Table 늦전직 Lv.", lateClassChangeAria: (name) => `${name} 늦전직`, eventLateUnavailable: "개근·전설 수병은 늦전직을 적용할 수 없습니다.", lateFlow: (level) => `늦전직 · 행렬 행 적용 (최소 Lv.${level})`, koreaFirstLateFlow: (level) => `늦전직 · 행렬 행 적용 (Lv.${level}~25)`, classChangeFlow: (level) => `전직 Lv.${level}`,
            cornerTitle: "음탐 수병범위<br>수리속도", details: "상세", detailsAria: "어빌리티와 인원 상세 표시", currentLevel: "현재 레벨", columnAria: (index) => `${index}열 현재 레벨`, lateLevel: "늦전직 레벨", rowAria: (index) => `${index}행 늦전직 레벨`,
            startsAt: (name, level) => `${name}은(는) Lv.${level}부터 시작합니다`, lateExceedsCurrent: (late, current) => `늦전직 Lv.${late} > 현재 Lv.${current}`, veteranMaximum: (maximum, entered) => `사관 상한 ${maximum} / 입력 ${entered}`,
            potentialAbility: "잠재", repairAbility: "수리", experts: "숙련병", crew: "수병수", sonarAppliedAbility: "음탐 적용 잠재", sonarAbilityCap: "음탐 어빌캡", sonarRange: "음탐 수병범위",
            summaryServer: "서버", summaryNation: "국가", summaryClass: "병종", summarySailor: "수병", summaryEnhancement: "강화", enhancement20: "전체 20% 강화", noEnhancement: "강화 없음",
        },
        en: {
            pageTitle: "Sonar Cap Simulator", pageDescription: "Compare sonar sailor range across current-level and delayed-class-change combinations on Korea and Global servers.", serverBadge: "English · Global server", languageName: "English", setupTitle: "Sailor setup",
            server: "Server", nation: "Nation", pathPreset: "Class change path preset", all: "All", final: "Final", sailorPreset: "Sailor preset", enhancementItem: "Sailor enhancement item", appliedPath: "Applied class change path",
            step: "Step", className: "Class", requiredLevel: "Required Lv.", actualLevel: "Actual class change Lv.", lateApply: "Late apply", crewGrowth: "Crew growth", potential: "Potential", accuracy: "Accuracy", reload: "Reload", torpedo: "Torpedo", antiAir: "Anti-air", repair: "Repair", restore: "Restore", engine: "Engine", aircraft: "Aircraft", fighter: "Fighter", bomber: "Bomber",
            pathHelp: "Checked classes use the matrix row's delayed level. Support Sailor is excluded by default. On Korea, the first class change after Sailor cannot be delayed beyond Lv.25, and Attendance/Legendary sailors cannot use delayed class changes.", matrixTitle: "Estimated sonar sailor range & repair speed",
            veterans: "Veterans", veteranHelp: "The entered Veteran count applies to every cell; all remaining sailors are Experts. The Veteran limit is 45% on Korea and 50% on Global.", low: "Low", sonarRange100: "100% sonar sailor range", unavailableHelp: "Gray cells cannot be calculated for the selected conditions.",
            targetMatrixTitle: "Minimum Veterans for 100% sonar range & repair speed", targetMatrixHelp: "Each cell finds the minimum Veterans needed for 100% sonar sailor range within the server limit. All remaining sailors are Experts.", targetCornerTitle: "Minimum Veterans<br>Repair speed", minimumVeterans: "Veterans", veteranLimitExceeded: "100% exceeds Veteran limit",
            displayLanguage: "Display language", koreaServer: "Korea server", globalServer: "Global server", selectNation: "Select a nation", loadingNations: "Loading nations…", selectSonarPath: "Select a Sonarman path", none: "None", boost20: "Premium Sailors / increase +20%", potentialPlus1: "Potential +1 enhancement", potentialPlus2: "Potential +2 enhancement", repairPlus1: "Repair +1 enhancement", repairPlus2: "Repair +2 enhancement", noSonarPath: "No Sonarman class change path was found for this nation.", loadingCatalog: "Loading sailor catalog…", catalogUnavailable: "Catalog unavailable", loadFailed: "Failed to load sailor catalog",
            matrixLateLevel: "Matrix Late Lv.", lateClassChangeAria: (name) => `${name} late class change`, eventLateUnavailable: "Attendance and Legendary sailors cannot use delayed class changes.", lateFlow: (level) => `Late change · matrix row (min Lv.${level})`, koreaFirstLateFlow: (level) => `Late change · matrix row (Lv.${level}–25)`, classChangeFlow: (level) => `Class change Lv.${level}`,
            cornerTitle: "Sonar sailor range<br>Repair speed", details: "Details", detailsAria: "Show ability and personnel details", currentLevel: "Current level", columnAria: (index) => `Column ${index} current level`, lateLevel: "Delayed class change level", rowAria: (index) => `Row ${index} delayed class change level`,
            startsAt: (name, level) => `${name} starts at Lv.${level}`, lateExceedsCurrent: (late, current) => `Late Lv.${late} > Current Lv.${current}`, veteranMaximum: (maximum, entered) => `Veteran max ${maximum} / entered ${entered}`,
            potentialAbility: "Potential", repairAbility: "Repair", experts: "Experts", crew: "Crew", sonarAppliedAbility: "Sonar-adjusted Potential", sonarAbilityCap: "Sonar ability cap", sonarRange: "Sonar sailor range",
            summaryServer: "Server", summaryNation: "Nation", summaryClass: "Class", summarySailor: "Sailor", summaryEnhancement: "Enhancement", enhancement20: "+20% enhancement", noEnhancement: "No enhancement",
        },
    };

    function sailorType(id, names, values = {}) {
        return {
            id, ...names,
            initialLevel: values.initialLevel ?? 1,
            potentialGrowth: values.potentialGrowth ?? 9,
            potentialAbility: values.potentialAbility ?? 27,
            repairGrowth: values.repairGrowth ?? 9,
            repairAbility: values.repairAbility ?? 27,
            crewGrowth: values.crewGrowth ?? 5,
            crewCount: values.crewCount ?? 55,
            event: values.event === true,
            normalVariant: values.normalVariant === true,
        };
    }
    const KOREA_SAILOR_TYPES = [
        sailorType("normalPotential14Repair12", { ko: "일반수병 잠재14 수리12", en: "Normal sailor Potential 14 Repair 12" }, { potentialGrowth: 14, repairGrowth: 12, normalVariant: true }),
        sailorType("normalPotential15Repair11", { ko: "일반수병 잠재15 수리11", en: "Normal sailor Potential 15 Repair 11" }, { potentialGrowth: 15, repairGrowth: 11, normalVariant: true }),
        sailorType("normalPotential15Repair12", { ko: "일반수병 잠재15 수리12", en: "Normal sailor Potential 15 Repair 12" }, { potentialGrowth: 15, repairGrowth: 12, normalVariant: true }),
        sailorType("attendance", { ko: "개근 수병 Lv90", en: "Attendance event sailor Lv90" }, { event: true }),
        sailorType("legendSupport", { ko: "전설 보조 수병 Lv90", en: "Legendary support sailor Lv90" }, { repairGrowth: 14, repairAbility: 30, event: true }),
        sailorType("legendSpecial", { ko: "전설 특무 수병 Lv90", en: "Legendary special sailor Lv90" }, { event: true }),
        sailorType("premiumPotential", { ko: "프리미엄 잠재 수병 Lv12", en: "Premium potential sailor Lv12" }, { potentialGrowth: 17, potentialAbility: 30 }),
        sailorType("premiumAccuracy", { ko: "프리미엄 명중 수병 Lv12", en: "Premium accuracy sailor Lv12" }),
        sailorType("premiumReload", { ko: "프리미엄 연사 수병 Lv12", en: "Premium reload sailor Lv12" }),
        sailorType("premiumTorpedo", { ko: "프리미엄 어뢰 수병 Lv12", en: "Premium torpedo sailor Lv12" }),
        sailorType("premiumRepair", { ko: "프리미엄 수리 수병 Lv12", en: "Premium repair sailor Lv12" }, { repairGrowth: 14, repairAbility: 30 }),
        sailorType("premiumRestore", { ko: "프리미엄 보수 수병 Lv12", en: "Premium restore sailor Lv12" }),
        sailorType("premiumEngine", { ko: "프리미엄 기관 수병 Lv12", en: "Premium engine sailor Lv12" }),
        sailorType("premiumFighter", { ko: "프리미엄 전투 수병 Lv12", en: "Premium fighter sailor Lv12" }),
        sailorType("premiumBomber", { ko: "프리미엄 폭격 수병 Lv12", en: "Premium bomber sailor Lv12" }),
    ];
    function globalSailorType(id, en, specialty, specializedGrowth, pairedGrowth = 9, values = {}) {
        return sailorType(id, { en }, {
            potentialGrowth: specialty === "potential" ? specializedGrowth : pairedGrowth,
            potentialAbility: specialty === "potential" ? (values.specializedAbility ?? 27) : (values.baseAbility ?? 27),
            repairGrowth: specialty === "repair" ? specializedGrowth : pairedGrowth,
            repairAbility: specialty === "repair" ? (values.specializedAbility ?? 27) : (values.baseAbility ?? 27),
            ...values,
        });
    }
    const GLOBAL_SAILOR_TYPES = [
        sailorType("normal", { en: "Normal sailor" }),
        sailorType("nfXSailor", { en: "NF X Sailor Lv12" }, { initialLevel: 12, potentialGrowth: 18, potentialAbility: 251, repairGrowth: 18, repairAbility: 251, crewCount: 110 }),
        sailorType("advancedHero", { en: "Advanced Hero Sailor Lv12" }, { initialLevel: 12, potentialGrowth: 16, potentialAbility: 212, repairGrowth: 16, repairAbility: 212, crewCount: 110 }),
        sailorType("heroSailor", { en: "Hero Sailor Lv12" }, { initialLevel: 12, potentialGrowth: 14, potentialAbility: 184, repairGrowth: 14, repairAbility: 184, crewCount: 110 }),
        globalSailorType("elitePotential", "Elite Potential Sailor", "potential", 16, 9, { specializedAbility: 30 }),
        globalSailorType("eliteAccuracy", "Elite Accuracy Sailor", "accuracy", 13, 9),
        globalSailorType("eliteReload", "Elite Reload Sailor", "reload", 13, 9),
        globalSailorType("eliteTorpedo", "Elite Torpedo Sailor", "torpedo", 13, 9),
        globalSailorType("eliteRepair", "Elite Repair Sailor", "repair", 13, 9, { specializedAbility: 30 }),
        globalSailorType("eliteRestore", "Elite Restore Sailor", "restore", 13, 9),
        globalSailorType("eliteEngine", "Elite Engine Sailor", "engine", 13, 9),
        globalSailorType("eliteFighter", "Elite Fighter Pilot", "fighter", 13, 9),
        globalSailorType("eliteBomber", "Elite Bomber Pilot", "bomber", 13, 9),
        globalSailorType("superElitePotential", "Super Elite Potential", "potential", 18, 10, { specializedAbility: 36 }),
        globalSailorType("superEliteAccuracy", "Super Elite Accuracy", "accuracy", 15, 10),
        globalSailorType("superEliteReload", "Super Elite Reload", "reload", 15, 10),
        globalSailorType("superEliteTorpedo", "Super Elite Torpedo", "torpedo", 15, 10),
        globalSailorType("superEliteRepair", "Super Elite Repair", "repair", 15, 10, { specializedAbility: 36 }),
        globalSailorType("superEliteRestore", "Super Elite Restore", "restore", 15, 10),
        globalSailorType("superEliteEngine", "Super Elite Engine", "engine", 15, 10),
        globalSailorType("superEliteFighter", "Super Elite Fighter", "fighter", 15, 10),
        globalSailorType("superEliteBomber", "Super Elite Bomber", "bomber", 15, 10),
        globalSailorType("advancedEliteAccuracy", "Advanced Elite Accuracy Lv12", "accuracy", 17, 10, { initialLevel: 12, baseAbility: 140, crewCount: 110 }),
        globalSailorType("advancedEliteReload", "Advanced Elite Reload Lv12", "reload", 17, 10, { initialLevel: 12, baseAbility: 140, crewCount: 110 }),
        globalSailorType("advancedEliteTorpedo", "Advanced Elite Torpedo Lv12", "torpedo", 17, 10, { initialLevel: 12, baseAbility: 140, crewCount: 110 }),
        globalSailorType("advancedEliteRepair", "Advanced Elite Repair Lv12", "repair", 17, 10, { initialLevel: 12, specializedAbility: 223, baseAbility: 140, crewCount: 110 }),
        globalSailorType("advancedEliteRestore", "Advanced Elite Restore Lv12", "restore", 17, 10, { initialLevel: 12, baseAbility: 140, crewCount: 110 }),
        globalSailorType("advancedEliteEngine", "Advanced Elite Engine Lv12", "engine", 17, 10, { initialLevel: 12, baseAbility: 140, crewCount: 110 }),
        globalSailorType("advancedEliteFighter", "Advanced Elite Fighter Lv12", "fighter", 17, 10, { initialLevel: 12, baseAbility: 140, crewCount: 110 }),
        globalSailorType("advancedEliteBomber", "Advanced Elite Bomber Lv12", "bomber", 17, 10, { initialLevel: 12, baseAbility: 140, crewCount: 110 }),
    ];
    const GLOBAL_KOREAN_NAMES = {
        normal: "일반 수병", nfXSailor: "NF X 수병 Lv12", advancedHero: "어드밴스드 히어로 수병 Lv12", heroSailor: "히어로 수병 Lv12",
        elitePotential: "엘리트 잠재 수병", eliteAccuracy: "엘리트 명중 수병", eliteReload: "엘리트 연사 수병", eliteTorpedo: "엘리트 어뢰 수병", eliteRepair: "엘리트 수리 수병", eliteRestore: "엘리트 보수 수병", eliteEngine: "엘리트 기관 수병", eliteFighter: "엘리트 전투기 조종사", eliteBomber: "엘리트 폭격기 조종사",
        superElitePotential: "슈퍼 엘리트 잠재 수병", superEliteAccuracy: "슈퍼 엘리트 명중 수병", superEliteReload: "슈퍼 엘리트 연사 수병", superEliteTorpedo: "슈퍼 엘리트 어뢰 수병", superEliteRepair: "슈퍼 엘리트 수리 수병", superEliteRestore: "슈퍼 엘리트 보수 수병", superEliteEngine: "슈퍼 엘리트 기관 수병", superEliteFighter: "슈퍼 엘리트 전투기 조종사", superEliteBomber: "슈퍼 엘리트 폭격기 조종사",
        advancedEliteAccuracy: "어드밴스드 엘리트 명중 수병 Lv12", advancedEliteReload: "어드밴스드 엘리트 연사 수병 Lv12", advancedEliteTorpedo: "어드밴스드 엘리트 어뢰 수병 Lv12", advancedEliteRepair: "어드밴스드 엘리트 수리 수병 Lv12", advancedEliteRestore: "어드밴스드 엘리트 보수 수병 Lv12", advancedEliteEngine: "어드밴스드 엘리트 기관 수병 Lv12", advancedEliteFighter: "어드밴스드 엘리트 전투기 조종사 Lv12", advancedEliteBomber: "어드밴스드 엘리트 폭격기 조종사 Lv12",
    };

    const el = (selector) => document.querySelector(selector);
    const serverSelect = el("#server");
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
    const targetMatrixHead = el("#target-matrix-head");
    const targetMatrixBody = el("#target-matrix-body");
    const pathTableBody = el("#path-table-body");
    const classChangeFlow = el("#class-change-flow");
    const numberFormatter = new Intl.NumberFormat("en-US");

    let selectedLanguage = "ko";
    let sailorCatalog = null;
    let catalogLoadState = "loading";
    let catalogLoadError = "";
    let allClassChangePaths = [];
    let sonarPaths = [];
    let lateStageSelections = [];
    let pathFilterMode = "final";
    let showCellDetails = true;
    let columnSettings = [];
    let lateLevels = [];

    const language = () => selectedLanguage;
    const t = () => TEXT[language()];
    const server = () => serverSelect.value;
    const maximumLevel = () => server() === "korea" ? 120 : 125;
    const veteranRateLimit = () => server() === "korea" ? 0.45 : 0.5;
    const availableSailorTypes = () => server() === "korea" ? KOREA_SAILOR_TYPES : GLOBAL_SAILOR_TYPES;
    const defaultSailorTypeId = () => server() === "korea" ? "premiumPotential" : "superElitePotential";
    const isKoreaNormalSailor = () => server() === "korea" && selectedSailorType()?.normalVariant;
    const lateClassChangeAllowed = () => !(server() === "korea" && selectedSailorType()?.event);

    function storedServer() {
        try {
            const value = localStorage.getItem(SERVER_STORAGE_KEY);
            return ["korea", "global"].includes(value) ? value : null;
        } catch { return null; }
    }
    function saveServer() {
        try { localStorage.setItem(SERVER_STORAGE_KEY, server()); } catch { /* selection still works */ }
    }
    function browserDefaultServer() {
        const locale = navigator.languages?.[0] || navigator.language || "";
        return /^ko(?:-|$)/i.test(locale) ? "korea" : "global";
    }
    function resetAxes() {
        const levels = server() === "korea" ? [80, 90, 100, 110, 120] : [80, 90, 100, 110, 125];
        columnSettings = levels.map((currentLevel) => ({ currentLevel }));
        lateLevels = [...levels];
    }
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
    function integerInRange(value, fallback, minimum = 0, maximum = maximumLevel()) {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? Math.min(maximum, Math.max(minimum, Math.floor(numeric))) : fallback;
    }
    function localizedNationName(nation) {
        return NATION_NAMES[language()]?.[Number(nation.id)] || nation.name;
    }
    function sailorTypeName(type) {
        if (language() === "ko") return type.ko || GLOBAL_KOREAN_NAMES[type.id] || type.en || type.id;
        return type.en || type.ko || type.id;
    }
    function buildPaths(sailors) {
        const byName = new Map(sailors.map((sailor) => [sailor.name, sailor]));
        const incoming = new Set(sailors.flatMap((sailor) => sailor.classChangeTargets || []));
        const paths = [];
        const walk = (sailor, path, visited) => {
            if (visited.has(sailor.name)) return;
            const nextPath = [...path, sailor];
            paths.push(nextPath);
            const nextVisited = new Set(visited).add(sailor.name);
            (sailor.classChangeTargets || []).map((name) => byName.get(name)).filter(Boolean)
                .forEach((target) => walk(target, nextPath, nextVisited));
        };
        sailors.filter((sailor) => !incoming.has(sailor.name)).forEach((root) => walk(root, [], new Set()));
        return paths;
    }
    function isSonarPath(path) {
        const name = String(path.at(-1)?.name || "").trim();
        return server() === "korea" ? /^음파 탐지(?:병|장|관)$/.test(name) : /^(?:2nd|1st|Chief) Sonarman$/i.test(name);
    }
    function pathIdentity(path) { return path.map((stage) => stage.name).join("\u0000"); }
    function isFinalClassChangePath(path) {
        return !allClassChangePaths.some((candidate) => candidate.length === path.length + 1
            && path.every((stage, index) => candidate[index]?.name === stage.name));
    }
    function filteredSonarPaths() {
        const paths = allClassChangePaths.filter(isSonarPath);
        return pathFilterMode === "all" ? paths : paths.filter(isFinalClassChangePath);
    }
    function selectedPath() {
        const index = Number(presetSelect.value);
        return presetSelect.value !== "" && Number.isInteger(index) ? sonarPaths[index] || null : null;
    }
    function selectedSailorType() {
        const types = availableSailorTypes();
        return types.find((type) => type.id === sailorTypeSelect.value)
            || types.find((type) => type.id === defaultSailorTypeId()) || types[0];
    }
    function pathLabel(path) {
        return `${path.at(-1)?.name || "Sonarman"} · ${path.map((stage) => `Lv.${stage.requiredLevel} ${stage.name}`).join(" > ")}`;
    }
    function appendPresetPathContent(container, path) {
        const finalClass = document.createElement("span");
        finalClass.className = "preset-path-class";
        finalClass.textContent = path.at(-1)?.name || "Sonarman";
        const route = document.createElement("span");
        route.className = "preset-path-route";
        route.textContent = path.map((stage) => `Lv.${stage.requiredLevel} ${stage.name}`).join(" > ");
        container.append(finalClass, route);
    }
    function updatePresetCustomSelection() {
        presetToggle.replaceChildren();
        const path = selectedPath();
        if (path) appendPresetPathContent(presetToggle, path);
        else {
            const placeholder = document.createElement("span");
            placeholder.className = "preset-custom-placeholder";
            placeholder.textContent = t().selectSonarPath;
            presetToggle.append(placeholder);
        }
        presetToggle.disabled = presetSelect.disabled;
        presetMenu.querySelectorAll(".preset-path-option").forEach((button) => button.classList.toggle("active", button.dataset.presetValue === presetSelect.value));
    }
    function renderPresetCustomDropdown() {
        presetMenu.replaceChildren();
        sonarPaths.forEach((path, index) => {
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
    function renderSailorTypes(preserveSelection = false) {
        const selected = preserveSelection ? sailorTypeSelect.value : defaultSailorTypeId();
        const types = availableSailorTypes();
        sailorTypeSelect.replaceChildren(...types.map((type) => option(type.id, sailorTypeName(type))));
        sailorTypeSelect.value = types.some((type) => type.id === selected) ? selected : defaultSailorTypeId();
    }
    function renderEnhancementOptions(preserveSelection = true) {
        const defaultSelection = server() === "global"
            ? "all:20"
            : isKoreaNormalSailor()
                ? "repair:2"
                : "potential:1";
        const selected = preserveSelection ? enhancementSelect.value : defaultSelection;
        enhancementSelect.replaceChildren(option("none", t().none));
        if (server() === "global") {
            enhancementSelect.append(option("all:20", t().boost20));
        } else {
            enhancementSelect.append(option("potential:1", t().potentialPlus1));
            if (isKoreaNormalSailor()) enhancementSelect.append(option("potential:2", t().potentialPlus2));
            enhancementSelect.append(option("repair:1", t().repairPlus1));
            if (isKoreaNormalSailor()) enhancementSelect.append(option("repair:2", t().repairPlus2));
        }
        enhancementSelect.value = [...enhancementSelect.options].some((item) => item.value === selected)
            ? selected
            : defaultSelection;
    }
    function enhancementLabel() {
        return enhancementSelect.options[enhancementSelect.selectedIndex]?.textContent || t().none;
    }
    function renderVeteranPresets() {
        const counts = server() === "korea" ? [100, 180, 250, 300] : [100, 150, 200, 250, 300];
        const wrap = el("#veteran-presets");
        wrap.replaceChildren();
        counts.forEach((count) => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-secondary";
            button.type = "button";
            button.dataset.veteranPreset = String(count);
            button.textContent = String(count);
            button.addEventListener("click", () => {
                veteranCountInput.value = String(count);
                updateVeteranPresetButtons();
                renderMatrix();
            });
            wrap.append(button);
        });
        updateVeteranPresetButtons();
    }
    function updateVeteranPresetButtons() {
        const count = integerInRange(veteranCountInput.value, server() === "korea" ? 180 : 150, 0, 9999);
        document.querySelectorAll("[data-veteran-preset]").forEach((button) => {
            const active = Number(button.dataset.veteranPreset) === count;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }
    function updatePathFilterButtons() {
        document.querySelectorAll("[data-path-filter]").forEach((button) => {
            const active = button.dataset.pathFilter === pathFilterMode;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }
    function renderNations() {
        const nations = sailorCatalog?.servers?.[server()]?.nations || [];
        nationSelect.replaceChildren(option("", t().selectNation));
        nations.forEach((nation) => nationSelect.append(option(String(nation.id), localizedNationName(nation))));
        nationSelect.disabled = nations.length === 0;
        nationSelect.classList.toggle("selection-required", !nationSelect.value && !nationSelect.disabled);
    }
    function renderPresets(preserveSelection = false) {
        const previousIdentity = preserveSelection && selectedPath() ? pathIdentity(selectedPath()) : null;
        const selectedNation = sailorCatalog?.servers?.[server()]?.nations
            ?.find((nation) => Number(nation.id) === Number(nationSelect.value));
        nationSelect.classList.toggle("selection-required", !nationSelect.value && !nationSelect.disabled);
        presetSelect.replaceChildren(option("", t().selectSonarPath));
        allClassChangePaths = [];
        sonarPaths = [];
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
        allClassChangePaths = buildPaths(selectedNation.sailors.filter((sailor) => Number(sailor.requiredLevel) > 0));
        sonarPaths = filteredSonarPaths();
        sonarPaths.forEach((path, index) => presetSelect.append(option(String(index), pathLabel(path))));
        presetSelect.disabled = sonarPaths.length === 0;
        if (sonarPaths.length === 0) {
            renderPresetCustomDropdown();
            setStatus(t().noSonarPath, "warning");
            return;
        }
        const preservedIndex = previousIdentity === null ? -1 : sonarPaths.findIndex((path) => pathIdentity(path) === previousIdentity);
        let bestIndex = preservedIndex >= 0 ? preservedIndex : 0;
        if (preservedIndex < 0) {
            sonarPaths.forEach((path, index) => {
                const score = path.reduce((sum, stage) => sum + Number(stage.abilities?.potential || 0), 0);
                const bestScore = sonarPaths[bestIndex].reduce((sum, stage) => sum + Number(stage.abilities?.potential || 0), 0);
                if (score > bestScore) bestIndex = index;
            });
        }
        presetSelect.value = String(bestIndex);
        renderPresetCustomDropdown();
        setStatus("");
        renderSelectedPath();
    }
    function setPathFilterMode(mode) {
        if (!['all', 'final'].includes(mode) || mode === pathFilterMode) return;
        pathFilterMode = mode;
        updatePathFilterButtons();
        renderPresets(true);
    }
    function signedValue(value) {
        const numeric = Number(value) || 0;
        return numeric > 0 ? `+${numeric}` : String(numeric);
    }
    function sailorStageIndex(path) {
        return path.findIndex((stage) => /^(?:수병|sailor)$/i.test(String(stage.name).trim()) && Number(stage.requiredLevel) === 12);
    }
    function isSupportSailorStage(stage) {
        return /^(?:보조병|Support Sailor)$/i.test(String(stage?.name || "").trim());
    }
    function defaultLateStageSelections(path) {
        if (!lateClassChangeAllowed()) return path.map(() => false);
        const baseIndex = sailorStageIndex(path);
        return path.map((stage, index) => index > baseIndex && !isSupportSailorStage(stage));
    }
    function firstClassAfterSailorIndex(path) { return Math.max(0, sailorStageIndex(path) + 1); }
    function effectiveLateLevel(path, index, lateLevel) {
        const required = Number(path[index].requiredLevel) || 1;
        if (!lateStageSelections[index]) return required;
        const cappedLateLevel = server() === "korea" && index === firstClassAfterSailorIndex(path) ? Math.min(lateLevel, 25) : lateLevel;
        return Math.max(required, cappedLateLevel);
    }
    function renderPathTable(path) {
        pathTableBody.replaceChildren();
        path.forEach((stage, index) => {
            const row = document.createElement("tr");
            row.classList.toggle("path-stage-late", Boolean(lateStageSelections[index]));
            const values = [String(index + 1), stage.name, String(stage.requiredLevel)];
            values.forEach((value) => { const cell = document.createElement("td"); cell.textContent = value; row.append(cell); });
            const actualCell = document.createElement("td");
            actualCell.textContent = lateStageSelections[index] ? t().matrixLateLevel : String(stage.requiredLevel);
            const lateCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.className = "form-check-input";
            checkbox.type = "checkbox";
            checkbox.checked = Boolean(lateStageSelections[index]);
            checkbox.disabled = !lateClassChangeAllowed();
            checkbox.setAttribute("aria-label", t().lateClassChangeAria(stage.name));
            if (checkbox.disabled) checkbox.title = t().eventLateUnavailable;
            checkbox.addEventListener("change", () => {
                lateStageSelections[index] = checkbox.checked;
                row.classList.toggle("path-stage-late", checkbox.checked);
                actualCell.textContent = checkbox.checked ? t().matrixLateLevel : String(stage.requiredLevel);
                renderClassChangeFlow(path);
                renderMatrix();
            });
            lateCell.append(checkbox);
            const crewCell = document.createElement("td");
            crewCell.textContent = String(stage.crewGrowth);
            row.append(actualCell, lateCell, crewCell);
            PATH_ABILITY_COLUMNS.forEach((key) => {
                const cell = document.createElement("td");
                cell.textContent = signedValue(stage.abilities?.[key]);
                row.append(cell);
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
                ? (server() === "korea" && index === firstClassAfterSailorIndex(path) ? t().koreaFirstLateFlow(stage.requiredLevel) : t().lateFlow(stage.requiredLevel))
                : t().classChangeFlow(stage.requiredLevel);
            node.append(name, level);
            classChangeFlow.append(node);
        });
    }
    function renderSelectedPath() {
        const path = selectedPath();
        if (!path) {
            lateStageSelections = [];
            pathSection.hidden = true;
            matrixSection.hidden = true;
            return;
        }
        lateStageSelections = defaultLateStageSelections(path);
        renderPathTable(path);
        renderClassChangeFlow(path);
        pathSection.hidden = false;
        matrixSection.hidden = false;
        renderMatrix();
    }
    function applyClassChange(state, stage) {
        state.potentialGrowth += Number(stage.abilities?.potential || 0);
        state.repairGrowth += Number(stage.abilities?.repair || 0);
        state.crewGrowth = Number(stage.crewGrowth) || state.crewGrowth;
        state.potentialAbility += Number(stage.bonusAbilities?.potential || 0);
        state.repairAbility += Number(stage.bonusAbilities?.repair || 0);
    }
    function calculateSailor(path, currentLevel, lateLevel, enhanced) {
        const type = selectedSailorType();
        const state = {
            potentialGrowth: type.potentialGrowth, potentialAbility: type.potentialAbility,
            repairGrowth: type.repairGrowth, repairAbility: type.repairAbility,
            crewGrowth: type.crewGrowth, crewCount: type.crewCount,
        };
        const [enhancedAbility, enhancedAmount] = enhancementSelect.value.split(":");
        if (enhancedAbility === "potential" || enhancedAbility === "repair") {
            state[`${enhancedAbility}Growth`] += Number(enhancedAmount) || 0;
            state[`${enhancedAbility}Ability`] += Number(enhancedAmount) || 0;
        }
        let previousActualLevel = 1;
        const scheduledStages = path.map((stage, index) => {
            const selectedLevel = effectiveLateLevel(path, index, lateLevel);
            const actualLevel = Math.max(previousActualLevel, selectedLevel);
            previousActualLevel = actualLevel;
            return { stage, actualLevel };
        });
        let classChangeIndex = 0;
        while (classChangeIndex < scheduledStages.length && scheduledStages[classChangeIndex].actualLevel <= type.initialLevel) {
            applyClassChange(state, scheduledStages[classChangeIndex].stage);
            classChangeIndex += 1;
        }
        for (let nextLevel = type.initialLevel + 1; nextLevel <= currentLevel; nextLevel += 1) {
            state.potentialAbility += state.potentialGrowth;
            state.repairAbility += state.repairGrowth;
            state.crewCount += state.crewGrowth;
            while (classChangeIndex < scheduledStages.length && scheduledStages[classChangeIndex].actualLevel === nextLevel) {
                applyClassChange(state, scheduledStages[classChangeIndex].stage);
                classChangeIndex += 1;
            }
        }
        state.potentialAbility = Math.max(0, state.potentialAbility);
        state.repairAbility = Math.max(0, state.repairAbility);
        state.crewCount = Math.max(1, state.crewCount);
        if (enhanced) {
            state.potentialAbility = Math.floor(state.potentialAbility / 9 * 11);
            state.repairAbility = Math.floor(state.repairAbility / 9 * 11);
        }
        return state;
    }
    function hasUnavailableLateLevel(path, currentLevel, lateLevel) {
        return path.some((stage, index) => lateStageSelections[index] && effectiveLateLevel(path, index, lateLevel) > currentLevel);
    }
    function mixColor(left, right, ratio) {
        const safe = Math.min(1, Math.max(0, ratio));
        return `rgb(${left.map((value, index) => Math.round(value + (right[index] - value) * safe)).join(", ")})`;
    }
    function progressColor(progress) {
        const safe = Math.min(100, Math.max(0, progress));
        return safe <= 50 ? mixColor([248,212,212], [255,240,184], safe / 50) : mixColor([255,240,184], [212,242,217], (safe - 50) / 50);
    }
    function repairSpeedTextColor(ratio) {
        const safe = Math.min(1, Math.max(0, ratio));
        return safe <= .5 ? mixColor([176,42,55], [145,105,0], safe * 2) : mixColor([145,105,0], [21,98,53], (safe - .5) * 2);
    }
    function applyRepairSpeedTextColors(root) {
        const elements = [...root.querySelectorAll(".cap-repair-speed[data-repair-speed]")];
        const speeds = elements.map((item) => Number(item.dataset.repairSpeed));
        if (!speeds.length) return;
        const minimum = Math.min(...speeds), maximum = Math.max(...speeds);
        elements.forEach((item) => { item.style.color = maximum === minimum ? "#3f4d57" : repairSpeedTextColor((Number(item.dataset.repairSpeed) - minimum) / (maximum - minimum)); });
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
        const toggle = document.createElement("label");
        toggle.className = "matrix-details-toggle";
        const checkbox = document.createElement("input");
        checkbox.className = "form-check-input";
        checkbox.type = "checkbox";
        checkbox.checked = showCellDetails;
        checkbox.setAttribute("aria-label", t().detailsAria);
        checkbox.addEventListener("change", () => { showCellDetails = checkbox.checked; matrixBody.classList.toggle("show-cell-details", showCellDetails); });
        toggle.append(checkbox, document.createTextNode(t().details));
        corner.append(toggle);
        row.append(corner);
        columnSettings.forEach((setting, index) => {
            const heading = document.createElement("th");
            heading.scope = "col";
            const label = document.createElement("span");
            label.className = "axis-title";
            label.textContent = t().currentLevel;
            const control = document.createElement("div");
            control.className = "axis-control";
            control.append(createNumberInput({ value: setting.currentLevel, minimum: 1, maximum: maximumLevel(), label: t().columnAria(index + 1), onChange: (value) => { setting.currentLevel = value; renderMatrix(); } }));
            heading.append(label, control);
            row.append(heading);
        });
        matrixHead.replaceChildren(row);
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
    function calculatePersonnelPerformance(sailor, veteranCount) {
        const experts = sailor.crewCount - veteranCount;
        const condition = { veterans: veteranCount, experts, rookies: 0, seamanAdjustmentPercent: 0 };
        const potentialStages = calculateAbilityStages({ server: server(), ability: sailor.potentialAbility, crewCount: sailor.crewCount, condition, applySeamanAdjustment: false });
        const sonarResult = calculateSonarPerformance(potentialStages.seamanAdjAbility);
        const repairStages = calculateAbilityStages({ server: server(), ability: sailor.repairAbility, crewCount: sailor.crewCount, condition, applySeamanAdjustment: false });
        const repairResult = calculateRepairAndStructuralDefense(server(), { repair: repairStages.seamanAdjAbility, restore: 0 });
        return { veteranCount, experts, potentialStages, sonarResult, repairResult };
    }
    function resultCell(path, currentLevel, lateLevel, veteranCount) {
        const type = selectedSailorType();
        if (currentLevel < type.initialLevel) return unavailableCell(t().startsAt(sailorTypeName(type), type.initialLevel));
        if (hasUnavailableLateLevel(path, currentLevel, lateLevel)) return unavailableCell(t().lateExceedsCurrent(lateLevel, currentLevel));
        const sailor = calculateSailor(path, currentLevel, lateLevel, enhancementSelect.value === "all:20");
        const maximumVeterans = Math.floor(sailor.crewCount * veteranRateLimit());
        if (veteranCount > maximumVeterans) return unavailableCell(t().veteranMaximum(maximumVeterans, veteranCount));
        const calculated = calculatePersonnelPerformance(sailor, veteranCount);
        const range = Number(calculated.sonarResult.sonarSailorRangePercent) || 0;
        const cell = document.createElement("td");
        cell.className = "cap-cell";
        cell.style.backgroundColor = progressColor(range);
        const value = document.createElement("span");
        value.className = `cap-progress${range >= 100 ? " cap-reached" : ""}`;
        value.textContent = `${range.toFixed(1)}%`;
        const potentialDetail = document.createElement("span");
        potentialDetail.className = "cap-detail cap-extra-detail";
        potentialDetail.textContent = `${t().potentialAbility} ${numberFormatter.format(sailor.potentialAbility)}`;
        const repairSpeed = document.createElement("span");
        repairSpeed.className = "cap-detail cap-repair-speed";
        repairSpeed.dataset.repairSpeed = String(calculated.repairResult.repairSpeedPerSecond);
        repairSpeed.textContent = `${calculated.repairResult.repairSpeedPerSecond.toFixed(1)}/s`;
        const personnel = document.createElement("span");
        personnel.className = "cap-detail cap-extra-detail";
        personnel.textContent = `${t().veterans} ${numberFormatter.format(veteranCount)} · ${t().experts} ${numberFormatter.format(calculated.experts)}`;
        cell.title = `${t().sonarRange} ${range.toFixed(1)}%, ${t().sonarAppliedAbility} ${Math.floor(calculated.potentialStages.seamanAdjAbility)} / ${t().sonarAbilityCap} ${SONAR_ABILITY_CAP}, ${t().crew} ${sailor.crewCount}`;
        cell.append(value, potentialDetail, repairSpeed, personnel);
        return cell;
    }
    function findMinimumVeteransForFullRange(sailor) {
        const maximumVeterans = Math.floor(sailor.crewCount * veteranRateLimit());
        const maximumResult = calculatePersonnelPerformance(sailor, maximumVeterans);
        if (Number(maximumResult.sonarResult.sonarSailorRangePercent) < 100) return { reached: false };
        let minimum = 0, maximum = maximumVeterans;
        while (minimum < maximum) {
            const middle = Math.floor((minimum + maximum) / 2);
            const result = calculatePersonnelPerformance(sailor, middle);
            if (Number(result.sonarResult.sonarSailorRangePercent) >= 100) maximum = middle;
            else minimum = middle + 1;
        }
        return { reached: true, result: calculatePersonnelPerformance(sailor, minimum) };
    }
    function targetResultCell(path, currentLevel, lateLevel) {
        const type = selectedSailorType();
        if (currentLevel < type.initialLevel) return unavailableCell(t().startsAt(sailorTypeName(type), type.initialLevel));
        if (hasUnavailableLateLevel(path, currentLevel, lateLevel)) return unavailableCell(t().lateExceedsCurrent(lateLevel, currentLevel));
        const sailor = calculateSailor(path, currentLevel, lateLevel, enhancementSelect.value === "all:20");
        const minimum = findMinimumVeteransForFullRange(sailor);
        if (!minimum.reached) return unavailableCell(t().veteranLimitExceeded);
        const calculated = minimum.result;
        const cell = document.createElement("td");
        cell.className = "cap-cell target-cell";
        const veterans = document.createElement("span");
        veterans.className = "cap-progress cap-reached";
        veterans.textContent = `${t().minimumVeterans} ${numberFormatter.format(calculated.veteranCount)}`;
        const repairSpeed = document.createElement("span");
        repairSpeed.className = "cap-detail cap-repair-speed";
        repairSpeed.dataset.repairSpeed = String(calculated.repairResult.repairSpeedPerSecond);
        repairSpeed.textContent = `${calculated.repairResult.repairSpeedPerSecond.toFixed(1)}/s`;
        cell.title = `${t().sonarAppliedAbility} ${Math.floor(calculated.potentialStages.seamanAdjAbility)} / ${SONAR_ABILITY_CAP}, ${t().crew} ${sailor.crewCount}, ${t().veterans} ${calculated.veteranCount}, ${t().experts} ${calculated.experts}`;
        cell.append(veterans, repairSpeed);
        return cell;
    }
    function renderMatrixBody() {
        const path = selectedPath();
        matrixBody.replaceChildren();
        if (!path) return;
        const veteranCount = integerInRange(veteranCountInput.value, server() === "korea" ? 180 : 150, 0, 9999);
        lateLevels.forEach((lateLevel, rowIndex) => {
            const row = document.createElement("tr");
            const heading = document.createElement("th");
            heading.scope = "row";
            const label = document.createElement("span");
            label.className = "axis-title";
            label.textContent = t().lateLevel;
            const control = document.createElement("div");
            control.className = "axis-control justify-content-start";
            control.append(createNumberInput({ value: lateLevel, minimum: 1, maximum: maximumLevel(), label: t().rowAria(rowIndex + 1), onChange: (value) => { lateLevels[rowIndex] = value; renderMatrix(); } }));
            heading.append(label, control);
            row.append(heading);
            columnSettings.forEach((setting) => row.append(resultCell(path, setting.currentLevel, lateLevel, veteranCount)));
            matrixBody.append(row);
        });
        matrixBody.classList.toggle("show-cell-details", showCellDetails);
        applyRepairSpeedTextColors(matrixBody);
    }
    function renderTargetMatrixHead() {
        const row = document.createElement("tr");
        const corner = document.createElement("th");
        corner.scope = "col";
        corner.innerHTML = `<span class="matrix-corner-title">${t().targetCornerTitle}</span>`;
        row.append(corner);
        columnSettings.forEach((setting) => {
            const heading = document.createElement("th");
            heading.scope = "col";
            heading.innerHTML = `<span class="axis-title">${t().currentLevel}</span><span class="cap-detail">Lv.${setting.currentLevel}</span>`;
            row.append(heading);
        });
        targetMatrixHead.replaceChildren(row);
    }
    function renderTargetMatrixBody() {
        const path = selectedPath();
        targetMatrixBody.replaceChildren();
        if (!path) return;
        lateLevels.forEach((lateLevel) => {
            const row = document.createElement("tr");
            const heading = document.createElement("th");
            heading.scope = "row";
            heading.innerHTML = `<span class="axis-title">${t().lateLevel}</span><span class="cap-detail">Lv.${lateLevel}</span>`;
            row.append(heading);
            columnSettings.forEach((setting) => row.append(targetResultCell(path, setting.currentLevel, lateLevel)));
            targetMatrixBody.append(row);
        });
        applyRepairSpeedTextColors(targetMatrixBody);
    }
    function renderMatrixSummary(path) {
        const summary = el("#matrix-summary");
        summary.replaceChildren();
        const items = [
            [t().summaryServer, server() === "korea" ? t().koreaServer : t().globalServer],
            [t().summaryNation, nationSelect.options[nationSelect.selectedIndex]?.textContent || "-"],
            [t().summaryClass, path.at(-1)?.name || "Sonarman"],
            [t().summarySailor, sailorTypeName(selectedSailorType())],
            [t().summaryEnhancement, enhancementLabel()],
        ];
        items.forEach(([labelText, valueText]) => {
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
    function renderMatrix() {
        const path = selectedPath();
        if (!path) return;
        renderMatrixHead();
        renderMatrixBody();
        renderTargetMatrixHead();
        renderTargetMatrixBody();
        renderMatrixSummary(path);
    }
    function updateServerBadge() {
        const serverName = server() === "korea" ? t().koreaServer : t().globalServer;
        el('[data-i18n="serverBadge"]').textContent = `${t().languageName} · ${serverName}`;
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
        const selectedServer = server();
        serverSelect.replaceChildren(option("korea", t().koreaServer), option("global", t().globalServer));
        serverSelect.value = selectedServer;
        updateServerBadge();
        renderSailorTypes(true);
        renderEnhancementOptions(true);
        if (sailorCatalog) {
            const selectedNation = nationSelect.value;
            renderNations();
            nationSelect.value = selectedNation;
            nationSelect.classList.toggle("selection-required", !nationSelect.value);
        } else if (nationSelect.options.length) {
            const failed = catalogLoadState === "error";
            nationSelect.options[0].textContent = failed ? t().catalogUnavailable : t().loadingNations;
            setStatus(failed ? `${t().loadFailed}: ${catalogLoadError}` : t().loadingCatalog, failed ? "danger" : "secondary");
        }
        if (presetSelect.options.length && presetSelect.options[0].value === "") presetSelect.options[0].textContent = t().selectSonarPath;
        renderPresetCustomDropdown();
        const path = selectedPath();
        if (path) {
            renderPathTable(path);
            renderClassChangeFlow(path);
            renderMatrix();
        } else if (sailorCatalog && nationSelect.value && sonarPaths.length === 0) setStatus(t().noSonarPath, "warning");
    }
    function setLanguage(nextLanguage) {
        if (!["ko", "en"].includes(nextLanguage) || nextLanguage === language()) return;
        selectedLanguage = nextLanguage;
        applyLanguage();
    }
    function changeServer() {
        saveServer();
        updateServerBadge();
        resetAxes();
        veteranCountInput.value = server() === "korea" ? "180" : "150";
        renderVeteranPresets();
        renderSailorTypes(false);
        renderEnhancementOptions(false);
        renderNations();
        renderPresets(false);
    }
    function changeSailorType() {
        renderEnhancementOptions(false);
        const path = selectedPath();
        if (!path) return;
        lateStageSelections = defaultLateStageSelections(path);
        renderPathTable(path);
        renderClassChangeFlow(path);
        renderMatrix();
    }
    async function loadCatalog() {
        const apiBase = document.querySelector('meta[name="sailor-api-base"]')?.content.replace(/\/$/, "") || "";
        try {
            const response = await fetch(`${apiBase}/catalog/sailor-catalog.json?v=${encodeURIComponent(CATALOG_VERSION)}`, { cache: "default" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const loaded = await response.json();
            if (loaded.schemaVersion !== CATALOG_SCHEMA) throw new Error(`Expected schema ${CATALOG_SCHEMA}, received ${loaded.schemaVersion || "unversioned"}`);
            if (loaded.catalogVersion !== CATALOG_VERSION) throw new Error(`Expected catalog ${CATALOG_VERSION}, received ${loaded.catalogVersion || "unversioned"}`);
            if (!loaded.servers?.korea?.nations || !loaded.servers?.global?.nations) throw new Error("Korea or Global sailor catalog is unavailable");
            sailorCatalog = loaded;
            catalogLoadState = "loaded";
            renderNations();
            setStatus("");
        } catch (error) {
            console.error(error);
            catalogLoadState = "error";
            catalogLoadError = error.message;
            nationSelect.replaceChildren(option("", t().catalogUnavailable));
            nationSelect.disabled = true;
            presetSelect.disabled = true;
            renderPresetCustomDropdown();
            setStatus(`${t().loadFailed}: ${error.message}`, "danger");
        }
    }

    serverSelect.value = storedServer() || browserDefaultServer();
    selectedLanguage = server() === "korea" ? "ko" : "en";
    resetAxes();
    veteranCountInput.value = server() === "korea" ? "180" : "150";
    serverSelect.addEventListener("change", changeServer);
    nationSelect.addEventListener("change", () => renderPresets(false));
    presetSelect.addEventListener("change", () => { updatePresetCustomSelection(); renderSelectedPath(); });
    document.querySelectorAll("[data-path-filter]").forEach((button) => button.addEventListener("click", () => setPathFilterMode(button.dataset.pathFilter)));
    document.querySelectorAll("#cap-language-switch [data-language]").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
    sailorTypeSelect.addEventListener("change", changeSailorType);
    enhancementSelect.addEventListener("change", renderMatrix);
    veteranCountInput.addEventListener("input", updateVeteranPresetButtons);
    veteranCountInput.addEventListener("change", () => {
        veteranCountInput.value = String(integerInRange(veteranCountInput.value, server() === "korea" ? 180 : 150, 0, 9999));
        updateVeteranPresetButtons();
        renderMatrix();
    });
    applyLanguage();
    renderVeteranPresets();
    renderSailorTypes(false);
    renderEnhancementOptions(false);
    updatePathFilterButtons();
    loadCatalog();
})();
