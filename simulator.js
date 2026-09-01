(() => {
    "use strict";
    const ABILITIES = [
        ["potential", "잠재", "Potential"], ["accuracy", "명중", "Accuracy"], ["reload", "연사", "Reload"],
        ["torpedo", "어뢰", "Torpedo"], ["antiAir", "대공", "Anti-air"], ["repair", "수리", "Repair"],
        ["restore", "보수", "Restore"], ["engine", "기관", "Engine"], ["aircraft", "함재", "Aircraft"],
        ["fighter", "전투", "Fighter"], ["bomber", "폭격", "Bomber"], ["crewGrowth", "수병수", "Crew"],
    ];
    const DECK_CORRECTION_ABILITIES = ABILITIES.slice(0, -1);
    const NATIONS = {
        korea: [
            [1, "미국"], [2, "영국"], [3, "일본"], [4, "독일"],
            [5, "프랑스"], [6, "소련"], [7, "이탈리아"],
        ],
        global: [
            [1, "United States"], [2, "United Kingdom"], [3, "Japan"], [4, "Germany"],
            [5, "France"], [6, "Soviet Union"], [7, "Italy"], [8, "China"],
        ],
    };
    function growthValues(base, overrides = {}) {
        return Object.fromEntries(ABILITIES.slice(0, -1).map(([key]) => [key, overrides[key] ?? base]));
    }
    function level12Totals(base, overrides = {}) {
        return { ...growthValues(base, overrides), crewGrowth: 110 };
    }
    function eliteType(id, name, key, base, specialized, paired = base) {
        const overrides = { [key]: specialized };
        if (key === "accuracy") overrides.reload = paired;
        if (key === "reload") overrides.accuracy = paired;
        return { id, en: name, growth: growthValues(base, overrides), total: { [key]: 30 } };
    }
    function advancedEliteType(id, name, key, specialized) {
        const sailor = eliteType(id, name, key, 10, specialized);
        sailor.initialLevel = 12;
        sailor.total = level12Totals(140, { [key]: 223 });
        return sailor;
    }
    const KOREA_SAILOR_TYPES = [
        { id: "normal", ko: "일반 수병", en: "Normal sailor" },
        { id: "attendance", ko: "개근 수병 Lv90", en: "Attendance event sailor Lv90", event: true, level: 90, growth: { accuracy: 14, reload: 14 }, total: { accuracy: 30, reload: 30 } },
        { id: "legendSupport", ko: "전설 보조 수병 Lv90", en: "Legendary support sailor Lv90", event: true, level: 90, growth: { repair: 14, restore: 14, engine: 14 }, total: { repair: 30, restore: 30, engine: 30 } },
        { id: "legendSpecial", ko: "전설 특무 수병 Lv90", en: "Legendary special sailor Lv90", event: true, level: 90, growth: { aircraft: 14, fighter: 14, bomber: 14 }, total: { aircraft: 30, fighter: 30, bomber: 30 } },
        { id: "premiumPotential", ko: "프리미엄 잠재 수병 Lv12", en: "Premium potential sailor Lv12", growth: { potential: 17 }, total: { potential: 30 } },
        { id: "premiumAccuracy", ko: "프리미엄 명중 수병 Lv12", en: "Premium accuracy sailor Lv12", growth: { accuracy: 14, reload: 11 }, total: { accuracy: 30, reload: 30 } },
        { id: "premiumReload", ko: "프리미엄 연사 수병 Lv12", en: "Premium reload sailor Lv12", growth: { accuracy: 11, reload: 14 }, total: { accuracy: 30, reload: 30 } },
        { id: "premiumTorpedo", ko: "프리미엄 어뢰 수병 Lv12", en: "Premium torpedo sailor Lv12", growth: { torpedo: 14 }, total: { torpedo: 30 } },
        { id: "premiumRepair", ko: "프리미엄 수리 수병 Lv12", en: "Premium repair sailor Lv12", growth: { repair: 14 }, total: { repair: 30 } },
        { id: "premiumRestore", ko: "프리미엄 보수 수병 Lv12", en: "Premium restore sailor Lv12", growth: { restore: 14 }, total: { restore: 30 } },
        { id: "premiumEngine", ko: "프리미엄 기관 수병 Lv12", en: "Premium engine sailor Lv12", growth: { engine: 14 }, total: { engine: 30 } },
        { id: "premiumFighter", ko: "프리미엄 전투 수병 Lv12", en: "Premium fighter sailor Lv12", growth: { fighter: 14 }, total: { fighter: 30 } },
        { id: "premiumBomber", ko: "프리미엄 폭격 수병 Lv12", en: "Premium bomber sailor Lv12", growth: { bomber: 14 }, total: { bomber: 30 } },
    ];
    const GLOBAL_SAILOR_TYPES = [
        { id: "normal", en: "Normal sailor" },
        { id: "nfXSailor", en: "NF X Sailor Lv12", initialLevel: 12, growth: growthValues(18), total: level12Totals(251), source: "https://www.navyfield.com/Store/View.aspx?num=333&category=C&page=1" },
        { id: "advancedHero", en: "Advanced Hero Sailor Lv12", initialLevel: 12, growth: growthValues(16), total: level12Totals(212), source: "https://www.navyfield.com/Store/View.aspx?num=400&category=C&page=1" },
        { id: "heroSailor", en: "Hero Sailor Lv12", initialLevel: 12, growth: growthValues(14), total: level12Totals(184) },
        eliteType("elitePotential", "Elite Potential Sailor", "potential", 9, 16),
        eliteType("eliteAccuracy", "Elite Accuracy Sailor", "accuracy", 9, 13, 11),
        eliteType("eliteReload", "Elite Reload Sailor", "reload", 9, 13, 11),
        eliteType("eliteTorpedo", "Elite Torpedo Sailor", "torpedo", 9, 13),
        eliteType("eliteRepair", "Elite Repair Sailor", "repair", 9, 13),
        eliteType("eliteRestore", "Elite Restore Sailor", "restore", 9, 13),
        eliteType("eliteEngine", "Elite Engine Sailor", "engine", 9, 13),
        eliteType("eliteFighter", "Elite Fighter Pilot", "fighter", 9, 13),
        eliteType("eliteBomber", "Elite Bomber Pilot", "bomber", 9, 13),
        eliteType("superElitePotential", "Super Elite Potential", "potential", 10, 18),
        eliteType("superEliteAccuracy", "Super Elite Accuracy", "accuracy", 10, 15, 12),
        eliteType("superEliteReload", "Super Elite Reload", "reload", 10, 15, 12),
        eliteType("superEliteTorpedo", "Super Elite Torpedo", "torpedo", 10, 15),
        eliteType("superEliteRepair", "Super Elite Repair", "repair", 10, 15),
        eliteType("superEliteRestore", "Super Elite Restore", "restore", 10, 15),
        eliteType("superEliteEngine", "Super Elite Engine", "engine", 10, 15),
        eliteType("superEliteFighter", "Super Elite Fighter", "fighter", 10, 15),
        eliteType("superEliteBomber", "Super Elite Bomber", "bomber", 10, 15),
        advancedEliteType("advancedEliteAccuracy", "Advanced Elite Accuracy Lv12", "accuracy", 17),
        advancedEliteType("advancedEliteReload", "Advanced Elite Reload Lv12", "reload", 17),
        advancedEliteType("advancedEliteTorpedo", "Advanced Elite Torpedo Lv12", "torpedo", 17),
        advancedEliteType("advancedEliteRepair", "Advanced Elite Repair Lv12", "repair", 17),
        advancedEliteType("advancedEliteRestore", "Advanced Elite Restore Lv12", "restore", 17),
        advancedEliteType("advancedEliteEngine", "Advanced Elite Engine Lv12", "engine", 17),
        advancedEliteType("advancedEliteFighter", "Advanced Elite Fighter Lv12", "fighter", 17),
        advancedEliteType("advancedEliteBomber", "Advanced Elite Bomber Lv12", "bomber", 17),
    ];
    const TEXT = {
        ko: {
            subtitle: "수병 전직 정보를 기반으로 현재 레벨의 성장 어빌리티와 누적 어빌리티를 계산합니다.", settingsTitle: "수병 설정", serverHelp: "Global server users: select “Global server”.",
            server: "서버", nation: "국가", preset: "전직 트리 프리셋", level: "현재 레벨", sailorType: "수병 프리셋", boost: "수병 강화 아이템",
            growthInput: "초기 성장 어빌리티", totalInput: "초기 누적 어빌리티", hiddenInput: (level) => `히든 어빌리티 (Lv1 ~ Lv${level})`, abilityHelp: "수병 종류를 선택하면 초기값이 자동 입력됩니다. 수병수는 기본값을 표시하며 직접 입력할 수 없습니다.",
            hiddenHelp: "히든 어빌리티는 수병명 끝에 표시된 레벨까지 실제로 적용된 성장값입니다. 누적 보정값은 (히든 어빌리티 - 초기 성장 어빌리티) × (표시 레벨 - 1)이며, 현재 레벨이 표시 레벨보다 낮으면 반영하지 않습니다.",
            nationPlaceholder: "국가를 선택하세요", presetPlaceholder: "전직 트리를 선택하세요", none: "강화 없음", boost20: "전체 20% 강화",
            plus1: "1강", plus2: "2강", loading: "국가별 시뮬레이터 카탈로그를 불러오는 중…", unknownResponse: "알 수 없는 API 응답 형식입니다.",
            loaded: (count) => `${count}개 병종을 불러왔습니다. 국가를 선택하세요.`, loadError: (message) => `시뮬레이터 카탈로그를 불러오지 못했습니다: ${message}`,
            paths: (count) => `${count}개 전직 프리셋을 구성했습니다.`, complete: "계산이 완료되었습니다.", treeTitle: "적용 전직 트리",
            promotionHelp: "실제 전직 Lv을 모두 비우면 전직 가능 Lv을 적용합니다. 하나라도 입력하면 빈 단계부터 전직하지 않은 것으로 계산합니다.",
            promotionBulkLabel: "실제 전직 Lv. 일괄 입력", promotionBulkApply: "적용", promotionBulkPlaceholder: "예: 25",
            promotionBulkHelp: "입력한 하나의 레벨을 수병 다음인 2단계부터 모두 적용합니다. 각 단계의 전직 요구 레벨보다 낮게 적용되지 않으며, 한국 서버의 2단계는 Lv.25가 상한입니다.",
            promotionBulkInvalid: (minimum, maximum) => `전직 레벨은 ${minimum}~${maximum} 사이의 정수로 입력하세요.`, promotionBulkApplied: (level) => `Lv.${level}을 2단계 이후 실제 전직 레벨에 일괄 적용했습니다.`, promotionBulkCleared: "일괄 입력을 비워 기본 전직 가능 레벨을 적용했습니다.", promotionBulkKoreaCap: (level) => `Lv.${level}을 일괄 적용하고 한국 서버 2단계만 Lv.25로 조정했습니다.`,
            step: "단계", className: "병종", required: "전직 가능 Lv.", actual: "실제 전직 Lv.", crewGrowth: "수병수 성장",
            resultTitle: "현재 레벨 계산 결과", ability: "어빌리티", currentGrowth: "성장", total: "누적", deckAbility: "표시", resultAbilityHelp: "누적 어빌리티를 직접 수정할 수 있으며, 수정한 값은 성능 계산 요청에 반영됩니다.", officerTitle: "사관수", officerRate: "사관 비율", officerCount: "사관수", performanceInputTitle: "성능 검토 입력", performancePersonnelTitle: "사관 숙련병 신병 조건", performanceDeckAbilityTitle: "갑판병 보정 적용 어빌", performanceGunTitle: "시뮬레이트 적용 함포", performanceGun: "함포", performanceGunClass: "필요병종", performanceGunLevel: "필요레벨", performanceGunCaliber: "구경", performanceGunBarrels: "연장", performanceGunElevation: "최대양각", performanceGunReload: "함포 연사속도", performanceSimulationTitle: "수병 성능 시뮬레이션", performanceItem: "성능 항목", performanceCase: "조건", performanceOfficer: "사관", performanceVeteran: "숙련병", performanceRookie: "신병", performanceDeckRate: "갑판병 보정률", performanceCrewCount: "현재 / 총 수병수", performanceCrewRate: "수병 비율", performanceReady: "누적 어빌리티를 수정하고 계산을 요청할 수 있습니다.\n성능 검토 조건을 입력하고 계산을 요청하세요.", performanceCalculate: "성능 계산 요청", performanceCalculating: "계산 요청 중…", performanceComplete: "시뮬레이션이 완료되었습니다.", performanceFailed: (message) => `성능 계산 요청 실패: ${message}`, performanceRepair: "수리속도 [/s]", performanceStructural: "구조방어", performanceAppliedDeckCorrection: "연사 적용 갑판병 보정률", performanceReloadEfficiency: "수병 연사효율 구간", performanceReloadCapProgress: "연사 어빌캡 도달율", performanceAbilityCapReached: "연사캡 도달", performanceAverageReload: "선택 함포 평균 연사시간 [s]", performanceRequiredDeck: "다음 연사구간 필요 갑판 보정", performanceAverageReloadWithDeck: "필요 갑판 보정 적용 평균 연사시간 [s]", appliedSailorPreset: "수병 프리셋", appliedBoost: "적용 강화", notApplied: "미적용", noChange: "변화 없음",
            performanceFcsTitle: "시뮬레이트 적용 FCS", performanceFcsName: "FCS리스트", performanceFcsGuideLength: "목표가이드라인길이", performanceFcsTargetGun: "목표함포지정", performanceFcsAccuracy: "명중 보너스", performanceFcsCapacity: "필요용적", performanceGuidelineLength: "가이드라인 길이", performanceGuidelineAdjustment: "목표가이드라인 수병조절", performanceGuidelineTargetInput: (target) => `${target} : 직접입력`, performanceGuidelineTargetGun: (target, gunName) => `${target} : ${gunName}`, performanceGuidelineRepair: (target) => `가이드라인 (${target}) 수리속도 [/s]`, performanceGuidelineStructural: (target) => `가이드라인 (${target}) 구조방어`, performanceGuidelineNoAdjustment: "조절 불필요", performanceGuidelineUnavailable: "불가능", performanceGuidelineAdjustmentImpossible: "사관수 고정 조건에서 조절 불가", performanceGuidelineCalculated: (length) => `가이드라인 계산 : ${length}`, performanceGuidelineOfficer: (value) => `사관 ${value}`, performanceGuidelineVeteran: (value) => `숙련병 ${value}`, performanceGuidelineRookie: (value) => `신병 ${value}`,
            performanceDeckHelp: "갑판 보정은 0~12%를 입력합니다. 입력 시 관련 성능에 반영하여 계산합니다.",
            performanceImplementedReloadTitle: "12회 구현 연사시간 비교 [s]", performanceImplementedReloadHelp: "각 조건의 12회 구현 연사시간을 비교합니다. 막대 아래에는 각 발사까지의 누적시간을 표시하며, 느린 구간은 부드러운 빨간색, 중간은 노란색, 빠른 구간은 초록색입니다.", performanceTimeline: "12회 누적시간 [s]", performanceShotNumber: (index) => `${index}회차`, performanceTimelineSummary: (total, average) => `총 ${total}s · 평균 ${average}s`, performanceIntervalDetail: (index, interval, cumulative) => `${index}회차: ${interval}s · 누적 ${cumulative}s`,
            performanceResultTableTitle: "수병 성능 시뮬레이션 결과",
        },
        en: {
            subtitle: "Calculate current growth and accumulated abilities based on sailor promotion information.", settingsTitle: "Sailor settings", serverHelp: "Global server users: select “Global server”.",
            server: "Server", nation: "Nation", preset: "Promotion path preset", level: "Current level", sailorType: "Sailor preset", boost: "Sailor enhancement item",
            growthInput: "Initial growth abilities", totalInput: "Initial accumulated abilities", hiddenInput: (level) => `Hidden abilities (Lv1 ~ Lv${level})`, abilityHelp: "Selecting a sailor type fills the initial values automatically. Crew values are read-only.",
            hiddenHelp: "Hidden abilities are the growth values actually applied through the level shown at the end of the sailor name. The accumulated correction is (hidden ability - initial growth ability) × (displayed level - 1), and is not applied when the current level is below the displayed level.",
            hiddenDisabledHelp: "Hidden ability input is disabled because this Lv12 preset starts with accumulated abilities that already include levels 1–12.",
            nationPlaceholder: "Select a nation", presetPlaceholder: "Select a promotion path", none: "No enhancement", boost20: "Premium Sailors / increase +20%",
            plus1: "+1 enhancement", plus2: "+2 enhancement", loading: "Loading the nation simulator catalog…", unknownResponse: "Unknown API response format.",
            loaded: (count) => `Loaded ${count} classes. Select a nation.`, loadError: (message) => `Could not load the simulator catalog: ${message}`,
            paths: (count) => `Built ${count} promotion path presets.`, complete: "Calculation complete.", treeTitle: "Applied promotion path",
            promotionHelp: "Leave every actual level blank to use required levels. Once any level is entered, the first blank stage and all following stages are treated as not promoted.",
            promotionBulkLabel: "Bulk actual promotion level", promotionBulkApply: "Apply", promotionBulkPlaceholder: "e.g. 25",
            promotionBulkHelp: "Applies one level to every stage after Sailor. No stage is set below its required level.",
            promotionBulkInvalid: (minimum, maximum) => `Enter a whole-number promotion level from ${minimum} to ${maximum}.`, promotionBulkApplied: (level) => `Applied Lv.${level} to every actual promotion level after Sailor.`, promotionBulkCleared: "Cleared bulk input and restored required promotion levels.", promotionBulkKoreaCap: (level) => `Applied Lv.${level} in bulk and adjusted Korea-server stage 2 to Lv.25.`,
            step: "Stage", className: "Class", required: "Required Lv.", actual: "Actual Lv.", crewGrowth: "Crew growth",
            resultTitle: "Current-level results", ability: "Ability", currentGrowth: "Growth", total: "Accumulated", deckAbility: "Display", resultAbilityHelp: "You can edit accumulated abilities directly. The edited values will be used for the performance calculation.", officerTitle: "Officers", officerRate: "Officer rate", officerCount: "Officers", performanceInputTitle: "Performance review inputs", performancePersonnelTitle: "Officer, veteran, and rookie conditions", performanceDeckAbilityTitle: "Abilities affected by seaman correction", performanceGunTitle: "Gun applied to simulation", performanceGun: "Gun", performanceGunClass: "Required class", performanceGunLevel: "Required level", performanceGunCaliber: "Caliber", performanceGunBarrels: "Mount", performanceGunElevation: "Maximum elevation", performanceGunReload: "Gun reload time", performanceSimulationTitle: "Sailor performance simulation", performanceItem: "Performance", performanceCase: "Case", performanceOfficer: "Officers", performanceVeteran: "Veterans", performanceRookie: "Rookies", performanceDeckRate: "Seaman correction rate", performanceCrewCount: "Current / total crew", performanceCrewRate: "Crew rate", performanceReady: "Review or edit the accumulated abilities and performance conditions, then request a calculation.", performanceCalculate: "Request performance simulation", performanceCalculating: "Requesting calculation…", performanceComplete: "Simulation complete.", performanceFailed: (message) => `Performance request failed: ${message}`, performanceRepair: "Repair speed [/s]", performanceStructural: "Structural defense", performanceAppliedDeckCorrection: "Seaman correction applied to reload", performanceReloadEfficiency: "Sailor reload efficiency tier", performanceReloadCapProgress: "Reload ability cap progress", performanceAbilityCapReached: "Reload cap reached", performanceAverageReload: "Selected gun average reload time [s]", performanceRequiredDeck: "Seaman correction needed for next reload tier", performanceAverageReloadWithDeck: "Average reload with required correction [s]", appliedSailorPreset: "Sailor preset", appliedBoost: "Applied enhancement", notApplied: "not applied", noChange: "No change",
            performanceFcsTitle: "FCS applied to simulation", performanceFcsName: "FCS list", performanceFcsGuideLength: "Target guideline length", performanceFcsTargetGun: "Specify target gun", performanceFcsAccuracy: "Accuracy bonus", performanceFcsCapacity: "Required capacity", performanceGuidelineLength: "Guideline length", performanceGuidelineAdjustment: "Target guideline sailor adjustment", performanceGuidelineTargetInput: (target) => `${target}: direct input`, performanceGuidelineTargetGun: (target, gunName) => `${target}: ${gunName}`, performanceGuidelineRepair: (target) => `Guideline (${target}) repair speed [/s]`, performanceGuidelineStructural: (target) => `Guideline (${target}) structural defense`, performanceGuidelineNoAdjustment: "No adjustment needed", performanceGuidelineUnavailable: "Unavailable", performanceGuidelineAdjustmentImpossible: "Cannot adjust while keeping officers fixed", performanceGuidelineCalculated: (length) => `Calculated guideline: ${length}`, performanceGuidelineOfficer: (value) => `Officers ${value}`, performanceGuidelineVeteran: (value) => `Veterans ${value}`, performanceGuidelineRookie: (value) => `Rookies ${value}`,
            performanceDeckHelp: "Enter a seaman correction from 0% to 12%. The entered rate is applied when calculating the related performance values.",
            performanceImplementedReloadTitle: "12-shot implemented reload comparison [s]", performanceImplementedReloadHelp: "Compares 12 implemented reload intervals for each case. Cumulative time through each shot appears below the bar; slow intervals are soft red, medium intervals yellow, and fast intervals green.", performanceTimeline: "12-shot cumulative time [s]", performanceShotNumber: (index) => `Shot ${index}`, performanceTimelineSummary: (total, average) => `Total ${total}s · average ${average}s`, performanceIntervalDetail: (index, interval, cumulative) => `Shot ${index}: ${interval}s · cumulative ${cumulative}s`,
            performanceResultTableTitle: "Performance results",
        },
    };
    const API_BASE = document.querySelector('meta[name="sailor-api-base"]')?.content.replace(/\/$/, "") || "";
    const el = (selector) => document.querySelector(selector);
    const server = el("#sailor-server");
    const nation = el("#sailor-nation");
    const preset = el("#sailor-preset");
    const level = el("#sailor-level");
    const sailorType = el("#sailor-type");
    const boost = el("#sailor-boost");
    const status = el("#sailor-status");
    let catalog = null;
    let nationCatalog = null;
    let paths = [];
    let actualPromotionLevels = [];
    let bulkPromotionLevel = "";
    let performanceCompositions = [];
    let performanceDetailedHeaders = [];
    let performanceCrewCount = null;
    let performanceServer = null;
    let latestPerformanceContext = null;
    let availablePerformanceGuns = [];
    let availablePerformanceFcs = [];
    let catalogRequestSequence = 0;
    const deckCorrectionEnabled = Object.fromEntries(DECK_CORRECTION_ABILITIES.map(([key]) => [key, true]));
    const language = () => server.value === "global" ? "en" : "ko";
    const t = () => TEXT[language()];
    const abilityLabel = (ability) => ability[language() === "ko" ? 1 : 2];
    const nationName = (serverId, nationId) => NATIONS[serverId]
        ?.find(([id]) => id === Number(nationId))?.[1] || `Nation ${nationId}`;
    const availableSailorTypes = () => server.value === "global" ? GLOBAL_SAILOR_TYPES : KOREA_SAILOR_TYPES;
    const selectedSailorType = () => {
        const types = availableSailorTypes();
        return types.find((type) => type.id === sailorType.value) || types[0];
    };
    const selectedSailorLevel = (selected) => {
        if (selected?.initialLevel) return selected.initialLevel;
        const label = selected?.[language()] || "";
        const match = label.match(/Lv(\d+)$/i);
        return match ? Number(match[1]) : null;
    };
    const selectedInitialLevel = (selected) => Math.max(1, Number(selected?.initialLevel) || 1);
    const hiddenAbilityInputDisabled = (selected) => server.value === "global" && selectedInitialLevel(selected) > 1;

    function setStatus(message, kind = "secondary") {
        status.className = `alert alert-${kind} py-2`;
        status.textContent = message;
    }
    function option(value, text) {
        const item = document.createElement("option");
        item.value = value;
        item.textContent = text;
        return item;
    }
    function renderAbilityInputs() {
        for (const [containerId, type] of [["#base-growth-abilities", "growth"], ["#base-total-abilities", "total"]]) {
            const wrap = el(containerId);
            wrap.replaceChildren();
            for (const ability of ABILITIES) {
                const [key] = ability;
                const box = document.createElement("div");
                box.className = "ability-input";
                const defaultValue = type === "growth" ? (key === "crewGrowth" ? 5 : 9) : (key === "crewGrowth" ? 55 : 27);
                const label = document.createElement("label");
                label.htmlFor = `base-${type}-${key}`;
                label.textContent = abilityLabel(ability);
                box.append(label);
                if (key === "crewGrowth") {
                    const value = document.createElement("div");
                    value.id = `base-${type}-${key}`;
                    value.className = "ability-readonly";
                    value.dataset[`${type}Ability`] = key;
                    value.textContent = String(defaultValue);
                    box.append(value);
                } else {
                    const input = document.createElement("input");
                    input.id = `base-${type}-${key}`;
                    input.className = "form-control form-control-sm";
                    input.type = "number";
                    input.step = "1";
                    input.value = String(defaultValue);
                    input.dataset[`${type}Ability`] = key;
                    box.append(input);
                }
                wrap.append(box);
            }
        }
    }
    function renderHiddenAbilityInputs() {
        const wrap = el("#hidden-abilities");
        wrap.replaceChildren();
        for (const ability of ABILITIES.slice(0, -1)) {
            const [key] = ability;
            const box = document.createElement("div");
            box.className = "ability-input";
            const label = document.createElement("label");
            label.htmlFor = `hidden-${key}`;
            label.textContent = abilityLabel(ability);
            const input = document.createElement("input");
            input.id = `hidden-${key}`;
            input.className = "form-control form-control-sm";
            input.type = "number";
            input.step = "1";
            input.min = "7";
            input.max = "12";
            input.value = "9";
            input.dataset.hiddenAbility = key;
            box.append(label, input);
            wrap.append(box);
        }
        const placeholder = document.createElement("div");
        placeholder.className = "ability-input ability-input-placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        wrap.append(placeholder);
    }
    function renderSailorTypeOptions() {
        const selected = sailorType.value || "normal";
        const types = availableSailorTypes();
        sailorType.replaceChildren();
        for (const type of types) sailorType.append(option(type.id, type[language()]));
        sailorType.value = types.some((type) => type.id === selected) ? selected : "normal";
    }
    function updateHiddenAbilityTitle(selected) {
        const sailorLevel = selectedSailorLevel(selected);
        if (!sailorLevel) return;
        el("#hidden-input-title").innerHTML = `<span class="step-number">9.</span>${t().hiddenInput(sailorLevel)}`;
    }
    function applySailorType(recalculate = true) {
        const selected = selectedSailorType();
        const initialLevel = selectedInitialLevel(selected);
        level.min = String(initialLevel);
        if ((Number(level.value) || 1) < initialLevel) level.value = String(initialLevel);
        if (server.value === "korea" && selected.event) {
            actualPromotionLevels = [];
            bulkPromotionLevel = "";
        }
        const disableHiddenAbilities = hiddenAbilityInputDisabled(selected);
        for (const [key] of ABILITIES.slice(0, -1)) {
            const initialGrowth = selected.growth?.[key] ?? 9;
            el(`#base-growth-${key}`).value = String(initialGrowth);
            el(`#base-total-${key}`).value = String(selected.total?.[key] ?? 27);
            el(`#hidden-${key}`).value = String(initialGrowth);
            el(`#hidden-${key}`).disabled = disableHiddenAbilities;
        }
        el("#base-growth-crewGrowth").textContent = String(selected.growth?.crewGrowth ?? 5);
        el("#base-total-crewGrowth").textContent = String(selected.total?.crewGrowth ?? 55);
        el("#event-hidden-section").hidden = !selectedSailorLevel(selected) || disableHiddenAbilities;
        el("#hidden-ability-help").textContent = disableHiddenAbilities ? t().hiddenDisabledHelp : t().hiddenHelp;
        updateHiddenAbilityTitle(selected);
        renderBoostOptions();
        if (recalculate) calculate();
    }
    function renderBoostOptions() {
        const selected = boost.value;
        boost.replaceChildren(option("", t().none));
        if (server.value === "korea") {
            const allowPlusTwo = sailorType.value === "normal";
            for (const ability of ABILITIES.slice(0, -1)) {
                boost.append(option(`${ability[0]}:1`, `${abilityLabel(ability)} ${t().plus1}`));
                if (allowPlusTwo) boost.append(option(`${ability[0]}:2`, `${abilityLabel(ability)} ${t().plus2}`));
            }
        } else {
            boost.append(option("all:20", t().boost20));
        }
        if ([...boost.options].some((item) => item.value === selected)) boost.value = selected;
    }
    function applyLanguage() {
        document.documentElement.lang = language();
        const labels = {
            "#sailor-subtitle": "subtitle", "#settings-title": "settingsTitle", "#server-help": "serverHelp", "#tree-title": "treeTitle", "#promotion-help": "promotionHelp",
            "#promotion-bulk-label": "promotionBulkLabel", "#promotion-bulk-help": "promotionBulkHelp",
            "#result-title": "resultTitle", "#result-ability-help": "resultAbilityHelp", "#officer-title": "officerTitle", "#performance-input-title": "performanceInputTitle", "#performance-personnel-title": "performancePersonnelTitle", "#performance-deck-ability-title": "performanceDeckAbilityTitle", "#performance-deck-help": "performanceDeckHelp", "#performance-fcs-title": "performanceFcsTitle", "#performance-fcs-name-heading": "performanceFcsName", "#performance-fcs-guide-length-heading": "performanceFcsGuideLength", "#performance-fcs-target-gun-heading": "performanceFcsTargetGun", "#performance-gun-title": "performanceGunTitle", "#performance-gun-heading": "performanceGun", "#performance-gun-class-heading": "performanceGunClass", "#performance-gun-level-heading": "performanceGunLevel", "#performance-gun-caliber-heading": "performanceGunCaliber", "#performance-gun-barrels-heading": "performanceGunBarrels", "#performance-gun-elevation-heading": "performanceGunElevation", "#performance-gun-reload-heading": "performanceGunReload", "#performance-result-title": "performanceSimulationTitle", "#performance-result-table-title": "performanceResultTableTitle", "#performance-implemented-reload-title": "performanceImplementedReloadTitle", "#performance-implemented-reload-help": "performanceImplementedReloadHelp", "#performance-case-heading": "performanceCase", "#performance-officer-heading": "performanceOfficer", "#performance-veteran-heading": "performanceVeteran", "#performance-rookie-heading": "performanceRookie", "#performance-deck-rate-heading": "performanceDeckRate", "#performance-crew-count-heading": "performanceCrewCount", "#performance-crew-rate-heading": "performanceCrewRate", "#ability-help": "abilityHelp", "#hidden-ability-help": "hiddenHelp", "#tree-step-heading": "step", "#tree-class-heading": "className",
            "#tree-required-heading": "required", "#tree-actual-heading": "actual", "#tree-crew-heading": "crewGrowth",
            "#result-ability-heading": "ability", "#result-growth-heading": "currentGrowth", "#result-total-heading": "total", "#result-deck-heading": "deckAbility",
        };
        for (const [selector, key] of Object.entries(labels)) el(selector).textContent = t()[key];
        el("#promotion-bulk-input").placeholder = t().promotionBulkPlaceholder;
        el("#promotion-bulk-apply").textContent = t().promotionBulkApply;
        el("#performance-calculate-button").textContent = t().performanceCalculate;
        el("#server-help").hidden = server.value === "global";
        for (const ability of ABILITIES.slice(0, -1)) {
            el(`#tree-${ability[0]}-heading`).textContent = abilityLabel(ability);
        }
        for (const [selector, number, key] of [["#server-label", 1, "server"], ["#nation-label", 2, "nation"], ["#preset-label", 3, "preset"], ["#level-label", 4, "level"], ["#sailor-type-label", 5, "sailorType"], ["#boost-label", 6, "boost"], ["#growth-input-title", 7, "growthInput"], ["#total-input-title", 8, "totalInput"]]) {
            el(selector).innerHTML = `<span class="step-number">${number}.</span>${t()[key]}`;
        }
        renderAbilityInputs();
        renderHiddenAbilityInputs();
        renderDeckCorrectionAbilities();
        renderSailorTypeOptions();
        applySailorType(false);
    }
    function selectServer() {
        catalogRequestSequence += 1;
        level.max = server.value === "korea" ? "120" : "125";
        level.value = server.value === "korea" ? "120" : "125";
        applyLanguage();
        catalog = null;
        nationCatalog = null;
        paths = [];
        preset.disabled = true;
        nation.replaceChildren(option("", t().nationPlaceholder));
        preset.replaceChildren(option("", t().presetPlaceholder));
        for (const [id, name] of NATIONS[server.value]) nation.append(option(String(id), name));
        nation.disabled = false;
        actualPromotionLevels = [];
        bulkPromotionLevel = "";
        el("#performance-fcs-target-gun").checked = false;
        setPromotionBulkFeedback();
        hideResults();
        setStatus(server.value === "korea"
            ? `${t().serverHelp}\n${t().nationPlaceholder}`
            : t().nationPlaceholder);
    }
    async function loadNationCatalogs() {
        const selectedServer = server.value;
        const selectedNation = nation.value;
        const requestSequence = ++catalogRequestSequence;
        catalog = null;
        nationCatalog = null;
        paths = [];
        preset.disabled = true;
        preset.replaceChildren(option("", t().presetPlaceholder));
        actualPromotionLevels = [];
        bulkPromotionLevel = "";
        el("#performance-fcs-target-gun").checked = false;
        setPromotionBulkFeedback();
        hideResults();
        if (!selectedNation) {
            setStatus(t().nationPlaceholder);
            return;
        }
        setStatus(t().loading);
        try {
            const response = await fetch(
                `${API_BASE}/api/simulator/catalog?server=${encodeURIComponent(selectedServer)}&nationId=${encodeURIComponent(selectedNation)}&catalogVersion=5`,
                { cache: "no-store" },
            );
            const body = await response.json();
            if (!response.ok) throw new Error(body?.error?.message || body?.error || `HTTP ${response.status}`);
            if (requestSequence !== catalogRequestSequence) return;
            nationCatalog = body.catalog;
            catalog = nationCatalog?.sailors;
            if (!catalog?.sailors || !catalog?.nations) throw new Error(t().unknownResponse);
            paths = buildPaths(catalog.sailors.filter((item) => item.requiredLevel > 0));
            paths.forEach((path, index) => {
                const last = path.at(-1);
                preset.append(option(String(index), `${last.name} (Lv.${last.requiredLevel}) · ${path.map((item) => item.name).join(" → ")}`));
            });
            preset.disabled = false;
            setStatus(t().paths(paths.length), "success");
        } catch (error) {
            if (requestSequence !== catalogRequestSequence) return;
            console.error(error);
            catalog = null;
            nationCatalog = null;
            setStatus(t().loadError(error.message), "danger");
        }
    }
    function buildPaths(sailors) {
        const byName = new Map(sailors.map((item) => [item.name, item]));
        const incoming = new Set(sailors.flatMap((item) => item.promotionTargets));
        const roots = sailors.filter((item) => !incoming.has(item.name));
        const output = [];
        const walk = (node, path, visited) => {
            if (visited.has(node.name)) return;
            const nextPath = [...path, node];
            output.push(nextPath);
            const nextVisited = new Set(visited).add(node.name);
            node.promotionTargets.map((name) => byName.get(name)).filter(Boolean).forEach((target) => walk(target, nextPath, nextVisited));
        };
        roots.forEach((root) => walk(root, [], new Set()));
        // ForceInfo의 다음 전직 순서를 따라 한 분기를 끝까지 배치한다.
        // 최종 병종명/레벨로 다시 전역 정렬하면 같은 계열이 흩어지므로
        // DFS에서 만들어진 계통 순서를 그대로 프리셋에 사용한다.
        return output;
    }
    function readStartingValues() {
        const growth = {};
        const total = {};
        document.querySelectorAll("[data-growth-ability]").forEach((input) => {
            growth[input.dataset.growthAbility] = Number(input.value ?? input.textContent) || 0;
        });
        document.querySelectorAll("[data-total-ability]").forEach((input) => {
            total[input.dataset.totalAbility] = Number(input.value ?? input.textContent) || 0;
        });
        const initialGrowth = { ...growth };
        const [boostKey, amount] = boost.value.split(":");
        if (boostKey && boostKey !== "all") {
            growth[boostKey] += Number(amount);
            total[boostKey] += Number(amount);
        }
        return { growth, total, initialGrowth };
    }
    function promotionBulkStartIndex(path) {
        if (!path.length) return 0;
        return /^(수병|sailor)$/i.test(String(path[0].name || "").trim()) ? 1 : 0;
    }
    function setPromotionBulkFeedback(message = "", kind = "secondary") {
        const feedback = el("#promotion-bulk-feedback");
        feedback.className = `form-text text-${kind}`;
        feedback.textContent = message;
    }
    function syncPromotionBulkInput(path, allowLatePromotion) {
        const input = el("#promotion-bulk-input");
        const button = el("#promotion-bulk-apply");
        const startIndex = promotionBulkStartIndex(path);
        const firstPromotion = path[startIndex];
        input.value = bulkPromotionLevel;
        input.min = String(firstPromotion?.requiredLevel || 1);
        input.max = level.max;
        input.placeholder = firstPromotion
            ? `${language() === "ko" ? "예" : "e.g."}: ${server.value === "korea" ? Math.max(firstPromotion.requiredLevel, 25) : firstPromotion.requiredLevel}`
            : t().promotionBulkPlaceholder;
        input.disabled = !allowLatePromotion || !firstPromotion;
        button.disabled = input.disabled;
    }
    function applyBulkPromotionLevels() {
        if (preset.value === "") return;
        const path = paths[Number(preset.value)] || [];
        const input = el("#promotion-bulk-input");
        const rawValue = input.value.trim();
        if (!rawValue) {
            actualPromotionLevels = [];
            bulkPromotionLevel = "";
            calculate();
            setPromotionBulkFeedback(t().promotionBulkCleared, "secondary");
            return;
        }
        const startIndex = promotionBulkStartIndex(path);
        const minimumLevel = Number(path[startIndex]?.requiredLevel) || 1;
        const maximumLevel = Number(level.max);
        const enteredLevel = Number(rawValue);
        if (!Number.isInteger(enteredLevel) || enteredLevel < minimumLevel || enteredLevel > maximumLevel) {
            setPromotionBulkFeedback(t().promotionBulkInvalid(minimumLevel, maximumLevel), "danger");
            return;
        }
        const nextLevels = Array(path.length).fill("");
        for (let index = 0; index < startIndex; index += 1) {
            nextLevels[index] = String(path[index].requiredLevel);
        }
        for (let index = startIndex; index < path.length; index += 1) {
            const stageRequiredLevel = Number(path[index].requiredLevel) || 1;
            const stageBulkLevel = server.value === "korea" && index === startIndex
                ? Math.min(enteredLevel, 25)
                : enteredLevel;
            nextLevels[index] = String(Math.max(stageRequiredLevel, stageBulkLevel));
        }
        actualPromotionLevels = nextLevels;
        bulkPromotionLevel = String(enteredLevel);
        calculate();
        setPromotionBulkFeedback(
            server.value === "korea" && enteredLevel > 25 ? t().promotionBulkKoreaCap(enteredLevel) : t().promotionBulkApplied(enteredLevel),
            server.value === "korea" && enteredLevel > 25 ? "warning" : "success",
        );
    }
    function defaultPerformanceCompositions(crewCount) {
        const fixedOfficers = server.value === "korea" ? [180, 250, 300] : [100, 250, 300];
        const officers = [...fixedOfficers, Math.floor(crewCount * 0.4), Math.floor(crewCount * 0.45)];
        return officers.map((officerCount) => {
            const safeOfficers = Math.min(officerCount, maximumPerformanceOfficers(crewCount));
            return { officers: safeOfficers, veterans: crewCount - safeOfficers, rookies: 0, deckCorrectionRate: 0 };
        });
    }
    function maximumPerformanceOfficers(crewCount) {
        return Math.floor(crewCount * (server.value === "korea" ? 0.45 : 0.5));
    }
    function performanceCaseLabels(showActualOfficerCount = false) {
        return performanceCompositions.map((composition, index) => {
            const currentCrew = performanceCurrentCrew(composition);
            const crewRate = performanceCrewCount > 0 ? currentCrew / performanceCrewCount * 100 : 0;
            const deckCorrectionRate = Number(composition.deckCorrectionRate) || 0;
            const percentageOfficerRate = [40, 45, 50].find((rate) =>
                composition.officers === Math.floor(performanceCrewCount * rate / 100)
            );
            const officerLabel = language() === "ko"
                ? `사관 ${showActualOfficerCount ? composition.officers : percentageOfficerRate ?? composition.officers}${!showActualOfficerCount && percentageOfficerRate ? "%" : ""}`
                : `Officers ${showActualOfficerCount ? composition.officers : percentageOfficerRate ?? composition.officers}${!showActualOfficerCount && percentageOfficerRate ? "%" : ""}`;
            const officerRateLabel = showActualOfficerCount && percentageOfficerRate
                ? (language() === "ko" ? `사관 ${percentageOfficerRate}%` : `Officers ${percentageOfficerRate}%`)
                : null;
            if (!performanceDetailedHeaders[index] && deckCorrectionRate <= 0) {
                return officerRateLabel ? [officerLabel, officerRateLabel] : [officerLabel];
            }
            const labels = language() === "ko"
                ? [officerLabel, `숙련 ${composition.veterans} · 신병 ${composition.rookies}`, `총원 ${crewRate.toFixed(1)}%`]
                : [officerLabel, `Veterans ${composition.veterans} · Rookies ${composition.rookies}`, `Total ${crewRate.toFixed(1)}%`];
            if (officerRateLabel) labels.splice(1, 0, officerRateLabel);
            if (deckCorrectionRate > 0) {
                labels.splice(2, 0, language() === "ko"
                    ? `갑판병 보정률 ${displayGunNumber(deckCorrectionRate)}%`
                    : `Seaman correction ${displayGunNumber(deckCorrectionRate)}%`);
            }
            return labels;
        });
    }
    function renderDeckCorrectionAbilities() {
        const headRow = document.createElement("tr");
        const inputRow = document.createElement("tr");
        for (const ability of DECK_CORRECTION_ABILITIES) {
            const [key] = ability;
            const heading = document.createElement("th");
            heading.textContent = abilityLabel(ability);
            headRow.append(heading);
            const cell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.className = "form-check-input performance-deck-ability-checkbox";
            checkbox.type = "checkbox";
            checkbox.checked = deckCorrectionEnabled[key];
            checkbox.dataset.ability = key;
            checkbox.setAttribute("aria-label", abilityLabel(ability));
            cell.append(checkbox);
            inputRow.append(cell);
        }
        el("#performance-deck-ability-head").replaceChildren(headRow);
        el("#performance-deck-ability-body").replaceChildren(inputRow);
    }
    function performanceCurrentCrew(composition) {
        return composition.officers + composition.veterans + composition.rookies;
    }
    function updatePerformanceCrewDisplay(index) {
        const composition = performanceCompositions[index];
        if (!composition) return;
        const currentCrew = performanceCurrentCrew(composition);
        const countCell = el(`#performance-input-body [data-crew-count="${index}"]`);
        const rateCell = el(`#performance-input-body [data-crew-rate="${index}"]`);
        if (countCell) countCell.textContent = `${currentCrew} / ${performanceCrewCount}`;
        if (rateCell) rateCell.textContent = `${(performanceCrewCount > 0 ? currentCrew / performanceCrewCount * 100 : 0).toFixed(1)}%`;
    }
    function renderPerformanceInputs(crewCount) {
        if (performanceCrewCount !== crewCount || performanceServer !== server.value || performanceCompositions.length !== 5) {
            performanceCrewCount = crewCount;
            performanceServer = server.value;
            performanceCompositions = defaultPerformanceCompositions(crewCount);
            performanceDetailedHeaders = Array(5).fill(false);
        }
        const body = el("#performance-input-body");
        body.replaceChildren();
        const caseLabels = performanceCaseLabels();
        performanceCompositions.forEach((composition, index) => {
            const row = document.createElement("tr");
            const heading = document.createElement("th");
            heading.scope = "row";
            heading.textContent = caseLabels[index][0];
            row.append(heading);
            for (const field of ["officers", "veterans", "rookies"]) {
                const cell = document.createElement("td");
                const input = document.createElement("input");
                input.className = "form-control form-control-sm text-end performance-personnel-input";
                input.type = "number";
                input.min = "0";
                if (field === "officers") input.max = String(maximumPerformanceOfficers(crewCount));
                input.step = "1";
                input.value = String(composition[field]);
                input.dataset.index = String(index);
                input.dataset.field = field;
                cell.append(input);
                row.append(cell);
            }
            const countCell = document.createElement("td");
            countCell.dataset.crewCount = String(index);
            const rateCell = document.createElement("td");
            rateCell.dataset.crewRate = String(index);
            row.append(countCell, rateCell);
            const deckRateCell = document.createElement("td");
            const deckRateGroup = document.createElement("div");
            deckRateGroup.className = "input-group input-group-sm";
            const deckRateInput = document.createElement("input");
            deckRateInput.className = "form-control text-end performance-deck-rate-input";
            deckRateInput.type = "number";
            deckRateInput.min = "0";
            deckRateInput.max = "12";
            deckRateInput.step = "1";
            deckRateInput.value = String(composition.deckCorrectionRate);
            deckRateInput.dataset.index = String(index);
            const deckRateSuffix = document.createElement("span");
            deckRateSuffix.className = "input-group-text";
            deckRateSuffix.textContent = "%";
            deckRateGroup.append(deckRateInput, deckRateSuffix);
            deckRateCell.append(deckRateGroup);
            row.append(deckRateCell);
            body.append(row);
            updatePerformanceCrewDisplay(index);
        });
        el("#performance-input-section").hidden = false;
    }
    function gunRequirementForClasses(gun, appliedClasses, currentLevel) {
        const requirements = [
            { className: gun.requiredClassName, level: Number(gun.requiredLevel) || 0 },
            { className: gun.secondaryRequiredClassName, level: Number(gun.secondaryRequiredLevel) || 0 },
        ];
        return requirements.find((requirement) =>
            appliedClasses.has(requirement.className) && requirement.level <= currentLevel
        ) || null;
    }
    function isTorpedoSailorClass(className) {
        return server.value === "korea"
            ? /어뢰병$/.test(className)
            : /\bTorpedo\b.*\bMan$/i.test(className);
    }
    function renderPerformanceFcsCatalog(appliedClasses) {
        const section = el("#performance-fcs-section");
        const select = el("#performance-fcs-select");
        const previousMeta = Number(select.value);
        select.replaceChildren();
        const isCaptainPath = server.value === "korea"
            ? appliedClasses.has("관제병")
            : appliedClasses.has("Bridge Operator");
        if (!isCaptainPath) {
            availablePerformanceFcs = [];
            section.hidden = true;
            return false;
        }
        availablePerformanceFcs = [...(nationCatalog?.equipment?.fcs || [])].sort((left, right) =>
            Number(right.accuracyBonus) - Number(left.accuracyBonus)
            || String(left.name).localeCompare(String(right.name))
        );
        availablePerformanceFcs.forEach((fcs) => {
            const item = option(
                String(fcs.meta),
                language() === "ko"
                    ? `${fcs.name} · 명중보너스 ${fcs.accuracyBonus} · 필요용적 ${fcs.requiredCapacity} · 착탄보정한계거리 ${fcs.spottingCorrectionLimitRange}`
                    : `${fcs.name} · Accuracy Bonus ${fcs.accuracyBonus} · Required Capacity ${fcs.requiredCapacity} · Impact Revision Range Limit ${fcs.spottingCorrectionLimitRange}`,
            );
            select.append(item);
        });
        if (availablePerformanceFcs.some((fcs) => Number(fcs.meta) === previousMeta)) {
            select.value = String(previousMeta);
        }
        section.hidden = availablePerformanceFcs.length === 0;
        return !section.hidden;
    }
    function displayGunNumber(value) {
        const number = Number(value) || 0;
        return Number.isInteger(number) ? String(number) : String(Number(number.toFixed(2)));
    }
    function primaryGunRequirement(gun) {
        const requirements = [
            { className: gun.requiredClassName, level: Number(gun.requiredLevel) || 0 },
            { className: gun.secondaryRequiredClassName, level: Number(gun.secondaryRequiredLevel) || 0 },
        ];
        return requirements.find((requirement) => requirement.className) || {
            className: "-",
            level: Number(gun.requiredLevel) || 0,
        };
    }
    function performanceGunLabel(gun, requirement) {
        return `L${requirement.level} ${gun.mountCode} ${gun.name} · ${displayGunNumber(gun.maxElevation)}° · ${displayGunNumber(gun.reloadSeconds)}s`;
    }
    function performanceGunBarrels(barrelCount) {
        const count = Math.max(1, Number(barrelCount) || 1);
        if (language() === "ko") return count === 1 ? "단장" : `${count}연장`;
        return ({ 1: "Single", 2: "Twin", 3: "Triple", 4: "Quad" })[count] || `${count}-barrel`;
    }
    function updatePerformanceGunDetails() {
        const selectedMeta = Number(el("#performance-gun-select").value);
        const selected = availablePerformanceGuns.find(({ gun }) => gun.meta === selectedMeta);
        if (!selected) return;
        el("#performance-gun-class").textContent = selected.requirement.className;
        el("#performance-gun-level").textContent = String(selected.requirement.level);
        el("#performance-gun-caliber").textContent = `${selected.gun.caliberInches}\"`;
        el("#performance-gun-barrels").textContent = performanceGunBarrels(selected.gun.barrelCount);
        el("#performance-gun-elevation").textContent = `${displayGunNumber(selected.gun.maxElevation)}°`;
        el("#performance-gun-reload").textContent = `${displayGunNumber(selected.gun.reloadSeconds)}s`;
        if (latestPerformanceContext) latestPerformanceContext.gunMeta = selected.gun.meta;
    }
    function renderPerformanceGunInput(appliedClasses, currentLevel, currentClassName) {
        const select = el("#performance-gun-select");
        const previousMeta = Number(select.value);
        const isCaptainPath = server.value === "korea"
            ? appliedClasses.has("관제병")
            : appliedClasses.has("Bridge Operator");
        const targetGunSpecified = isCaptainPath && el("#performance-fcs-target-gun").checked;
        if (isTorpedoSailorClass(currentClassName)) {
            availablePerformanceGuns = [];
            select.replaceChildren();
            el("#performance-gun-section").hidden = true;
            if (latestPerformanceContext) delete latestPerformanceContext.gunMeta;
            return;
        }
        if (isCaptainPath && !targetGunSpecified) {
            availablePerformanceGuns = [];
            select.replaceChildren();
            el("#performance-gun-section").hidden = true;
            if (latestPerformanceContext) delete latestPerformanceContext.gunMeta;
            return;
        }
        availablePerformanceGuns = (nationCatalog?.equipment?.guns || [])
            .map((gun) => ({
                gun,
                requirement: targetGunSpecified
                    ? primaryGunRequirement(gun)
                    : gunRequirementForClasses(gun, appliedClasses, currentLevel),
            }))
            .filter(({ requirement }) => requirement)
            .sort((left, right) =>
                right.requirement.level - left.requirement.level
                || right.gun.caliberInches - left.gun.caliberInches
                || left.gun.name.localeCompare(right.gun.name)
            );
        select.replaceChildren();
        el("#performance-gun-section").hidden = availablePerformanceGuns.length === 0;
        if (!availablePerformanceGuns.length) return;
        for (const { gun, requirement } of availablePerformanceGuns) {
            select.append(option(String(gun.meta), performanceGunLabel(gun, requirement)));
        }
        if (availablePerformanceGuns.some(({ gun }) => gun.meta === previousMeta)) {
            select.value = String(previousMeta);
        }
        updatePerformanceGunDetails();
    }
    function fitPerformanceComposition(composition, changedField) {
        const reductionOrder = {
            officers: ["veterans", "rookies"],
            veterans: ["rookies", "officers"],
            rookies: ["veterans", "officers"],
        };
        let overflow = composition.officers + composition.veterans + composition.rookies - performanceCrewCount;
        if (overflow <= 0) {
            if (changedField !== "rookies") composition.rookies += -overflow;
            return;
        }
        for (const field of reductionOrder[changedField]) {
            const reduction = Math.min(composition[field], overflow);
            composition[field] -= reduction;
            overflow -= reduction;
            if (overflow === 0) return;
        }
        composition[changedField] = Math.max(0, composition[changedField] - overflow);
    }
    function appendPerformanceCaseHeading(row, lines) {
        const heading = document.createElement("th");
        lines.forEach((line, index) => {
            const label = document.createElement(index === 0 ? "div" : "small");
            label.textContent = line;
            if (index > 0) label.className = "d-block fw-normal text-muted performance-case-detail";
            heading.append(label);
        });
        row.append(heading);
    }
    function implementedReloadSequence(averageSeconds) {
        const sampleCount = 12;
        const quantumSeconds = 0.24;
        const totalQuanta = Math.round(averageSeconds * sampleCount / quantumSeconds);
        const shortQuanta = Math.floor(totalQuanta / sampleCount);
        const longCount = totalQuanta - shortQuanta * sampleCount;
        const shortSeconds = shortQuanta * quantumSeconds;
        const longSeconds = (shortQuanta + 1) * quantumSeconds;
        const values = Array(sampleCount).fill(shortSeconds);
        for (let longIndex = 0; longIndex < longCount; longIndex += 1) {
            values[Math.floor(longIndex * sampleCount / longCount)] = longSeconds;
        }
        return {
            shortSeconds,
            longSeconds,
            hasVariation: longCount > 0,
            totalSeconds: totalQuanta * quantumSeconds,
            averageSeconds: totalQuanta * quantumSeconds / sampleCount,
            values,
        };
    }
    function reloadIntervalColors(value, minimumValue, maximumValue) {
        const speedRatio = maximumValue === minimumValue
            ? 1
            : (maximumValue - value) / (maximumValue - minimumValue);
        // 느림(빨강) -> 중간(노랑) -> 빠름(초록)의 저채도 색상 척도다.
        const hue = speedRatio * 120;
        const saturation = 45 - speedRatio * 5;
        const lightness = 80 - speedRatio * 8;
        return {
            backgroundColor: `hsl(${hue} ${saturation}% ${lightness}%)`,
            color: "#111",
        };
    }
    function renderImplementedReloadVisualization(results, caseLabels) {
        const section = el("#performance-implemented-reload-section");
        const sequences = results.map((result) => {
            const average = Number(result.performance?.averageGunReloadSeconds);
            return Number.isFinite(average) ? implementedReloadSequence(average) : null;
        });
        if (!sequences.some(Boolean)) {
            section.hidden = true;
            el("#performance-implemented-reload-head").replaceChildren();
            el("#performance-implemented-reload-body").replaceChildren();
            return;
        }

        const maximumSeconds = Math.max(...sequences.filter(Boolean).map(({ totalSeconds }) => totalSeconds));
        const intervalValues = sequences.filter(Boolean).flatMap(({ values }) => values);
        const minimumInterval = Math.min(...intervalValues);
        const maximumInterval = Math.max(...intervalValues);
        const headRow = document.createElement("tr");
        const caseHeading = document.createElement("th");
        caseHeading.textContent = t().performanceCase;
        headRow.append(caseHeading);
        const timelineHeading = document.createElement("th");
        const timelineTitle = document.createElement("div");
        timelineTitle.textContent = t().performanceTimeline;
        timelineHeading.append(timelineTitle);
        headRow.append(timelineHeading);
        el("#performance-implemented-reload-head").replaceChildren(headRow);

        const tableBody = el("#performance-implemented-reload-body");
        tableBody.replaceChildren();
        sequences.forEach((sequence, caseIndex) => {
            const row = document.createElement("tr");
            appendPerformanceCaseHeading(row, caseLabels[caseIndex]);
            const cell = document.createElement("td");
            if (sequence) {
                const track = document.createElement("div");
                track.className = "implemented-reload-track";
                const fill = document.createElement("div");
                fill.className = "implemented-reload-fill";
                fill.style.width = `${sequence.totalSeconds / maximumSeconds * 100}%`;
                const cumulativeTimeline = document.createElement("div");
                cumulativeTimeline.className = "implemented-reload-cumulative";
                cumulativeTimeline.style.width = fill.style.width;
                let cumulativeSeconds = 0;
                sequence.values.forEach((value, shotIndex) => {
                    cumulativeSeconds += value;
                    const segment = document.createElement("div");
                    segment.className = "implemented-reload-segment";
                    segment.style.flexGrow = String(value);
                    segment.textContent = displayGunNumber(value);
                    segment.title = t().performanceIntervalDetail(
                        shotIndex + 1,
                        displayGunNumber(value),
                        displayGunNumber(cumulativeSeconds),
                    );
                    const colors = reloadIntervalColors(value, minimumInterval, maximumInterval);
                    segment.style.backgroundColor = colors.backgroundColor;
                    segment.style.color = colors.color;
                    fill.append(segment);
                    const cumulativeValue = document.createElement("span");
                    cumulativeValue.className = "implemented-reload-cumulative-value";
                    cumulativeValue.style.flexGrow = String(value);
                    cumulativeValue.textContent = displayGunNumber(cumulativeSeconds);
                    cumulativeValue.title = t().performanceIntervalDetail(
                        shotIndex + 1,
                        displayGunNumber(value),
                        displayGunNumber(cumulativeSeconds),
                    );
                    cumulativeTimeline.append(cumulativeValue);
                });
                track.append(fill);
                const summary = document.createElement("div");
                summary.className = "implemented-reload-summary";
                summary.textContent = t().performanceTimelineSummary(
                    displayGunNumber(sequence.totalSeconds),
                    displayGunNumber(sequence.averageSeconds),
                );
                cell.append(track, cumulativeTimeline, summary);
            }
            row.append(cell);
            tableBody.append(row);
        });
        section.hidden = false;
    }
    function clearPerformanceApiResult() {
        el("#performance-result-section").hidden = true;
        el("#performance-result-head").replaceChildren();
        el("#performance-result-body").replaceChildren();
        el("#performance-implemented-reload-section").hidden = true;
        el("#performance-implemented-reload-head").replaceChildren();
        el("#performance-implemented-reload-body").replaceChildren();
        if (!latestPerformanceContext) setPerformanceStatus("");
        else setPerformanceStatus(t().performanceReady, "success");
    }
    function setPerformanceStatus(message, kind = "secondary") {
        const performanceStatus = el("#performance-status");
        performanceStatus.textContent = message;
        performanceStatus.className = `alert alert-${kind} py-2 mb-3`;
        performanceStatus.hidden = !message;
    }
    function updatePerformanceRequestAvailability() {
        const button = el("#performance-calculate-button");
        button.disabled = !latestPerformanceContext
            || (latestPerformanceContext.isCaptainPath
                && !Number.isInteger(latestPerformanceContext.fcsMeta));
    }
    async function requestPerformanceCalculation() {
        if (!latestPerformanceContext) return;
        for (const [key] of ABILITIES.slice(0, -1)) {
            const input = el(`[data-result-total-ability="${key}"]`);
            if (!input || !input.checkValidity()) {
                input?.reportValidity();
                return;
            }
            latestPerformanceContext.abilities[key] = Number(input.value);
        }
        const button = el("#performance-calculate-button");
        button.disabled = true;
        setPerformanceStatus(t().performanceCalculating, "info");
        el("#performance-result-section").hidden = true;
        const parameters = new URLSearchParams({
            server: server.value,
            nationId: String(latestPerformanceContext.nationId),
            sailorClass: latestPerformanceContext.sailorClass,
            abilities: JSON.stringify(ABILITIES.slice(0, -1).map(([key]) => ({
                key,
                value: latestPerformanceContext.abilities[key],
                applyDeckCorrection: deckCorrectionEnabled[key] === true,
            }))),
            crewCount: String(latestPerformanceContext.crewCount),
            conditions: JSON.stringify(performanceCompositions),
        });
        const targetGunSpecified = latestPerformanceContext.isCaptainPath
            && el("#performance-fcs-target-gun").checked
            && Number.isInteger(latestPerformanceContext.gunMeta);
        if ((!latestPerformanceContext.isCaptainPath || targetGunSpecified)
            && Number.isInteger(latestPerformanceContext.gunMeta)) {
            parameters.set("gunMeta", String(latestPerformanceContext.gunMeta));
        }
        if (latestPerformanceContext.isCaptainPath) {
            parameters.set("performanceRole", "captain");
            parameters.set("fcsMeta", String(latestPerformanceContext.fcsMeta));
            if (!targetGunSpecified) {
                const targetGuidelineLength = Number(el("#performance-fcs-guide-length").value);
                if (Number.isInteger(targetGuidelineLength)
                    && targetGuidelineLength >= 100
                    && targetGuidelineLength <= 9999) {
                    parameters.set("targetGuidelineLength", String(targetGuidelineLength));
                }
            }
        }
        try {
            const response = await fetch(
                `${API_BASE}/api/sailor/performance/calculate?${parameters}`,
                { cache: "no-store" },
            );
            const body = await response.json();
            if (!response.ok || !body.ok || !Array.isArray(body.result?.results)) {
                throw new Error(body.error || t().unknownResponse);
            }
            const caseLabels = performanceCaseLabels(true);
            const headRow = document.createElement("tr");
            const itemHeading = document.createElement("th");
            itemHeading.textContent = t().performanceItem;
            headRow.append(itemHeading);
            caseLabels.forEach((lines) => appendPerformanceCaseHeading(headRow, lines));
            el("#performance-result-head").replaceChildren(headRow);
            const resultBody = el("#performance-result-body");
            resultBody.replaceChildren();
            const hasAppliedDeckCorrection = body.result.results.some((result) =>
                Number(result.performance?.appliedDeckCorrectionPercent) > 0
            );
            const isGlobalReloadCap = (result) => server.value === "global"
                && Number(result.performance?.gunReloadEfficiencyChangePercent) <= -66;
            const allGlobalReloadCaps = body.result.results.length > 0
                && body.result.results.every(isGlobalReloadCap);
            const appendReloadCapLabel = (cell) => {
                const capLabel = document.createElement("small");
                capLabel.className = "d-block fw-normal text-muted";
                capLabel.textContent = t().performanceAbilityCapReached;
                cell.append(capLabel);
            };
            const reloadRows = latestPerformanceContext.isCaptainPath ? [] : [
                [t().performanceReloadEfficiency, "gunReloadEfficiencyChangePercent", (value) => `${value}%`],
                [t().performanceReloadCapProgress, "gunReloadAbilityCapProgressPercent", (value) => `${Number(value).toFixed(1)}%`],
                [t().performanceAverageReload, "averageGunReloadSeconds", (value) => String(value)],
                ...(allGlobalReloadCaps ? [] : [
                    [t().performanceRequiredDeck, "requiredDeckCorrectionPercent", (value) => value === null ? "" : `${value}%`],
                    [t().performanceAverageReloadWithDeck, "averageGunReloadSecondsWithRequiredDeckCorrection", (value) => value === null ? "" : String(value)],
                ]),
            ];
            const performanceRows = [
                [t().performanceRepair, "repairSpeedPerSecond", (value) => String(value)],
                [t().performanceStructural, "structuralDefense", (value) => String(value)],
                ...(hasAppliedDeckCorrection
                    ? [[t().performanceAppliedDeckCorrection, "appliedDeckCorrectionPercent", (value) => `${value}%`]]
                    : []),
                [t().performanceGuidelineLength, "guidelineLength", (value) => String(value)],
                ...reloadRows,
            ].filter(([, valueKey]) => Object.hasOwn(body.result.results[0]?.performance || {}, valueKey));
            for (const [label, valueKey, formatValue] of performanceRows) {
                const row = document.createElement("tr");
                const heading = document.createElement("th");
                heading.scope = "row";
                heading.textContent = label;
                row.append(heading);
                body.result.results.forEach((result) => {
                    const cell = document.createElement("td");
                    const isDeckSuggestionRow = valueKey === "requiredDeckCorrectionPercent"
                        || valueKey === "averageGunReloadSecondsWithRequiredDeckCorrection";
                    const showReloadCapOnly = isDeckSuggestionRow && isGlobalReloadCap(result);
                    if (showReloadCapOnly) appendReloadCapLabel(cell);
                    else if (valueKey === "gunReloadAbilityCapProgressPercent"
                        && isGlobalReloadCap(result)) {
                        // 구버전 Worker가 2,070,000 기준 도달률을 반환해도 실제
                        // -66% 연사캡 상태와 화면 표시가 충돌하지 않게 한다.
                        cell.textContent = "100.0%";
                    } else cell.textContent = formatValue(result.performance[valueKey]);
                    if (valueKey === "gunReloadEfficiencyChangePercent"
                        && Number(result.performance.appliedDeckCorrectionPercent) === 0
                        && isGlobalReloadCap(result)) {
                        appendReloadCapLabel(cell);
                    }
                    row.append(cell);
                });
                resultBody.append(row);
            }
            const guidelineTargetLength = Number(body.result.guidelineTarget?.length);
            const hasGuidelineTarget = Number.isFinite(guidelineTargetLength);
            if (hasGuidelineTarget) {
                const adjustmentRows = [
                    [t().performanceGuidelineAdjustment, "personnel"],
                    [t().performanceGuidelineRepair(guidelineTargetLength), "repairSpeedPerSecond"],
                    [t().performanceGuidelineStructural(guidelineTargetLength), "structuralDefense"],
                ];
                for (const [label, valueKey] of adjustmentRows) {
                    const row = document.createElement("tr");
                    const heading = document.createElement("th");
                    heading.scope = "row";
                    heading.textContent = label;
                    if (valueKey === "personnel") {
                        const targetDetail = document.createElement("small");
                        targetDetail.className = "d-block fw-normal text-muted";
                        targetDetail.textContent = body.result.guidelineTarget?.source === "gun"
                            ? t().performanceGuidelineTargetGun(
                                guidelineTargetLength,
                                body.result.guidelineTarget?.gun?.name || "-",
                            )
                            : t().performanceGuidelineTargetInput(guidelineTargetLength);
                        heading.append(targetDetail);
                    }
                    row.append(heading);
                    body.result.results.forEach((result) => {
                        const cell = document.createElement("td");
                        const performance = result.performance || {};
                        const adjustment = performance.guidelineAdjustment;
                        if (!performance.guidelineAdjustmentRequired) {
                            const isBelowTarget = Number(performance.guidelineLength) < guidelineTargetLength;
                            cell.textContent = valueKey === "personnel"
                                ? (isBelowTarget
                                    ? t().performanceGuidelineUnavailable
                                    : t().performanceGuidelineNoAdjustment)
                                : "-";
                        } else if (!adjustment?.possible) {
                            cell.textContent = valueKey === "personnel"
                                ? t().performanceGuidelineAdjustmentImpossible
                                : "-";
                        } else if (valueKey === "personnel") {
                            for (const personnelText of [
                                t().performanceGuidelineOfficer(adjustment.officers),
                                t().performanceGuidelineVeteran(adjustment.veterans),
                                t().performanceGuidelineRookie(adjustment.rookies),
                            ]) {
                                const personnelLine = document.createElement("small");
                                personnelLine.className = "d-block fw-normal";
                                personnelLine.textContent = personnelText;
                                cell.append(personnelLine);
                            }
                        } else {
                            cell.textContent = String(adjustment[valueKey]);
                        }
                        row.append(cell);
                    });
                    resultBody.append(row);
                }
            }
            renderImplementedReloadVisualization(body.result.results, caseLabels);
            el("#performance-result-section").hidden = false;
            setPerformanceStatus(t().performanceComplete, "success");
        } catch (error) {
            setPerformanceStatus(t().performanceFailed(error.message), "danger");
        } finally {
            updatePerformanceRequestAvailability();
        }
    }
    function calculate() {
        hideResults();
        if (preset.value === "") return;
        const path = paths[Number(preset.value)];
        const selected = selectedSailorType();
        const initialLevel = selectedInitialLevel(selected);
        const currentLevel = Math.max(initialLevel, Math.min(Number(level.max), Number(level.value) || initialLevel));
        level.value = String(currentLevel);
        const { growth, total, initialGrowth } = readStartingValues();
        const allowLatePromotion = !(server.value === "korea" && selected.event);
        const hasCustomLevels = allowLatePromotion && actualPromotionLevels.some((value) => value !== "" && value !== undefined);
        let pathOpen = true;
        let previousActualLevel = 1;
        const scheduledStages = [];
        const treeBody = el("#tree-body");
        treeBody.replaceChildren();
        path.forEach((stage, index) => {
            const entered = actualPromotionLevels[index] ?? "";
            let actualLevel = stage.requiredLevel;
            const minimumActualLevel = Math.max(stage.requiredLevel, previousActualLevel);
            const isFirstPromotionAfterSailor = server.value === "korea"
                && index > 0
                && path[index - 1].name === "수병";
            const maximumActualLevel = isFirstPromotionAfterSailor
                ? 25
                : Number(level.max);
            const hasValidLatePromotionRange = minimumActualLevel <= maximumActualLevel;
            if (hasCustomLevels) {
                if (!pathOpen || entered === "") pathOpen = false;
                else if (!hasValidLatePromotionRange) pathOpen = false;
                else {
                    actualLevel = Math.min(maximumActualLevel, Math.max(minimumActualLevel, Number(entered) || minimumActualLevel));
                    actualPromotionLevels[index] = String(actualLevel);
                }
            }
            const active = pathOpen && actualLevel <= currentLevel;
            const row = document.createElement("tr");
            if (!active) row.className = "text-muted";
            const actualInput = document.createElement("input");
            actualInput.className = "form-control form-control-sm promotion-level-input";
            actualInput.type = "number";
            actualInput.min = String(minimumActualLevel);
            actualInput.max = String(maximumActualLevel);
            actualInput.placeholder = String(stage.requiredLevel);
            actualInput.value = actualPromotionLevels[index] ?? "";
            actualInput.dataset.index = String(index);
            actualInput.disabled = !allowLatePromotion || !hasValidLatePromotionRange;
            row.innerHTML = `<td>${index + 1}</td><td>${stage.name}${active ? "" : ` (${t().notApplied})`}</td><td>${stage.requiredLevel}</td><td></td><td>${stage.crewGrowth}</td>`;
            row.children[3].append(actualInput);
            for (const [key] of ABILITIES.slice(0, -1)) {
                const value = Number(stage.abilities[key] || 0);
                const cell = document.createElement("td");
                cell.textContent = value > 0 ? `+${value}` : String(value);
                row.append(cell);
            }
            treeBody.append(row);
            if (active) scheduledStages.push({ stage, actualLevel });
            if (pathOpen) previousActualLevel = actualLevel;
        });
        syncPromotionBulkInput(path, allowLatePromotion);

        // Lv.1 누적값에서 시작한다. Lv.N으로 오를 때는 기존 성장값을 먼저
        // 누적하고, Lv.N 전직으로 바뀐 성장값은 Lv.N -> Lv.N+1부터 적용한다.
        let promotionIndex = 0;
        const applyPromotion = ({ stage }) => {
            for (const [key] of ABILITIES) {
                if (key === "crewGrowth") {
                    growth[key] = stage.crewGrowth;
                } else {
                    growth[key] += Number(stage.abilities[key] || 0);
                    const bonus = Number(stage.bonusAbilities?.[key] || 0);
                    total[key] += bonus;
                }
            }
        };
        while (promotionIndex < scheduledStages.length && scheduledStages[promotionIndex].actualLevel <= initialLevel) {
            applyPromotion(scheduledStages[promotionIndex]);
            promotionIndex += 1;
        }
        for (let nextLevel = initialLevel + 1; nextLevel <= currentLevel; nextLevel += 1) {
            for (const [key] of ABILITIES) total[key] += growth[key];
            while (promotionIndex < scheduledStages.length && scheduledStages[promotionIndex].actualLevel === nextLevel) {
                applyPromotion(scheduledStages[promotionIndex]);
                promotionIndex += 1;
            }
        }
        const sailorLevel = selectedSailorLevel(selected);
        if (sailorLevel && currentLevel >= sailorLevel && !hiddenAbilityInputDisabled(selected)) {
            const hiddenLevelUps = sailorLevel - 1;
            for (const [key] of ABILITIES.slice(0, -1)) {
                const hiddenGrowth = Number(el(`#hidden-${key}`).value) || 0;
                total[key] += (hiddenGrowth - initialGrowth[key]) * hiddenLevelUps;
            }
        }
        for (const [key] of ABILITIES) total[key] = Math.max(0, total[key]);
        if (boost.value === "all:20") {
            for (const [key] of ABILITIES.slice(0, -1)) {
                growth[key] = Math.floor(growth[key] / 9 * 11);
                total[key] = Math.floor(total[key] / 9 * 11);
            }
        }
        const isDeckPath = path.some((stage) => server.value === "korea"
            ? /갑판/.test(stage.name)
            : ["2nd Seaman", "1st Seaman", "Chief Seaman"].includes(stage.name));
        el("#result-deck-heading").hidden = !isDeckPath;
        const resultBody = el("#result-body");
        resultBody.replaceChildren();
        for (const ability of ABILITIES) {
            const [key] = ability;
            const row = document.createElement("tr");
            const labelCell = document.createElement("th");
            labelCell.scope = "row";
            labelCell.textContent = abilityLabel(ability);
            const growthCell = document.createElement("td");
            growthCell.textContent = String(growth[key]);
            const totalCell = document.createElement("td");
            if (key === "crewGrowth") {
                totalCell.textContent = String(total[key]);
            } else {
                const totalInput = document.createElement("input");
                totalInput.type = "number";
                totalInput.min = "0";
                totalInput.step = "1";
                totalInput.required = true;
                totalInput.value = String(total[key]);
                totalInput.className = "form-control form-control-sm text-end";
                totalInput.dataset.resultTotalAbility = key;
                totalInput.setAttribute("aria-label", `${abilityLabel(ability)} ${t().total}`);
                totalCell.append(totalInput);
            }
            row.append(labelCell, growthCell, totalCell);
            if (isDeckPath) {
                const deckCell = document.createElement("td");
                deckCell.textContent = key === "crewGrowth" ? String(total[key]) : String(Math.floor(total[key] * 0.07));
                const totalInput = totalCell.querySelector("input");
                if (totalInput) {
                    totalInput.addEventListener("input", () => {
                        const editedTotal = Number(totalInput.value);
                        deckCell.textContent = Number.isFinite(editedTotal)
                            ? String(Math.floor(Math.max(0, editedTotal) * 0.07))
                            : "";
                    });
                }
                row.append(deckCell);
            }
            resultBody.append(row);
        }
        const officerRates = server.value === "korea" ? [0.4, 0.45] : [0.4, 0.45, 0.5];
        const officerHeadRow = document.createElement("tr");
        const officerHeadLabel = document.createElement("th");
        officerHeadLabel.textContent = t().officerRate;
        officerHeadRow.append(officerHeadLabel);
        const officerCountRow = document.createElement("tr");
        const officerCountLabel = document.createElement("th");
        officerCountLabel.scope = "row";
        officerCountLabel.textContent = t().officerCount;
        officerCountRow.append(officerCountLabel);
        for (const rate of officerRates) {
            const rateCell = document.createElement("th");
            rateCell.textContent = `${Math.round(rate * 100)}%`;
            officerHeadRow.append(rateCell);
            const countCell = document.createElement("td");
            countCell.textContent = String(Math.floor(total.crewGrowth * rate));
            officerCountRow.append(countCell);
        }
        el("#officer-head").replaceChildren(officerHeadRow);
        el("#officer-body").replaceChildren(officerCountRow);
        const currentClassName = scheduledStages.at(-1)?.stage.name || path[0].name;
        const appliedClasses = new Set(scheduledStages.map(({ stage }) => stage.name));
        latestPerformanceContext = {
            nationId: Number(nation.value),
            sailorClass: currentClassName,
            abilities: Object.fromEntries(ABILITIES.slice(0, -1).map(([key]) => [key, total[key]])),
            crewCount: total.crewGrowth,
        };
        renderPerformanceInputs(total.crewGrowth);
        latestPerformanceContext.isCaptainPath = renderPerformanceFcsCatalog(appliedClasses);
        el("#performance-fcs-guide-length").disabled = latestPerformanceContext.isCaptainPath
            && el("#performance-fcs-target-gun").checked;
        if (latestPerformanceContext.isCaptainPath) {
            latestPerformanceContext.fcsMeta = Number(el("#performance-fcs-select").value);
        }
        renderPerformanceGunInput(
            appliedClasses,
            currentLevel,
            currentClassName,
        );
        setPerformanceStatus(t().performanceReady, "success");
        updatePerformanceRequestAvailability();
        const boostText = boost.options[boost.selectedIndex]?.textContent || t().none;
        const sailorPresetText = sailorType.options[sailorType.selectedIndex]?.textContent || "";
        el("#result-summary").textContent = `${nationName(server.value, nation.value)} · ${currentClassName} · Lv.${currentLevel} · ${t().appliedSailorPreset}: ${sailorPresetText} · ${t().appliedBoost}: ${boostText}`;
        el("#tree-section").hidden = false;
        el("#result-section").hidden = false;
        setStatus(t().complete, "success");
    }
    function hideResults() {
        latestPerformanceContext = null;
        availablePerformanceGuns = [];
        availablePerformanceFcs = [];
        clearPerformanceApiResult();
        el("#tree-section").hidden = true;
        el("#result-section").hidden = true;
        el("#performance-input-section").hidden = true;
        el("#performance-fcs-section").hidden = true;
        el("#performance-gun-section").hidden = true;
    }
    applyLanguage();
    server.addEventListener("change", selectServer);
    nation.addEventListener("change", loadNationCatalogs);
    preset.addEventListener("change", () => {
        actualPromotionLevels = [];
        bulkPromotionLevel = "";
        el("#performance-fcs-target-gun").checked = false;
        setPromotionBulkFeedback();
        calculate();
    });
    level.addEventListener("input", calculate);
    sailorType.addEventListener("change", () => applySailorType());
    boost.addEventListener("change", calculate);
    el("#sailor-form").addEventListener("input", (event) => {
        if (event.target.matches("[data-growth-ability], [data-total-ability], [data-hidden-ability]")) calculate();
    });
    el("#tree-body").addEventListener("change", (event) => {
        if (!event.target.matches(".promotion-level-input")) return;
        actualPromotionLevels[Number(event.target.dataset.index)] = event.target.value;
        bulkPromotionLevel = "";
        setPromotionBulkFeedback();
        calculate();
    });
    el("#promotion-bulk-apply").addEventListener("click", applyBulkPromotionLevels);
    el("#promotion-bulk-input").addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        applyBulkPromotionLevels();
    });
    el("#performance-fcs-guide-length").addEventListener("change", (event) => {
        if (event.target.value === "") {
            clearPerformanceApiResult();
            return;
        }
        const guideLength = Math.floor(Number(event.target.value) || 100);
        event.target.value = String(Math.max(100, Math.min(9999, guideLength)));
        clearPerformanceApiResult();
    });
    el("#performance-fcs-target-gun").addEventListener("change", calculate);
    el("#performance-input-body").addEventListener("input", (event) => {
        if (!event.target.matches(".performance-personnel-input")) return;
        const index = Number(event.target.dataset.index);
        const field = event.target.dataset.field;
        const composition = performanceCompositions[index];
        if (!composition) return;
        const inputValue = Math.max(0, Math.floor(Number(event.target.value) || 0));
        if (field === "veterans" || field === "rookies") performanceDetailedHeaders[index] = true;
        composition[field] = field === "officers" ? Math.min(inputValue, maximumPerformanceOfficers(performanceCrewCount)) : inputValue;
        fitPerformanceComposition(composition, field);
        for (const personnelField of ["officers", "veterans", "rookies"]) {
            const input = el(`#performance-input-body [data-index="${index}"][data-field="${personnelField}"]`);
            if (input) input.value = String(composition[personnelField]);
        }
        updatePerformanceCrewDisplay(index);
        clearPerformanceApiResult();
    });
    el("#performance-input-body").addEventListener("input", (event) => {
        if (!event.target.matches(".performance-deck-rate-input")) return;
        const composition = performanceCompositions[Number(event.target.dataset.index)];
        if (!composition) return;
        composition.deckCorrectionRate = Math.min(12, Math.max(0, Number(event.target.value) || 0));
        event.target.value = String(composition.deckCorrectionRate);
        clearPerformanceApiResult();
    });
    el("#performance-calculate-button").addEventListener("click", requestPerformanceCalculation);
    el("#performance-fcs-select").addEventListener("change", (event) => {
        if (latestPerformanceContext?.isCaptainPath) {
            latestPerformanceContext.fcsMeta = Number(event.target.value);
        }
        clearPerformanceApiResult();
        updatePerformanceRequestAvailability();
    });
    el("#performance-gun-select").addEventListener("change", () => {
        updatePerformanceGunDetails();
        clearPerformanceApiResult();
    });
    el("#performance-deck-ability-body").addEventListener("change", (event) => {
        if (!event.target.matches(".performance-deck-ability-checkbox")) return;
        deckCorrectionEnabled[event.target.dataset.ability] = event.target.checked;
        clearPerformanceApiResult();
    });
    selectServer();
})();
