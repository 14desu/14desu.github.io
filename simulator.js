(() => {
    "use strict";
    const ABILITIES = [
        ["potential", "잠재", "Potential"], ["accuracy", "명중", "Accuracy"], ["reload", "연사", "Reload"],
        ["torpedo", "어뢰", "Torpedo"], ["antiAir", "대공", "Anti-air"], ["repair", "수리", "Repair"],
        ["restore", "보수", "Restore"], ["engine", "기관", "Engine"], ["aircraft", "함재", "Aircraft"],
        ["fighter", "전투", "Fighter"], ["bomber", "폭격", "Bomber"], ["crewGrowth", "수병수", "Crew"],
    ];
    const SEAMAN_ADJ_ABILITIES = ABILITIES.slice(0, -1);
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
    function initialGrowthValues(base, overrides = {}) {
        return Object.fromEntries(ABILITIES.slice(0, -1).map(([key]) => [key, overrides[key] ?? base]));
    }
    function level12Abilities(base, overrides = {}) {
        return { ...initialGrowthValues(base, overrides), crewGrowth: 110 };
    }
    function eliteType(id, name, key, base, specialized, paired = base) {
        const overrides = { [key]: specialized };
        if (key === "accuracy") overrides.reload = paired;
        if (key === "reload") overrides.accuracy = paired;
        return { id, en: name, initialGrowth: initialGrowthValues(base, overrides), ability: { [key]: 30 } };
    }
    function superEliteType(id, name, key, specialized = 15, paired = 10) {
        const sailor = eliteType(id, name, key, 10, specialized, paired);
        sailor.ability[key] = 36;
        return sailor;
    }
    function advancedEliteType(id, name, key, specialized) {
        const sailor = eliteType(id, name, key, 10, specialized);
        sailor.initialLevel = 12;
        sailor.ability = level12Abilities(140, { [key]: 223 });
        return sailor;
    }
    const KOREA_SAILOR_TYPES = [
        { id: "normal", ko: "일반 수병", en: "Normal sailor" },
        { id: "attendance", ko: "개근 수병 Lv90", en: "Attendance event sailor Lv90", event: true, level: 90, initialGrowth: { accuracy: 14, reload: 14 }, ability: { accuracy: 30, reload: 30 } },
        { id: "legendSupport", ko: "전설 보조 수병 Lv90", en: "Legendary support sailor Lv90", event: true, level: 90, initialGrowth: { repair: 14, restore: 14, engine: 14 }, ability: { repair: 30, restore: 30, engine: 30 } },
        { id: "legendSpecial", ko: "전설 특무 수병 Lv90", en: "Legendary special sailor Lv90", event: true, level: 90, initialGrowth: { aircraft: 14, fighter: 14, bomber: 14 }, ability: { aircraft: 30, fighter: 30, bomber: 30 } },
        { id: "premiumPotential", ko: "프리미엄 잠재 수병 Lv12", en: "Premium potential sailor Lv12", initialGrowth: { potential: 17 }, ability: { potential: 30 } },
        { id: "premiumAccuracy", ko: "프리미엄 명중 수병 Lv12", en: "Premium accuracy sailor Lv12", initialGrowth: { accuracy: 14, reload: 11 }, ability: { accuracy: 30, reload: 30 } },
        { id: "premiumReload", ko: "프리미엄 연사 수병 Lv12", en: "Premium reload sailor Lv12", initialGrowth: { accuracy: 11, reload: 14 }, ability: { accuracy: 30, reload: 30 } },
        { id: "premiumTorpedo", ko: "프리미엄 어뢰 수병 Lv12", en: "Premium torpedo sailor Lv12", initialGrowth: { torpedo: 14 }, ability: { torpedo: 30 } },
        { id: "premiumRepair", ko: "프리미엄 수리 수병 Lv12", en: "Premium repair sailor Lv12", initialGrowth: { repair: 14 }, ability: { repair: 30 } },
        { id: "premiumRestore", ko: "프리미엄 보수 수병 Lv12", en: "Premium restore sailor Lv12", initialGrowth: { restore: 14 }, ability: { restore: 30 } },
        { id: "premiumEngine", ko: "프리미엄 기관 수병 Lv12", en: "Premium engine sailor Lv12", initialGrowth: { engine: 14 }, ability: { engine: 30 } },
        { id: "premiumFighter", ko: "프리미엄 전투 수병 Lv12", en: "Premium fighter sailor Lv12", initialGrowth: { fighter: 14 }, ability: { fighter: 30 } },
        { id: "premiumBomber", ko: "프리미엄 폭격 수병 Lv12", en: "Premium bomber sailor Lv12", initialGrowth: { bomber: 14 }, ability: { bomber: 30 } },
    ];
    const GLOBAL_SAILOR_TYPES = [
        { id: "normal", en: "Normal sailor" },
        { id: "nfXSailor", en: "NF X Sailor Lv12", initialLevel: 12, initialGrowth: initialGrowthValues(18), ability: level12Abilities(251), source: "https://www.navyfield.com/Store/View.aspx?num=333&category=C&page=1" },
        { id: "advancedHero", en: "Advanced Hero Sailor Lv12", initialLevel: 12, initialGrowth: initialGrowthValues(16), ability: level12Abilities(212), source: "https://www.navyfield.com/Store/View.aspx?num=400&category=C&page=1" },
        { id: "heroSailor", en: "Hero Sailor Lv12", initialLevel: 12, initialGrowth: initialGrowthValues(14), ability: level12Abilities(184) },
        eliteType("elitePotential", "Elite Potential Sailor", "potential", 9, 16),
        eliteType("eliteAccuracy", "Elite Accuracy Sailor", "accuracy", 9, 13, 11),
        eliteType("eliteReload", "Elite Reload Sailor", "reload", 9, 13, 11),
        eliteType("eliteTorpedo", "Elite Torpedo Sailor", "torpedo", 9, 13),
        eliteType("eliteRepair", "Elite Repair Sailor", "repair", 9, 13),
        eliteType("eliteRestore", "Elite Restore Sailor", "restore", 9, 13),
        eliteType("eliteEngine", "Elite Engine Sailor", "engine", 9, 13),
        eliteType("eliteFighter", "Elite Fighter Pilot", "fighter", 9, 13),
        eliteType("eliteBomber", "Elite Bomber Pilot", "bomber", 9, 13),
        superEliteType("superElitePotential", "Super Elite Potential", "potential", 18),
        superEliteType("superEliteAccuracy", "Super Elite Accuracy", "accuracy", 15, 12),
        superEliteType("superEliteReload", "Super Elite Reload", "reload", 15, 12),
        superEliteType("superEliteTorpedo", "Super Elite Torpedo", "torpedo"),
        superEliteType("superEliteRepair", "Super Elite Repair", "repair"),
        superEliteType("superEliteRestore", "Super Elite Restore", "restore"),
        superEliteType("superEliteEngine", "Super Elite Engine", "engine"),
        superEliteType("superEliteFighter", "Super Elite Fighter", "fighter"),
        superEliteType("superEliteBomber", "Super Elite Bomber", "bomber"),
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
            subtitle: "", settingsTitle: "수병 설정", calculatorSettings: "계산기 설정", sailorCalculation: "수병", shipCalculation: "함선", sailorLayer: "수병", addSailor: "수병 추가", removeSailor: "수병 삭제", captain: "함장", gunner: "포병", support: "보조", ship: "함선목록", shipPlaceholder: "함선을 선택하세요", modeHelp: "함선을 선택하면 함장 1명과 포병석·보조석 수에 맞춰 수병 탭이 자동으로 구성됩니다.", serverHelp: "Global server users: select “Global server”.",
            shipOption: (name, level, type, gunnerSlots, supportSlots) => `${type} Lv.${level} ${name} 포병석 ${gunnerSlots} 보조석 ${supportSlots}`,
            shipCapacity: (total, gunnerSlots, supportSlots) => `탑승 수병 ${total}명 (함장 1 + 포병 ${gunnerSlots} + 보조 ${supportSlots})`,
            shipRosterTitle: "함선 수병 설정", selectSailorLayer: "수병 좌석 선택",
            rosterSeat: "수병 좌석", rosterClass: "병종", rosterLevel: "Lv", rosterSailor: "수병", rosterBoost: "강화", rosterClassChange: "전직", rosterOfficer: "사관", performanceOutput: "출력", onTime: "칼직",
            server: "서버", nation: "국가", preset: "전직 트리 프리셋", level: "현재 레벨", sailorType: "수병 프리셋", boost: "수병 강화 아이템",
            initialGrowthInput: "초기 성장 어빌리티", initialAbilityInput: "초기 누적 어빌리티", hiddenGrowthInput: (level) => `히든 어빌리티 (Lv1 ~ Lv${level})`, abilityHelp: "수병 종류를 선택하면 초기값이 자동 입력됩니다. 수병수는 기본값을 표시하며 직접 입력할 수 없습니다.",
            hiddenHelp: "히든 어빌리티는 수병명 끝에 표시된 레벨까지 실제로 적용된 성장값입니다. 누적 보정값은 (히든 어빌리티 - 초기 성장 어빌리티) × (표시 레벨 - 1)이며, 현재 레벨이 표시 레벨보다 낮으면 반영하지 않습니다.",
            nationPlaceholder: "국가를 선택하세요", presetPlaceholder: "전직 트리를 선택하세요", none: "강화 없음", boost20: "전체 20% 강화",
            plus1: "1강", plus2: "2강", loading: "국가별 시뮬레이터 카탈로그를 불러오는 중…", unknownResponse: "알 수 없는 API 응답 형식입니다.",
            loaded: (count) => `${count}개 병종을 불러왔습니다. 국가를 선택하세요.`, loadError: (message) => `시뮬레이터 카탈로그를 불러오지 못했습니다: ${message}`,
            paths: (count) => `${count}개 전직 프리셋을 구성했습니다.`, complete: "계산이 완료되었습니다.", treeTitle: "적용 전직 트리",
            classChangeHelp: "실제 전직 Lv을 모두 비우면 전직 가능 Lv을 적용합니다. 하나라도 입력하면 빈 단계부터 전직하지 않은 것으로 계산합니다.",
            classChangeBulkLabel: "실제 전직 Lv. 일괄 입력", classChangeBulkApply: "적용", classChangeBulkPlaceholder: "예) 120",
            classChangeBulkHelp: "입력한 하나의 레벨을 수병 다음인 2단계부터 모두 적용합니다. 각 단계의 전직 요구 레벨보다 낮게 적용되지 않으며, 한국 서버의 2단계는 Lv.25가 상한입니다.",
            classChangeBulkInvalid: (minimum, maximum) => `전직 레벨은 ${minimum}~${maximum} 사이의 정수로 입력하세요.`, classChangeBulkApplied: (level) => `Lv.${level}을 2단계 이후 실제 전직 레벨에 일괄 적용했습니다.`, classChangeBulkCleared: "일괄 입력을 비워 기본 전직 가능 레벨을 적용했습니다.", classChangeBulkKoreaCap: (level) => `Lv.${level}을 일괄 적용하고 한국 서버 2단계만 Lv.25로 조정했습니다.`,
            step: "단계", className: "병종", required: "전직 가능 Lv.", actual: "실제 전직 Lv.", crewGrowth: "수병수 성장",
            resultTitle: "수병 계산 결과", ability: "어빌리티", currentGrowth: "성장", currentAbility: "누적", seamanAdjAbility: "표시", resultAbilityHelp: "누적 어빌리티를 직접 수정할 수 있으며, 수정한 값은 성능 계산 요청에 반영됩니다.", fixedResultAbilityHelp: "수병 프리셋에 누적값이 지정된 어빌리티만 직접 수정할 수 없습니다.", officerTitle: "사관수", officerRate: "사관 비율", officerCount: "사관수", performanceInputTitle: "성능 검토 입력", performancePersonnelTitle: "사관 숙련병 신병 조건", performanceSeamanAdjAbilityTitle: "갑판병 보정 적용 어빌", performanceGunTitle: "시뮬레이트 적용 함포", performanceGun: "함포", performanceGunClass: "필요병종", performanceGunLevel: "필요레벨", performanceGunCaliber: "구경", performanceGunBarrels: "연장", performanceGunElevation: "최대양각", performanceGunReload: "함포 연사속도", performanceSimulationTitle: "수병 성능 시뮬레이션", performanceItem: "성능 항목", performanceCase: "조건", performanceOfficer: "사관", performanceVeteran: "숙련병", performanceRookie: "신병", performanceSeamanAdjustmentPercent: "갑판병 보정률", performanceCrewCount: "현재 / 총 수병수", performanceCrewRate: "수병 비율", performanceReady: "누적 어빌리티를 수정하고 계산을 요청할 수 있습니다.\n성능 검토 조건을 입력하고 계산을 요청하세요.", performanceCalculate: "성능 계산 요청", performanceCalculating: "계산 요청 중…", performanceComplete: "시뮬레이션이 완료되었습니다.", performanceFailed: (message) => `성능 계산 요청 실패: ${message}`, performanceRepair: "수리속도 [/s]", performanceStructural: "구조방어", performanceAppliedSeamanAdjustment: "연사 적용 갑판병 보정률", performanceReloadEfficiency: "수병 연사효율 구간", performanceReloadCapProgress: "연사 어빌캡 도달율", performanceAbilityCapReached: "연사캡 도달", performanceAverageReload: "선택 함포 평균 연사시간 [s]", performanceRequiredSeamanAdjustment: "다음 연사구간 필요 갑판 보정", performanceAverageReloadWithSeamanAdjustment: "필요 갑판 보정 적용 평균 연사시간 [s]", appliedSailorPreset: "수병 프리셋", appliedBoost: "적용 강화", notApplied: "미적용", noChange: "변화 없음",
            performanceFcsTitle: "시뮬레이트 적용 FCS", performanceFcsName: "FCS리스트", performanceFcsGuideLength: "목표가이드라인길이", performanceFcsTargetGun: "목표함포지정", performanceFcsAccuracy: "명중 보너스", performanceFcsCapacity: "필요용적", performanceGuidelineLength: "가이드라인 길이", performanceGuidelineAdjustment: "목표가이드라인 수병조절", performanceGuidelineTargetInput: (target) => `${target} : 직접입력`, performanceGuidelineTargetGun: (target, gunName) => `${target} : ${gunName}`, performanceGuidelineRepair: (target) => `가이드라인 (${target}) 수리속도 [/s]`, performanceGuidelineStructural: (target) => `가이드라인 (${target}) 구조방어`, performanceGuidelineNoAdjustment: "조절 불필요", performanceGuidelineUnavailable: "불가능", performanceGuidelineAdjustmentImpossible: "사관수 고정 조건에서 조절 불가", performanceGuidelineCalculated: (length) => `가이드라인 계산 : ${length}`, performanceGuidelineOfficer: (value) => `사관 ${value}`, performanceGuidelineVeteran: (value) => `숙련병 ${value}`, performanceGuidelineRookie: (value) => `신병 ${value}`,
            performanceSeamanAdjustmentHelp: "갑판 보정은 0~12%를 입력합니다. 입력 시 관련 성능에 반영하여 계산합니다.",
            performanceImplementedReloadTitle: "12회 구현 연사시간 비교 [s]", performanceImplementedReloadHelp: "각 조건의 12회 구현 연사시간을 비교합니다. 막대 아래에는 각 발사까지의 누적시간을 표시하며, 느린 구간은 부드러운 빨간색, 중간은 노란색, 빠른 구간은 초록색입니다.", performanceTimeline: "12회 누적시간 [s]", performanceShotNumber: (index) => `${index}회차`, performanceTimelineSummary: (total, average) => `총 ${total}s · 평균 ${average}s`, performanceIntervalDetail: (index, interval, cumulative) => `${index}회차: ${interval}s · 누적 ${cumulative}s`,
            performanceResultTableTitle: "수병 성능 시뮬레이션 결과",
        },
        en: {
            subtitle: "", settingsTitle: "Sailor settings", calculatorSettings: "Simulator settings", sailorCalculation: "Sailor", shipCalculation: "Ship", sailorLayer: "Sailor", addSailor: "Add sailor", removeSailor: "Remove sailor", captain: "B.O.", gunner: "Gunner", support: "Support", ship: "Ship List", shipPlaceholder: "Select a ship", modeHelp: "Selecting a ship automatically creates one B.O. plus its gunner and support sailor slots.", serverHelp: "Global server users: select “Global server”.",
            shipOption: (name, level, type, gunnerSlots, supportSlots) => `${type} Lv.${level} ${name} Gunner ${gunnerSlots} Support ${supportSlots}`,
            shipCapacity: (total, gunnerSlots, supportSlots) => `${total} Sailor Slot (1 B.O. + ${gunnerSlots} Gunner + ${supportSlots} Support)`,
            shipRosterTitle: "Ship Sailor Settings", selectSailorLayer: "Select sailor slot",
            rosterSeat: "Sailor Slot", rosterClass: "Class", rosterLevel: "Lv", rosterSailor: "Sailor", rosterBoost: "Boost", rosterClassChange: "Class Change", rosterOfficer: "Officers", performanceOutput: "Output", onTime: "OnTime",
            server: "Server", nation: "Nation", preset: "Class change path preset", level: "Current level", sailorType: "Sailor preset", boost: "Sailor enhancement item",
            initialGrowthInput: "Initial growth abilities", initialAbilityInput: "Initial accumulated abilities", hiddenGrowthInput: (level) => `Hidden abilities (Lv1 ~ Lv${level})`, abilityHelp: "Selecting a sailor type fills the initial values automatically. Crew values are read-only.",
            hiddenHelp: "Hidden abilities are the growth values actually applied through the level shown at the end of the sailor name. The accumulated correction is (hidden ability - initial growth ability) × (displayed level - 1), and is not applied when the current level is below the displayed level.",
            hiddenDisabledHelp: "Hidden ability input is disabled because this Lv12 preset starts with accumulated abilities that already include levels 1–12.",
            nationPlaceholder: "Select a nation", presetPlaceholder: "Select a class change path", none: "No enhancement", boost20: "Premium Sailors / increase +20%",
            plus1: "+1 enhancement", plus2: "+2 enhancement", loading: "Loading the nation simulator catalog…", unknownResponse: "Unknown API response format.",
            loaded: (count) => `Loaded ${count} classes. Select a nation.`, loadError: (message) => `Could not load the simulator catalog: ${message}`,
            paths: (count) => `Built ${count} class change path presets.`, complete: "Calculation complete.", treeTitle: "Applied class change path",
            classChangeHelp: "Leave all actual class change levels blank to use the required levels. Once any level is entered, the first blank stage and all subsequent stages are treated as not having changed class.",
            classChangeBulkLabel: "Actual class change Lv. (all stages)", classChangeBulkApply: "Apply", classChangeBulkPlaceholder: "e.g. 125",
            classChangeBulkHelp: "Applies one level to every stage after Sailor. No stage is set below its required class change level.",
            classChangeBulkInvalid: (minimum, maximum) => `Enter a whole-number class change level from ${minimum} to ${maximum}.`, classChangeBulkApplied: (level) => `Applied Lv.${level} to every actual class change level after Sailor.`, classChangeBulkCleared: "Cleared bulk input and restored the required class change levels.", classChangeBulkKoreaCap: (level) => `Applied Lv.${level} in bulk and adjusted Korea-server stage 2 to Lv.25.`,
            step: "Stage", className: "Class", required: "Required Lv.", actual: "Actual Lv.", crewGrowth: "Crew growth",
            resultTitle: "Sailor calculation results", ability: "Ability", currentGrowth: "Growth", currentAbility: "Ability", seamanAdjAbility: "Display", resultAbilityHelp: "You can edit accumulated abilities directly. The edited values will be used for the performance calculation.", fixedResultAbilityHelp: "Only abilities with accumulated values supplied by the sailor preset cannot be edited.", officerTitle: "Officers", officerRate: "Officer rate", officerCount: "Officers", performanceInputTitle: "Performance review inputs", performancePersonnelTitle: "Officer, veteran, and rookie conditions", performanceSeamanAdjAbilityTitle: "Abilities affected by seaman adjustment", performanceGunTitle: "Gun applied to simulation", performanceGun: "Gun", performanceGunClass: "Required class", performanceGunLevel: "Required level", performanceGunCaliber: "Caliber", performanceGunBarrels: "Mount", performanceGunElevation: "Maximum elevation", performanceGunReload: "Gun reload time", performanceSimulationTitle: "Sailor performance simulation", performanceItem: "Performance", performanceCase: "Case", performanceOfficer: "Officers", performanceVeteran: "Veterans", performanceRookie: "Rookies", performanceSeamanAdjustmentPercent: "Seaman adjustment rate", performanceCrewCount: "Current / total crew", performanceCrewRate: "Crew rate", performanceReady: "Review or edit accumulated abilities and performance conditions, then request a calculation.", performanceCalculate: "Request performance simulation", performanceCalculating: "Requesting calculation…", performanceComplete: "Simulation complete.", performanceFailed: (message) => `Performance request failed: ${message}`, performanceRepair: "Repair speed [/s]", performanceStructural: "Structural defense", performanceAppliedSeamanAdjustment: "Seaman adjustment applied to reload", performanceReloadEfficiency: "Sailor reload efficiency tier", performanceReloadCapProgress: "Reload ability cap progress", performanceAbilityCapReached: "Reload cap reached", performanceAverageReload: "Selected gun average reload time [s]", performanceRequiredSeamanAdjustment: "Seaman adjustment needed for next reload tier", performanceAverageReloadWithSeamanAdjustment: "Average reload with required adjustment [s]", appliedSailorPreset: "Sailor preset", appliedBoost: "Applied enhancement", notApplied: "not applied", noChange: "No change",
            performanceFcsTitle: "FCS applied to simulation", performanceFcsName: "FCS list", performanceFcsGuideLength: "Target guideline length", performanceFcsTargetGun: "Specify target gun", performanceFcsAccuracy: "Accuracy bonus", performanceFcsCapacity: "Required capacity", performanceGuidelineLength: "Guideline length", performanceGuidelineAdjustment: "Target guideline sailor adjustment", performanceGuidelineTargetInput: (target) => `${target}: direct input`, performanceGuidelineTargetGun: (target, gunName) => `${target}: ${gunName}`, performanceGuidelineRepair: (target) => `Guideline (${target}) repair speed [/s]`, performanceGuidelineStructural: (target) => `Guideline (${target}) structural defense`, performanceGuidelineNoAdjustment: "No adjustment needed", performanceGuidelineUnavailable: "Unavailable", performanceGuidelineAdjustmentImpossible: "Cannot adjust while keeping officers fixed", performanceGuidelineCalculated: (length) => `Calculated guideline: ${length}`, performanceGuidelineOfficer: (value) => `Officers ${value}`, performanceGuidelineVeteran: (value) => `Veterans ${value}`, performanceGuidelineRookie: (value) => `Rookies ${value}`,
            performanceSeamanAdjustmentHelp: "Enter a seaman adjustment from 0% to 12%. The entered rate is applied when calculating the related performance values.",
            performanceImplementedReloadTitle: "12-shot implemented reload comparison [s]", performanceImplementedReloadHelp: "Compares 12 implemented reload intervals for each case. Cumulative time through each shot appears below the bar; slow intervals are soft red, medium intervals yellow, and fast intervals green.", performanceTimeline: "12-shot cumulative time [s]", performanceShotNumber: (index) => `Shot ${index}`, performanceTimelineSummary: (total, average) => `Total ${total}s · average ${average}s`, performanceIntervalDetail: (index, interval, cumulative) => `Shot ${index}: ${interval}s · cumulative ${cumulative}s`,
            performanceResultTableTitle: "Performance results",
        },
    };
    const API_BASE = document.querySelector('meta[name="sailor-api-base"]')?.content.replace(/\/$/, "") || "";
    const CATALOG_BASE = `${API_BASE}/catalog`;
    const STATIC_CATALOG_VERSIONS = {
        "sailor-catalog.json": "20260914-2",
        "gun-shipyard-catalog.json": "20260906-3",
        "fcs-catalog.json": "20260912-1",
        "ship-catalog.json": "20260912-4",
    };
    const STATIC_CATALOG_SCHEMAS = {
        "sailor-catalog.json": 2,
        "gun-shipyard-catalog.json": 2,
        "fcs-catalog.json": 1,
        "ship-catalog.json": 3,
    };
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
    let actualClassChangeLevels = [];
    let bulkClassChangeLevel = "";
    let performanceCompositions = [];
    let performanceDetailedHeaders = [];
    let performanceSelectedConditionIndex = 0;
    let performanceCrewCount = null;
    let performanceEngineCrewCount = 1;
    let performanceServer = null;
    let latestPerformanceContext = null;
    let availablePerformanceGuns = [];
    let availablePerformanceFcs = [];
    let catalogRequestSequence = 0;
    let staticCatalogPromise = null;
    const seamanAdjustmentEnabled = Object.fromEntries(SEAMAN_ADJ_ABILITIES.map(([key]) => [key, true]));
    let simulatorMode = "single";
    let resultView = "all";
    let activeShipLayer = 0;
    const layerSets = {
        single: [{ role: "sailor", roleIndex: 1, state: null }],
        ship: [{ role: "captain", roleIndex: 1, state: null }],
    };
    const activeLayerIndexes = { single: 0, ship: 0 };
    let shipLayers = layerSets.single;
    let changingShipLayer = false;
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
    const hasPresetInitialGrowthValues = (selected) => Boolean(selected?.initialGrowth);
    const hasPresetAbilityValues = (selected) => Boolean(selected?.ability);
    const hasPresetAbilityValue = (selected, key) => Object.prototype.hasOwnProperty.call(selected?.ability || {}, key);
    const hiddenGrowthInputDisabled = (selected) => server.value === "global" && selectedInitialLevel(selected) > 1;

    function setStatus(message, kind = "secondary") {
        status.className = `alert alert-${kind} py-2`;
        status.textContent = message;
    }
    function updateIntroNoticeVisibility() {
        const hide = Boolean(server.value && nation.value);
        for (const block of [el(".renewal-message")]) {
            if (!block) continue;
            block.hidden = hide;
            if (block.previousElementSibling?.matches("h4")) block.previousElementSibling.hidden = hide;
        }
    }
    function option(value, text) {
        const item = document.createElement("option");
        item.value = value;
        item.textContent = text;
        return item;
    }

    async function fetchStaticCatalog(name) {
        const version = STATIC_CATALOG_VERSIONS[name];
        const schemaVersion = STATIC_CATALOG_SCHEMAS[name];
        const versionQuery = version ? `?v=${encodeURIComponent(version)}` : "";
        const response = await fetch(`${CATALOG_BASE}/${name}${versionQuery}`, { cache: "default" });
        if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
        const catalog = await response.json();
        if (version && catalog.catalogVersion !== version) {
            throw new Error(`${name}: expected catalog ${version}, received ${catalog.catalogVersion || "unversioned"}`);
        }
        if (schemaVersion && catalog.schemaVersion !== schemaVersion) {
            throw new Error(`${name}: expected schema ${schemaVersion}, received ${catalog.schemaVersion || "unversioned"}`);
        }
        return catalog;
    }

    function gunCalibre(model) {
        const match = String(model || "").match(/(\d+(?:\.\d+)?)\s*"/);
        return match ? Number(match[1]) : 0;
    }

    function normalizeStaticGun(gun, meta) {
        const requirements = Array.isArray(gun.requirements) ? gun.requirements : [];
        const primary = requirements[0] || {};
        const secondary = requirements[1] || {};
        const projectiles = Array.isArray(gun.projectiles) ? gun.projectiles : [];
        const shipyardRange = projectiles.reduce(
            (maximum, projectile) => Math.max(maximum, Number(projectile.shipyardRange) || 0),
            0,
        );
        return {
            ...gun,
            meta,
            name: gun.model,
            requiredClassName: primary.sailorTypeName || "",
            requiredLevel: Number(primary.level) || 0,
            secondaryRequiredClassName: secondary.sailorTypeName || "",
            secondaryRequiredLevel: Number(secondary.level) || 0,
            mountCode: `${Math.max(1, Number(gun.barrelCount) || 1)}x`,
            caliberInches: gunCalibre(gun.model),
            maxElevation: Number(gun.maxAngle) || 0,
            reloadSeconds: Number(gun.reloadSpeed) || 0,
            shipyardRange,
        };
    }

    async function loadStaticCatalogs() {
        if (!staticCatalogPromise) {
            staticCatalogPromise = Promise.all([
                fetchStaticCatalog("sailor-catalog.json"),
                fetchStaticCatalog("gun-shipyard-catalog.json"),
                fetchStaticCatalog("fcs-catalog.json"),
                fetchStaticCatalog("ship-catalog.json"),
            ]).catch((error) => {
                staticCatalogPromise = null;
                throw error;
            });
        }
        return staticCatalogPromise;
    }

    async function staticNationCatalog(serverId, nationId) {
        const [sailorCatalog, gunCatalog, fcsCatalog, shipCatalog] = await loadStaticCatalogs();
        const numericNationId = Number(nationId);
        const sailorServer = sailorCatalog.servers?.[serverId];
        const sailorNation = sailorServer?.nations?.find((item) => item.id === numericNationId);
        const gunServer = gunCatalog.servers?.[serverId];
        const fcsServer = fcsCatalog.servers?.[serverId];
        const fcsNation = fcsServer?.nations?.find((item) => item.id === numericNationId);
        const shipServer = shipCatalog.servers?.[serverId];
        if (!sailorServer || !sailorNation || !gunServer || !fcsNation || !shipServer) {
            throw new Error(t().unknownResponse);
        }
        return {
            sailors: {
                language: sailorServer.language,
                nations: sailorServer.nations.map(({ id, name }) => ({ id, name })),
                sailors: sailorNation.sailors,
            },
            equipment: {
                guns: gunServer.guns
                    .map((gun, index) => ({ gun, index }))
                    .filter(({ gun }) => gun.nationId === numericNationId)
                    .map(({ gun, index }) => normalizeStaticGun(gun, index)),
                fcs: (fcsNation.fcs || []).map((fcs, index) => ({
                    ...fcs,
                    meta: index,
                    name: fcs.fcs,
                    requiredCapacity: Number(fcs.reqCapacity) || 0,
                    spottingCorrectionLimitRange: Number(fcs.impactRevisionRangeLimit) || 0,
                })),
                ships: (shipServer.ships || []).filter((ship) => Number(ship.NationID) === numericNationId),
            },
        };
    }
    function renderAbilityInputs() {
        for (const [containerId, type] of [["#initial-growth-abilities", "initialGrowth"], ["#initial-abilities", "initialAbility"]]) {
            const wrap = el(containerId);
            wrap.replaceChildren();
            for (const ability of ABILITIES) {
                const [key] = ability;
                const box = document.createElement("div");
                box.className = "ability-input";
                const defaultValue = type === "initialGrowth" ? (key === "crewGrowth" ? 5 : 9) : (key === "crewGrowth" ? 55 : 27);
                const label = document.createElement("label");
                label.htmlFor = `${type === "initialGrowth" ? "initial-growth" : "initial-ability"}-${key}`;
                label.textContent = abilityLabel(ability);
                box.append(label);
                if (key === "crewGrowth") {
                    const value = document.createElement("div");
                    value.id = `${type === "initialGrowth" ? "initial-growth" : "initial-ability"}-${key}`;
                    value.className = "ability-readonly";
                    value.dataset[type] = key;
                    value.textContent = String(defaultValue);
                    box.append(value);
                } else {
                    const input = document.createElement("input");
                    input.id = `${type === "initialGrowth" ? "initial-growth" : "initial-ability"}-${key}`;
                    input.className = "form-control form-control-sm";
                    input.type = "number";
                    input.step = "1";
                    input.value = String(defaultValue);
                    input.dataset[type] = key;
                    box.append(input);
                }
                wrap.append(box);
            }
        }
    }
    function renderHiddenGrowthInputs() {
        const wrap = el("#hidden-growth-abilities");
        wrap.replaceChildren();
        for (const ability of ABILITIES.slice(0, -1)) {
            const [key] = ability;
            const box = document.createElement("div");
            box.className = "ability-input";
            const label = document.createElement("label");
            label.htmlFor = `hidden-growth-${key}`;
            label.textContent = abilityLabel(ability);
            const input = document.createElement("input");
            input.id = `hidden-growth-${key}`;
            input.className = "form-control form-control-sm";
            input.type = "number";
            input.step = "1";
            input.min = "7";
            input.max = "12";
            input.value = "9";
            input.dataset.hiddenGrowth = key;
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
    function updateHiddenGrowthTitle(selected) {
        const sailorLevel = selectedSailorLevel(selected);
        if (!sailorLevel) return;
        el("#hidden-growth-input-title").innerHTML = `<span class="step-number">${simulatorMode === "ship" ? 10 : 9}.</span>${t().hiddenGrowthInput(sailorLevel)}`;
    }
    function applySailorType(recalculate = true) {
        const selected = selectedSailorType();
        const initialLevel = selectedInitialLevel(selected);
        level.min = String(initialLevel);
        if ((Number(level.value) || 1) < initialLevel) level.value = String(initialLevel);
        if (server.value === "korea" && selected.event) {
            actualClassChangeLevels = [];
            bulkClassChangeLevel = "";
        }
        const disableHiddenGrowth = hiddenGrowthInputDisabled(selected);
        const disableInitialGrowthAbilities = hasPresetInitialGrowthValues(selected);
        const disableAbilityValues = hasPresetAbilityValues(selected);
        for (const [key] of ABILITIES.slice(0, -1)) {
            const initialGrowth = selected.initialGrowth?.[key] ?? 9;
            const disablePresetAbility = hasPresetAbilityValue(selected, key);
            const initialGrowthInput = el(`#initial-growth-${key}`);
            const abilityInput = el(`#initial-ability-${key}`);
            initialGrowthInput.value = String(initialGrowth);
            initialGrowthInput.disabled = disableInitialGrowthAbilities;
            abilityInput.value = String(selected.ability?.[key] ?? 27);
            abilityInput.disabled = disablePresetAbility;
            el(`#hidden-growth-${key}`).value = String(initialGrowth);
            el(`#hidden-growth-${key}`).disabled = disableHiddenGrowth || disablePresetAbility;
        }
        el("#initial-growth-crewGrowth").textContent = String(selected.initialGrowth?.crewGrowth ?? 5);
        el("#initial-ability-crewGrowth").textContent = String(selected.ability?.crewGrowth ?? 55);
        el("#hidden-growth-section").hidden = !selectedSailorLevel(selected) || disableHiddenGrowth;
        el("#hidden-growth-help").textContent = disableHiddenGrowth ? t().hiddenDisabledHelp : t().hiddenHelp;
        el("#result-ability-help").textContent = disableAbilityValues ? t().fixedResultAbilityHelp : t().resultAbilityHelp;
        updateHiddenGrowthTitle(selected);
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
    function updateStepLabels() {
        const shipStepOffset = simulatorMode === "ship" ? 1 : 0;
        for (const [selector, number, key] of [["#server-label", 1, "server"], ["#nation-label", 2, "nation"], ["#preset-label", 3 + shipStepOffset, "preset"], ["#level-label", 4 + shipStepOffset, "level"], ["#sailor-type-label", 5 + shipStepOffset, "sailorType"], ["#boost-label", 6 + shipStepOffset, "boost"], ["#initial-growth-input-title", 7 + shipStepOffset, "initialGrowthInput"], ["#initial-ability-input-title", 8 + shipStepOffset, "initialAbilityInput"]]) {
            el(selector).innerHTML = `<span class="step-number">${number}.</span>${t()[key]}`;
        }
        el("#ship-label").innerHTML = `<span class="step-number">3.</span>${t().ship}`;
        const selected = selectedSailorType();
        const sailorLevel = selectedSailorLevel(selected) || selectedInitialLevel(selected);
        el("#hidden-growth-input-title").innerHTML = `<span class="step-number">${9 + shipStepOffset}.</span>${t().hiddenGrowthInput(sailorLevel)}`;
    }
    function applyLanguage() {
        document.documentElement.lang = language();
        el("#active-sailor-layer").setAttribute("aria-label", t().selectSailorLayer);
        const labels = {
            "#sailor-subtitle": "subtitle", "#settings-title": "settingsTitle", "#ship-roster-title": "shipRosterTitle", "#server-help": "serverHelp", "#tree-title": "treeTitle", "#class-change-help": "classChangeHelp",
            "#class-change-bulk-label": "classChangeBulkLabel", "#class-change-bulk-help": "classChangeBulkHelp",
            "#result-title": "resultTitle", "#result-ability-help": "resultAbilityHelp", "#officer-title": "officerTitle", "#performance-input-title": "performanceInputTitle", "#performance-personnel-title": "performancePersonnelTitle", "#performance-seaman-adj-ability-title": "performanceSeamanAdjAbilityTitle", "#performance-seaman-adjustment-help": "performanceSeamanAdjustmentHelp", "#performance-fcs-title": "performanceFcsTitle", "#performance-fcs-name-heading": "performanceFcsName", "#performance-fcs-guide-length-heading": "performanceFcsGuideLength", "#performance-fcs-target-gun-heading": "performanceFcsTargetGun", "#performance-gun-title": "performanceGunTitle", "#performance-gun-heading": "performanceGun", "#performance-gun-class-heading": "performanceGunClass", "#performance-gun-level-heading": "performanceGunLevel", "#performance-gun-caliber-heading": "performanceGunCaliber", "#performance-gun-barrels-heading": "performanceGunBarrels", "#performance-gun-elevation-heading": "performanceGunElevation", "#performance-gun-reload-heading": "performanceGunReload", "#performance-result-title": "performanceSimulationTitle", "#performance-result-table-title": "performanceResultTableTitle", "#performance-implemented-reload-title": "performanceImplementedReloadTitle", "#performance-implemented-reload-help": "performanceImplementedReloadHelp", "#performance-case-heading": "performanceCase", "#performance-condition-select-heading": "performanceOutput", "#performance-officer-heading": "performanceOfficer", "#performance-veteran-heading": "performanceVeteran", "#performance-rookie-heading": "performanceRookie", "#performance-seaman-adjustment-percent-heading": "performanceSeamanAdjustmentPercent", "#performance-crew-count-heading": "performanceCrewCount", "#performance-crew-rate-heading": "performanceCrewRate", "#ability-help": "abilityHelp", "#hidden-growth-help": "hiddenHelp", "#tree-step-heading": "step", "#tree-class-heading": "className",
            "#tree-required-heading": "required", "#tree-actual-heading": "actual", "#tree-crew-heading": "crewGrowth",
            "#result-ability-heading": "ability", "#result-growth-heading": "currentGrowth", "#result-current-ability-heading": "currentAbility", "#result-seaman-adj-heading": "seamanAdjAbility",
        };
        for (const [selector, key] of Object.entries(labels)) el(selector).textContent = t()[key];
        el("#class-change-bulk-input").placeholder = t().classChangeBulkPlaceholder;
        el("#class-change-bulk-apply").textContent = t().classChangeBulkApply;
        el("#performance-calculate-button").textContent = t().performanceCalculate;
        el("#server-help").hidden = server.value === "global";
        for (const ability of ABILITIES.slice(0, -1)) {
            el(`#tree-${ability[0]}-heading`).textContent = abilityLabel(ability);
        }
        updateStepLabels();
        renderAbilityInputs();
        renderHiddenGrowthInputs();
        renderSeamanAdjAbilities();
        renderSailorTypeOptions();
        applySailorType(false);
        initializeResultViewControls();
        el("#calculator-settings-title").textContent = t().calculatorSettings;
        el("#single-sailor-mode-label").textContent = t().sailorCalculation;
        el("#ship-mode-label").textContent = t().shipCalculation;
        el("#calculator-mode-help").textContent = t().modeHelp;
        el("#sailor-layer-add").innerHTML = `<i class="fa-solid fa-plus"></i> ${t().addSailor}`;
        el("#sailor-layer-remove").textContent = t().removeSailor;
        populateShipOptions(true);
        renderShipLayerTabs();
    }
    function setResultView(view) {
        resultView = view;
        const section = el("#result-section");
        section.dataset.view = view;
        const initialButton = el("#result-show-initial");
        const currentButton = el("#result-show-current");
        if (initialButton && currentButton) {
            initialButton.className = `btn btn-sm ${view === "initial" ? "btn-light" : "btn-outline-light"}`;
            currentButton.className = `btn btn-sm ${view === "current" ? "btn-light" : "btn-outline-light"}`;
        }
    }
    function initializeResultViewControls() {
        renderResultTableHeader();
        const title = el("#result-title");
        const titleText = document.createElement("span");
        titleText.textContent = t().resultTitle;
        title.replaceChildren(titleText);
        setResultView("all");
    }
    function resultHeading(id, text, className = "") {
        const heading = document.createElement("th");
        heading.id = id;
        heading.className = className;
        heading.textContent = text;
        return heading;
    }
    function renderResultTableHeader(initialLevel = level.value || 1, currentLevel = level.value || 1, showHidden = !el("#hidden-growth-section").hidden, showSeamanAdj = false) {
        const table = el("#result-body").closest("table");
        const head = table.tHead;
        head.replaceChildren();
        const top = document.createElement("tr");
        const ability = resultHeading("result-ability-heading", t().ability);
        ability.rowSpan = 2;
        const initialLabel = language() === "ko" ? "초기설정" : "Initial settings";
        const currentLabel = language() === "ko" ? "현재레벨" : "Current level";
        const growthLabel = language() === "ko" ? "성장" : "Growth";
        const hiddenLabel = language() === "ko" ? "히든" : "Hidden";
        const abilityValueLabel = language() === "ko" ? "누적" : "Ability";
        const initial = resultHeading("result-initial-heading", `${initialLabel} Lv.${initialLevel}`, "initial-setting-column text-center");
        initial.colSpan = showHidden ? 3 : 2;
        const current = resultHeading("result-current-heading", `${currentLabel} Lv.${currentLevel}`, "current-result-column text-center");
        current.colSpan = showSeamanAdj ? 3 : 2;
        const seamanAdjHeading = resultHeading("result-seaman-adj-heading", t().seamanAdjAbility);
        seamanAdjHeading.className = "current-result-column";
        seamanAdjHeading.hidden = !showSeamanAdj;
        top.append(ability, initial, current);
        const bottom = document.createElement("tr");
        bottom.append(
            resultHeading("result-initial-growth-heading", growthLabel, "initial-setting-column"),
            ...(showHidden ? [resultHeading("result-initial-hidden-heading", hiddenLabel, "initial-setting-column")] : []),
            resultHeading("result-initial-ability-heading", abilityValueLabel, "initial-setting-column"),
            resultHeading("result-growth-heading", t().currentGrowth, "current-result-column"),
            resultHeading("result-current-ability-heading", t().currentAbility, "current-result-column"),
            seamanAdjHeading,
        );
        head.append(top, bottom);
    }
    function selectServer() {
        catalogRequestSequence += 1;
        level.max = server.value === "korea" ? "120" : "125";
        level.value = server.value === "korea" ? "120" : "125";
        applyLanguage();
        catalog = null;
        nationCatalog = null;
        resetShipSelection();
        paths = [];
        preset.disabled = true;
        nation.replaceChildren(option("", t().nationPlaceholder));
        preset.replaceChildren(option("", t().presetPlaceholder));
        for (const [id, name] of NATIONS[server.value]) nation.append(option(String(id), name));
        nation.disabled = false;
        actualClassChangeLevels = [];
        bulkClassChangeLevel = "";
        el("#performance-fcs-target-gun").checked = false;
        setClassChangeBulkFeedback();
        hideResults();
        updateIntroNoticeVisibility();
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
        resetShipSelection();
        paths = [];
        preset.disabled = true;
        preset.replaceChildren(option("", t().presetPlaceholder));
        actualClassChangeLevels = [];
        bulkClassChangeLevel = "";
        el("#performance-fcs-target-gun").checked = false;
        setClassChangeBulkFeedback();
        hideResults();
        updateIntroNoticeVisibility();
        if (!selectedNation) {
            setStatus(t().nationPlaceholder);
            return;
        }
        setStatus(t().loading);
        try {
            const loadedCatalog = await staticNationCatalog(selectedServer, selectedNation);
            if (requestSequence !== catalogRequestSequence) return;
            nationCatalog = loadedCatalog;
            catalog = nationCatalog?.sailors;
            if (!catalog?.sailors || !catalog?.nations) throw new Error(t().unknownResponse);
            populateShipOptions();
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
            resetShipSelection();
            setStatus(t().loadError(error.message), "danger");
        }
    }
    function buildPaths(sailors) {
        const byName = new Map(sailors.map((item) => [item.name, item]));
        const incoming = new Set(sailors.flatMap((item) => item.classChangeTargets));
        const roots = sailors.filter((item) => !incoming.has(item.name));
        const output = [];
        const walk = (node, path, visited) => {
            if (visited.has(node.name)) return;
            const nextPath = [...path, node];
            output.push(nextPath);
            const nextVisited = new Set(visited).add(node.name);
            node.classChangeTargets.map((name) => byName.get(name)).filter(Boolean).forEach((target) => walk(target, nextPath, nextVisited));
        };
        roots.forEach((root) => walk(root, [], new Set()));
        // ForceInfo의 다음 전직 순서를 따라 한 분기를 끝까지 배치한다.
        // 최종 병종명/레벨로 다시 전역 정렬하면 같은 계열이 흩어지므로
        // DFS에서 만들어진 계통 순서를 그대로 프리셋에 사용한다.
        return output;
    }
    function readStartingValues() {
        const initialGrowth = {};
        const abilityByType = {};
        document.querySelectorAll("[data-initial-growth]").forEach((input) => {
            initialGrowth[input.dataset.initialGrowth] = Number(input.value ?? input.textContent) || 0;
        });
        document.querySelectorAll("[data-initial-ability]").forEach((input) => {
            abilityByType[input.dataset.initialAbility] = Number(input.value ?? input.textContent) || 0;
        });
        const hiddenGrowthBaseline = { ...initialGrowth };
        const [boostKey, amount] = boost.value.split(":");
        if (boostKey && boostKey !== "all") {
            initialGrowth[boostKey] += Number(amount);
            abilityByType[boostKey] += Number(amount);
        }
        return { initialGrowth, hiddenGrowthBaseline, abilityByType };
    }
    function classChangeBulkStartIndex(path) {
        if (!path.length) return 0;
        return /^(수병|sailor)$/i.test(String(path[0].name || "").trim()) ? 1 : 0;
    }
    function setClassChangeBulkFeedback(message = "", kind = "secondary") {
        const feedback = el("#class-change-bulk-feedback");
        feedback.className = `form-text text-${kind}`;
        feedback.textContent = message;
    }
    function syncClassChangeBulkInput(path, allowLateClassChange) {
        const input = el("#class-change-bulk-input");
        const button = el("#class-change-bulk-apply");
        const startIndex = classChangeBulkStartIndex(path);
        const firstClassChange = path[startIndex];
        input.value = bulkClassChangeLevel;
        input.min = String(firstClassChange?.requiredLevel || 1);
        input.max = level.max;
        input.placeholder = server.value === "korea" ? "예) 120" : "e.g. 125";
        input.disabled = !allowLateClassChange || !firstClassChange;
        button.disabled = input.disabled;
    }
    function applyBulkClassChangeLevels() {
        if (preset.value === "") return;
        const path = paths[Number(preset.value)] || [];
        const input = el("#class-change-bulk-input");
        const rawValue = input.value.trim();
        if (!rawValue) {
            actualClassChangeLevels = [];
            bulkClassChangeLevel = "";
            calculate();
            setClassChangeBulkFeedback(t().classChangeBulkCleared, "secondary");
            return;
        }
        const startIndex = classChangeBulkStartIndex(path);
        const minimumLevel = Number(path[startIndex]?.requiredLevel) || 1;
        const maximumLevel = Number(level.max);
        const enteredLevel = Number(rawValue);
        if (!Number.isInteger(enteredLevel) || enteredLevel < minimumLevel || enteredLevel > maximumLevel) {
            setClassChangeBulkFeedback(t().classChangeBulkInvalid(minimumLevel, maximumLevel), "danger");
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
        actualClassChangeLevels = nextLevels;
        bulkClassChangeLevel = String(enteredLevel);
        calculate();
        setClassChangeBulkFeedback(
            server.value === "korea" && enteredLevel > 25 ? t().classChangeBulkKoreaCap(enteredLevel) : t().classChangeBulkApplied(enteredLevel),
            server.value === "korea" && enteredLevel > 25 ? "warning" : "success",
        );
    }
    function defaultPerformanceCompositions(crewCount) {
        const fixedOfficers = server.value === "korea" ? [180, 250, 300] : [100, 250, 300];
        const officers = [...fixedOfficers, Math.floor(crewCount * 0.4), Math.floor(crewCount * 0.45)];
        return officers.map((officerCount) => {
            const safeOfficers = Math.min(officerCount, maximumPerformanceOfficers(crewCount));
            return { officers: safeOfficers, veterans: crewCount - safeOfficers, rookies: 0, seamanAdjustmentPercent: 0 };
        });
    }
    function maximumPerformanceOfficers(crewCount) {
        return Math.floor(crewCount * (server.value === "korea" ? 0.45 : 0.5));
    }
    function performanceCaseLabels(showActualOfficerCount = false) {
        return performanceCompositions.map((composition, index) => {
            const currentCrew = performanceCurrentCrew(composition);
            const crewRate = performanceCrewCount > 0 ? currentCrew / performanceCrewCount * 100 : 0;
            const seamanAdjustmentPercent = Number(composition.seamanAdjustmentPercent) || 0;
            const percentageOfficerRate = [40, 45, 50].find((rate) =>
                composition.officers === Math.floor(performanceCrewCount * rate / 100)
            );
            const officerLabel = language() === "ko"
                ? `사관 ${showActualOfficerCount ? composition.officers : percentageOfficerRate ?? composition.officers}${!showActualOfficerCount && percentageOfficerRate ? "%" : ""}`
                : `Officers ${showActualOfficerCount ? composition.officers : percentageOfficerRate ?? composition.officers}${!showActualOfficerCount && percentageOfficerRate ? "%" : ""}`;
            const officerRateLabel = showActualOfficerCount && percentageOfficerRate
                ? (language() === "ko" ? `사관 ${percentageOfficerRate}%` : `Officers ${percentageOfficerRate}%`)
                : null;
            const hasRookies = Number(composition.rookies) > 0;
            const hasReducedCrew = currentCrew !== performanceCrewCount;
            const showDetails = hasRookies || hasReducedCrew || seamanAdjustmentPercent > 0;
            if (!showDetails) {
                return officerRateLabel ? [officerLabel, officerRateLabel] : [officerLabel];
            }
            const labels = language() === "ko"
                ? [officerLabel, `숙련 ${composition.veterans} · 신병 ${composition.rookies}`, `총원 ${crewRate.toFixed(1)}%`]
                : [officerLabel, `Veterans ${composition.veterans} · Rookies ${composition.rookies}`, `Total ${crewRate.toFixed(1)}%`];
            if (officerRateLabel) labels.splice(1, 0, officerRateLabel);
            if (seamanAdjustmentPercent > 0) {
                labels.splice(2, 0, language() === "ko"
                    ? `갑판병 보정률 ${displayGunNumber(seamanAdjustmentPercent)}%`
                    : `Seaman adjustment ${displayGunNumber(seamanAdjustmentPercent)}%`);
            }
            return labels;
        });
    }
    function renderSeamanAdjAbilities() {
        const headRow = document.createElement("tr");
        const inputRow = document.createElement("tr");
        for (const ability of SEAMAN_ADJ_ABILITIES) {
            const [key] = ability;
            const heading = document.createElement("th");
            heading.textContent = abilityLabel(ability);
            headRow.append(heading);
            const cell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.className = "form-check-input performance-seaman-adj-ability-checkbox";
            checkbox.type = "checkbox";
            checkbox.checked = seamanAdjustmentEnabled[key];
            checkbox.dataset.ability = key;
            checkbox.setAttribute("aria-label", abilityLabel(ability));
            cell.append(checkbox);
            inputRow.append(cell);
        }
        el("#performance-seaman-adj-ability-head").replaceChildren(headRow);
        el("#performance-seaman-adj-ability-body").replaceChildren(inputRow);
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
            performanceSelectedConditionIndex = 0;
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
            const outputCell = document.createElement("td");
            const outputCheckbox = document.createElement("input");
            outputCheckbox.className = "form-check-input performance-condition-output";
            outputCheckbox.type = "checkbox";
            outputCheckbox.checked = index === performanceSelectedConditionIndex;
            outputCheckbox.dataset.index = String(index);
            outputCheckbox.setAttribute("aria-label", `${caseLabels[index][0]} ${t().performanceOutput}`);
            outputCell.append(outputCheckbox);
            row.append(outputCell);
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
            const seamanAdjustmentCell = document.createElement("td");
            const seamanAdjustmentGroup = document.createElement("div");
            seamanAdjustmentGroup.className = "input-group input-group-sm";
            const seamanAdjustmentInput = document.createElement("input");
            seamanAdjustmentInput.className = "form-control text-end performance-seaman-adjustment-input";
            seamanAdjustmentInput.type = "number";
            seamanAdjustmentInput.min = "0";
            seamanAdjustmentInput.max = "12";
            seamanAdjustmentInput.step = "1";
            seamanAdjustmentInput.value = String(composition.seamanAdjustmentPercent);
            seamanAdjustmentInput.dataset.index = String(index);
            const seamanAdjustmentSuffix = document.createElement("span");
            seamanAdjustmentSuffix.className = "input-group-text";
            seamanAdjustmentSuffix.textContent = "%";
            seamanAdjustmentGroup.append(seamanAdjustmentInput, seamanAdjustmentSuffix);
            seamanAdjustmentCell.append(seamanAdjustmentGroup);
            row.append(seamanAdjustmentCell);
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
    function isGunnerPath(appliedClasses) {
        /* Legacy encoding-broken implementation retained only for source compatibility.
        return [...appliedClasses].some((className) => server.value === "korea"
            ? className.includes("포병")
            : /\b(?:Gunner|Gunnery)\b/i.test(className));
    }
    function isEngineSailorClass(className) {
        return server.value === "korea"
            ? className.includes("\uAE30\uAD00\uBCD1")
            : /\b(?:Engine|Engineer)\b/i.test(className);
    }
    function displayGunNumber(value) {
        */
        return [...appliedClasses].some((className) => server.value === "korea"
            ? className.includes("\uD3EC\uBCD1")
            : /\b(?:Gunner|Gunnery)\b/i.test(className));
    }
    function displayGunNumber(value) {
        const number = Number(value) || 0;
        return Number.isInteger(number) ? String(number) : String(Number(number.toFixed(2)));
    }
    function isEngineSailorClass(className) {
        return server.value === "korea"
            ? className.includes("\uAE30\uAD00\uBCD1")
            : /\b(?:Engine|Engineer)\b/i.test(className);
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
        if (latestPerformanceContext) latestPerformanceContext.gun = selected.gun;
    }
    function renderPerformanceGunInput(appliedClasses, currentLevel, currentClassName) {
        const select = el("#performance-gun-select");
        const previousMeta = Number(select.value);
        const isCaptainPath = server.value === "korea"
            ? appliedClasses.has("관제병")
            : appliedClasses.has("Bridge Operator");
        const targetGunSpecified = isCaptainPath && el("#performance-fcs-target-gun").checked;
        const hasGunnerPath = isGunnerPath(appliedClasses);
        if ((!isCaptainPath && !hasGunnerPath) || isTorpedoSailorClass(currentClassName)) {
            availablePerformanceGuns = [];
            select.replaceChildren();
            el("#performance-gun-section").hidden = true;
            if (latestPerformanceContext) delete latestPerformanceContext.gun;
            return;
        }
        if (isCaptainPath && !targetGunSpecified) {
            availablePerformanceGuns = [];
            select.replaceChildren();
            el("#performance-gun-section").hidden = true;
            if (latestPerformanceContext) delete latestPerformanceContext.gun;
            return;
        }
        availablePerformanceGuns = (nationCatalog?.equipment?.guns || [])
            .map((gun) => ({
                gun,
                requirement: targetGunSpecified
                    ? primaryGunRequirement(gun)
                    : gunRequirementForClasses(gun, appliedClasses, currentLevel),
            }))
            .filter(({ gun, requirement }) => requirement && (!targetGunSpecified || gun.shipyardRange > 0))
            .sort((left, right) =>
                right.requirement.level - left.requirement.level
                || right.gun.caliberInches - left.gun.caliberInches
                || left.gun.name.localeCompare(right.gun.name)
            );
        select.replaceChildren();
        el("#performance-gun-section").hidden = availablePerformanceGuns.length === 0;
        if (!availablePerformanceGuns.length) {
            if (latestPerformanceContext) delete latestPerformanceContext.gun;
            return;
        }
        for (const { gun, requirement } of availablePerformanceGuns) {
            select.append(option(String(gun.meta), performanceGunLabel(gun, requirement)));
        }
        if (availablePerformanceGuns.some(({ gun }) => gun.meta === previousMeta)) {
            select.value = String(previousMeta);
        }
        updatePerformanceGunDetails();
    }
    function renderPerformanceEngineCrewInput(isEngineSailor) {
        const section = el("#performance-engine-crew-section");
        const input = el("#performance-engine-crew-count");
        section.hidden = !isEngineSailor;
        input.value = String(performanceEngineCrewCount);
        el("#performance-engine-crew-label").textContent = server.value === "global"
            ? "Embarked engine sailors"
            : "\uD0D1\uC2B9 \uAE30\uAD00\uBCD1 \uC218";
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
    function renderMultipleEnginePerformance(results, caseLabels) {
        const section = el("#performance-engine-multiple-result-section");
        const head = el("#performance-engine-multiple-result-head");
        const body = el("#performance-engine-multiple-result-body");
        const capNote = el("#performance-engine-cap-note");
        capNote.textContent = server.value === "global"
            ? "Because this cap excludes the ship and engine overheat margins, the ability cap may be reached slightly sooner in practice."
            : "함선 오버힛여유율과 엔진오버힛여유율을 제외한 캡이므로 실제로는 약간 더 빨리 어빌캡에 도달합니다.";
        head.replaceChildren();
        body.replaceChildren();
        capNote.hidden = true;
        if (!latestPerformanceContext?.isEngineSailor
            || latestPerformanceContext.engineSailorCount <= 1) {
            section.hidden = true;
            return;
        }
        el("#performance-engine-multiple-result-title").textContent = server.value === "global"
            ? `Engine performance · ${latestPerformanceContext.engineSailorCount} sailors`
            : `기관병 ${latestPerformanceContext.engineSailorCount}명 성능`;
        const headRow = document.createElement("tr");
        const itemHeading = document.createElement("th");
        itemHeading.textContent = t().performanceItem;
        headRow.append(itemHeading);
        caseLabels.forEach((lines) => appendPerformanceCaseHeading(headRow, lines));
        head.append(headRow);
        el("#performance-engine-multiple-result-title").textContent = server.value === "global"
            ? `Engine performance simulation results · ${latestPerformanceContext.engineSailorCount} sailors`
            : `\uAE30\uAD00\uBCD1 ${latestPerformanceContext.engineSailorCount}\uBA85 \uC131\uB2A5 \uC2DC\uBBAC\uB808\uC774\uC158 \uACB0\uACFC`;
        const rows = [
            [server.value === "global" ? "Repair speed [/s]" : "\uC218\uB9AC\uC18D\uB3C4 [/s]", "repairSpeedMultipleEngineSailorsPerSecond", (value) => String(value)],
            [server.value === "global" ? "Structural defense" : "\uAD6C\uC870\uBC29\uC5B4", "structuralDefenseMultipleEngineSailors", (value) => String(value)],
            [server.value === "global" ? "Engine overheat time [s]" : "기관 오버힛 시간 [s]", "engineOverheatTimeMultipleSailorsSeconds", (value) => String(value)],
            [server.value === "global" ? "Engine overheat rate increase [%]" : "기관 오버힛 증가율 [%]", "engineOverheatRateMultipleSailorsPercent", (value) => `${value}%`],
        ];
        for (const [label, key, format] of rows) {
            const row = document.createElement("tr");
            const heading = document.createElement("th");
            heading.scope = "row";
            heading.textContent = label;
            row.append(heading);
            results.forEach((result) => {
                const cell = document.createElement("td");
                cell.textContent = format(result.performance[key]);
                if (server.value === "global"
                    && key === "engineOverheatRateMultipleSailorsPercent"
                    && Number(result.performance[key]) >= 70) {
                    appendCapLabel(cell);
                }
                if (key === "structuralDefenseMultipleEngineSailors"
                    && Number(result.performance[key]) >= 900) {
                    appendCapLabel(cell);
                }
                row.append(cell);
            });
            body.append(row);
        }
        capNote.hidden = !(server.value === "global"
            && results.some((result) => Number(result.performance?.engineOverheatRateMultipleSailorsPercent) >= 70));
        section.hidden = false;
    }
    function appendCapLabel(cell) {
        const capLabel = document.createElement("small");
        capLabel.className = "d-block fw-normal text-muted";
        capLabel.textContent = server.value === "global" ? "Reach the cap" : "상한도달";
        cell.append(capLabel);
    }
    function clearPerformanceApiResult() {
        el("#performance-result-section").hidden = true;
        el("#performance-result-head").replaceChildren();
        el("#performance-result-body").replaceChildren();
        el("#performance-engine-multiple-result-section").hidden = true;
        el("#performance-engine-multiple-result-head").replaceChildren();
        el("#performance-engine-multiple-result-body").replaceChildren();
        el("#performance-engine-cap-note").hidden = true;
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
                && !el("#performance-fcs-select").value);
    }
    async function requestPerformanceCalculation() {
        if (!latestPerformanceContext) return;
        for (const [key] of ABILITIES.slice(0, -1)) {
            const input = el(`[data-result-ability="${key}"]`);
            if (!input || !input.checkValidity()) {
                input?.reportValidity();
                return;
            }
            latestPerformanceContext.abilityByType[key] = Number(input.value);
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
                ability: latestPerformanceContext.abilityByType[key],
                applySeamanAdjustment: seamanAdjustmentEnabled[key] === true,
            }))),
            crewCount: String(latestPerformanceContext.crewCount),
            conditions: JSON.stringify(performanceCompositions),
        });
        if (latestPerformanceContext.isEngineSailor) {
            parameters.set("engineSailorCount", String(latestPerformanceContext.engineSailorCount));
        }
        const targetGunSpecified = latestPerformanceContext.isCaptainPath
            && el("#performance-fcs-target-gun").checked
            && latestPerformanceContext.gun;
        if ((latestPerformanceContext.isGunnerPath || targetGunSpecified)
            && latestPerformanceContext.gun) {
            parameters.set("gun", JSON.stringify({
                name: latestPerformanceContext.gun.name,
                reloadSeconds: latestPerformanceContext.gun.reloadSeconds,
                shipyardRange: latestPerformanceContext.gun.shipyardRange || null,
            }));
        }
        if (latestPerformanceContext.isCaptainPath) {
            parameters.set("performanceRole", "captain");
            const selectedFcsMeta = Number(el("#performance-fcs-select").value);
            const selectedFcs = availablePerformanceFcs.find((fcs) => fcs.meta === selectedFcsMeta);
            if (!selectedFcs) {
                setPerformanceStatus(t().performanceFailed(t().unknownResponse), "danger");
                updatePerformanceRequestAvailability();
                return;
            }
            parameters.set("fcs", JSON.stringify({
                name: selectedFcs.name,
                spottingCorrectionLimitRange: selectedFcs.spottingCorrectionLimitRange,
            }));
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
            const hasAppliedSeamanAdjustment = body.result.results.some((result) =>
                Number(result.performance?.appliedSeamanAdjustmentPercent) > 0
            );
            const isGlobalReloadCap = (result) => server.value === "global"
                && Number(result.performance?.gunReloadEfficiencyChangePercent) <= -66;
            const allGlobalReloadCaps = body.result.results.length > 0
                && body.result.results.every(isGlobalReloadCap);
            const appendReloadCapLabel = (cell) => {
                appendCapLabel(cell);
            };
            const reloadRows = latestPerformanceContext.isGunnerPath ? [
                [t().performanceReloadEfficiency, "gunReloadEfficiencyChangePercent", (value) => `${value}%`],
                [t().performanceReloadCapProgress, "gunReloadAbilityCapProgressPercent", (value) => `${Number(value).toFixed(1)}%`],
                [t().performanceAverageReload, "averageGunReloadSeconds", (value) => String(value)],
                ...(allGlobalReloadCaps ? [] : [
                    [t().performanceRequiredSeamanAdjustment, "requiredSeamanAdjustmentPercent", (value) => value === null ? "" : `${value}%`],
                    [t().performanceAverageReloadWithSeamanAdjustment, "averageGunReloadSecondsWithRequiredSeamanAdjustment", (value) => value === null ? "" : String(value)],
                ]),
            ] : [];
            const performanceRows = [
                [t().performanceRepair, "repairSpeedPerSecond", (value) => String(value)],
                [t().performanceStructural, "structuralDefense", (value) => String(value)],
                ...(latestPerformanceContext.isEngineSailor ? [
                    [server.value === "global" ? "Engine overheat time [s]" : "기관 오버힛 시간 [s]", "engineOverheatTimeOneSailorSeconds", (value) => String(value)],
                    [server.value === "global" ? "Engine overheat rate increase [%]" : "기관 오버힛 증가율 [%]", "engineOverheatRateOneSailorPercent", (value) => `${value}%`],
                ] : []),
                ...(hasAppliedSeamanAdjustment
                    ? [[t().performanceAppliedSeamanAdjustment, "appliedSeamanAdjustmentPercent", (value) => `${value}%`]]
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
                    const isSeamanSuggestionRow = valueKey === "requiredSeamanAdjustmentPercent"
                        || valueKey === "averageGunReloadSecondsWithRequiredSeamanAdjustment";
                    const showReloadCapOnly = isSeamanSuggestionRow && isGlobalReloadCap(result);
                    if (showReloadCapOnly) appendReloadCapLabel(cell);
                    else if (valueKey === "gunReloadAbilityCapProgressPercent"
                        && isGlobalReloadCap(result)) {
                        // 구버전 Worker가 2,070,000 기준 도달률을 반환해도 실제
                        // -66% 연사캡 상태와 화면 표시가 충돌하지 않게 한다.
                        cell.textContent = "100.0%";
                    } else cell.textContent = formatValue(result.performance[valueKey]);
                    if (valueKey === "gunReloadEfficiencyChangePercent"
                        && Number(result.performance.appliedSeamanAdjustmentPercent) === 0
                        && isGlobalReloadCap(result)) {
                        appendReloadCapLabel(cell);
                    }
                    if (server.value === "global"
                        && valueKey === "engineOverheatRateOneSailorPercent"
                        && Number(result.performance[valueKey]) >= 70) {
                        appendCapLabel(cell);
                    }
                    if (valueKey === "structuralDefense"
                        && Number(result.performance[valueKey]) >= 900) {
                        appendCapLabel(cell);
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
            renderMultipleEnginePerformance(body.result.results, caseLabels);
            el("#performance-result-section").hidden = false;
            setPerformanceStatus(t().performanceComplete, "success");
        } catch (error) {
            setPerformanceStatus(t().performanceFailed(error.message), "danger");
        } finally {
            updatePerformanceRequestAvailability();
        }
    }
    function calculate() {
        for (const [key] of ABILITIES) {
            for (const [inputId, containerId] of [[`initial-growth-${key}`, "#initial-growth-abilities"], [`initial-ability-${key}`, "#initial-abilities"], [`hidden-growth-${key}`, "#hidden-growth-abilities"]]) {
                const input = el(`#${inputId}`);
                const box = input?.closest(".ability-input");
                const container = el(containerId);
                if (box && container && !container.contains(box)) container.append(box);
            }
        }
        hideResults();
        if (preset.value === "") {
            refreshActiveLayerSummary("-");
            return;
        }
        const path = paths[Number(preset.value)];
        const selected = selectedSailorType();
        const initialLevel = selectedInitialLevel(selected);
        const currentLevel = Math.max(initialLevel, Math.min(Number(level.max), Number(level.value) || initialLevel));
        level.value = String(currentLevel);
        const { initialGrowth, hiddenGrowthBaseline, abilityByType } = readStartingValues();
        const currentGrowth = { ...initialGrowth };
        const allowLateClassChange = !(server.value === "korea" && selected.event);
        const hasCustomLevels = allowLateClassChange && actualClassChangeLevels.some((value) => value !== "" && value !== undefined);
        let pathOpen = true;
        let previousActualLevel = 1;
        const scheduledStages = [];
        const treeBody = el("#tree-body");
        treeBody.replaceChildren();
        path.forEach((stage, index) => {
            const entered = actualClassChangeLevels[index] ?? "";
            let actualLevel = stage.requiredLevel;
            const minimumActualLevel = Math.max(stage.requiredLevel, previousActualLevel);
            const isFirstClassChangeAfterSailor = server.value === "korea"
                && index > 0
                && path[index - 1].name === "수병";
            const maximumActualLevel = isFirstClassChangeAfterSailor
                ? 25
                : Number(level.max);
            const hasValidLateClassChangeRange = minimumActualLevel <= maximumActualLevel;
            if (hasCustomLevels) {
                if (!pathOpen || entered === "") pathOpen = false;
                else if (!hasValidLateClassChangeRange) pathOpen = false;
                else {
                    actualLevel = Math.min(maximumActualLevel, Math.max(minimumActualLevel, Number(entered) || minimumActualLevel));
                    actualClassChangeLevels[index] = String(actualLevel);
                }
            }
            const active = pathOpen && actualLevel <= currentLevel;
            const row = document.createElement("tr");
            if (!active) row.className = "text-muted";
            const actualInput = document.createElement("input");
            actualInput.className = "form-control form-control-sm class-change-level-input";
            actualInput.type = "number";
            actualInput.min = String(minimumActualLevel);
            actualInput.max = String(maximumActualLevel);
            actualInput.placeholder = String(stage.requiredLevel);
            actualInput.value = actualClassChangeLevels[index] ?? "";
            actualInput.dataset.index = String(index);
            actualInput.disabled = !allowLateClassChange || !hasValidLateClassChangeRange;
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
        syncClassChangeBulkInput(path, allowLateClassChange);

        // Lv.1 누적값에서 시작한다. Lv.N으로 오를 때는 기존 성장값을 먼저
        // 누적하고, Lv.N 전직으로 바뀐 성장값은 Lv.N -> Lv.N+1부터 적용한다.
        let classChangeIndex = 0;
        const applyClassChange = ({ stage }) => {
            for (const [key] of ABILITIES) {
                if (key === "crewGrowth") {
                    currentGrowth[key] = stage.crewGrowth;
                } else {
                    currentGrowth[key] += Number(stage.abilities[key] || 0);
                    const bonus = Number(stage.bonusAbilities?.[key] || 0);
                    abilityByType[key] += bonus;
                }
            }
        };
        while (classChangeIndex < scheduledStages.length && scheduledStages[classChangeIndex].actualLevel <= initialLevel) {
            applyClassChange(scheduledStages[classChangeIndex]);
            classChangeIndex += 1;
        }
        for (let nextLevel = initialLevel + 1; nextLevel <= currentLevel; nextLevel += 1) {
            for (const [key] of ABILITIES) abilityByType[key] += currentGrowth[key];
            while (classChangeIndex < scheduledStages.length && scheduledStages[classChangeIndex].actualLevel === nextLevel) {
                applyClassChange(scheduledStages[classChangeIndex]);
                classChangeIndex += 1;
            }
        }
        const sailorLevel = selectedSailorLevel(selected);
        if (sailorLevel && currentLevel >= sailorLevel && !hiddenGrowthInputDisabled(selected)) {
            const hiddenLevelUps = sailorLevel - 1;
            for (const [key] of ABILITIES.slice(0, -1)) {
                const hiddenGrowth = Number(el(`#hidden-growth-${key}`).value) || 0;
                abilityByType[key] += (hiddenGrowth - hiddenGrowthBaseline[key]) * hiddenLevelUps;
            }
        }
        for (const [key] of ABILITIES) abilityByType[key] = Math.max(0, abilityByType[key]);
        if (boost.value === "all:20") {
            for (const [key] of ABILITIES.slice(0, -1)) {
                currentGrowth[key] = Math.floor(currentGrowth[key] / 9 * 11);
                abilityByType[key] = Math.floor(abilityByType[key] / 9 * 11);
            }
        }
        const isSeamanPath = path.some((stage) => server.value === "korea"
            ? /갑판/.test(stage.name)
            : ["2nd Seaman", "1st Seaman", "Chief Seaman"].includes(stage.name));
        const showHidden = !el("#hidden-growth-section").hidden;
        renderResultTableHeader(initialLevel, currentLevel, showHidden, isSeamanPath);
        const resultBody = el("#result-body");
        resultBody.replaceChildren();
        for (const ability of ABILITIES) {
            const [key] = ability;
            const row = document.createElement("tr");
            const labelCell = document.createElement("th");
            labelCell.scope = "row";
            labelCell.textContent = abilityLabel(ability);
            const initialCells = [];
            for (const [inputId, visible] of [[`initial-growth-${key}`, true], [`hidden-growth-${key}`, showHidden], [`initial-ability-${key}`, true]]) {
                const input = el(`#${inputId}`);
                const box = input?.closest(".ability-input");
                const initialCell = document.createElement("td");
                initialCell.className = "initial-ability-cell initial-setting-column";
                if (visible && box) initialCell.append(box);
                initialCells.push(initialCell);
            }
            const growthCell = document.createElement("td");
            growthCell.textContent = String(currentGrowth[key]);
            const abilityCell = document.createElement("td");
            if (key === "crewGrowth") {
                abilityCell.textContent = String(abilityByType[key]);
            } else {
                const abilityInput = document.createElement("input");
                abilityInput.type = "number";
                abilityInput.min = "0";
                abilityInput.step = "1";
                abilityInput.required = true;
                abilityInput.value = String(abilityByType[key]);
                abilityInput.className = "form-control form-control-sm text-end result-ability-input";
                abilityInput.dataset.resultAbility = key;
                abilityInput.disabled = hasPresetAbilityValue(selected, key);
                abilityInput.setAttribute("aria-label", `${abilityLabel(ability)} ${t().currentAbility}`);
                abilityCell.append(abilityInput);
            }
            row.append(labelCell, ...initialCells.filter((_, index) => index !== 1 || showHidden), growthCell, abilityCell);
            if (isSeamanPath) {
                const seamanAdjCell = document.createElement("td");
                seamanAdjCell.textContent = key === "crewGrowth" ? String(abilityByType[key]) : String(Math.floor(abilityByType[key] * 0.07));
                const abilityInput = abilityCell.querySelector("input");
                if (abilityInput) {
                    abilityInput.addEventListener("input", () => {
                        const editedAbility = Number(abilityInput.value);
                        seamanAdjCell.textContent = Number.isFinite(editedAbility)
                            ? String(Math.floor(Math.max(0, editedAbility) * 0.07))
                            : "";
                    });
                }
                row.append(seamanAdjCell);
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
            countCell.textContent = String(Math.floor(abilityByType.crewGrowth * rate));
            officerCountRow.append(countCell);
        }
        const officerTable = el("#officer-head").closest("table");
        officerTable.classList.add("officer-rate-table");
        el("#officer-head").replaceChildren(officerHeadRow);
        el("#officer-body").replaceChildren(officerCountRow);
        const currentClassName = scheduledStages.at(-1)?.stage.name || path[0].name;
        const appliedClasses = new Set(scheduledStages.map(({ stage }) => stage.name));
        const isEngineSailor = isEngineSailorClass(currentClassName);
        latestPerformanceContext = {
            nationId: Number(nation.value),
            sailorClass: currentClassName,
            abilityByType: Object.fromEntries(ABILITIES.slice(0, -1).map(([key]) => [key, abilityByType[key]])),
            crewCount: abilityByType.crewGrowth,
            isEngineSailor,
            engineSailorCount: performanceEngineCrewCount,
        };
        renderPerformanceEngineCrewInput(isEngineSailor);
        renderPerformanceInputs(abilityByType.crewGrowth);
        latestPerformanceContext.isCaptainPath = renderPerformanceFcsCatalog(appliedClasses);
        latestPerformanceContext.isGunnerPath = isGunnerPath(appliedClasses);
        el("#performance-fcs-guide-length").disabled = latestPerformanceContext.isCaptainPath
            && el("#performance-fcs-target-gun").checked;
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
        el(".settings-result-layout")?.classList.add("has-result");
        setResultView("all");
        setStatus(t().complete, "success");
        refreshActiveLayerSummary(path.at(-1)?.name || currentClassName);
    }
    function hideResults() {
        latestPerformanceContext = null;
        availablePerformanceGuns = [];
        availablePerformanceFcs = [];
        clearPerformanceApiResult();
        el("#tree-section").hidden = true;
        el("#result-section").hidden = true;
        el(".settings-result-layout")?.classList.remove("has-result");
        el("#performance-input-section").hidden = true;
        el("#performance-fcs-section").hidden = true;
        el("#performance-gun-section").hidden = true;
    }
    function captureShipLayerState() {
        const fields = {};
        document.querySelectorAll("[id^=\"initial-growth-\"], [id^=\"initial-ability-\"], [id^=\"hidden-growth-\"], #sailor-level, #sailor-type, #sailor-boost, #sailor-preset").forEach((field) => {
            if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement)) return;
            if (field.id === "sailor-server" || field.id === "sailor-nation") return;
            fields[field.id] = field.value;
        });
        return {
            fields,
            actualClassChangeLevels: [...actualClassChangeLevels],
            bulkClassChangeLevel,
            performanceCompositions: structuredClone(performanceCompositions),
            performanceDetailedHeaders: [...performanceDetailedHeaders],
            performanceSelectedConditionIndex,
            performanceCrewCount,
            performanceEngineCrewCount,
        };
    }
    function shipLayerLabel(layer, index) {
        if (simulatorMode === "single") return `${t().sailorLayer} ${index + 1}`;
        if (layer.role === "captain") return t().captain;
        if (layer.role === "gunner") return `${t().gunner} ${layer.roleIndex}`;
        if (layer.role === "support") return `${t().support} ${layer.roleIndex}`;
        return `${t().sailorLayer} ${index + 1}`;
    }
    function compactSailorPreset(typeId) {
        const koreanNames = {
            normal: "일반", attendance: "개근", legendSupport: "전설보조", legendSpecial: "전설특무",
            premiumPotential: "잠재플미", premiumAccuracy: "명중플미", premiumReload: "연사플미",
            premiumTorpedo: "어뢰플미", premiumRepair: "수리플미", premiumRestore: "보수플미",
            premiumEngine: "기관플미", premiumFighter: "전투플미", premiumBomber: "폭격플미",
        };
        if (language() === "ko") return koreanNames[typeId] || typeId || "-";
        const globalNames = { normal: "Normal", nfXSailor: "X Sailor", advancedHero: "Advanced Hero", heroSailor: "Hero Sailor" };
        if (globalNames[typeId]) return globalNames[typeId];
        const match = String(typeId || "").match(/^(advancedElite|superElite|elite)(Potential|Accuracy|Reload|Torpedo|Repair|Restore|Engine|Fighter|Bomber)$/);
        if (!match) return typeId || "-";
        const grade = { advancedElite: "AE", superElite: "SE", elite: "E" }[match[1]];
        const specialty = { Potential: "Pot", Accuracy: "Acc", Reload: "Rel", Torpedo: "Torp", Repair: "Rep", Restore: "Rest", Engine: "Eng", Fighter: "Ftr", Bomber: "Bmb" }[match[2]];
        return `${grade} ${specialty}`;
    }
    function compactBoost(boostId) {
        if (!boostId) return language() === "ko" ? "없음" : "None";
        if (boostId === "all:20") return "+20%";
        const [abilityKey, enhancement] = boostId.split(":");
        const ability = ABILITIES.find(([key]) => key === abilityKey);
        return ability ? `${abilityLabel(ability)} ${enhancement}강` : boostId;
    }
    function currentClassChangeSummary() {
        const enteredLevels = actualClassChangeLevels.filter((value) => value !== "" && value !== undefined);
        return enteredLevels.length > 0 ? `Lv.${enteredLevels.at(-1)}` : t().onTime;
    }
    function currentPersonnelSummary() {
        const composition = performanceCompositions[performanceSelectedConditionIndex];
        if (!composition || !Number.isFinite(performanceCrewCount)) return "-";
        const currentCrew = performanceCurrentCrew(composition);
        const allNonOfficersAreVeterans = Number(composition.rookies) === 0
            && currentCrew === performanceCrewCount
            && Number(composition.veterans) === performanceCrewCount - Number(composition.officers);
        return allNonOfficersAreVeterans
            ? String(composition.officers)
            : `${composition.officers}/${composition.veterans}/${composition.rookies}`;
    }
    function refreshActiveLayerSummary(finalClassName) {
        const layer = shipLayers[activeShipLayer];
        if (!layer) return;
        layer.summary = {
            className: finalClassName ?? layer.summary?.className ?? "-",
            level: level.value || "-",
            sailor: compactSailorPreset(sailorType.value || "normal"),
            boost: compactBoost(boost.value),
            classChange: currentClassChangeSummary(),
            personnel: currentPersonnelSummary(),
        };
        if (simulatorMode === "ship") renderShipLayerTabs();
    }
    function shipLayerSummary(layer) {
        const fields = layer.state?.fields || {};
        return {
            className: layer.summary?.className || "-",
            level: layer.summary?.level || fields["sailor-level"] || "-",
            sailor: layer.summary?.sailor || compactSailorPreset(fields["sailor-type"] || "normal"),
            boost: layer.summary?.boost || compactBoost(fields["sailor-boost"] || ""),
            classChange: layer.summary?.classChange || t().onTime,
            personnel: layer.summary?.personnel || "-",
        };
    }
    function shipLayerFieldValue(layer, index, fieldId, fallback = "") {
        if (index === activeShipLayer) {
            const field = document.getElementById(fieldId);
            if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) return field.value;
        }
        return layer.state?.fields?.[fieldId] ?? fallback;
    }
    function rosterPresetOptions() {
        const duplicateCounts = new Map();
        for (const path of paths) {
            const name = path.at(-1)?.name || "-";
            duplicateCounts.set(name, (duplicateCounts.get(name) || 0) + 1);
        }
        const occurrences = new Map();
        return paths.map((path, index) => {
            const name = path.at(-1)?.name || "-";
            const occurrence = (occurrences.get(name) || 0) + 1;
            occurrences.set(name, occurrence);
            const displayName = language() === "ko" && /^(명중|연사)\s/.test(name)
                ? name.replace(/\s+/g, "")
                : name;
            const gunnerPathCode = Number(nation.value) === 1
                ? path.map(({ name: stageName }) => {
                    if (language() === "ko") {
                        if (/^명중\s/.test(stageName)) return "명";
                        if (/^연사\s/.test(stageName)) return "연";
                    } else {
                        if (/^(?:Accuracy|Accu)\s/i.test(stageName)) return "A";
                        if (/^Reload\s/i.test(stageName)) return "R";
                    }
                    return "";
                }).join("")
                : "";
            if (duplicateCounts.get(name) <= 1) return [String(index), displayName];
            return [String(index), gunnerPathCode
                ? `${displayName} ${gunnerPathCode}`
                : `${displayName} (${occurrence})`];
        });
    }
    function rosterBoostOptions(typeId) {
        const output = [["", compactBoost("")]];
        if (server.value === "global") return [...output, ["all:20", "+20%"]];
        for (const [abilityKey] of ABILITIES.slice(0, -1)) {
            output.push([`${abilityKey}:1`, compactBoost(`${abilityKey}:1`)]);
            if (typeId === "normal") output.push([`${abilityKey}:2`, compactBoost(`${abilityKey}:2`)]);
        }
        return output;
    }
    function createRosterSelect(value, options, ariaLabel, onChange) {
        const select = document.createElement("select");
        select.className = "form-select form-select-sm ship-roster-control";
        select.setAttribute("aria-label", ariaLabel);
        for (const [optionValue, label] of options) select.append(option(optionValue, label));
        if ([...select.options].some((item) => item.value === value)) select.value = value;
        select.addEventListener("change", () => onChange(select.value));
        return select;
    }
    function activateLayerForRosterEdit(index) {
        if (index !== activeShipLayer) activateShipLayer(index);
    }
    function applyRosterPersonnelInput(index, value) {
        activateLayerForRosterEdit(index);
        const totalCrew = Math.max(0, Number(performanceCrewCount) || 0);
        const composition = performanceCompositions[performanceSelectedConditionIndex];
        if (!composition || totalCrew <= 0) return;
        const values = String(value).split("/").map((item) => Math.max(0, Math.floor(Number(item.trim()) || 0)));
        const officers = Math.min(values[0] || 0, maximumPerformanceOfficers(totalCrew));
        if (values.length >= 3) {
            const veterans = Math.min(values[1], Math.max(0, totalCrew - officers));
            const rookies = Math.min(values[2], Math.max(0, totalCrew - officers - veterans));
            Object.assign(composition, { officers, veterans, rookies });
        } else {
            Object.assign(composition, { officers, veterans: totalCrew - officers, rookies: 0 });
        }
        performanceDetailedHeaders[performanceSelectedConditionIndex] = values.length >= 3;
        for (const field of ["officers", "veterans", "rookies"]) {
            const input = el(`#performance-input-body [data-index="${performanceSelectedConditionIndex}"][data-field="${field}"]`);
            if (input) input.value = String(composition[field]);
        }
        updatePerformanceCrewDisplay(performanceSelectedConditionIndex);
        clearPerformanceApiResult();
        refreshActiveLayerSummary();
    }
    function renderShipLayerTabs() {
        const tabs = el("#ship-layer-tabs");
        tabs.replaceChildren();
        const layerBar = tabs.closest(".ship-layer-bar");
        layerBar?.classList.toggle("ship-roster", simulatorMode === "ship");
        const activeLayerSelect = el("#active-sailor-layer");
        if (activeLayerSelect) {
            const showActiveLayer = simulatorMode === "ship" && Boolean(selectedShip());
            activeLayerSelect.hidden = !showActiveLayer;
            activeLayerSelect.replaceChildren();
            if (showActiveLayer) {
                shipLayers.forEach((layer, index) => {
                    activeLayerSelect.append(option(String(index), shipLayerLabel(layer, index)));
                });
                activeLayerSelect.value = String(activeShipLayer);
            }
        }
        if (simulatorMode === "ship") {
            const table = document.createElement("table");
            table.className = "table table-bordered table-striped table-sm ship-layer-roster-table";
            const head = document.createElement("thead");
            const headRow = document.createElement("tr");
            for (const heading of [t().rosterSeat, t().rosterClass, t().rosterLevel, t().rosterSailor, t().rosterBoost, t().rosterClassChange, t().rosterOfficer]) {
                const cell = document.createElement("th");
                cell.scope = "col";
                cell.textContent = heading;
                headRow.append(cell);
            }
            head.append(headRow);
            const body = document.createElement("tbody");
            shipLayers.forEach((layer, index) => {
                const summary = shipLayerSummary(layer);
                const presetValue = shipLayerFieldValue(layer, index, "sailor-preset");
                const levelValue = shipLayerFieldValue(layer, index, "sailor-level", summary.level);
                const sailorTypeValue = shipLayerFieldValue(layer, index, "sailor-type", "normal");
                const boostValue = shipLayerFieldValue(layer, index, "sailor-boost");
                const layerClassChangeLevels = index === activeShipLayer
                    ? actualClassChangeLevels
                    : (layer.state?.actualClassChangeLevels || []);
                const enteredClassChangeLevels = layerClassChangeLevels.filter((value) => value !== "" && value !== undefined);
                const classChangeValue = enteredClassChangeLevels.at(-1) || "";
                const layerCompositions = index === activeShipLayer
                    ? performanceCompositions
                    : (layer.state?.performanceCompositions || []);
                const selectedConditionIndex = index === activeShipLayer
                    ? performanceSelectedConditionIndex
                    : (Number(layer.state?.performanceSelectedConditionIndex) || 0);
                const layerComposition = layerCompositions[selectedConditionIndex];
                const layerCrewCount = index === activeShipLayer
                    ? performanceCrewCount
                    : layer.state?.performanceCrewCount;
                const row = document.createElement("tr");
                if (index === activeShipLayer) row.className = "table-active";
                const seatCell = document.createElement("td");
                seatCell.className = "ship-layer-seat-cell";
                const button = document.createElement("button");
                button.type = "button";
                button.className = `btn btn-sm ship-layer-tab ${index === activeShipLayer ? "btn-secondary" : "btn-outline-secondary"}`;
                button.textContent = shipLayerLabel(layer, index);
                button.setAttribute("aria-current", index === activeShipLayer ? "true" : "false");
                button.addEventListener("click", () => activateShipLayer(index));
                seatCell.append(button);
                row.append(seatCell);

                const classCell = document.createElement("td");
                classCell.className = "ship-layer-class-cell";
                const classSelect = createRosterSelect(presetValue, [["", "-"] , ...rosterPresetOptions()], t().rosterClass, (value) => {
                    activateLayerForRosterEdit(index);
                    preset.value = value;
                    preset.dispatchEvent(new Event("change", { bubbles: true }));
                });
                classSelect.disabled = preset.disabled;
                classCell.append(classSelect);

                const levelCell = document.createElement("td");
                const levelInput = document.createElement("input");
                levelInput.className = "form-control form-control-sm ship-roster-control ship-roster-level";
                levelInput.type = "number";
                levelInput.min = "1";
                levelInput.max = level.max;
                levelInput.value = levelValue;
                levelInput.setAttribute("aria-label", t().rosterLevel);
                levelInput.addEventListener("change", () => {
                    const value = levelInput.value;
                    activateLayerForRosterEdit(index);
                    level.value = value;
                    level.dispatchEvent(new Event("input", { bubbles: true }));
                });
                levelCell.append(levelInput);

                const sailorCell = document.createElement("td");
                sailorCell.append(createRosterSelect(
                    sailorTypeValue,
                    availableSailorTypes().map((type) => [type.id, compactSailorPreset(type.id)]),
                    t().rosterSailor,
                    (value) => {
                        activateLayerForRosterEdit(index);
                        sailorType.value = value;
                        sailorType.dispatchEvent(new Event("change", { bubbles: true }));
                    },
                ));

                const boostCell = document.createElement("td");
                boostCell.append(createRosterSelect(boostValue, rosterBoostOptions(sailorTypeValue), t().rosterBoost, (value) => {
                    activateLayerForRosterEdit(index);
                    boost.value = value;
                    boost.dispatchEvent(new Event("change", { bubbles: true }));
                }));

                const classChangeCell = document.createElement("td");
                const classChangeInput = document.createElement("input");
                classChangeInput.className = "form-control form-control-sm ship-roster-control ship-roster-class-change";
                classChangeInput.type = "number";
                classChangeInput.min = "1";
                classChangeInput.max = level.max;
                classChangeInput.value = classChangeValue;
                classChangeInput.placeholder = t().onTime;
                classChangeInput.disabled = !presetValue;
                classChangeInput.setAttribute("aria-label", t().rosterClassChange);
                classChangeInput.addEventListener("change", () => {
                    const value = classChangeInput.value;
                    activateLayerForRosterEdit(index);
                    el("#class-change-bulk-input").value = value;
                    applyBulkClassChangeLevels();
                });
                classChangeCell.append(classChangeInput);

                const personnelCell = document.createElement("td");
                const personnelInput = document.createElement("input");
                personnelInput.className = "form-control form-control-sm ship-roster-control ship-roster-personnel";
                personnelInput.type = "text";
                personnelInput.inputMode = "numeric";
                personnelInput.value = summary.personnel === "-" ? "" : summary.personnel;
                personnelInput.placeholder = language() === "ko" ? "사관 또는 사관/숙련/신병" : "O or O/V/R";
                personnelInput.disabled = !layerComposition || !Number.isFinite(layerCrewCount);
                personnelInput.setAttribute("aria-label", t().rosterOfficer);
                personnelInput.addEventListener("change", () => applyRosterPersonnelInput(index, personnelInput.value));
                personnelCell.append(personnelInput);

                row.append(classCell, levelCell, sailorCell, boostCell, classChangeCell, personnelCell);
                body.append(row);
            });
            table.append(head, body);
            tabs.append(table);
        } else {
        shipLayers.forEach((layer, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `btn btn-sm ship-layer-tab ${index === activeShipLayer ? "btn-secondary" : "btn-outline-secondary"}`;
            button.textContent = shipLayerLabel(layer, index);
            button.setAttribute("aria-current", index === activeShipLayer ? "true" : "false");
            button.addEventListener("click", () => activateShipLayer(index));
            tabs.append(button);
        });
        }
        const removeButton = el("#sailor-layer-remove");
        if (removeButton) removeButton.disabled = shipLayers.length <= 1;
    }
    function restoreShipLayerState(saved) {
        if (!saved) return;
        changingShipLayer = true;
        try {
            preset.value = saved.fields["sailor-preset"] || "";
            sailorType.value = saved.fields["sailor-type"] || "normal";
            applySailorType(false);
            for (const [id, value] of Object.entries(saved.fields)) {
                const field = document.getElementById(id);
                if (field) field.value = value;
            }
            actualClassChangeLevels = [...saved.actualClassChangeLevels];
            bulkClassChangeLevel = saved.bulkClassChangeLevel;
            performanceCompositions = structuredClone(saved.performanceCompositions);
            performanceDetailedHeaders = [...saved.performanceDetailedHeaders];
            performanceSelectedConditionIndex = Number(saved.performanceSelectedConditionIndex) || 0;
            performanceCrewCount = Number.isFinite(saved.performanceCrewCount) ? saved.performanceCrewCount : null;
            performanceEngineCrewCount = saved.performanceEngineCrewCount;
            calculate();
        } finally {
            changingShipLayer = false;
        }
    }
    function activateShipLayer(index) {
        if (changingShipLayer || index === activeShipLayer || !shipLayers[index]) return;
        if (shipLayers[activeShipLayer]) shipLayers[activeShipLayer].state = captureShipLayerState();
        const saved = shipLayers[index].state;
        activeShipLayer = index;
        renderShipLayerTabs();
        restoreShipLayerState(saved);
    }
    function selectedShip() {
        const selectedValue = el("#ship-select")?.value;
        if (!selectedValue) return null;
        const shipId = Number(selectedValue);
        if (!Number.isInteger(shipId)) return null;
        return (nationCatalog?.equipment?.ships || []).find((ship) => Number(ship.ShipID) === shipId) || null;
    }
    function populateShipOptions(preserveSelection = false) {
        const select = el("#ship-select");
        if (!select) return;
        const previousValue = preserveSelection ? select.value : "";
        select.replaceChildren(option("", t().shipPlaceholder));
        const ships = [...(nationCatalog?.equipment?.ships || [])].sort((left, right) =>
            (Number(right.RequiredLevel) || 0) - (Number(left.RequiredLevel) || 0)
            || String(left.ShipName || "").localeCompare(String(right.ShipName || ""), language())
            || (Number(left.ShipID) || 0) - (Number(right.ShipID) || 0));
        for (const ship of ships) {
            select.append(option(
                String(ship.ShipID),
                t().shipOption(
                    ship.ShipName || `Ship ${ship.ShipID}`,
                    Number(ship.RequiredLevel) || 0,
                    ship.ShipType || "-",
                    Math.max(0, Number(ship.GunnerSailorSlot) || 0),
                    Math.max(0, Number(ship.SupportSailorSlot) || 0),
                ),
            ));
        }
        select.disabled = ships.length === 0;
        if (previousValue && [...select.options].some((item) => item.value === previousValue)) {
            select.value = previousValue;
        }
    }
    function resetShipSelection() {
        const select = el("#ship-select");
        if (select) {
            select.replaceChildren(option("", t().shipPlaceholder));
            select.disabled = true;
        }
        layerSets.single = [{ role: "sailor", roleIndex: 1, state: null }];
        layerSets.ship = [{ role: "captain", roleIndex: 1, state: null }];
        activeLayerIndexes.single = 0;
        activeLayerIndexes.ship = 0;
        shipLayers = layerSets[simulatorMode];
        activeShipLayer = 0;
        const capacity = el("#ship-capacity-help");
        if (capacity) capacity.textContent = "";
        renderShipLayerTabs();
        updateSimulatorModeUi();
    }
    function resizeShipLayersForShip(ship) {
        if (!ship) {
            const previousActiveLayer = activeShipLayer;
            if (shipLayers[activeShipLayer]) shipLayers[activeShipLayer].state = captureShipLayerState();
            const captainState = shipLayers[0]?.state || captureShipLayerState();
            shipLayers = [{ role: "captain", roleIndex: 1, state: captainState }];
            layerSets.ship = shipLayers;
            activeShipLayer = 0;
            renderShipLayerTabs();
            if (previousActiveLayer !== 0) restoreShipLayerState(captainState);
            el("#ship-capacity-help").textContent = "";
            return;
        }
        const currentState = captureShipLayerState();
        if (shipLayers[activeShipLayer]) shipLayers[activeShipLayer].state = currentState;
        const previousLayers = shipLayers;
        const currentSummary = previousLayers[activeShipLayer]?.summary;
        const seats = [{ role: "captain", roleIndex: 1 }];
        const gunnerSlots = Math.max(0, Math.floor(Number(ship.GunnerSailorSlot) || 0));
        const supportSlots = Math.max(0, Math.floor(Number(ship.SupportSailorSlot) || 0));
        for (let index = 1; index <= gunnerSlots; index += 1) seats.push({ role: "gunner", roleIndex: index });
        for (let index = 1; index <= supportSlots; index += 1) seats.push({ role: "support", roleIndex: index });
        shipLayers = seats.map((seat, index) => ({
            ...seat,
            state: previousLayers[index]?.state || structuredClone(currentState),
            summary: previousLayers[index]?.summary
                ? structuredClone(previousLayers[index].summary)
                : (currentSummary ? structuredClone(currentSummary) : undefined),
        }));
        layerSets.ship = shipLayers;
        const previousActiveLayer = activeShipLayer;
        activeShipLayer = Math.min(activeShipLayer, shipLayers.length - 1);
        renderShipLayerTabs();
        if (activeShipLayer !== previousActiveLayer) restoreShipLayerState(shipLayers[activeShipLayer].state);
        el("#ship-capacity-help").textContent = t().shipCapacity(shipLayers.length, gunnerSlots, supportSlots);
    }
    function updateSimulatorModeUi() {
        const shipMode = simulatorMode === "ship";
        const shipSection = el("#ship-selection-section");
        const rosterSection = el("#ship-roster-section");
        const rosterTitle = el("#ship-roster-title");
        const rosterBody = el("#ship-roster-card-body");
        const layerControls = el("#ship-layer-controls");
        const modeHelp = el("#calculator-mode-help");
        const addButton = el("#sailor-layer-add");
        const removeButton = el("#sailor-layer-remove");
        const showLayerControls = !shipMode || Boolean(selectedShip());
        if (shipSection) shipSection.hidden = !shipMode;
        if (rosterSection) {
            rosterSection.hidden = !showLayerControls;
            rosterSection.className = shipMode ? "card sailor-card mb-3" : "mb-3";
        }
        if (rosterTitle) rosterTitle.hidden = !shipMode;
        if (rosterBody) rosterBody.className = shipMode ? "card-body compact-card-body" : "";
        if (layerControls) layerControls.hidden = !showLayerControls;
        if (modeHelp) modeHelp.hidden = !shipMode;
        if (addButton) addButton.hidden = shipMode;
        if (removeButton) {
            removeButton.hidden = shipMode;
            removeButton.disabled = shipLayers.length <= 1;
        }
    }
    function setSimulatorMode(mode) {
        if (mode === simulatorMode) return;
        const currentState = captureShipLayerState();
        if (shipLayers[activeShipLayer]) shipLayers[activeShipLayer].state = currentState;
        layerSets[simulatorMode] = shipLayers;
        activeLayerIndexes[simulatorMode] = activeShipLayer;
        simulatorMode = mode;
        shipLayers = layerSets[simulatorMode];
        activeShipLayer = activeLayerIndexes[simulatorMode];
        if (!shipLayers[activeShipLayer].state) shipLayers[activeShipLayer].state = structuredClone(currentState);
        restoreShipLayerState(shipLayers[activeShipLayer].state);
        updateStepLabels();
        updateSimulatorModeUi();
        renderShipLayerTabs();
    }
    function initializeCalculatorLayout() {
        for (const block of [el(".renewal-message")]) {
            if (block?.previousElementSibling?.matches("h4")) block.previousElementSibling.classList.add("simulator-intro-title");
        }
        const modeSection = el("#simulator-mode-section");
        const modeBody = modeSection.querySelector(".card-body");
        const serverSection = el("#server-label").closest(".col-12");
        const nationSection = el("#nation-label").closest(".col-12");
        const originalModeRow = modeBody.querySelector(".d-flex");
        const modeButtons = originalModeRow.querySelector(".simulator-mode-switch");
        const modeHelp = originalModeRow.querySelector(".small.text-muted");
        const modeHeader = document.createElement("div");
        modeHeader.className = "card-header calculator-settings-header";
        const modeTitle = document.createElement("span");
        modeTitle.id = "calculator-settings-title";
        modeTitle.textContent = "계산기 설정";
        modeBody.querySelector('label[for="single-sailor-mode"]').id = "single-sailor-mode-label";
        modeBody.querySelector('label[for="ship-mode"]').id = "ship-mode-label";
        for (const label of modeButtons.querySelectorAll("label")) {
            label.classList.remove("btn-outline-secondary");
            label.classList.add("btn-outline-light");
        }
        modeHeader.append(modeTitle, modeButtons);
        modeBody.before(modeHeader);
        const inputs = document.createElement("div");
        inputs.className = "row g-2 align-items-start calculator-mode-inputs";
        const shipSection = document.createElement("div");
        shipSection.id = "ship-selection-section";
        shipSection.className = "col-12 col-lg-6";
        shipSection.hidden = true;
        const shipLabel = document.createElement("label");
        shipLabel.id = "ship-label";
        shipLabel.className = "form-label fw-bold";
        shipLabel.htmlFor = "ship-select";
        const shipSelect = document.createElement("select");
        shipSelect.id = "ship-select";
        shipSelect.className = "form-select";
        shipSelect.disabled = true;
        shipSelect.append(option("", "함선을 선택하세요"));
        const shipCapacityHelp = document.createElement("div");
        shipCapacityHelp.id = "ship-capacity-help";
        shipCapacityHelp.className = "form-text";
        shipSection.append(shipLabel, shipSelect, shipCapacityHelp);
        modeHelp.id = "calculator-mode-help";
        modeHelp.className = "d-block small text-muted mt-2";
        serverSection.className = "col-12 col-md-4 col-lg-3";
        nationSection.className = "col-12 col-md-4 col-lg-3";
        inputs.append(serverSection, nationSection, shipSection);
        modeBody.prepend(inputs);
        inputs.after(modeHelp);
        originalModeRow.remove();
        const layerControls = el("#ship-layer-controls");
        layerControls.hidden = true;
        layerControls.classList.remove("mt-2");
        const rosterSection = document.createElement("section");
        rosterSection.id = "ship-roster-section";
        rosterSection.className = "mb-3";
        rosterSection.hidden = true;
        const rosterTitle = document.createElement("div");
        rosterTitle.id = "ship-roster-title";
        rosterTitle.className = "card-header";
        rosterTitle.textContent = "함선 수병 설정";
        rosterTitle.hidden = true;
        const rosterBody = document.createElement("div");
        rosterBody.id = "ship-roster-card-body";
        rosterBody.append(layerControls);
        rosterSection.append(rosterTitle, rosterBody);
        modeSection.after(rosterSection);
        el("#preset-label").closest(".col-12").className = "col-12";
        el("#level-label").closest(".col-12").className = "col-12 col-md-3 col-lg-2";
        el("#sailor-type-label").closest(".col-12").className = "col-12 col-md-9 col-lg-5";
        el("#boost-label").closest(".col-12").className = "col-12 col-lg-5";
        const initialGrowthSection = el("#initial-growth-input-title").closest(".col-12");
        const initialAbilitySection = el("#initial-ability-input-title").closest(".col-12");
        const hiddenGrowthSection = el("#hidden-growth-section");
        [initialGrowthSection, initialAbilitySection, hiddenGrowthSection].forEach((section) => { section.classList.add("initial-source-section"); });
        el("#officer-title").parentElement.hidden = true;
        const settings = el("#sailor-settings-section");
        const result = el("#result-section");
        const layout = document.createElement("div");
        layout.className = "settings-result-layout";
        settings.before(layout);
        layout.append(settings, result);
        updateIntroNoticeVisibility();
        updateSimulatorModeUi();
    }
    initializeCalculatorLayout();
    applyLanguage();
    document.querySelectorAll('input[name="simulator-mode"]').forEach((input) => {
        input.addEventListener("change", () => {
            if (input.checked) setSimulatorMode(input.value);
        });
    });
    el("#active-sailor-layer").addEventListener("change", (event) => {
        const index = Number(event.target.value);
        if (Number.isInteger(index)) activateShipLayer(index);
    });
    el("#ship-select").addEventListener("change", () => {
        resizeShipLayersForShip(selectedShip());
        updateSimulatorModeUi();
    });
    el("#sailor-layer-add").addEventListener("click", () => {
        if (simulatorMode !== "single") return;
        const currentState = captureShipLayerState();
        if (shipLayers[activeShipLayer]) shipLayers[activeShipLayer].state = currentState;
        shipLayers.push({
            role: "sailor",
            roleIndex: shipLayers.length + 1,
            state: structuredClone(currentState),
            summary: shipLayers[activeShipLayer]?.summary ? structuredClone(shipLayers[activeShipLayer].summary) : undefined,
        });
        activeShipLayer = shipLayers.length - 1;
        activeLayerIndexes.single = activeShipLayer;
        renderShipLayerTabs();
        updateSimulatorModeUi();
    });
    el("#sailor-layer-remove").addEventListener("click", () => {
        if (simulatorMode !== "single" || shipLayers.length <= 1) return;
        if (shipLayers[activeShipLayer]) shipLayers[activeShipLayer].state = captureShipLayerState();
        shipLayers.splice(activeShipLayer, 1);
        activeShipLayer = Math.max(0, activeShipLayer - 1);
        activeLayerIndexes.single = activeShipLayer;
        shipLayers.forEach((layer, index) => { layer.roleIndex = index + 1; });
        renderShipLayerTabs();
        restoreShipLayerState(shipLayers[activeShipLayer].state);
        updateSimulatorModeUi();
    });
    server.addEventListener("change", selectServer);
    nation.addEventListener("change", loadNationCatalogs);
    preset.addEventListener("change", () => {
        actualClassChangeLevels = [];
        bulkClassChangeLevel = "";
        el("#performance-fcs-target-gun").checked = false;
        setClassChangeBulkFeedback();
        calculate();
    });
    level.addEventListener("input", calculate);
    sailorType.addEventListener("change", () => applySailorType());
    boost.addEventListener("change", calculate);
    el("#sailor-form").addEventListener("input", (event) => {
        if (event.target.matches("[data-initial-growth], [data-initial-ability], [data-hidden-growth]")) calculate();
    });
    el("#result-body").addEventListener("input", (event) => {
        if (event.target.matches("[data-initial-growth], [data-initial-ability], [data-hidden-growth]")) calculate();
    });
    el("#tree-body").addEventListener("change", (event) => {
        if (!event.target.matches(".class-change-level-input")) return;
        actualClassChangeLevels[Number(event.target.dataset.index)] = event.target.value;
        bulkClassChangeLevel = "";
        setClassChangeBulkFeedback();
        calculate();
    });
    el("#class-change-bulk-apply").addEventListener("click", applyBulkClassChangeLevels);
    el("#class-change-bulk-input").addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        applyBulkClassChangeLevels();
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
    el("#performance-input-body").addEventListener("change", (event) => {
        if (!event.target.matches(".performance-condition-output")) return;
        performanceSelectedConditionIndex = Number(event.target.dataset.index) || 0;
        document.querySelectorAll(".performance-condition-output").forEach((checkbox) => {
            checkbox.checked = Number(checkbox.dataset.index) === performanceSelectedConditionIndex;
        });
        refreshActiveLayerSummary();
    });
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
        refreshActiveLayerSummary();
    });
    el("#performance-input-body").addEventListener("input", (event) => {
        if (!event.target.matches(".performance-seaman-adjustment-input")) return;
        const composition = performanceCompositions[Number(event.target.dataset.index)];
        if (!composition) return;
        composition.seamanAdjustmentPercent = Math.min(12, Math.max(0, Number(event.target.value) || 0));
        event.target.value = String(composition.seamanAdjustmentPercent);
        clearPerformanceApiResult();
    });
    el("#performance-calculate-button").addEventListener("click", requestPerformanceCalculation);
    el("#performance-engine-crew-count").addEventListener("input", (event) => {
        performanceEngineCrewCount = Math.min(10, Math.max(1, Math.floor(Number(event.target.value) || 1)));
        event.target.value = String(performanceEngineCrewCount);
        calculate();
    });
    el("#performance-fcs-select").addEventListener("change", () => {
        clearPerformanceApiResult();
        updatePerformanceRequestAvailability();
    });
    el("#performance-gun-select").addEventListener("change", () => {
        updatePerformanceGunDetails();
        clearPerformanceApiResult();
    });
    el("#performance-seaman-adj-ability-body").addEventListener("change", (event) => {
        if (!event.target.matches(".performance-seaman-adj-ability-checkbox")) return;
        seamanAdjustmentEnabled[event.target.dataset.ability] = event.target.checked;
        clearPerformanceApiResult();
    });
    selectServer();
})();
