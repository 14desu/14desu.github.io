import {
    calculateSailorPerformance,
    calculateShipEngineOverheat,
    calculateShipOverheatSpeed,
    calculateShipRepairSpeedDetails,
    SHIP_BASE_REPAIR_SPEED,
} from "./sailor-performance/index.js?v=20260923-rank-terms-v11";

(() => {
    "use strict";
    const ABILITIES = [
        ["potential", "잠재", "Potential"], ["accuracy", "명중", "Accuracy"], ["reload", "연사", "Reload"],
        ["torpedo", "어뢰", "Torpedo"], ["antiAir", "대공", "Anti-air"], ["repair", "수리", "Repair"],
        ["restore", "보수", "Restore"], ["engine", "기관", "Engine"], ["aircraft", "함재", "Aircraft"],
        ["fighter", "전투", "Fighter"], ["bomber", "폭격", "Bomber"], ["crewGrowth", "수병수", "Crew"],
    ];
    const SEAMAN_ADJ_ABILITIES = ABILITIES.slice(0, -1);
    const SPECIAL_LANDING_CLASS_NAMES = new Set([
        "에어본", "US 마린", "에어어설트", "로열 마린", "공수부대", "육전대",
        "팔슈름 얘거", "마리네", "GIA", "마린 프랑세즈", "V.D.V", "Morskoi", "Folgore", "San Marco",
        "Air Borne", "US Marine", "Air Assault", "Royal Marine", "IJN Air Borne", "IJN Marine",
        "Fallschirm Jaeger", "Marine", "GIA (Groupes de l'Infanterie de l'Air)", "French Marine",
    ]);
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
            subtitle: "", settingsTitle: "수병 설정", calculatorSettings: "계산기 설정", sailorCalculation: "수병모드", shipCalculation: "함선모드", sailorLayer: "수병", addSailor: "수병 추가", removeSailor: "수병 삭제", captain: "함장", gunner: "포병", support: "보조", ship: "함선목록", shipPlaceholder: "함선을 선택하세요", modeHelp: "함선을 선택하면 함장 1명과 포병석·보조석 수에 맞춰 수병 탭이 자동으로 구성됩니다.", serverHelp: "Global server users: select “Global server”.",
            shipOption: (name, level, type, gunnerSlots, supportSlots) => `${type} Lv.${level} ${name} 포병석 ${gunnerSlots} 보조석 ${supportSlots}`,
            shipCapacity: (total, gunnerSlots, supportSlots) => `탑승가능 수병수 ${total}명 (함장석1 + 포병석${gunnerSlots} + 보조석${supportSlots})`,
            shipRosterTitle: "함선 수병 설정", selectSailorLayer: "수병 좌석 선택",
            shipEquipmentTitle: "함선 설정", shipEquipmentFcs: "FCS", shipEquipmentEngine: "엔진", shipEquipmentRGun: "R mount 함포", shipEquipmentTGun: "T mount 함포", shipBaseSpeed: "함선 기본속도 [knot]", shipBaseSpeedPlaceholder: "유저 수동 입력", shipEquipmentFcsPlaceholder: "FCS 선택", shipEquipmentEnginePlaceholder: "엔진 선택", shipEquipmentGunPlaceholder: "함포 선택", shipEquipmentUnavailable: "장착 가능한 장비 없음",
            shipEquipmentTGun2: "T mount 함포 2", shipAddTGun: "T mount 함포 추가",
            shipVeteranBulk: "사관 일괄 입력", shipVeteranRatePlaceholder: "예) 180", carrierAircraftModeF: "F · 전투기", carrierAircraftModeA: "A · 뇌격기", carrierAircraftModeB: "B · 급폭기",
            shipTargetGuideline: "목표 가이드라인", shipRGunRangeTarget: "R mount 함포 사거리 대체", shipGuidelineAdjustCaptain: "목표 가이드라인 함장 수병수 조절", shipPerformanceTitle: "함선 성능", shipRepairSpeed: "함선 수리속도 [/s]", shipOverheatSpeed: "함선 오버힛속도", shipOverheatTime: "함선 오버힛시간 [s]", shipPerformanceSeat: "좌석", shipReloadEfficiency: "연사 성능", shipImplementedReload: "12회 구현 연사시간", shipGuidelineAdjustmentResult: "목표 가이드라인 함장 수병수 조절", shipGuidelineAdjustmentDisabled: "조절 불가", shipGuidelineAdjustmentNotRequired: "조절 불필요", shipGuidelineAdjustmentApplied: "함장 수병 구성에 적용",
            shipRepairBreakdown: (shipValue, sailorValue) => `함선 ${shipValue} + 수병 ${sailorValue}`,
            shipOverheatTimeBreakdown: (shipValue, sailorValue) => `함선 ${shipValue} + 수병 ${sailorValue}`,
            shipOverheatSpeedBaseBreakdown: (value) => `함선 기본속도 ${value} · 유저수동입력`,
            shipOverheatSpeedBaseRequired: "함선 기본속도 입력 필요",
            shipOverheatSpeedRateBreakdown: (shipValue, sailorValue) => `함선 ${shipValue} 수병 ${sailorValue}`,
            shipOverheatSpeedRateMaxed: (value) => `함선+수병 Maxed +${value}%`,
            shipOverheatSpeedRateUncappedBreakdown: (shipValue, sailorValue) => `(함선 ${shipValue} 수병 ${sailorValue})`,
            shipGuidelineBreakdown: (shipValue, sailorValue) => `함선 ${shipValue} + 수병 ${sailorValue}`,
            shipEquipmentContext: (nationLabel, shipType, fcsCapacity, engineCapacity, rCapacity, tCapacity) => `${nationLabel} · ${shipType} · FCS 용적 ${fcsCapacity} · 엔진 용적 ${engineCapacity} · R mount 용적 ${rCapacity} · T mount 용적 ${tCapacity}`,
            rosterSeat: "수병 좌석", rosterClass: "병종", rosterLevel: "Lv", rosterSailor: "수병", rosterBoost: "강화", rosterClassChange: "전직", rosterRepairSpeed: "수병의 수리속도 [/s]", rosterVeteran: "사관", rosterExpert: "숙련병", rosterRookie: "신병", rosterTotalCrew: "총수병수", performanceOutput: "출력", onTime: "칼직",
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
            resultTitle: "수병 계산 결과", ability: "어빌리티", currentGrowth: "성장", currentAbility: "누적", seamanAdjAbility: "표시", resultAbilityHelp: "누적 어빌리티를 직접 수정할 수 있으며, 수정한 값은 성능 계산에 반영됩니다.", fixedResultAbilityHelp: "수병 프리셋에 누적값이 지정된 어빌리티만 직접 수정할 수 없습니다.", veteranTitle: "사관수", veteranRate: "사관 비율", veteranCount: "사관수", performanceInputTitle: "수병 성능 설정", performancePersonnelTitle: "사관 숙련병 신병 조건", performanceSeamanAdjAbilityTitle: "갑판병 보정 적용 어빌", performanceGunTitle: "시뮬레이트 적용 함포", performanceGun: "함포", performanceGunClass: "필요병종", performanceGunLevel: "필요레벨", performanceGunCaliber: "구경", performanceGunBarrels: "연장", performanceGunElevation: "최대양각", performanceGunReload: "함포 연사속도", performanceSimulationTitle: "수병 성능 시뮬레이션", performanceItem: "성능 항목", performanceCase: "조건", performanceVeteran: "사관", performanceExpert: "숙련병", performanceRookie: "신병", performanceSeamanAdjustmentPercent: "갑판병 보정률", performanceCrewCount: "현재 / 총 수병수", performanceCrewRate: "수병 비율", performanceReady: "누적 어빌리티와 성능 설정이 바뀌면 자동으로 계산됩니다.", performanceCalculating: "계산 중…", performanceComplete: "시뮬레이션이 완료되었습니다.", performanceFailed: (message) => `성능 계산 실패: ${message}`, performanceRepair: "수리속도 [/s]", performanceStructural: "구조방어", performanceAppliedSeamanAdjustment: "연사 적용 갑판병 보정률", performanceReloadEfficiency: "수병 연사효율 구간", performanceReloadCapProgress: "연사 어빌캡 도달율", performanceAbilityCapReached: "연사캡 도달", performanceAverageReload: "선택 함포 평균 연사시간 [s]", performanceRequiredSeamanAdjustment: "다음 연사구간 필요 갑판 보정", performanceAverageReloadWithSeamanAdjustment: "필요 갑판 보정 적용 평균 연사시간 [s]", appliedSailorPreset: "수병 프리셋", appliedBoost: "적용 강화", notApplied: "미적용", noChange: "변화 없음",
            performanceSeamanSeats: (labels, mode) => labels.length > 0
                ? labels.join(" + ")
                : mode === "ship"
                    ? "미탑승 *함선내 갑판병 설정시 갑판병보정이 적용됩니다"
                    : "미탑승 *수병추가 갑판병 설정시 갑판병보정이 적용됩니다",
            performanceSeamanGlobalWarning: "글로벌 서버 갑판병 보정은 한국 서버 로직을 임시 적용했으며 확인이 필요합니다.",
            performanceFcsTitle: "시뮬레이트 적용 FCS", performanceFcsName: "FCS리스트", performanceFcsGuideLength: "목표가이드라인길이", performanceFcsTargetGun: "목표함포지정", performanceFcsAccuracy: "명중 보너스", performanceFcsCapacity: "필요용적", performanceGuidelineLength: "가이드라인 길이", performanceGuidelineAdjustment: "목표가이드라인 수병조절", performanceGuidelineTargetInput: (target) => `${target} : 직접입력`, performanceGuidelineTargetGun: (target, gunName) => `${target} : ${gunName}`, performanceGuidelineRepair: (target) => `가이드라인 (${target}) 수리속도 [/s]`, performanceGuidelineStructural: (target) => `가이드라인 (${target}) 구조방어`, performanceGuidelineNoAdjustment: "조절 불필요", performanceGuidelineUnavailable: "불가능", performanceGuidelineAdjustmentImpossible: "사관수 고정 조건에서 조절 불가", performanceGuidelineCalculated: (length) => `가이드라인 계산 : ${length}`, performanceGuidelineVeteran: (value) => `사관 ${value}`, performanceGuidelineExpert: (value) => `숙련병 ${value}`, performanceGuidelineRookie: (value) => `신병 ${value}`,
            performanceSeamanAdjustmentHelp: "갑판 보정은 0~12%를 입력합니다. 입력 시 관련 성능에 반영하여 계산합니다.",
            performanceImplementedReloadTitle: "12회 인게임 연사시간 예측 비교 [s]", performanceImplementedReloadHelp: "각 조건의 12회 인게임 연사시간 예측값을 비교합니다. 막대 아래에는 각 발사까지의 누적시간을 표시하며, 느린 구간은 부드러운 빨간색, 중간은 노란색, 빠른 구간은 초록색입니다.", performanceTimeline: "12회 누적시간 [s]", performanceShotNumber: (index) => `${index}회차`, performanceTimelineSummary: (total, average) => `총 ${total}s · 평균 ${average}s`, performanceIntervalDetail: (index, interval, cumulative) => `${index}회차: ${interval}s · 누적 ${cumulative}s`,
            performanceResultTableTitle: "수병 성능 시뮬레이션 결과",
        },
        en: {
            subtitle: "", settingsTitle: "Sailor settings", calculatorSettings: "Simulator settings", sailorCalculation: "Sailor mode", shipCalculation: "Ship mode", sailorLayer: "Sailor", addSailor: "Add sailor", removeSailor: "Remove sailor", captain: "B.O.", gunner: "Gunner", support: "Support", ship: "Ship List", shipPlaceholder: "Select a ship", modeHelp: "Selecting a ship automatically creates 1 B.O. slot and its gunner and support sailor slots.", serverHelp: "Global server users: select “Global server”.",
            shipOption: (name, level, type, gunnerSlots, supportSlots) => `${type} Lv.${level} ${name} Gunner ${gunnerSlots} Support ${supportSlots}`,
            shipCapacity: (total, gunnerSlots, supportSlots) => `${total} Sailor Slot (1 B.O. + ${gunnerSlots} Gunner + ${supportSlots} Support)`,
            shipRosterTitle: "Ship Sailor Settings", selectSailorLayer: "Select sailor slot",
            shipEquipmentTitle: "Ship setting", shipEquipmentFcs: "FCS", shipEquipmentEngine: "Engine", shipEquipmentRGun: "R mount gun", shipEquipmentTGun: "T mount gun", shipBaseSpeed: "Base ship speed [knot]", shipBaseSpeedPlaceholder: "User manual input", shipEquipmentFcsPlaceholder: "Select an FCS", shipEquipmentEnginePlaceholder: "Select an engine", shipEquipmentGunPlaceholder: "Select a gun", shipEquipmentUnavailable: "No compatible equipment",
            shipEquipmentTGun2: "T mount gun 2", shipAddTGun: "Add T mount gun",
            shipVeteranBulk: "Veteran batch input", shipVeteranRatePlaceholder: "e.g. 100", carrierAircraftModeF: "F · Fighter", carrierAircraftModeA: "A · Torpedo bomber", carrierAircraftModeB: "B · Dive bomber",
            shipTargetGuideline: "Target guideline", shipRGunRangeTarget: "Use R mount gun range", shipGuidelineAdjustCaptain: "Adjust Bridge sailor count to target guideline", shipPerformanceTitle: "Ship performance", shipRepairSpeed: "Ship repair speed [/s]", shipOverheatSpeed: "Ship overheat speed", shipOverheatTime: "Ship overheat time [s]", shipPerformanceSeat: "Sailor slot", shipReloadEfficiency: "Reload performance", shipImplementedReload: "12-shot implemented reload time", shipGuidelineAdjustmentResult: "Bridge sailor adjustment for target guideline", shipGuidelineAdjustmentDisabled: "Adjustment unavailable", shipGuidelineAdjustmentNotRequired: "No adjustment needed", shipGuidelineAdjustmentApplied: "Applied to Bridge sailor composition",
            shipRepairBreakdown: (shipValue, sailorValue) => `Ship ${shipValue} + Sailor ${sailorValue}`,
            shipOverheatTimeBreakdown: (shipValue, sailorValue) => `Ship ${shipValue} + Sailor ${sailorValue}`,
            shipOverheatSpeedBaseBreakdown: (value) => `Base ship speed ${value} · User manual input`,
            shipOverheatSpeedBaseRequired: "Base ship speed required",
            shipOverheatSpeedRateBreakdown: (shipValue, sailorValue) => `Ship ${shipValue} Sailor ${sailorValue}`,
            shipOverheatSpeedRateMaxed: (value) => `Ship+Sailor Maxed +${value}%`,
            shipOverheatSpeedRateUncappedBreakdown: (shipValue, sailorValue) => `(Ship ${shipValue} Sailor ${sailorValue})`,
            shipGuidelineBreakdown: (shipValue, sailorValue) => `Ship ${shipValue} + Sailor ${sailorValue}`,
            shipEquipmentContext: (nationLabel, shipType, fcsCapacity, engineCapacity, rCapacity, tCapacity) => `${nationLabel} · ${shipType} · FCS capacity ${fcsCapacity} · Engine capacity ${engineCapacity} · R mount capacity ${rCapacity} · T mount capacity ${tCapacity}`,
            rosterSeat: "Sailor Slot", rosterClass: "Class", rosterLevel: "Lv", rosterSailor: "Sailor", rosterBoost: "Boost", rosterClassChange: "Class Change", rosterRepairSpeed: "Repair speed", rosterVeteran: "Veterans", rosterExpert: "Experts", rosterRookie: "Rookies", rosterTotalCrew: "Total Sailors", performanceOutput: "Output", onTime: "OnTime",
            server: "Server", nation: "Nation", preset: "Class change path preset", level: "Level", sailorType: "Sailor preset", boost: "Sailor enhancement item",
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
            resultTitle: "Sailor calculation results", ability: "Ability", currentGrowth: "Growth", currentAbility: "Ability", seamanAdjAbility: "Display", resultAbilityHelp: "You can edit accumulated abilities directly. The edited values will be used for the performance calculation.", fixedResultAbilityHelp: "Only abilities with accumulated values supplied by the sailor preset cannot be edited.", veteranTitle: "Veterans", veteranRate: "Veteran rate", veteranCount: "Veterans", performanceInputTitle: "Sailor performance settings", performancePersonnelTitle: "Veteran, expert, and rookie conditions", performanceSeamanAdjAbilityTitle: "Abilities affected by seaman adjustment", performanceGunTitle: "Gun applied to simulation", performanceGun: "Gun", performanceGunClass: "Required class", performanceGunLevel: "Required level", performanceGunCaliber: "Caliber", performanceGunBarrels: "Mount", performanceGunElevation: "Maximum elevation", performanceGunReload: "Gun reload time", performanceSimulationTitle: "Sailor performance simulation", performanceItem: "Performance", performanceCase: "Case", performanceVeteran: "Veterans", performanceExpert: "Experts", performanceRookie: "Rookies", performanceSeamanAdjustmentPercent: "Seaman adjustment rate", performanceCrewCount: "Current / total crew", performanceCrewRate: "Crew rate", performanceReady: "Performance is recalculated automatically when abilities or settings change.", performanceCalculating: "Calculating…", performanceComplete: "Simulation complete.", performanceFailed: (message) => `Performance calculation failed: ${message}`, performanceRepair: "Repair speed [/s]", performanceStructural: "Structural defense", performanceAppliedSeamanAdjustment: "Seaman adjustment applied to reload", performanceReloadEfficiency: "Sailor reload efficiency tier", performanceReloadCapProgress: "Reload ability cap progress", performanceAbilityCapReached: "Reload cap reached", performanceAverageReload: "Selected gun average reload time [s]", performanceRequiredSeamanAdjustment: "Seaman adjustment needed for next reload tier", performanceAverageReloadWithSeamanAdjustment: "Average reload with required adjustment [s]", appliedSailorPreset: "Sailor preset", appliedBoost: "Applied enhancement", notApplied: "not applied", noChange: "No change",
            performanceSeamanSeats: (labels, mode) => labels.length > 0
                ? labels.join(" + ")
                : mode === "ship"
                    ? "Seaman bonuses apply only when a Seaman is assigned to a slot."
                    : "Not embarked *Seaman adjustment applies when an added sailor is set as a Seaman.",
            performanceSeamanGlobalWarning: "Global Seaman adjustment temporarily uses the Korea-server formula and still requires verification.",
            performanceFcsTitle: "FCS applied to simulation", performanceFcsName: "FCS list", performanceFcsGuideLength: "Target guideline length", performanceFcsTargetGun: "Specify target gun", performanceFcsAccuracy: "Accuracy bonus", performanceFcsCapacity: "Required capacity", performanceGuidelineLength: "Guideline length", performanceGuidelineAdjustment: "Target guideline sailor adjustment", performanceGuidelineTargetInput: (target) => `${target}: direct input`, performanceGuidelineTargetGun: (target, gunName) => `${target}: ${gunName}`, performanceGuidelineRepair: (target) => `Guideline (${target}) repair speed [/s]`, performanceGuidelineStructural: (target) => `Guideline (${target}) structural defense`, performanceGuidelineNoAdjustment: "No adjustment needed", performanceGuidelineUnavailable: "Unavailable", performanceGuidelineAdjustmentImpossible: "Cannot adjust while keeping veterans fixed", performanceGuidelineCalculated: (length) => `Calculated guideline: ${length}`, performanceGuidelineVeteran: (value) => `Veterans ${value}`, performanceGuidelineExpert: (value) => `Experts ${value}`, performanceGuidelineRookie: (value) => `Rookies ${value}`,
            performanceSeamanAdjustmentHelp: "Enter a seaman adjustment from 0% to 12%. The entered rate is applied when calculating the related performance values.",
            performanceImplementedReloadTitle: "12-shot in-game reload estimation comparison [s]", performanceImplementedReloadHelp: "Compares the estimated in-game reload intervals for 12 shots in each case. Cumulative time through each shot appears below the bar; slow intervals are soft red, medium intervals yellow, and fast intervals green.", performanceTimeline: "12-shot cumulative time [s]", performanceShotNumber: (index) => `Shot ${index}`, performanceTimelineSummary: (total, average) => `Total ${total}s · average ${average}s`, performanceIntervalDetail: (index, interval, cumulative) => `Shot ${index}: ${interval}s · cumulative ${cumulative}s`,
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
        "engine-catalog.json": "20260915-1",
    };
    const STATIC_CATALOG_SCHEMAS = {
        "sailor-catalog.json": 2,
        "gun-shipyard-catalog.json": 2,
        "fcs-catalog.json": 1,
        "ship-catalog.json": 3,
        "engine-catalog.json": 1,
    };
    const el = (selector) => document.querySelector(selector);
    const server = el("#sailor-server");
    const nation = el("#sailor-nation");
    const preset = el("#sailor-preset");
    const level = el("#sailor-level");
    const sailorType = el("#sailor-type");
    const boost = el("#sailor-boost");
    const status = el("#sailor-status");
    const SERVER_PREFERENCE_STORAGE_KEY = "navyfield-simulator-server";
    function storedServerPreference() {
        try {
            const savedServer = window.localStorage.getItem(SERVER_PREFERENCE_STORAGE_KEY);
            return ["korea", "global"].includes(savedServer) ? savedServer : null;
        } catch {
            return null;
        }
    }
    function browserLanguageServer() {
        const preferredLanguage = navigator.languages?.[0] || navigator.language || "";
        return /^ko(?:-|$)/i.test(String(preferredLanguage).trim()) ? "korea" : "global";
    }
    function saveServerPreference(serverId) {
        if (!["korea", "global"].includes(serverId)) return;
        try {
            window.localStorage.setItem(SERVER_PREFERENCE_STORAGE_KEY, serverId);
        } catch {
            // The selection still works when storage is unavailable or blocked.
        }
    }
    server.value = storedServerPreference() || browserLanguageServer();
    let catalog = null;
    let nationCatalog = null;
    let paths = [];
    let pathFilterMode = "final";
    let actualClassChangeLevels = [];
    let bulkClassChangeLevel = "";
    let performanceCompositions = [];
    let performanceDetailedHeaders = [];
    let performanceSelectedConditionIndex = defaultPerformanceConditionIndex();
    let performanceCrewCount = null;
    let performanceEngineCrewCount = 1;
    let performanceServer = null;
    let latestPerformanceContext = null;
    let availablePerformanceGuns = [];
    let availablePerformanceFcs = [];
    let catalogRequestSequence = 0;
    let staticCatalogPromise = null;
    let simulatorMode = "ship";
    let shipClassFilter = "BB";
    let globalShipSpecialtyMode = "repair";
    let carrierAircraftMode = server.value === "korea" ? "B" : "F";
    let shipVeteranBulkScope = "all";
    let resultView = "all";
    let activeShipLayer = 0;
    const layerSets = {
        single: [{ role: "sailor", roleIndex: 1, state: null }],
        ship: [{ role: "captain", roleIndex: 1, state: null }],
    };
    const activeLayerIndexes = { single: 0, ship: 0 };
    let shipLayers = layerSets[simulatorMode];
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
        status.hidden = false;
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
                fetchStaticCatalog("engine-catalog.json"),
            ]).catch((error) => {
                staticCatalogPromise = null;
                throw error;
            });
        }
        return staticCatalogPromise;
    }

    async function staticNationCatalog(serverId, nationId) {
        const [sailorCatalog, gunCatalog, fcsCatalog, shipCatalog, engineCatalog] = await loadStaticCatalogs();
        const numericNationId = Number(nationId);
        const sailorServer = sailorCatalog.servers?.[serverId];
        const sailorNation = sailorServer?.nations?.find((item) => item.id === numericNationId);
        const gunServer = gunCatalog.servers?.[serverId];
        const fcsServer = fcsCatalog.servers?.[serverId];
        const fcsNation = fcsServer?.nations?.find((item) => item.id === numericNationId);
        const shipServer = shipCatalog.servers?.[serverId];
        const engineServer = engineCatalog.servers?.[serverId];
        const engineNation = engineServer?.nations?.find((item) => item.id === numericNationId);
        if (!sailorServer || !sailorNation || !gunServer || !fcsNation || !shipServer || !engineServer) {
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
                    requiredWeight: Number(fcs.reqWeight) || 0,
                    requiredCapacity: Number(fcs.reqCapacity) || 0,
                    spottingCorrectionLimitRange: Number(fcs.impactRevisionRangeLimit) || 0,
                })),
                engines: (engineNation?.engines || []).map((engine, index) => ({
                    ...engine,
                    meta: index,
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
            "#ship-guideline-length-label": "shipGuidelineLength",
            "#ship-equipment-t-gun-2-label": "shipEquipmentTGun2", "#ship-add-t-gun-label": "shipAddTGun",
            "#sailor-subtitle": "subtitle", "#settings-title": "settingsTitle", "#ship-roster-title": "shipRosterTitle", "#ship-equipment-title": "shipEquipmentTitle", "#ship-equipment-fcs-label": "shipEquipmentFcs", "#ship-equipment-engine-label": "shipEquipmentEngine", "#ship-equipment-r-gun-label": "shipEquipmentRGun", "#ship-equipment-t-gun-label": "shipEquipmentTGun", "#ship-base-speed-label": "shipBaseSpeed", "#ship-target-guideline-label": "shipTargetGuideline", "#ship-r-gun-range-target-label": "shipRGunRangeTarget", "#ship-guideline-adjust-captain-label": "shipGuidelineAdjustCaptain", "#ship-performance-title": "shipPerformanceTitle", "#ship-repair-speed-label": "shipRepairSpeed", "#ship-overheat-speed-label": "shipOverheatSpeed", "#ship-overheat-time-label": "shipOverheatTime", "#ship-r-seat-heading": "shipPerformanceSeat", "#ship-t-seat-heading": "shipPerformanceSeat", "#ship-r-efficiency-heading": "shipReloadEfficiency", "#ship-t-efficiency-heading": "shipReloadEfficiency", "#ship-r-reload-heading": "shipImplementedReload", "#ship-t-reload-heading": "shipImplementedReload", "#server-help": "serverHelp", "#tree-title": "treeTitle", "#class-change-help": "classChangeHelp",
            "#class-change-bulk-label": "classChangeBulkLabel", "#class-change-bulk-help": "classChangeBulkHelp",
            "#result-title": "resultTitle", "#result-ability-help": "resultAbilityHelp", "#veteran-title": "veteranTitle", "#performance-input-title": "performanceInputTitle", "#performance-personnel-title": "performancePersonnelTitle", "#performance-seaman-adj-ability-title": "performanceSeamanAdjAbilityTitle", "#performance-fcs-title": "performanceFcsTitle", "#performance-fcs-name-heading": "performanceFcsName", "#performance-fcs-guide-length-heading": "performanceFcsGuideLength", "#performance-fcs-target-gun-heading": "performanceFcsTargetGun", "#performance-gun-title": "performanceGunTitle", "#performance-result-title": "performanceSimulationTitle", "#performance-result-table-title": "performanceResultTableTitle", "#performance-implemented-reload-title": "performanceImplementedReloadTitle", "#performance-implemented-reload-help": "performanceImplementedReloadHelp", "#performance-case-heading": "performanceCase", "#performance-condition-select-heading": "performanceOutput", "#performance-veteran-heading": "performanceVeteran", "#performance-expert-heading": "performanceExpert", "#performance-rookie-heading": "performanceRookie", "#performance-crew-count-heading": "performanceCrewCount", "#performance-crew-rate-heading": "performanceCrewRate", "#ability-help": "abilityHelp", "#hidden-growth-help": "hiddenHelp", "#tree-step-heading": "step", "#tree-class-heading": "className",
            "#tree-required-heading": "required", "#tree-actual-heading": "actual", "#tree-crew-heading": "crewGrowth",
            "#result-ability-heading": "ability", "#result-growth-heading": "currentGrowth", "#result-current-ability-heading": "currentAbility", "#result-seaman-adj-heading": "seamanAdjAbility",
        };
        for (const [selector, key] of Object.entries(labels)) el(selector).textContent = key === "shipGuidelineLength"
            ? (language() === "ko" ? "함선 가이드라인 길이" : "Ship guideline length") : t()[key];
        const overheatSpeedLabel = el("#ship-overheat-speed-label");
        overheatSpeedLabel.textContent = `${t().shipOverheatSpeed} [knot]`;
        el("#ship-base-speed").placeholder = t().shipBaseSpeedPlaceholder;
        el("#class-change-bulk-input").placeholder = t().classChangeBulkPlaceholder;
        el("#class-change-bulk-apply").textContent = t().classChangeBulkApply;
        renderShipSailorPresetButtons();
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
        updateShipEquipmentCapacityLabels(selectedShip());
        renderShipLayerTabs();
        renderShipPerformance();
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
        shipClassFilter = "BB";
        globalShipSpecialtyMode = "repair";
        carrierAircraftMode = server.value === "korea" ? "B" : "F";
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
        renderPresetCustomDropdown();
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
        shipClassFilter = "BB";
        globalShipSpecialtyMode = "repair";
        carrierAircraftMode = server.value === "korea" ? "B" : "F";
        catalog = null;
        nationCatalog = null;
        resetShipSelection();
        paths = [];
        preset.disabled = true;
        preset.replaceChildren(option("", t().presetPlaceholder));
        renderPresetCustomDropdown();
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
            renderPresetPathOptions(false);
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
    function isFinalClassChangePath(path) {
        return !paths.some((candidate) => candidate.length === path.length + 1
            && path.every((stage, index) => candidate[index]?.name === stage.name));
    }
    function filteredPathEntries() {
        return paths.map((path, index) => ({ path, index }))
            .filter(({ path }) => pathFilterMode === "all" || isFinalClassChangePath(path));
    }
    function appendPresetPathContent(container, path) {
        const last = path.at(-1);
        const className = document.createElement("span");
        className.className = "preset-path-class";
        className.textContent = last?.name || "-";
        const route = document.createElement("span");
        route.className = "preset-path-route";
        route.textContent = path.map((item) => `Lv${item.requiredLevel} ${item.name}`).join(" > ");
        container.append(className, route);
    }
    function updatePresetCustomSelection() {
        const toggle = el("#sailor-preset-dropdown-toggle");
        const menu = el("#sailor-preset-dropdown-menu");
        if (!toggle || !menu) return;
        toggle.replaceChildren();
        const selectedPath = preset.value === "" ? null : paths[Number(preset.value)];
        if (selectedPath) {
            appendPresetPathContent(toggle, selectedPath);
        } else {
            const placeholder = document.createElement("span");
            placeholder.className = "preset-custom-placeholder";
            placeholder.textContent = t().presetPlaceholder;
            toggle.append(placeholder);
        }
        toggle.disabled = preset.disabled;
        menu.querySelectorAll(".preset-path-option").forEach((button) => {
            button.classList.toggle("active", button.dataset.presetValue === preset.value);
        });
    }
    function renderPresetCustomDropdown() {
        const menu = el("#sailor-preset-dropdown-menu");
        if (!menu) return;
        menu.replaceChildren();
        for (const { path, index } of filteredPathEntries()) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "dropdown-item preset-path-option";
            button.dataset.presetValue = String(index);
            appendPresetPathContent(button, path);
            menu.append(button);
        }
        updatePresetCustomSelection();
    }
    function renderPresetPathOptions(preserveSelection = true) {
        const selectedValue = preserveSelection ? preset.value : "";
        preset.replaceChildren(option("", t().presetPlaceholder));
        for (const { path, index } of filteredPathEntries()) {
            const last = path.at(-1);
            preset.append(option(
                String(index),
                `${last.name} · ${path.map((item) => `Lv${item.requiredLevel} ${item.name}`).join(" > ")}`,
            ));
        }
        if ([...preset.options].some((item) => item.value === selectedValue)) {
            preset.value = selectedValue;
        }
        preset.disabled = paths.length === 0;
        renderPresetCustomDropdown();
    }
    function updatePathFilterButtons() {
        document.querySelectorAll(".path-filter-button").forEach((button) => {
            const active = button.dataset.pathFilter === pathFilterMode;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }
    function createPathFilterButtons() {
        const group = document.createElement("div");
        group.className = "btn-group path-filter-buttons";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "Class change path filter");
        for (const [value, label] of [["all", "All"], ["final", "Final"]]) {
            const button = document.createElement("button");
            const active = pathFilterMode === value;
            button.type = "button";
            button.className = `btn btn-outline-secondary path-filter-button${active ? " active" : ""}`;
            button.dataset.pathFilter = value;
            button.setAttribute("aria-pressed", String(active));
            button.textContent = label;
            group.append(button);
        }
        return group;
    }
    function setPathFilterMode(mode) {
        if (mode !== "all" && mode !== "final") return;
        const previousPreset = preset.value;
        pathFilterMode = mode;
        renderPresetPathOptions(true);
        updatePathFilterButtons();
        renderShipLayerTabs();
        if (previousPreset && preset.value !== previousPreset) {
            preset.dispatchEvent(new Event("change", { bubbles: true }));
        }
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
    function defaultGlobalShipVeteranCount() {
        if (server.value !== "global" || simulatorMode !== "ship") return 250;
        const activeLayer = shipLayers[activeShipLayer];
        const nationId = Number(nation.value);
        if (activeLayer?.role !== "gunner") return 200;
        if (new Set([1, 2, 3, 5, 6]).has(nationId)) return 230;
        return 200;
    }
    function defaultPerformanceCompositions(crewCount) {
        const fixedVeterans = server.value === "korea"
            ? [180, 250, 300]
            : [100, defaultGlobalShipVeteranCount(), 300];
        const veterans = [...fixedVeterans, Math.floor(crewCount * 0.4), Math.floor(crewCount * 0.45)];
        return veterans.map((veteranCount) => {
            const safeVeterans = Math.min(veteranCount, maximumPerformanceVeterans(crewCount));
            return { veterans: safeVeterans, experts: crewCount - safeVeterans, rookies: 0, seamanAdjustmentPercent: 0 };
        });
    }
    function defaultPerformanceConditionIndex() {
        return server.value === "korea" ? 4 : 1;
    }
    function maximumPerformanceVeterans(crewCount) {
        return Math.floor(crewCount * (server.value === "korea" ? 0.45 : 0.5));
    }
    function performanceCaseLabels(showActualVeteranCount = false) {
        return performanceCompositions.map((composition, index) => {
            const currentCrew = performanceCurrentCrew(composition);
            const crewRate = performanceCrewCount > 0 ? currentCrew / performanceCrewCount * 100 : 0;
            const percentageVeteranRate = [40, 45, 50].find((rate) =>
                composition.veterans === Math.floor(performanceCrewCount * rate / 100)
            );
            const veteranLabel = language() === "ko"
                ? `사관 ${showActualVeteranCount ? composition.veterans : percentageVeteranRate ?? composition.veterans}${!showActualVeteranCount && percentageVeteranRate ? "%" : ""}`
                : `Veterans ${showActualVeteranCount ? composition.veterans : percentageVeteranRate ?? composition.veterans}${!showActualVeteranCount && percentageVeteranRate ? "%" : ""}`;
            const veteranRateLabel = showActualVeteranCount && percentageVeteranRate
                ? (language() === "ko" ? `사관 ${percentageVeteranRate}%` : `Veterans ${percentageVeteranRate}%`)
                : null;
            const hasRookies = Number(composition.rookies) > 0;
            const hasReducedCrew = currentCrew !== performanceCrewCount;
            const showDetails = hasRookies || hasReducedCrew;
            if (!showDetails) {
                return veteranRateLabel ? [veteranLabel, veteranRateLabel] : [veteranLabel];
            }
            const labels = language() === "ko"
                ? [veteranLabel, `숙련 ${composition.experts} · 신병 ${composition.rookies}`, `총원 ${crewRate.toFixed(1)}%`]
                : [veteranLabel, `Experts ${composition.experts} · Rookies ${composition.rookies}`, `Total ${crewRate.toFixed(1)}%`];
            if (veteranRateLabel) labels.splice(1, 0, veteranRateLabel);
            return labels;
        });
    }
    function renderSeamanAdjAbilities() {
        const adjustment = seamanAdjustmentContext();
        const headRow = document.createElement("tr");
        const rateRow = document.createElement("tr");
        for (const ability of SEAMAN_ADJ_ABILITIES) {
            const [key] = ability;
            const heading = document.createElement("th");
            heading.textContent = abilityLabel(ability);
            headRow.append(heading);
            const cell = document.createElement("td");
            cell.textContent = `${adjustment.rateByAbility[key]}%`;
            rateRow.append(cell);
        }
        el("#performance-seaman-adj-ability-head").replaceChildren(headRow);
        el("#performance-seaman-adj-ability-body").replaceChildren(rateRow);
        el("#performance-seaman-adj-seats").textContent = t().performanceSeamanSeats(adjustment.labels, simulatorMode);
        const warning = el("#performance-seaman-adjustment-warning");
        warning.textContent = t().performanceSeamanGlobalWarning;
        warning.hidden = server.value !== "global" || adjustment.count === 0;
    }
    function performanceCurrentCrew(composition) {
        return composition.veterans + composition.experts + composition.rookies;
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
            performanceSelectedConditionIndex = defaultPerformanceConditionIndex();
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
            for (const field of ["veterans", "experts", "rookies"]) {
                const cell = document.createElement("td");
                const input = document.createElement("input");
                input.className = "form-control form-control-sm text-end performance-personnel-input";
                input.type = "number";
                input.min = "0";
                if (field === "veterans") input.max = String(maximumPerformanceVeterans(crewCount));
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
    function activeShipGunnerMountedGunValue() {
        if (simulatorMode !== "ship") return null;
        const layer = shipLayers[activeShipLayer];
        if (layer?.role !== "gunner") return null;
        const mountSelectId = layer.roleIndex <= 2
            ? "#ship-equipment-r-gun"
            : layer.roleIndex <= 4 ? "#ship-equipment-t-gun" : null;
        return mountSelectId ? (el(mountSelectId)?.value ?? "") : null;
    }
    function appendPerformanceGunContent(container, selection) {
        const { gun, requirement } = selection;
        const isKorean = language() === "ko";
        const name = document.createElement("span");
        name.className = "equipment-custom-main";
        name.textContent = gun.name;
        container.append(name);
        appendShipEquipmentDetail(container, `Lv ${requirement.level}`);
        appendShipEquipmentDetail(container, performanceGunBarrels(gun.barrelCount));
        appendShipEquipmentDetail(container, `${isKorean ? "연사" : "Reload"} ${displayGunNumber(gun.reloadSeconds)}s`);
        appendShipEquipmentDetail(container, `${isKorean ? "최대고각" : "Max angle"} ${displayGunNumber(gun.maxElevation)}°`);
    }
    function updatePerformanceGunSelection() {
        const select = el("#performance-gun-select");
        const toggle = el("#performance-gun-select-toggle");
        const menu = el("#performance-gun-select-menu");
        if (!select || !toggle || !menu) return;
        const selected = select.value
            ? availablePerformanceGuns.find(({ gun }) => String(gun.meta) === select.value)
            : null;
        toggle.replaceChildren();
        if (selected) {
            appendPerformanceGunContent(toggle, selected);
        } else {
            const placeholder = document.createElement("span");
            placeholder.className = "equipment-custom-placeholder";
            placeholder.textContent = select.options[0]?.textContent || t().shipEquipmentGunPlaceholder;
            toggle.append(placeholder);
        }
        toggle.disabled = select.disabled;
        toggle.classList.toggle("equipment-selection-required", !select.disabled && !selected);
        menu.querySelectorAll(".equipment-custom-option").forEach((button) => {
            const active = button.dataset.equipmentValue === select.value;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
        });
        if (latestPerformanceContext) {
            if (selected) latestPerformanceContext.gun = selected.gun;
            else delete latestPerformanceContext.gun;
        }
    }
    function renderPerformanceGunDropdown() {
        const select = el("#performance-gun-select");
        const menu = el("#performance-gun-select-menu");
        if (!select || !menu) return;
        menu.replaceChildren();
        for (const selection of availablePerformanceGuns) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "dropdown-item equipment-custom-option performance-custom-gun";
            button.dataset.equipmentSelect = select.id;
            button.dataset.equipmentValue = String(selection.gun.meta);
            appendPerformanceGunContent(button, selection);
            menu.append(button);
        }
        updatePerformanceGunSelection();
    }
    function renderPerformanceGunInput(appliedClasses, currentLevel, currentClassName) {
        const select = el("#performance-gun-select");
        const previousMeta = select.value;
        const mountedGunValue = activeShipGunnerMountedGunValue();
        const isCaptainPath = server.value === "korea"
            ? appliedClasses.has("관제병")
            : appliedClasses.has("Bridge Operator");
        const targetGunSpecified = isCaptainPath && el("#performance-fcs-target-gun").checked;
        const hasGunnerPath = isGunnerPath(appliedClasses) || mountedGunValue !== null;
        if ((!isCaptainPath && !hasGunnerPath) || isTorpedoSailorClass(currentClassName)) {
            availablePerformanceGuns = [];
            select.replaceChildren();
            select.disabled = true;
            renderPerformanceGunDropdown();
            el("#performance-gun-section").hidden = true;
            if (latestPerformanceContext) delete latestPerformanceContext.gun;
            return;
        }
        if (isCaptainPath && !targetGunSpecified) {
            availablePerformanceGuns = [];
            select.replaceChildren();
            select.disabled = true;
            renderPerformanceGunDropdown();
            el("#performance-gun-section").hidden = true;
            if (latestPerformanceContext) delete latestPerformanceContext.gun;
            return;
        }
        availablePerformanceGuns = (nationCatalog?.equipment?.guns || [])
            .map((gun) => {
                const requirement = targetGunSpecified
                    ? primaryGunRequirement(gun)
                    : gunRequirementForClasses(gun, appliedClasses, currentLevel);
                const isMountedGun = mountedGunValue !== null
                    && mountedGunValue !== ""
                    && String(gun.meta) === mountedGunValue;
                return {
                    gun,
                    requirement: requirement || (isMountedGun ? primaryGunRequirement(gun) : null),
                };
            })
            .filter(({ gun, requirement }) => requirement && (!targetGunSpecified || gun.shipyardRange > 0))
            .sort((left, right) =>
                right.requirement.level - left.requirement.level
                || right.gun.caliberInches - left.gun.caliberInches
                || left.gun.name.localeCompare(right.gun.name)
            );
        select.replaceChildren(option("", t().shipEquipmentGunPlaceholder));
        select.disabled = availablePerformanceGuns.length === 0;
        el("#performance-gun-section").hidden = availablePerformanceGuns.length === 0;
        if (!availablePerformanceGuns.length) {
            renderPerformanceGunDropdown();
            if (latestPerformanceContext) delete latestPerformanceContext.gun;
            return;
        }
        for (const { gun, requirement } of availablePerformanceGuns) {
            select.append(option(String(gun.meta), performanceGunLabel(gun, requirement)));
        }
        const preferredMeta = mountedGunValue === null ? previousMeta : mountedGunValue;
        if (availablePerformanceGuns.some(({ gun }) => String(gun.meta) === preferredMeta)) {
            select.value = preferredMeta;
        }
        renderPerformanceGunDropdown();
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
    function fitPerformanceComposition(composition, changedField, previousComposition = null) {
        if (changedField === "veterans"
            && previousComposition
            && performanceCurrentCrew(previousComposition) === performanceCrewCount) {
            const veteranIncrease = composition.veterans - previousComposition.veterans;
            composition.experts = Math.max(0, previousComposition.experts - veteranIncrease);
            composition.rookies = previousComposition.rookies;
        }
        const reductionOrder = {
            veterans: ["experts", "rookies"],
            experts: ["rookies", "veterans"],
            rookies: ["experts", "veterans"],
        };
        let overflow = composition.veterans + composition.experts + composition.rookies - performanceCrewCount;
        if (overflow <= 0) {
            const keepZeroRookies = changedField === "experts" && composition.rookies === 0;
            if (changedField !== "rookies" && !keepZeroRookies) composition.rookies += -overflow;
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
    function appendPerformanceCaseHeading(row, lines, conditionIndex = null) {
        const heading = document.createElement("th");
        if (Number.isInteger(conditionIndex)) {
            heading.dataset.performanceConditionIndex = String(conditionIndex);
            heading.classList.toggle(
                "performance-selected-condition-heading",
                simulatorMode === "ship" && conditionIndex === performanceSelectedConditionIndex,
            );
        }
        lines.forEach((line, index) => {
            const label = document.createElement(index === 0 ? "div" : "small");
            label.textContent = line;
            if (index > 0) label.className = "d-block fw-normal text-muted performance-case-detail";
            heading.append(label);
        });
        row.append(heading);
    }
    function updatePerformanceConditionHighlights() {
        document.querySelectorAll("[data-performance-condition-index]").forEach((heading) => {
            heading.classList.toggle(
                "performance-selected-condition-heading",
                simulatorMode === "ship"
                    && Number(heading.dataset.performanceConditionIndex) === performanceSelectedConditionIndex,
            );
        });
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
    function appendImplementedReloadVisualization(cell, sequence, {
        maximumSeconds,
        minimumInterval,
        maximumInterval,
    }) {
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
    function renderImplementedReloadVisualization(results, caseLabels) {
        const section = el("#performance-implemented-reload-section");
        if (!latestPerformanceContext?.gun) {
            section.hidden = true;
            el("#performance-implemented-reload-head").replaceChildren();
            el("#performance-implemented-reload-body").replaceChildren();
            return;
        }
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
                appendImplementedReloadVisualization(cell, sequence, {
                    maximumSeconds,
                    minimumInterval,
                    maximumInterval,
                });
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
        caseLabels.forEach((lines, index) => appendPerformanceCaseHeading(headRow, lines, index));
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
        capLabel.textContent = server.value === "global" ? "Maxed" : "상한도달";
        cell.append(capLabel);
    }
    function clearPerformanceResult() {
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
        if (!performanceStatus) return;
        performanceStatus.textContent = message;
        performanceStatus.className = `alert alert-${kind} py-2 mb-3`;
        performanceStatus.hidden = !message;
    }
    function buildPerformanceCalculationInput() {
        const seamanAdjustment = seamanAdjustmentContext();
        const input = {
            server: server.value,
            nationId: latestPerformanceContext.nationId,
            sailorClass: latestPerformanceContext.sailorClass,
            abilities: ABILITIES.slice(0, -1).map(([key]) => ({
                key,
                ability: latestPerformanceContext.abilityByType[key],
                applySeamanAdjustment: true,
                seamanAdjustmentPercent: seamanAdjustment.rateByAbility[key],
            })),
            crewCount: latestPerformanceContext.crewCount,
            conditions: performanceCompositions,
        };
        if (latestPerformanceContext.isEngineSailor) {
            input.engineSailorCount = latestPerformanceContext.engineSailorCount;
        }
        const targetGunSpecified = latestPerformanceContext.isCaptainPath
            && el("#performance-fcs-target-gun").checked
            && latestPerformanceContext.gun;
        if ((latestPerformanceContext.isGunnerPath || targetGunSpecified)
            && latestPerformanceContext.gun) {
            input.gun = {
                name: latestPerformanceContext.gun.name,
                reloadSeconds: latestPerformanceContext.gun.reloadSeconds,
                shipyardRange: latestPerformanceContext.gun.shipyardRange || null,
            };
        }
        if (latestPerformanceContext.isCaptainPath) {
            input.performanceRole = "captain";
            const selectedFcsMeta = Number(el("#performance-fcs-select").value);
            const selectedFcs = availablePerformanceFcs.find((fcs) => fcs.meta === selectedFcsMeta);
            if (!selectedFcs) throw new Error(t().unknownResponse);
            input.fcs = {
                name: selectedFcs.name,
                spottingCorrectionLimitRange: selectedFcs.spottingCorrectionLimitRange,
            };
            if (!targetGunSpecified) {
                const targetGuidelineLength = Number(el("#performance-fcs-guide-length").value);
                if (Number.isInteger(targetGuidelineLength)
                    && targetGuidelineLength >= 100
                    && targetGuidelineLength <= 9998
                    && targetGuidelineLength % 2 === 0) {
                    input.targetGuidelineLength = targetGuidelineLength;
                }
            }
        }
        return input;
    }
    function calculatePerformance() {
        if (!latestPerformanceContext) {
            clearPerformanceResult();
            return;
        }
        for (const [key] of ABILITIES.slice(0, -1)) {
            const input = el(`[data-result-ability="${key}"]`);
            if (!input || !input.checkValidity()) {
                clearPerformanceResult();
                return;
            }
            latestPerformanceContext.abilityByType[key] = Number(input.value);
        }
        renderSeamanAdjAbilities();
        if (latestPerformanceContext.isCaptainPath && !el("#performance-fcs-select").value) {
            clearPerformanceResult();
            return;
        }
        setPerformanceStatus(t().performanceCalculating, "info");
        el("#performance-result-section").hidden = true;
        try {
            const performanceResult = calculateSailorPerformance(buildPerformanceCalculationInput());
            if (!Array.isArray(performanceResult.results)) throw new Error(t().unknownResponse);
            const caseLabels = performanceCaseLabels(true);
            const headRow = document.createElement("tr");
            const itemHeading = document.createElement("th");
            itemHeading.textContent = t().performanceItem;
            headRow.append(itemHeading);
            caseLabels.forEach((lines, index) => appendPerformanceCaseHeading(headRow, lines, index));
            el("#performance-result-head").replaceChildren(headRow);
            const resultBody = el("#performance-result-body");
            resultBody.replaceChildren();
            const hasAppliedSeamanAdjustment = performanceResult.results.some((result) =>
                Number(result.performance?.appliedSeamanAdjustmentPercent) > 0
            );
            const isGlobalReloadCap = (result) => server.value === "global"
                && Number(result.performance?.gunReloadAbilityCapProgressPercent) >= 100;
            const allGlobalReloadCaps = performanceResult.results.length > 0
                && performanceResult.results.every(isGlobalReloadCap);
            const appendReloadCapLabel = (cell) => {
                appendCapLabel(cell);
            };
            const hasSelectedPerformanceGun = Boolean(latestPerformanceContext.gun);
            const reloadRows = latestPerformanceContext.isGunnerPath ? [
                [t().performanceReloadEfficiency, "gunReloadEfficiencyChangePercent", (value) => `${value}%`],
                [t().performanceReloadCapProgress, "gunReloadAbilityCapProgressPercent", (value) => `${Number(value).toFixed(1)}%`],
                ...(hasSelectedPerformanceGun ? [
                    [t().performanceAverageReload, "averageGunReloadSeconds", (value) => String(value)],
                ] : []),
                ...(allGlobalReloadCaps ? [] : [
                    [t().performanceRequiredSeamanAdjustment, "requiredSeamanAdjustmentPercent", (value) => value === null ? "" : `${value}%`],
                    ...(hasSelectedPerformanceGun ? [
                        [t().performanceAverageReloadWithSeamanAdjustment, "averageGunReloadSecondsWithRequiredSeamanAdjustment", (value) => value === null ? "" : String(value)],
                    ] : []),
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
            ].filter(([, valueKey]) => Object.hasOwn(performanceResult.results[0]?.performance || {}, valueKey));
            for (const [label, valueKey, formatValue] of performanceRows) {
                const row = document.createElement("tr");
                const heading = document.createElement("th");
                heading.scope = "row";
                heading.textContent = label;
                row.append(heading);
                performanceResult.results.forEach((result) => {
                    const cell = document.createElement("td");
                    const isSeamanSuggestionRow = valueKey === "requiredSeamanAdjustmentPercent"
                        || valueKey === "averageGunReloadSecondsWithRequiredSeamanAdjustment";
                    const showReloadCapOnly = isSeamanSuggestionRow && isGlobalReloadCap(result);
                    if (showReloadCapOnly) appendReloadCapLabel(cell);
                    else if (valueKey === "gunReloadAbilityCapProgressPercent"
                        && isGlobalReloadCap(result)) {
                        // 글로벌 연사캡 상태와 도달률 화면 표시가 충돌하지 않게 한다.
                        cell.textContent = "100.0%";
                    } else cell.textContent = formatValue(result.performance[valueKey]);
                    if (valueKey === "gunReloadEfficiencyChangePercent"
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
            const guidelineTargetLength = Number(performanceResult.guidelineTarget?.length);
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
                        targetDetail.textContent = performanceResult.guidelineTarget?.source === "gun"
                            ? t().performanceGuidelineTargetGun(
                                guidelineTargetLength,
                                performanceResult.guidelineTarget?.gun?.name || "-",
                            )
                            : t().performanceGuidelineTargetInput(guidelineTargetLength);
                        heading.append(targetDetail);
                    }
                    row.append(heading);
                    performanceResult.results.forEach((result) => {
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
                                t().performanceGuidelineVeteran(adjustment.veterans),
                                t().performanceGuidelineExpert(adjustment.experts),
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
            renderImplementedReloadVisualization(performanceResult.results, caseLabels);
            renderMultipleEnginePerformance(performanceResult.results, caseLabels);
            el("#performance-result-section").hidden = false;
            setPerformanceStatus(t().performanceComplete, "success");
        } catch (error) {
            setPerformanceStatus(t().performanceFailed(error.message), "danger");
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
        const classChangeStartIndex = classChangeBulkStartIndex(path);
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
            if (hasCustomLevels && index >= classChangeStartIndex) {
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
            actualInput.disabled = index < classChangeStartIndex
                || !allowLateClassChange
                || !hasValidLateClassChangeRange;
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
        const isSeamanPath = isSeamanSailorPath(preset.value);
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
        const veteranRates = server.value === "korea" ? [0.4, 0.45] : [0.4, 0.45, 0.5];
        const veteranHeadRow = document.createElement("tr");
        const veteranHeadLabel = document.createElement("th");
        veteranHeadLabel.textContent = t().veteranRate;
        veteranHeadRow.append(veteranHeadLabel);
        const veteranCountRow = document.createElement("tr");
        const veteranCountLabel = document.createElement("th");
        veteranCountLabel.scope = "row";
        veteranCountLabel.textContent = t().veteranCount;
        veteranCountRow.append(veteranCountLabel);
        for (const rate of veteranRates) {
            const rateCell = document.createElement("th");
            rateCell.textContent = `${Math.round(rate * 100)}%`;
            veteranHeadRow.append(rateCell);
            const countCell = document.createElement("td");
            countCell.textContent = String(Math.floor(abilityByType.crewGrowth * rate));
            veteranCountRow.append(countCell);
        }
        const veteranTable = el("#veteran-head").closest("table");
        veteranTable.classList.add("veteran-rate-table");
        el("#veteran-head").replaceChildren(veteranHeadRow);
        el("#veteran-body").replaceChildren(veteranCountRow);
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
        latestPerformanceContext.isGunnerPath = isGunnerPath(appliedClasses)
            || activeShipGunnerMountedGunValue() !== null;
        el("#performance-fcs-guide-length").disabled = latestPerformanceContext.isCaptainPath
            && el("#performance-fcs-target-gun").checked;
        renderPerformanceGunInput(
            appliedClasses,
            currentLevel,
            currentClassName,
        );
        const boostText = boost.options[boost.selectedIndex]?.textContent || t().none;
        const sailorPresetText = sailorType.options[sailorType.selectedIndex]?.textContent || "";
        el("#result-summary").textContent = `${nationName(server.value, nation.value)} · ${currentClassName} · Lv.${currentLevel} · ${t().appliedSailorPreset}: ${sailorPresetText} · ${t().appliedBoost}: ${boostText}`;
        el("#tree-section").hidden = false;
        el("#result-section").hidden = false;
        el(".settings-result-layout")?.classList.add("has-result");
        setResultView("all");
        status.hidden = true;
        status.textContent = "";
        refreshActiveLayerSummary(path.at(-1)?.name || currentClassName);
        calculatePerformance();
    }
    function hideResults() {
        latestPerformanceContext = null;
        availablePerformanceGuns = [];
        availablePerformanceFcs = [];
        clearPerformanceResult();
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
        if (layer.role === "captain") return language() === "ko" ? "함장석" : "Bridge";
        if (layer.role === "gunner") {
            if (layer.roleIndex <= 2) {
                return language() === "ko"
                    ? `주포석 R${layer.roleIndex}`
                    : `R mount ${layer.roleIndex}`;
            }
            if (layer.roleIndex <= 4) {
                return language() === "ko"
                    ? `부포석 T${layer.roleIndex - 2}`
                    : `T mount ${layer.roleIndex - 2}`;
            }
            return language() === "ko" ? `포병석 ${layer.roleIndex}` : `Gunner ${layer.roleIndex}`;
        }
        if (layer.role === "support") return language() === "ko"
            ? `보조석 ${layer.roleIndex}`
            : `${t().support} ${layer.roleIndex}`;
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
    function shipSailorPresetOptions() {
        if (server.value === "korea") {
            return [["attendanceLegend", "개근전설"], ["premium", "플미"]];
        }
        return [
            ["nfX", "X"], ["advancedHero", "AE Hero"], ["hero", "Hero"],
            ["advancedElite", "AE"], ["superElite", "SE"], ["elite", "E"],
        ];
    }
    function renderShipSailorPresetButtons() {
        const container = el("#ship-sailor-preset-buttons");
        if (!container) return;
        container.replaceChildren();
        shipSailorPresetOptions().forEach(([group, label]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "btn btn-outline-secondary btn-sm ship-sailor-preset-button";
            button.textContent = label;
            button.disabled = simulatorMode !== "ship" || !selectedShip();
            button.addEventListener("click", () => applyShipSailorPresetToRoster(group));
            container.append(button);
        });
        const specialtyContainer = el("#global-ship-specialty-buttons");
        if (!specialtyContainer) return;
        specialtyContainer.hidden = server.value !== "global";
        specialtyContainer.replaceChildren();
        for (const [mode, label] of [["repair", "Repair"], ["reload", "Reload"]]) {
            const button = document.createElement("button");
            const active = globalShipSpecialtyMode === mode;
            button.type = "button";
            button.className = `btn btn-outline-secondary btn-sm global-ship-specialty-button${active ? " active" : ""}`;
            button.textContent = label;
            button.disabled = simulatorMode !== "ship" || !selectedShip();
            button.setAttribute("aria-pressed", String(active));
            button.addEventListener("click", () => applyGlobalShipSpecialtyMode(mode));
            specialtyContainer.append(button);
        }
        renderCarrierAircraftModeButtons();
        renderShipVeteranBulkControls();
    }
    function renderCarrierAircraftModeButtons() {
        const container = el("#carrier-aircraft-mode-buttons");
        if (!container) return;
        const carrierSelected = simulatorMode === "ship" && String(selectedShip()?.ShipType || "").toUpperCase() === "CV";
        container.hidden = !carrierSelected;
        container.replaceChildren();
        for (const [mode, labelKey] of [["F", "carrierAircraftModeF"], ["A", "carrierAircraftModeA"], ["B", "carrierAircraftModeB"]]) {
            const button = document.createElement("button");
            const active = carrierAircraftMode === mode;
            button.type = "button";
            button.className = `btn btn-outline-secondary btn-sm carrier-aircraft-mode-button${active ? " active" : ""}`;
            button.textContent = mode;
            button.title = t()[labelKey];
            button.disabled = !carrierSelected;
            button.setAttribute("aria-label", t()[labelKey]);
            button.setAttribute("aria-pressed", String(active));
            button.addEventListener("click", () => applyCarrierAircraftMode(mode));
            container.append(button);
        }
    }
    function renderShipVeteranBulkControls() {
        const container = el("#ship-veteran-bulk-controls");
        const label = el("#ship-veteran-bulk-label");
        const scopeButtons = el("#ship-veteran-bulk-scope-buttons");
        const buttons = el("#ship-veteran-bulk-buttons");
        const input = el("#ship-veteran-bulk-input");
        if (!container || !label || !scopeButtons || !buttons || !input) return;
        const presetRates = server.value === "korea" ? [45, 40] : [50, 45, 40];
        const disabled = simulatorMode !== "ship" || !selectedShip();
        label.textContent = t().shipVeteranBulk;
        scopeButtons.replaceChildren();
        for (const [scope, scopeLabel] of [["all", "All"], ["captain", "Bridge"], ["gunner", "Mount"], ["support", "Support"]]) {
            const button = document.createElement("button");
            const active = shipVeteranBulkScope === scope;
            button.type = "button";
            button.className = `btn btn-outline-secondary btn-sm ship-veteran-bulk-scope-button${active ? " active" : ""}`;
            button.textContent = scopeLabel;
            button.disabled = disabled;
            button.setAttribute("aria-pressed", String(active));
            button.addEventListener("click", () => {
                shipVeteranBulkScope = scope;
                renderShipVeteranBulkControls();
            });
            scopeButtons.append(button);
        }
        buttons.replaceChildren();
        presetRates.forEach((rate) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "btn btn-outline-secondary btn-sm ship-veteran-bulk-button";
            button.textContent = `${rate}%`;
            button.disabled = disabled;
            button.addEventListener("click", () => applyVeteranRateToShipRoster(rate));
            buttons.append(button);
        });
        input.removeAttribute("max");
        input.placeholder = t().shipVeteranRatePlaceholder;
        input.setAttribute("aria-label", t().shipVeteranBulk);
        input.disabled = disabled;
    }
    function specializedAbilityForPath(pathIndex) {
        const path = paths[Number(pathIndex)] || [];
        const finalName = path.at(-1)?.name || "";
        if (SPECIAL_LANDING_CLASS_NAMES.has(finalName)) return "potential";
        if (/음파 탐지관|잠수 항해관|Chief Sonarman|Chief Planesman/i.test(finalName)) return "potential";
        if (/명중 거포병|Accu Huge Gunner/i.test(finalName)) return "reload";
        if (/양용포 병장|Chief DP Gunner/i.test(finalName)) return "reload";
        if (/정찰|\bRecon\b/i.test(finalName)) return "fighter";
        if (/급폭|폭격|Dive Bomber|Torpedo Bomber/i.test(finalName)) return "bomber";
        if (/전투기|Fighter/i.test(finalName)) return "fighter";
        if (/기관|Engineer/i.test(finalName)) return "engine";
        if (/보수|Restor/i.test(finalName)) return "restore";
        if (/수리|Repair/i.test(finalName)) return "repair";
        if (/어뢰|Torpedo/i.test(finalName)) return "torpedo";
        if (/명중|Accu(?:racy)?/i.test(finalName)) return "accuracy";
        if (/연사|포술|Gunner|Gunnery|대공|AA Gunner/i.test(finalName)) return "reload";
        if (/관제|Operator/i.test(finalName)) return "potential";
        const scores = Object.fromEntries(ABILITIES.slice(0, -1).map(([key]) => [key, 0]));
        path.forEach((stage) => {
            for (const [key] of ABILITIES.slice(0, -1)) {
                scores[key] += Math.max(0, Number(stage.abilities?.[key]) || 0);
            }
        });
        return ["potential", "reload", "accuracy", "torpedo", "repair", "restore", "engine", "fighter", "bomber", "aircraft"]
            .reduce((best, key) => scores[key] > scores[best] ? key : best, "potential");
    }
    function isSeamanSailorPath(pathIndex) {
        const path = paths[Number(pathIndex)] || [];
        return path.some((stage) => server.value === "korea"
            ? /갑판/.test(stage.name || "")
            : ["2nd Seaman", "1st Seaman", "Chief Seaman"].includes(stage.name));
    }
    function seamanAdjustmentSeatLabel(layer, index) {
        const sailorTypeId = shipLayerFieldValue(layer, index, "sailor-type", "normal");
        const boostId = shipLayerFieldValue(layer, index, "sailor-boost", "");
        return `${shipLayerLabel(layer, index)} · ${compactSailorPreset(sailorTypeId)} · ${compactBoost(boostId)}`;
    }
    function seamanAdjustmentContext() {
        const seamen = shipLayers.map((layer, index) => {
            const pathIndex = shipLayerFieldValue(layer, index, "sailor-preset");
            const isEligibleSeat = simulatorMode !== "ship" || layer.role === "support";
            if (!isEligibleSeat || pathIndex === "" || !isSeamanSailorPath(pathIndex)) return null;
            const context = index === activeShipLayer
                ? latestPerformanceContext
                : shipLayerSummary(layer).performanceContext;
            if (!context?.abilityByType) return null;
            return {
                layer,
                index,
                abilityByType: context.abilityByType,
            };
        }).filter(Boolean)
            .sort((left, right) => simulatorMode === "ship"
                ? Number(left.layer.roleIndex) - Number(right.layer.roleIndex)
                : left.index - right.index)
            .slice(0, 3);
        const rateByAbility = Object.fromEntries(SEAMAN_ADJ_ABILITIES.map(([key]) => {
            if (seamen.length === 0) return [key, 0];
            const contribution = seamen.reduce((sum, sailor) => {
                // Seaman 보정 원천은 사관·숙련병 가중치와 충원율을 적용하지 않은 누적 어빌이다.
                const accumulatedAbility = Math.max(0, Number(sailor.abilityByType[key]) || 0);
                const serverAdjustedAbility = server.value === "global"
                    ? accumulatedAbility * 0.9
                    : accumulatedAbility;
                return sum + Math.floor(serverAdjustedAbility / 300);
            }, 0);
            return [key, Math.floor(contribution / Math.sqrt(seamen.length))];
        }));
        return {
            rateByAbility,
            labels: seamen.map(({ layer, index }) => seamanAdjustmentSeatLabel(layer, index)),
            count: seamen.length,
        };
    }
    function sailorTypeForShipPreset(group, pathIndex, seat = null, globalSpecialtyOverride = null) {
        if (!group) return "normal";
        const path = paths[Number(pathIndex)] || [];
        const finalName = path.at(-1)?.name || "";
        if (server.value === "korea"
            && group === "premium"
            && Number(nation.value) === 2
            && seat?.role === "gunner"
            && seat.roleIndex <= 2
            && finalName === "연사 거포병") {
            return "premiumAccuracy";
        }
        const specialty = globalSpecialtyOverride || (/관제병|Bridge Operator/i.test(finalName)
            ? "repair"
            : specializedAbilityForPath(pathIndex));
        if (server.value === "korea") {
            if (group === "attendanceLegend") {
                if (finalName === "관제병") return "legendSupport";
                if (["aircraft", "fighter", "bomber"].includes(specialty)) return "legendSpecial";
                if (["repair", "restore", "engine"].includes(specialty)) return "legendSupport";
                return "attendance";
            }
            const premiumSpecialty = specialty === "aircraft"
                ? "Repair"
                : (specialty === "antiAir" ? "Reload" : `${specialty[0].toUpperCase()}${specialty.slice(1)}`);
            return `premium${premiumSpecialty}`;
        }
        const fixedTypes = { nfX: "nfXSailor", advancedHero: "advancedHero", hero: "heroSailor" };
        if (fixedTypes[group]) return fixedTypes[group];
        if (group === "advancedElite" && specialty === "potential") return "advancedHero";
        const gradePrefix = { advancedElite: "advancedElite", superElite: "superElite", elite: "elite" }[group];
        const gradeSpecialty = specialty === "aircraft"
            ? "Repair"
            : (specialty === "antiAir" ? "Reload" : `${specialty[0].toUpperCase()}${specialty.slice(1)}`);
        const typeId = `${gradePrefix}${gradeSpecialty}`;
        return availableSailorTypes().some((type) => type.id === typeId) ? typeId : "normal";
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
    function refreshActiveLayerSummary(finalClassName) {
        const layer = shipLayers[activeShipLayer];
        if (!layer) return;
        const accumulatedAbilityByType = latestPerformanceContext?.abilityByType;
        const useDisplayedAbility = preset.value !== "" && isSeamanSailorPath(preset.value);
        const abilityByType = accumulatedAbilityByType
            ? Object.fromEntries(Object.entries(accumulatedAbilityByType).map(([key, value]) => [
                key,
                useDisplayedAbility ? Math.floor(Number(value) * 0.07) : value,
            ]))
            : null;
        layer.summary = {
            className: finalClassName ?? layer.summary?.className ?? "-",
            level: level.value || "-",
            sailor: compactSailorPreset(sailorType.value || "normal"),
            boost: compactBoost(boost.value),
            classChange: currentClassChangeSummary(),
            totalCrew: Number.isFinite(latestPerformanceContext?.crewCount)
                ? latestPerformanceContext.crewCount
                : null,
            abilityByType,
            performanceContext: latestPerformanceContext
                ? structuredClone(latestPerformanceContext)
                : null,
            performanceCondition: performanceCompositions[performanceSelectedConditionIndex]
                ? structuredClone(performanceCompositions[performanceSelectedConditionIndex])
                : null,
        };
        if (simulatorMode === "ship") {
            renderShipLayerTabs();
            renderShipPerformance();
        }
    }
    function shipLayerSummary(layer) {
        const fields = layer.state?.fields || {};
        return {
            className: layer.summary?.className || "-",
            level: layer.summary?.level || fields["sailor-level"] || "-",
            sailor: layer.summary?.sailor || compactSailorPreset(fields["sailor-type"] || "normal"),
            boost: layer.summary?.boost || compactBoost(fields["sailor-boost"] || ""),
            classChange: layer.summary?.classChange || t().onTime,
            totalCrew: layer.summary?.totalCrew ?? null,
            abilityByType: layer.summary?.abilityByType || null,
            performanceContext: layer.summary?.performanceContext || null,
            performanceCondition: layer.summary?.performanceCondition || null,
        };
    }
    function shipLayerFieldValue(layer, index, fieldId, fallback = "") {
        if (index === activeShipLayer) {
            const field = document.getElementById(fieldId);
            if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) return field.value;
        }
        return layer.state?.fields?.[fieldId] ?? fallback;
    }
    function gunnerPathCode(path) {
        return path.map(({ name: stageName }) => {
            if (server.value === "korea") {
                if (/^명중\s/.test(stageName)) return "명";
                if (/^연사\s/.test(stageName)) return "연";
            } else {
                if (/^(?:Accuracy|Accu)\s/i.test(stageName)) return "A";
                if (/^Reload\s/i.test(stageName)) return "R";
            }
            return "";
        }).join("");
    }
    function rosterPresetOptions() {
        const entries = filteredPathEntries();
        const duplicateCounts = new Map();
        for (const { path } of entries) {
            const name = path.at(-1)?.name || "-";
            duplicateCounts.set(name, (duplicateCounts.get(name) || 0) + 1);
        }
        const occurrences = new Map();
        return entries.map(({ path, index }) => {
            const name = path.at(-1)?.name || "-";
            const occurrence = (occurrences.get(name) || 0) + 1;
            occurrences.set(name, occurrence);
            const displayName = language() === "ko" && /^(명중|연사)\s/.test(name)
                ? name.replace(/\s+/g, "")
                : name;
            const pathCode = Number(nation.value) === 1
                ? gunnerPathCode(path)
                : "";
            if (duplicateCounts.get(name) <= 1) return [String(index), displayName];
            return [String(index), pathCode
                ? `${displayName} ${pathCode}`
                : `${displayName} (${occurrence})`];
        });
    }
    function pathIndexByFinalName(...names) {
        for (const name of names) {
            const index = paths.findIndex((path) => path.at(-1)?.name === name);
            if (index >= 0) return index;
        }
        return -1;
    }
    function deepestPathIndex(matchesFinalName) {
        let selectedIndex = -1;
        let selectedLength = -1;
        paths.forEach((path, index) => {
            if (matchesFinalName(path.at(-1)?.name || "") && path.length > selectedLength) {
                selectedIndex = index;
                selectedLength = path.length;
            }
        });
        return selectedIndex;
    }
    function carrierAircraftPathIndex(mode) {
        const matchesFinalName = server.value === "korea"
            ? {
                F: (finalName) => /전투기(?:파일럿|편대장)$/.test(finalName),
                A: (finalName) => /뇌격(?:기파일럿|편대장)$/.test(finalName),
                B: (finalName) => /급폭|급강하폭격기/.test(finalName),
            }[mode]
            : {
                F: (finalName) => /\bFighter (?:Pilot|SQ\.Ldr)$/i.test(finalName),
                A: (finalName) => /\bTorpedo Bomber (?:Pilot|SQ\.Ldr)$/i.test(finalName),
                B: (finalName) => /\bDive Bomber (?:Pilot|SQ\.Ldr)$/i.test(finalName),
            }[mode];
        return matchesFinalName ? deepestPathIndex(matchesFinalName) : -1;
    }
    function isCarrierShip(ship) {
        return String(ship?.ShipType || "").trim().toUpperCase() === "CV";
    }
    function defaultShipPresetIndex(seat, ship) {
        if (seat.role === "captain") {
            return pathIndexByFinalName(server.value === "korea" ? "관제병" : "Bridge Operator");
        }
        if (seat.role === "gunner" && seat.roleIndex <= 2) {
            const reloadClassName = server.value === "korea" ? "연사 거포병" : "Reload Huge Gunner";
            const reloadPathCode = server.value === "korea" ? "연연연" : "RRR";
            const preferredReloadPath = paths.findIndex((path) =>
                path.at(-1)?.name === reloadClassName && gunnerPathCode(path) === reloadPathCode
            );
            if (preferredReloadPath >= 0) return preferredReloadPath;
            return pathIndexByFinalName(
                reloadClassName,
                server.value === "korea" ? "포술장" : "Chief Gunner",
            );
        }
        if (seat.role === "gunner" && seat.roleIndex <= 4) {
            const nationId = Number(nation.value);
            if (nationId === 1) {
                const reloadClassName = server.value === "korea" ? "연사 거포병" : "Reload Huge Gunner";
                const reloadPathCode = server.value === "korea" ? "연연연" : "RRR";
                const preferredReloadPath = paths.findIndex((path) =>
                    path.at(-1)?.name === reloadClassName && gunnerPathCode(path) === reloadPathCode
                );
                return preferredReloadPath >= 0 ? preferredReloadPath : pathIndexByFinalName(reloadClassName);
            }
            if (nationId === 2) {
                return pathIndexByFinalName(server.value === "korea" ? "연사 거포병" : "Reload Huge Gunner");
            }
            if (nationId === 3) {
                return pathIndexByFinalName(server.value === "korea" ? "양용포 병장" : "Chief DP Gunner");
            }
            if (nationId === 4) {
                return pathIndexByFinalName(server.value === "korea" ? "대공속사병장" : "Chief Rapid Fire Gunner");
            }
            if ([5, 6, 7].includes(nationId)
                || (server.value === "global" && nationId === 8)) {
                return pathIndexByFinalName(server.value === "korea" ? "포술장" : "Chief Gunner");
            }
        }
        if (seat.role === "support") {
            if (isCarrierShip(ship) && seat.roleIndex <= 8) {
                return carrierAircraftPathIndex(carrierAircraftMode);
            }
            const isBattleship = String(ship?.ShipType || "").trim().toUpperCase() === "BB";
            if (isBattleship && seat.roleIndex === 1) {
                return deepestPathIndex((finalName) => server.value === "korea"
                    ? /정찰기/.test(finalName)
                    : /\bRecon\b/i.test(finalName));
            }
            return deepestPathIndex((finalName) => server.value === "korea"
                ? /기관병/.test(finalName)
                : /\bEngineer\b/i.test(finalName));
        }
        return -1;
    }
    function initializeShipLayerSailorType(state, typeId) {
        const selected = availableSailorTypes().find((type) => type.id === typeId)
            || availableSailorTypes()[0];
        state.fields["sailor-type"] = selected.id;
        const initialLevel = selectedInitialLevel(selected);
        if ((Number(state.fields["sailor-level"]) || 1) < initialLevel) {
            state.fields["sailor-level"] = String(initialLevel);
        }
        for (const [key] of ABILITIES.slice(0, -1)) {
            const initialGrowth = selected.initialGrowth?.[key] ?? 9;
            state.fields[`initial-growth-${key}`] = String(initialGrowth);
            state.fields[`initial-ability-${key}`] = String(selected.ability?.[key] ?? 27);
            state.fields[`hidden-growth-${key}`] = String(initialGrowth);
        }
    }
    function defaultShipLayerBoost(seat, presetIndex) {
        if (server.value === "global") return "all:20";
        if (seat.role === "captain") return "repair:1";
        const finalClassName = paths[Number(presetIndex)]?.at(-1)?.name || "";
        if (seat.role === "gunner"
            && Number(nation.value) === 2
            && finalClassName === "연사 거포병") {
            return seat.roleIndex <= 2 ? "accuracy:1" : "reload:1";
        }
        return `${specializedAbilityForPath(presetIndex)}:1`;
    }
    function globalShipPresetGroupForType(typeId) {
        if (/^advancedElite/.test(typeId)) return "advancedElite";
        if (/^superElite/.test(typeId)) return "superElite";
        if (/^elite/.test(typeId)) return "elite";
        return null;
    }
    function shipPresetGroupForType(typeId) {
        if (server.value === "korea") {
            if (/^premium/.test(typeId)) return "premium";
            if (typeId === "attendance" || /^legend/.test(typeId)) return "attendanceLegend";
            return null;
        }
        const fixedGroups = { nfXSailor: "nfX", advancedHero: "advancedHero", heroSailor: "hero" };
        return fixedGroups[typeId] || globalShipPresetGroupForType(typeId);
    }
    function isGunnerShipPreset(pathIndex) {
        const numericPathIndex = Number(pathIndex);
        if (pathIndex === "" || !Number.isInteger(numericPathIndex) || numericPathIndex < 0) return false;
        return isGunnerPath((paths[numericPathIndex] || []).map((stage) => stage.name || ""));
    }
    function globalShipClassChangeSettings(pathIndex, mode) {
        if (mode !== "repair") return { levels: [], bulkLevel: "" };
        const numericPathIndex = Number(pathIndex);
        const path = pathIndex !== "" && Number.isInteger(numericPathIndex) && numericPathIndex >= 0
            ? (paths[numericPathIndex] || [])
            : [];
        const startIndex = classChangeBulkStartIndex(path);
        return {
            levels: path.map((stage, index) => index < startIndex
                ? ""
                : String(Math.max(125, Number(stage.requiredLevel) || 1))),
            bulkLevel: path.length > startIndex ? "125" : "",
        };
    }
    function lateClassChangeSettings(pathIndex, lateLevel) {
        const path = paths[Number(pathIndex)] || [];
        const startIndex = classChangeBulkStartIndex(path);
        const levels = Array(path.length).fill("");
        for (let index = 0; index < startIndex; index += 1) {
            levels[index] = String(path[index].requiredLevel);
        }
        for (let index = startIndex; index < path.length; index += 1) {
            const requiredLevel = Number(path[index].requiredLevel) || 1;
            const appliedLateLevel = server.value === "korea" && index === startIndex
                ? Math.min(lateLevel, 25)
                : lateLevel;
            levels[index] = String(Math.max(requiredLevel, appliedLateLevel));
        }
        return {
            levels,
            bulkLevel: path.length > startIndex ? String(lateLevel) : "",
        };
    }
    function applyGlobalShipClassChangeMode(pathIndex, mode) {
        const settings = globalShipClassChangeSettings(pathIndex, mode);
        actualClassChangeLevels = settings.levels;
        bulkClassChangeLevel = settings.bulkLevel;
    }
    function defaultShipLayerState(sourceState, seat, ship) {
        const state = structuredClone(sourceState);
        const defaultPresetIndex = defaultShipPresetIndex(seat, ship);
        state.fields ||= {};
        state.fields["sailor-preset"] = defaultPresetIndex >= 0 ? String(defaultPresetIndex) : "";
        const defaultSailorGroup = server.value === "korea" ? "premium" : "superElite";
        const useGlobalGunnerMode = server.value === "global" && isGunnerShipPreset(defaultPresetIndex);
        initializeShipLayerSailorType(
            state,
            sailorTypeForShipPreset(
                defaultSailorGroup,
                defaultPresetIndex,
                seat,
                useGlobalGunnerMode ? globalShipSpecialtyMode : null,
            ),
        );
        state.fields["sailor-boost"] = defaultShipLayerBoost(seat, defaultPresetIndex);
        state.actualClassChangeLevels = [];
        const lateJapaneseDpGunner = seat.role === "gunner"
            && seat.roleIndex >= 3
            && seat.roleIndex <= 4
            && Number(nation.value) === 3
            && defaultPresetIndex >= 0;
        const lateCarrierAircraft = isCarrierShip(ship)
            && seat.role === "support"
            && seat.roleIndex <= 8
            && ["A", "B"].includes(carrierAircraftMode)
            && defaultPresetIndex >= 0;
        if (lateCarrierAircraft) {
            const settings = lateClassChangeSettings(defaultPresetIndex, 90);
            state.actualClassChangeLevels = settings.levels;
            state.bulkClassChangeLevel = settings.bulkLevel;
        } else if (server.value === "global") {
            const settings = globalShipClassChangeSettings(
                defaultPresetIndex,
                useGlobalGunnerMode ? globalShipSpecialtyMode : null,
            );
            state.actualClassChangeLevels = settings.levels;
            state.bulkClassChangeLevel = settings.bulkLevel;
        } else if (lateJapaneseDpGunner) {
            state.actualClassChangeLevels = paths[defaultPresetIndex].map((stage) => String(stage.requiredLevel));
            state.actualClassChangeLevels[state.actualClassChangeLevels.length - 1] = "120";
            state.bulkClassChangeLevel = "";
        } else {
            state.bulkClassChangeLevel = "";
        }
        state.performanceCompositions = [];
        state.performanceDetailedHeaders = [];
        state.performanceSelectedConditionIndex = defaultPerformanceConditionIndex();
        state.performanceCrewCount = null;
        return state;
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
    function applyCarrierAircraftMode(mode) {
        if (!["F", "A", "B"].includes(mode)) return;
        carrierAircraftMode = mode;
        renderCarrierAircraftModeButtons();
        const ship = selectedShip();
        if (simulatorMode !== "ship" || !isCarrierShip(ship)) return;
        const aircraftPresetIndex = carrierAircraftPathIndex(mode);
        const enginePresetIndex = deepestPathIndex((finalName) => server.value === "korea"
            ? /기관병/.test(finalName)
            : /\bEngineer\b/i.test(finalName));
        const originalActiveLayer = activeShipLayer;
        shipLayers.forEach((layer, index) => {
            if (layer.role !== "support") return;
            const targetPresetIndex = layer.roleIndex <= 8 ? aircraftPresetIndex : enginePresetIndex;
            if (targetPresetIndex < 0) return;
            activateLayerForRosterEdit(index);
            const sailorGroup = shipPresetGroupForType(sailorType.value);
            preset.value = String(targetPresetIndex);
            updatePresetCustomSelection();
            sailorType.value = sailorTypeForShipPreset(sailorGroup, targetPresetIndex, layer);
            applySailorType(false);
            boost.value = defaultShipLayerBoost(layer, targetPresetIndex);
            if (layer.roleIndex <= 8 && ["A", "B"].includes(mode)) {
                const settings = lateClassChangeSettings(targetPresetIndex, 90);
                actualClassChangeLevels = settings.levels;
                bulkClassChangeLevel = settings.bulkLevel;
            } else {
                actualClassChangeLevels = [];
                bulkClassChangeLevel = "";
            }
            calculate();
        });
        activateLayerForRosterEdit(originalActiveLayer);
        renderShipLayerTabs();
    }
    function applyGlobalShipSpecialtyMode(mode) {
        if (server.value !== "global" || !["repair", "reload"].includes(mode)) return;
        globalShipSpecialtyMode = mode;
        renderShipSailorPresetButtons();
        if (simulatorMode !== "ship" || !selectedShip()) return;
        const originalActiveLayer = activeShipLayer;
        shipLayers.forEach((layer, index) => {
            activateLayerForRosterEdit(index);
            const group = globalShipPresetGroupForType(sailorType.value);
            if (!group || preset.value === "" || !isGunnerShipPreset(preset.value)) return;
            sailorType.value = sailorTypeForShipPreset(group, preset.value, layer, mode);
            applyGlobalShipClassChangeMode(preset.value, mode);
            sailorType.dispatchEvent(new Event("change", { bubbles: true }));
        });
        activateLayerForRosterEdit(originalActiveLayer);
        renderShipLayerTabs();
    }
    function applyShipSailorPresetToRoster(group) {
        if (simulatorMode !== "ship" || !selectedShip()) return;
        const fixedGlobalGroup = ["nfX", "advancedHero", "hero"].includes(group);
        const useGlobalSpecialtyMode = server.value === "global"
            && ["advancedElite", "superElite", "elite"].includes(group);
        const originalActiveLayer = activeShipLayer;
        shipLayers.forEach((layer, index) => {
            activateLayerForRosterEdit(index);
            if (group && !fixedGlobalGroup && preset.value === "") return;
            const applyGlobalGunnerMode = useGlobalSpecialtyMode && isGunnerShipPreset(preset.value);
            sailorType.value = sailorTypeForShipPreset(
                group,
                preset.value,
                layer,
                applyGlobalGunnerMode ? globalShipSpecialtyMode : null,
            );
            if (useGlobalSpecialtyMode) {
                applyGlobalShipClassChangeMode(
                    preset.value,
                    applyGlobalGunnerMode ? globalShipSpecialtyMode : null,
                );
            }
            sailorType.dispatchEvent(new Event("change", { bubbles: true }));
        });
        activateLayerForRosterEdit(originalActiveLayer);
        renderShipLayerTabs();
    }
    function applyVeteranSettingToShipRoster(resolveVeteranCount) {
        if (simulatorMode !== "ship" || !selectedShip()) return;
        const appliesToLayer = (layer) => shipVeteranBulkScope === "all" || layer.role === shipVeteranBulkScope;
        if (shipVeteranBulkScope === "all" || shipVeteranBulkScope === "captain") {
            disableCaptainAutoAdjustment(shipLayers.find((layer) => layer.role === "captain"));
        }
        let activeCompositionChanged = false;
        shipLayers.forEach((layer, index) => {
            if (!appliesToLayer(layer)) return;
            const isActiveLayer = index === activeShipLayer;
            const conditionIndex = isActiveLayer
                ? performanceSelectedConditionIndex
                : Number(layer.state?.performanceSelectedConditionIndex);
            const crewCount = Number(isActiveLayer
                ? performanceCrewCount
                : layer.state?.performanceCrewCount);
            const compositions = isActiveLayer
                ? performanceCompositions
                : layer.state?.performanceCompositions;
            if (!Number.isInteger(conditionIndex) || conditionIndex < 0 || conditionIndex >= 5
                || !Number.isFinite(crewCount) || crewCount < 0 || !Array.isArray(compositions)
                || !compositions[conditionIndex]) return;
            const requestedVeterans = Number(resolveVeteranCount(crewCount));
            if (!Number.isFinite(requestedVeterans)) return;
            const veterans = Math.min(
                Math.max(0, Math.floor(requestedVeterans)),
                maximumPerformanceVeterans(crewCount),
            );
            const currentComposition = compositions[conditionIndex];
            const appliedComposition = {
                veterans,
                experts: Math.max(0, crewCount - veterans),
                rookies: 0,
                seamanAdjustmentPercent: Number(currentComposition.seamanAdjustmentPercent) || 0,
            };
            compositions[conditionIndex] = appliedComposition;
            layer.summary ||= {};
            layer.summary.performanceCondition = structuredClone(appliedComposition);
            if (isActiveLayer) {
                performanceDetailedHeaders[conditionIndex] = true;
                activeCompositionChanged = true;
            } else if (layer.state) {
                layer.state.performanceDetailedHeaders ||= Array(5).fill(false);
                layer.state.performanceDetailedHeaders[conditionIndex] = true;
            }
        });
        if (activeCompositionChanged) {
            const composition = performanceCompositions[performanceSelectedConditionIndex];
            for (const field of ["veterans", "experts", "rookies"]) {
                const personnelInput = el(`#performance-input-body [data-index="${performanceSelectedConditionIndex}"][data-field="${field}"]`);
                if (personnelInput) personnelInput.value = String(composition[field]);
            }
            updatePerformanceCrewDisplay(performanceSelectedConditionIndex);
            calculatePerformance();
            refreshActiveLayerSummary();
            shipLayers[activeShipLayer].state = captureShipLayerState();
        } else {
            renderShipLayerTabs();
            renderShipPerformance();
        }
    }
    function applyVeteranRateToShipRoster(value) {
        if (String(value).trim() === "") return;
        const numericRate = Number(value);
        if (!Number.isFinite(numericRate)) return;
        const maximumRate = server.value === "korea" ? 45 : 50;
        const veteranRate = Math.min(maximumRate, Math.max(0, Math.floor(numericRate)));
        applyVeteranSettingToShipRoster((crewCount) => Math.floor(crewCount * veteranRate / 100));
    }
    function applyVeteranCountToShipRoster(value) {
        if (String(value).trim() === "") return;
        const veteranCount = Number(value);
        if (!Number.isFinite(veteranCount)) return;
        applyVeteranSettingToShipRoster(() => veteranCount);
    }
    function setPerformancePersonnelValue(index, field, value) {
        if (!["veterans", "experts", "rookies"].includes(field)) return false;
        const composition = performanceCompositions[index];
        if (!composition || !Number.isFinite(performanceCrewCount)) return false;
        const previousComposition = structuredClone(composition);
        const inputValue = Math.max(0, Math.floor(Number(value) || 0));
        if (field === "experts" || field === "rookies") performanceDetailedHeaders[index] = true;
        composition[field] = field === "veterans"
            ? Math.min(inputValue, maximumPerformanceVeterans(performanceCrewCount))
            : inputValue;
        fitPerformanceComposition(composition, field, previousComposition);
        for (const field of ["veterans", "experts", "rookies"]) {
            const input = el(`#performance-input-body [data-index="${index}"][data-field="${field}"]`);
            if (input) input.value = String(composition[field]);
        }
        updatePerformanceCrewDisplay(index);
        return true;
    }
    function disableCaptainAutoAdjustment(layer) {
        if (simulatorMode !== "ship" || layer?.role !== "captain") return;
        // Do not dispatch change: manual edits must not trigger the full-expert reset.
        el("#ship-guideline-adjust-captain").checked = false;
        el("#ship-guideline-adjustment-result").hidden = true;
    }
    function applyRosterPersonnelField(index, field, value) {
        disableCaptainAutoAdjustment(shipLayers[index]);
        activateLayerForRosterEdit(index);
        if (!setPerformancePersonnelValue(performanceSelectedConditionIndex, field, value)) return;
        refreshActiveLayerSummary();
        calculatePerformance();
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
            const fixedAbilityKeys = new Set(["potential", "repair", "engine"]);
            const embarkedSpecialtyKeys = new Set(shipLayers.map((layer, index) => {
                const pathIndex = shipLayerFieldValue(layer, index, "sailor-preset");
                return pathIndex === "" ? null : specializedAbilityForPath(pathIndex);
            }).filter(Boolean));
            if (shipLayers.some((layer) => layer.role === "gunner")) {
                embarkedSpecialtyKeys.add("accuracy");
                embarkedSpecialtyKeys.add("reload");
            }
            const rosterAbilityOrder = [
                "potential", "accuracy", "reload", "torpedo",
                "repair", "engine", "fighter", "bomber",
            ];
            const rosterAbilityColumns = rosterAbilityOrder
                .filter((key) => fixedAbilityKeys.has(key) || embarkedSpecialtyKeys.has(key))
                .map((key) => {
                    const ability = ABILITIES.find(([abilityKey]) => abilityKey === key);
                    return [key, abilityLabel(ability)];
                });
            const rosterHeadings = [
                t().rosterSeat, t().rosterClass, t().rosterLevel, t().rosterSailor, t().rosterBoost,
                t().rosterClassChange, t().rosterVeteran, t().rosterExpert, t().rosterRookie,
                t().rosterTotalCrew, ...rosterAbilityColumns.map(([, label]) => label),
            ];
            rosterHeadings.forEach((heading, headingIndex) => {
                const cell = document.createElement("th");
                cell.scope = "col";
                if (headingIndex === 1) {
                    const wrap = document.createElement("div");
                    wrap.className = "d-flex align-items-center justify-content-center gap-1";
                    const label = document.createElement("span");
                    label.textContent = heading;
                    wrap.append(label, createPathFilterButtons());
                    cell.append(wrap);
                } else {
                    cell.textContent = heading;
                }
                headRow.append(cell);
            });
            head.append(headRow);
            const body = document.createElement("tbody");
            const rosterFcs = selectedShipEquipment("#ship-equipment-fcs", "fcs");
            const rosterRGun = selectedShipEquipment("#ship-equipment-r-gun", "guns");
            const rosterTGun = selectedShipEquipment("#ship-equipment-t-gun", "guns");
            shipLayers.forEach((layer, index) => {
                const summary = shipLayerSummary(layer);
                const presetValue = shipLayerFieldValue(layer, index, "sailor-preset");
                const levelValue = shipLayerFieldValue(layer, index, "sailor-level", summary.level);
                const sailorTypeValue = shipLayerFieldValue(layer, index, "sailor-type", "normal");
                const layerSailorType = availableSailorTypes().find((type) => type.id === sailorTypeValue);
                const fixedClassChangeTiming = server.value === "korea" && Boolean(layerSailorType?.event);
                const boostValue = shipLayerFieldValue(layer, index, "sailor-boost");
                const layerClassChangeLevels = index === activeShipLayer
                    ? actualClassChangeLevels
                    : (layer.state?.actualClassChangeLevels || []);
                const enteredClassChangeLevels = layerClassChangeLevels.filter((value) => value !== "" && value !== undefined);
                const classChangeValue = fixedClassChangeTiming ? "" : (enteredClassChangeLevels.at(-1) || "");
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
                classChangeInput.disabled = !presetValue || fixedClassChangeTiming;
                classChangeInput.setAttribute("aria-label", t().rosterClassChange);
                classChangeInput.addEventListener("change", () => {
                    const value = classChangeInput.value;
                    activateLayerForRosterEdit(index);
                    el("#class-change-bulk-input").value = value;
                    applyBulkClassChangeLevels();
                });
                classChangeCell.append(classChangeInput);

                const personnelCells = [
                    ["veterans", t().rosterVeteran],
                    ["experts", t().rosterExpert],
                    ["rookies", t().rosterRookie],
                ].map(([field, label]) => {
                    const cell = document.createElement("td");
                    const input = document.createElement("input");
                    input.className = "form-control form-control-sm ship-roster-control ship-roster-personnel";
                    input.type = "number";
                    input.min = "0";
                    input.step = "1";
                    if (field === "veterans" && Number.isFinite(layerCrewCount)) {
                        input.max = String(maximumPerformanceVeterans(layerCrewCount));
                    }
                    input.value = layerComposition ? String(layerComposition[field]) : "";
                    input.disabled = !layerComposition || !Number.isFinite(layerCrewCount);
                    input.setAttribute("aria-label", label);
                    input.addEventListener("change", () => applyRosterPersonnelField(index, field, input.value));
                    cell.append(input);
                    return cell;
                });
                const resultCell = (value, visible = true, suffix = "") => {
                    const cell = document.createElement("td");
                    cell.className = "ship-roster-result";
                    if (!visible) {
                        cell.classList.add("ship-roster-result-hidden");
                        return cell;
                    }
                    cell.textContent = Number.isFinite(Number(value)) && value !== null
                        ? `${displayGunNumber(value)}${suffix}`
                        : "-";
                    return cell;
                };
                const appendResultDetail = (cell, value, { prefix = "", suffix = "" } = {}) => {
                    if (!Number.isFinite(Number(value)) || value === null) return;
                    const detail = document.createElement("small");
                    detail.className = "ship-roster-result-detail";
                    detail.textContent = `${prefix}${displayGunNumber(value)}${suffix}`;
                    cell.append(detail);
                };
                let layerPerformance = null;
                try {
                    layerPerformance = calculateShipLayerPerformance(
                        layer,
                        rosterFcs,
                        rosterRGun,
                        rosterTGun,
                    )?.performance || null;
                } catch (error) {
                    console.error("Could not calculate sailor roster performance", error);
                }
                const totalCrewCell = resultCell(summary.totalCrew);
                const totalCrew = Number(summary.totalCrew);
                if (layerComposition && Number.isFinite(totalCrew) && totalCrew > 0) {
                    const currentCrew = performanceCurrentCrew(layerComposition);
                    const crewRate = Number((currentCrew / totalCrew * 100).toFixed(1));
                    appendResultDetail(totalCrewCell, crewRate, { suffix: "%" });
                }
                const layerSpecialtyAbility = presetValue === ""
                    ? null
                    : specializedAbilityForPath(presetValue);
                const layerIsSeaman = presetValue !== "" && isSeamanSailorPath(presetValue);
                const showRosterAbility = (key) => {
                    if (layerIsSeaman) return true;
                    if (layer.role === "captain") return key === "potential" || key === "repair";
                    if (layer.role === "gunner") return key === "accuracy" || key === "reload" || key === "repair";
                    if (layer.role !== "support") return true;
                    return key === "repair" || key === layerSpecialtyAbility;
                };
                const abilityCells = rosterAbilityColumns.map(([key]) => {
                    const cell = resultCell(summary.abilityByType?.[key], showRosterAbility(key));
                    if (!showRosterAbility(key)) return cell;
                    if (key === "potential") {
                        appendResultDetail(cell, layerPerformance?.guidelineLength);
                    } else if (key === "repair") {
                        appendResultDetail(cell, layerPerformance?.repairSpeedPerSecond, { suffix: "/s" });
                    } else if (key === "reload") {
                        if (server.value === "global") {
                            const capProgress = layerPerformance?.gunReloadAbilityCapProgressPercent;
                            appendResultDetail(cell, capProgress, {
                                prefix: Number(capProgress) >= 100 ? "Maxed " : "",
                                suffix: "%",
                            });
                        } else {
                            appendResultDetail(cell, layerPerformance?.gunReloadEfficiencyChangePercent, {
                                suffix: "%",
                            });
                        }
                        appendResultDetail(cell, layerPerformance?.averageGunReloadSeconds, {
                            prefix: language() === "ko" ? "평균 " : "Average ", suffix: "s",
                        });
                    }
                    return cell;
                });

                row.append(
                    classCell, levelCell, sailorCell, boostCell, classChangeCell,
                    ...personnelCells, totalCrewCell, ...abilityCells,
                );
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
            const savedConditionIndex = Number(saved.performanceSelectedConditionIndex);
            performanceSelectedConditionIndex = Number.isInteger(savedConditionIndex)
                && savedConditionIndex >= 0
                && savedConditionIndex < 5
                ? savedConditionIndex
                : defaultPerformanceConditionIndex();
            performanceCrewCount = Number.isFinite(saved.performanceCrewCount) ? saved.performanceCrewCount : null;
            performanceEngineCrewCount = saved.performanceEngineCrewCount;
            updatePresetCustomSelection();
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
    function calculateAllShipLayerSummaries() {
        if (simulatorMode !== "ship" || shipLayers.length === 0) return;
        const originalActiveLayer = activeShipLayer;
        shipLayers.forEach((_, index) => {
            if (index !== activeShipLayer) activateShipLayer(index);
        });
        if (activeShipLayer !== originalActiveLayer) activateShipLayer(originalActiveLayer);
        else renderShipLayerTabs();
    }
    function selectedShip() {
        const selectedValue = el("#ship-select")?.value;
        if (!selectedValue) return null;
        const shipId = Number(selectedValue);
        if (!Number.isInteger(shipId)) return null;
        return (nationCatalog?.equipment?.ships || []).find((ship) => Number(ship.ShipID) === shipId) || null;
    }
    function shipMountCapacity(ship, mountType) {
        const capacities = (ship?.mountGroups || [])
            .filter((group) => group.type === mountType)
            .map((group) => Number(group.capacity))
            .filter((capacity) => Number.isFinite(capacity) && capacity > 0);
        return capacities.length > 0 ? Math.min(...capacities) : 0;
    }
    function compatibleFcsClassCodes(shipType) {
        const codesByShipType = {
            FF: ["DD"],
            DD: ["DD"],
            CL: ["CL", "DD"],
            CA: ["CA", "CL", "DD"],
            PS: ["CA", "CL", "DD"],
            BB: ["BB", "FN", "CA", "CL", "DD"],
            BC: ["BB", "FN", "CA", "CL", "DD"],
            CV: ["DD"],
            SS: ["SS"],
        };
        return new Set(codesByShipType[String(shipType || "").toUpperCase()] || []);
    }
    function fcsClassCode(fcs) {
        return String(fcs?.name || "").match(/^(BB|CA|CL|DD|SS|FN)\s*FCS/i)?.[1]?.toUpperCase() || "";
    }
    function shipEquipmentFcsLabel(fcs) {
        return language() === "ko"
            ? `${fcs.name} · 용적 ${fcs.requiredCapacity} · 명중 ${fcs.accuracyBonus}`
            : `${fcs.name} · Capacity ${fcs.requiredCapacity} · Accuracy ${fcs.accuracyBonus}`;
    }
    function shipEquipmentEngineLabel(engine) {
        return language() === "ko"
            ? `${engine.name} · 출력 ${engine.output} · 용적 ${engine.requiredCapacity} · 오버힛 ${engine.overheatPercentage}%`
            : `${engine.name} · Output ${engine.output} · Capacity ${engine.requiredCapacity} · Overheat ${engine.overheatPercentage}%`;
    }
    function compareDefaultShipFcsPriority(left, right) {
        return Number(right.accuracyBonus) - Number(left.accuracyBonus)
            || Number(left.requiredWeight) - Number(right.requiredWeight)
            || Number(left.requiredCapacity) - Number(right.requiredCapacity)
            || String(left.name).localeCompare(String(right.name));
    }
    function shipEquipmentGunLabel(gun, showRange = false) {
        const prefix = `Lv ${gun.requiredLevel} · ${performanceGunBarrels(gun.barrelCount)} · ${gun.name}`;
        const label = language() === "ko"
            ? `${prefix} · 용적 ${gun.capacity} · 연사 ${displayGunNumber(gun.reloadSeconds)}s`
            : `${prefix} · Capacity ${gun.capacity} · Reload ${displayGunNumber(gun.reloadSeconds)}s`;
        return showRange && Number.isFinite(Number(gun.shipyardRange)) && Number(gun.shipyardRange) > 0
            ? `${label} · ${language() === "ko" ? "쉽야드사거리" : "Shipyard range"} ${displayGunNumber(gun.shipyardRange)}`
            : label;
    }
    function shipEquipmentCustomClass(select) {
        if (select.id.endsWith("-fcs")) return "equipment-custom-fcs";
        if (select.id.endsWith("-engine")) return "equipment-custom-engine";
        return "equipment-custom-gun";
    }
    function shipEquipmentCatalogItem(select, value) {
        const equipmentKey = select.id.endsWith("-fcs")
            ? "fcs"
            : select.id.endsWith("-engine") ? "engines" : "guns";
        return (nationCatalog?.equipment?.[equipmentKey] || [])
            .find((item) => String(item.meta) === String(value)) || null;
    }
    function appendShipEquipmentDetail(container, text) {
        const span = document.createElement("span");
        span.className = "equipment-custom-detail";
        span.textContent = text;
        container.append(span);
    }
    function appendShipEquipmentContent(container, select, item) {
        const isKorean = language() === "ko";
        if (select.id.endsWith("-fcs")) {
            const name = document.createElement("span");
            name.className = "equipment-custom-main";
            name.textContent = item.name;
            container.append(name);
            appendShipEquipmentDetail(container, `${isKorean ? "용적" : "Capacity"} ${item.requiredCapacity}`);
            appendShipEquipmentDetail(container, `${isKorean ? "명중" : "Accuracy"} ${item.accuracyBonus}`);
            return;
        }
        if (select.id.endsWith("-engine")) {
            const name = document.createElement("span");
            name.className = "equipment-custom-main";
            name.textContent = item.name;
            container.append(name);
            appendShipEquipmentDetail(container, `${isKorean ? "출력" : "Output"} ${item.output}`);
            appendShipEquipmentDetail(container, `${isKorean ? "용적" : "Capacity"} ${item.requiredCapacity}`);
            appendShipEquipmentDetail(container, `${isKorean ? "오버힛" : "Overheat"} ${item.overheatPercentage}%`);
            return;
        }
        const name = document.createElement("span");
        name.className = "equipment-custom-main";
        name.textContent = item.name;
        container.append(name);
        appendShipEquipmentDetail(container, `Lv ${item.requiredLevel}`);
        appendShipEquipmentDetail(container, performanceGunBarrels(item.barrelCount));
        appendShipEquipmentDetail(container, `${isKorean ? "용적" : "Capacity"} ${item.capacity}`);
        appendShipEquipmentDetail(container, `${isKorean ? "연사" : "Reload"} ${displayGunNumber(item.reloadSeconds)}s`);
        const showRange = select.id.endsWith("-r-gun") && Number(item.shipyardRange) > 0;
        const showMaxAngle = ["ship-equipment-t-gun", "ship-equipment-t-gun-2"].includes(select.id)
            && Number(item.maxElevation) > 0;
        appendShipEquipmentDetail(container, showRange
            ? `${isKorean ? "쉽야드사거리" : "Shipyard range"} ${displayGunNumber(item.shipyardRange)}`
            : showMaxAngle
                ? `${isKorean ? "최대고각" : "MaxAngle"} ${displayGunNumber(item.maxElevation)}`
                : "");
    }
    function updateShipEquipmentCustomSelection(select) {
        const toggle = el(`#${select.id}-toggle`);
        const menu = el(`#${select.id}-menu`);
        if (!toggle || !menu) return;
        toggle.replaceChildren();
        const selectedItem = select.value ? shipEquipmentCatalogItem(select, select.value) : null;
        if (selectedItem) {
            appendShipEquipmentContent(toggle, select, selectedItem);
        } else {
            const placeholder = document.createElement("span");
            placeholder.className = "equipment-custom-placeholder";
            placeholder.textContent = select.options[0]?.textContent || "-";
            toggle.append(placeholder);
        }
        toggle.disabled = select.disabled;
        const isGunSelect = select.id.includes("-gun");
        toggle.classList.toggle("equipment-selection-required", isGunSelect && !select.disabled && !selectedItem);
        menu.querySelectorAll(".equipment-custom-option").forEach((button) => {
            const active = button.dataset.equipmentValue === select.value;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
        });
    }
    function renderShipEquipmentCustomDropdown(select) {
        const menu = el(`#${select.id}-menu`);
        if (!menu) return;
        menu.replaceChildren();
        for (const nativeOption of [...select.options]) {
            if (!nativeOption.value) continue;
            const item = shipEquipmentCatalogItem(select, nativeOption.value);
            if (!item) continue;
            const button = document.createElement("button");
            button.type = "button";
            button.className = `dropdown-item equipment-custom-option ${shipEquipmentCustomClass(select)}`;
            button.dataset.equipmentSelect = select.id;
            button.dataset.equipmentValue = nativeOption.value;
            appendShipEquipmentContent(button, select, item);
            menu.append(button);
        }
        updateShipEquipmentCustomSelection(select);
    }
    function populateShipEquipmentSelect(select, items, placeholder, labelForItem) {
        select.replaceChildren(option("", items.length > 0 ? placeholder : t().shipEquipmentUnavailable));
        items.forEach((item) => select.append(option(String(item.meta), labelForItem(item))));
        select.disabled = items.length === 0;
        renderShipEquipmentCustomDropdown(select);
    }
    function selectedShipEquipment(selectId, equipmentKey) {
        const selectedValue = el(selectId)?.value;
        if (!selectedValue) return null;
        const selectedMeta = Number(selectedValue);
        if (!Number.isFinite(selectedMeta)) return null;
        return (nationCatalog?.equipment?.[equipmentKey] || [])
            .find((item) => Number(item.meta) === selectedMeta) || null;
    }
    function updateShipBaseSpeedInputState() {
        const input = el("#ship-base-speed");
        if (!input) return;
        const isMissing = !input.disabled && input.value.trim() === "";
        input.classList.toggle("ship-base-speed-required", isMissing);
        if (isMissing) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
    }
    function resetShipPerformance() {
        el("#ship-guideline-length").textContent = "-";
        el("#ship-repair-speed").textContent = "-";
        el("#ship-overheat-speed").textContent = "-";
        el("#ship-overheat-speed").classList.remove("ship-overheat-speed-required");
        el("#ship-overheat-time").textContent = "-";
        for (const id of [
            "#ship-guideline-length-detail",
            "#ship-repair-speed-detail",
            "#ship-overheat-speed-base-detail",
            "#ship-overheat-speed-rate-detail",
            "#ship-overheat-speed-rate-source-detail",
            "#ship-overheat-time-detail",
        ]) {
            el(id).textContent = "";
            el(id).hidden = true;
        }
        el("#ship-guideline-adjustment-result").hidden = true;
        for (const mount of ["r", "t"]) {
            el(`#ship-${mount}-performance-section`).hidden = true;
            el(`#ship-${mount}-performance-body`).replaceChildren();
        }
    }
    function defaultShipTargetGuideline() {
        return server.value === "global" ? 3120 : 3000;
    }
    function normalizeTargetGuideline(value) {
        const target = Math.floor(Number(value) || 100);
        const clamped = Math.max(100, Math.min(9998, target));
        return clamped - (clamped % 2);
    }
    function updateShipGuidelineControls() {
        const shipIsReady = simulatorMode === "ship" && Boolean(selectedShip());
        const rGun = selectedShipEquipment("#ship-equipment-r-gun", "guns");
        const rangeTarget = el("#ship-r-gun-range-target");
        const targetGuideline = el("#ship-target-guideline");
        const adjustCaptain = el("#ship-guideline-adjust-captain");
        const canUseGunRange = shipIsReady && Number(rGun?.shipyardRange) > 0;
        const wasUsingGunRange = targetGuideline.dataset.rGunRangeTarget === "true";
        rangeTarget.disabled = !canUseGunRange;
        if (!canUseGunRange) rangeTarget.checked = false;
        if (rangeTarget.checked && canUseGunRange) {
            if (!wasUsingGunRange) targetGuideline.dataset.manualValue = targetGuideline.value;
            targetGuideline.value = String(rGun.shipyardRange);
            targetGuideline.dataset.rGunRangeTarget = "true";
        } else if (wasUsingGunRange) {
            targetGuideline.value = targetGuideline.dataset.manualValue || String(defaultShipTargetGuideline());
            delete targetGuideline.dataset.manualValue;
            delete targetGuideline.dataset.rGunRangeTarget;
        }
        targetGuideline.disabled = !shipIsReady || rangeTarget.checked;
        adjustCaptain.disabled = !shipIsReady;
        if (adjustCaptain.disabled) adjustCaptain.checked = false;
    }
    function shipLayerPerformanceSignature(layer) {
        const summary = shipLayerSummary(layer);
        return JSON.stringify({
            className: summary.className,
            level: summary.level,
            sailor: summary.sailor,
            boost: summary.boost,
            classChange: summary.classChange,
            sailorClass: summary.performanceContext?.sailorClass || "",
            abilityByType: summary.performanceContext?.abilityByType || null,
            crewCount: summary.performanceContext?.crewCount ?? null,
            condition: summary.performanceCondition,
        });
    }
    function calculateShipLayerPerformance(layer, fcs, rGun, tGun) {
        const summary = shipLayerSummary(layer);
        const context = summary.performanceContext;
        const condition = summary.performanceCondition;
        if (!context?.abilityByType || !condition) return null;
        const seamanAdjustment = seamanAdjustmentContext();
        const input = {
            server: server.value,
            nationId: context.nationId,
            sailorClass: context.sailorClass,
            abilities: ABILITIES.slice(0, -1).map(([key]) => ({
                key,
                ability: Number(context.abilityByType[key]) || 0,
                applySeamanAdjustment: true,
                seamanAdjustmentPercent: seamanAdjustment.rateByAbility[key],
            })),
            crewCount: context.crewCount,
            conditions: Array.from({ length: 5 }, () => structuredClone(condition)),
        };
        if (layer.role === "captain" && fcs) {
            input.performanceRole = "captain";
            input.fcs = {
                name: fcs.name,
                spottingCorrectionLimitRange: fcs.spottingCorrectionLimitRange,
            };
            if (el("#ship-guideline-adjust-captain").checked) {
                if (el("#ship-r-gun-range-target").checked && rGun) {
                    input.gun = {
                        name: rGun.name,
                        reloadSeconds: rGun.reloadSeconds,
                        shipyardRange: rGun.shipyardRange || null,
                    };
                } else {
                    const targetLength = Number(el("#ship-target-guideline").value);
                    if (Number.isInteger(targetLength) && targetLength >= 100
                        && targetLength <= 9998 && targetLength % 2 === 0) {
                        input.targetGuidelineLength = targetLength;
                    }
                }
            }
        } else if (layer.role === "gunner") {
            const gun = layer.roleIndex <= 2 ? rGun : layer.roleIndex <= 4 ? tGun : null;
            if (gun && Number(gun.reloadSeconds) > 0) {
                input.gun = {
                    name: gun.name,
                    reloadSeconds: gun.reloadSeconds,
                    shipyardRange: gun.shipyardRange || null,
                };
            }
        }
        return calculateSailorPerformance(input).results[0] || null;
    }
    function shipGunPerformanceEntries(mount, gun, layerResults, includeWithoutGun = false) {
        if (!gun && !includeWithoutGun) return [];
        const roleIndexes = mount === "R" ? [1, 2] : [3, 4];
        const entries = roleIndexes.map((roleIndex) => {
            const layer = shipLayers.find((candidate) => candidate.role === "gunner" && candidate.roleIndex === roleIndex);
            return layer ? { layer, result: layerResults.get(layer) } : null;
        }).filter(Boolean);
        const hasMatchingPair = entries.length === 2
            && shipLayerPerformanceSignature(entries[0].layer)
                === shipLayerPerformanceSignature(entries[1].layer);
        const visibleEntries = hasMatchingPair
            ? [{ ...entries[0], seatLayers: entries.map(({ layer }) => layer) }]
            : entries.map((entry) => ({ ...entry, seatLayers: [entry.layer] }));
        return visibleEntries.map(({ layer, seatLayers, result }) => {
            const averageReload = Number(result?.performance?.averageGunReloadSeconds);
            return {
                layer,
                seatLayers,
                result,
                sequence: Number.isFinite(averageReload) ? implementedReloadSequence(averageReload) : null,
            };
        });
    }
    function shipGunPerformanceScale(renderedEntries) {
        const sequences = renderedEntries.map(({ sequence }) => sequence).filter(Boolean);
        const intervalValues = sequences.flatMap(({ values }) => values);
        return {
            maximumSeconds: sequences.length > 0
                ? Math.max(...sequences.map(({ totalSeconds }) => totalSeconds))
                : 1,
            minimumInterval: intervalValues.length > 0 ? Math.min(...intervalValues) : 0,
            maximumInterval: intervalValues.length > 0 ? Math.max(...intervalValues) : 0,
        };
    }
    function appendShipGunPerformanceRows(body, renderedEntries, scale, gunNumber = null) {
        const { maximumSeconds, minimumInterval, maximumInterval } = scale;
        renderedEntries.forEach(({ layer, seatLayers, result, sequence }, entryIndex) => {
            const row = document.createElement("tr");
            if (gunNumber === 2 && entryIndex === 0) row.className = "ship-performance-secondary-gun-row";
            const seat = document.createElement("th");
            seat.scope = "row";
            seatLayers.forEach((seatLayer) => {
                const line = document.createElement("span");
                line.className = "d-block";
                const seatLabel = shipLayerLabel(seatLayer, shipLayers.indexOf(seatLayer));
                line.textContent = gunNumber
                    ? `${language() === "ko" ? `함포 ${gunNumber}` : `Gun ${gunNumber}`} · ${seatLabel}`
                    : seatLabel;
                seat.append(line);
            });
            const efficiency = document.createElement("td");
            const reload = document.createElement("td");
            const capProgress = result?.performance?.gunReloadAbilityCapProgressPercent;
            const efficiencyValue = result?.performance?.gunReloadEfficiencyChangePercent;
            const capMaxed = server.value === "global" && Number(capProgress) >= 100;
            let hasReloadPerformance = false;
            const appendReloadPerformanceLine = (label, value, maxed = false) => {
                if (!Number.isFinite(Number(value))) return;
                const line = document.createElement("div");
                line.append(`${label} `);
                if (maxed) {
                    const maxedLabel = document.createElement("small");
                    maxedLabel.className = "text-muted";
                    maxedLabel.textContent = "Maxed";
                    line.append(maxedLabel, " ");
                }
                line.append(`${displayGunNumber(value)}%`);
                efficiency.append(line);
                hasReloadPerformance = true;
            };
            if (server.value === "global" && Number.isFinite(Number(capProgress))) {
                appendReloadPerformanceLine("Cap", capProgress, capMaxed);
            }
            appendReloadPerformanceLine("Efficiency", efficiencyValue, capMaxed);
            if (!hasReloadPerformance) efficiency.textContent = "-";
            if (sequence) {
                reload.className = "ship-performance-reload-cell";
                appendImplementedReloadVisualization(reload, sequence, {
                    maximumSeconds,
                    minimumInterval,
                    maximumInterval,
                });
            } else {
                reload.textContent = "-";
            }
            row.append(seat, efficiency, reload);
            body.append(row);
        });
    }
    function renderShipGunPerformance(mount, gun, layerResults) {
        const outputKey = mount.toLowerCase();
        const section = el(`#ship-${outputKey}-performance-section`);
        const body = el(`#ship-${outputKey}-performance-body`);
        body.replaceChildren();
        const renderedEntries = shipGunPerformanceEntries(mount, gun, layerResults, true);
        if (renderedEntries.length === 0) {
            section.hidden = true;
            return;
        }
        appendShipGunPerformanceRows(body, renderedEntries, shipGunPerformanceScale(renderedEntries));
        section.hidden = body.children.length === 0;
    }
    function renderShipTGunPerformance(primaryGun, primaryResults, secondaryGun, secondaryResults) {
        const section = el("#ship-t-performance-section");
        const body = el("#ship-t-performance-body");
        body.replaceChildren();
        const primaryEntries = shipGunPerformanceEntries("T", primaryGun, primaryResults, true);
        const secondaryEntries = shipGunPerformanceEntries("T", secondaryGun, secondaryResults);
        const allEntries = [...primaryEntries, ...secondaryEntries];
        if (allEntries.length === 0) {
            section.hidden = true;
            return;
        }
        const sharedScale = shipGunPerformanceScale(allEntries);
        const showGunNumbers = primaryEntries.length > 0 && secondaryEntries.length > 0;
        appendShipGunPerformanceRows(body, primaryEntries, sharedScale, showGunNumbers ? 1 : null);
        appendShipGunPerformanceRows(body, secondaryEntries, sharedScale, showGunNumbers ? 2 : null);
        section.hidden = false;
    }
    function applyCaptainGuidelineAdjustment(captainLayer, captainResult) {
        const adjustment = captainResult?.performance?.guidelineAdjustment;
        if (!captainLayer || !adjustment?.possible) return null;
        return applyCaptainComposition(captainLayer, adjustment);
    }
    function resetCaptainCompositionToFullExperts() {
        const captain = shipLayers.find((layer) => layer.role === "captain");
        if (!captain) return;
        const summary = shipLayerSummary(captain);
        const totalCrew = Number(summary.performanceContext?.crewCount);
        const veterans = Number(summary.performanceCondition?.veterans);
        if (!Number.isFinite(totalCrew) || !Number.isFinite(veterans)) return;
        applyCaptainComposition(captain, {
            veterans,
            experts: Math.max(0, totalCrew - veterans),
            rookies: 0,
        });
    }
    function applyCaptainComposition(captainLayer, adjustment) {
        const isActiveCaptain = shipLayers[activeShipLayer] === captainLayer;
        const conditionIndex = isActiveCaptain
            ? performanceSelectedConditionIndex
            : Number(captainLayer.state?.performanceSelectedConditionIndex);
        if (!Number.isInteger(conditionIndex) || conditionIndex < 0 || conditionIndex >= 5) return null;
        const currentCondition = shipLayerSummary(captainLayer).performanceCondition;
        if (!currentCondition) return null;
        const appliedCondition = {
            veterans: adjustment.veterans,
            experts: adjustment.experts,
            rookies: adjustment.rookies,
            seamanAdjustmentPercent: Number(currentCondition.seamanAdjustmentPercent) || 0,
        };
        if (["veterans", "experts", "rookies", "seamanAdjustmentPercent"]
            .every((key) => Number(currentCondition[key]) === Number(appliedCondition[key]))) return null;
        captainLayer.summary.performanceCondition = structuredClone(appliedCondition);
        if (isActiveCaptain) {
            performanceCompositions[conditionIndex] = structuredClone(appliedCondition);
            performanceDetailedHeaders[conditionIndex] = true;
            for (const field of ["veterans", "experts", "rookies"]) {
                const input = el(`#performance-input-body [data-index="${conditionIndex}"][data-field="${field}"]`);
                if (input) input.value = String(appliedCondition[field]);
            }
            updatePerformanceCrewDisplay(conditionIndex);
            calculatePerformance();
            captainLayer.state = captureShipLayerState();
        } else if (captainLayer.state) {
            if (!Array.isArray(captainLayer.state.performanceCompositions)) {
                captainLayer.state.performanceCompositions = [];
            }
            if (!Array.isArray(captainLayer.state.performanceDetailedHeaders)) {
                captainLayer.state.performanceDetailedHeaders = Array(5).fill(false);
            }
            captainLayer.state.performanceCompositions[conditionIndex] = structuredClone(appliedCondition);
            captainLayer.state.performanceDetailedHeaders[conditionIndex] = true;
        }
        renderShipLayerTabs();
        return appliedCondition;
    }
    function renderShipGuidelineAdjustment() {
        const output = el("#ship-guideline-adjustment-result");
        if (!el("#ship-guideline-adjust-captain").checked) {
            output.hidden = true;
            return;
        }
        const captain = shipLayers.find((layer) => layer.role === "captain");
        const condition = captain ? shipLayerSummary(captain).performanceCondition : null;
        let value = t().shipGuidelineAdjustmentDisabled;
        if (condition) {
            value = language() === "ko"
                ? `사관 ${condition.veterans} / 숙련병 ${condition.experts} / 신병 ${condition.rookies}`
                : `Veterans ${condition.veterans} / Experts ${condition.experts} / Rookies ${condition.rookies}`;
        }
        output.textContent = value;
        output.hidden = false;
    }
    function renderShipPerformance() {
        const ship = selectedShip();
        if (simulatorMode !== "ship" || !ship) {
            resetShipPerformance();
            return;
        }
        updateShipGuidelineControls();
        const fcs = selectedShipEquipment("#ship-equipment-fcs", "fcs");
        const engine = selectedShipEquipment("#ship-equipment-engine", "engines");
        const rGun = selectedShipEquipment("#ship-equipment-r-gun", "guns");
        const tGun = selectedShipEquipment("#ship-equipment-t-gun", "guns");
        const tGun2 = el("#ship-add-t-gun").checked
            ? selectedShipEquipment("#ship-equipment-t-gun-2", "guns")
            : null;
        const layerResults = new Map();
        try {
            shipLayers.forEach((layer) => {
                const result = calculateShipLayerPerformance(layer, fcs, rGun, tGun);
                if (result) layerResults.set(layer, result);
            });
        } catch (error) {
            console.error("Could not calculate ship performance", error);
        }
        const tGun2LayerResults = new Map();
        if (tGun2) {
            try {
                shipLayers
                    .filter((layer) => layer.role === "gunner" && layer.roleIndex >= 3 && layer.roleIndex <= 4)
                    .forEach((layer) => {
                        const result = calculateShipLayerPerformance(layer, fcs, rGun, tGun2);
                        if (result) tGun2LayerResults.set(layer, result);
                    });
            } catch (error) {
                console.error("Could not calculate secondary T mount gun performance", error);
            }
        }
        const captain = shipLayers.find((layer) => layer.role === "captain");
        let captainResult = captain ? layerResults.get(captain) : null;
        const appliedCaptainCondition = el("#ship-guideline-adjust-captain").checked
            ? applyCaptainGuidelineAdjustment(captain, captainResult)
            : null;
        if (appliedCaptainCondition && captain) {
            try {
                captainResult = calculateShipLayerPerformance(captain, fcs, rGun, tGun);
                if (captainResult) layerResults.set(captain, captainResult);
            } catch (error) {
                console.error("Could not recalculate adjusted captain performance", error);
            }
        }
        const guidelineLength = captainResult?.performance?.guidelineLength;
        el("#ship-guideline-length").textContent = Number.isFinite(guidelineLength)
            ? displayGunNumber(guidelineLength) : "-";
        const guidelineDetail = el("#ship-guideline-length-detail");
        const fcsGuidelineLength = Number(captainResult?.performance?.fcsGuidelineLength);
        const sailorGuidelineIncrease = Number(captainResult?.performance?.sailorGuidelineIncrease);
        const hasGuidelineBreakdown = Number.isFinite(fcsGuidelineLength)
            && Number.isFinite(sailorGuidelineIncrease);
        guidelineDetail.textContent = hasGuidelineBreakdown
            ? t().shipGuidelineBreakdown(
                displayGunNumber(fcsGuidelineLength),
                displayGunNumber(sailorGuidelineIncrease),
            )
            : "";
        guidelineDetail.hidden = !hasGuidelineBreakdown;
        const occupiedLayers = shipLayers.filter((layer, index) =>
            shipLayerFieldValue(layer, index, "sailor-preset") !== ""
        );
        const completeResults = occupiedLayers.every((layer) => layerResults.has(layer));
        const totalRepairAbility = [...layerResults.values()].reduce(
            (sum, result) => sum + (Number(result.seamanAdjAbilities?.repair) || 0),
            0,
        );
        const repairSpeed = calculateShipRepairSpeedDetails(server.value, totalRepairAbility);
        el("#ship-repair-speed").textContent = !completeResults
            ? "-"
            : repairSpeed.isMaxed
                ? `Maxed ${displayGunNumber(repairSpeed.repairSpeed)} (${displayGunNumber(repairSpeed.uncappedRepairSpeed)})`
                : displayGunNumber(repairSpeed.repairSpeed);
        const repairDetail = el("#ship-repair-speed-detail");
        repairDetail.textContent = completeResults
            ? t().shipRepairBreakdown(
                displayGunNumber(SHIP_BASE_REPAIR_SPEED),
                displayGunNumber(repairSpeed.sailorRepairSpeed),
            )
            : "";
        repairDetail.hidden = !completeResults;
        const engineAbilities = shipLayers.flatMap((layer) => {
            const summary = shipLayerSummary(layer);
            if (!summary.performanceContext?.isEngineSailor) return [];
            const result = layerResults.get(layer);
            const ability = Number(result?.seamanAdjAbilities?.engine);
            return Number.isFinite(ability) ? [ability] : [];
        });
        const overheat = calculateShipEngineOverheat(server.value, engineAbilities, engine?.overheatTime);
        const overheatTime = Number(overheat.engineOverheatTimeSeconds);
        const hasOverheatResult = Boolean(engine) && completeResults && Number.isFinite(overheatTime);
        el("#ship-overheat-time").textContent = hasOverheatResult
            ? `${Math.floor(overheatTime)} (${displayGunNumber(overheatTime)})`
            : "-";
        const overheatTimeDetail = el("#ship-overheat-time-detail");
        overheatTimeDetail.textContent = hasOverheatResult
            ? t().shipOverheatTimeBreakdown(
                displayGunNumber(overheat.shipOverheatTimeSeconds),
                displayGunNumber(overheat.sailorOverheatTimeSeconds),
            )
            : "";
        overheatTimeDetail.hidden = !hasOverheatResult;
        const baseSpeedInput = el("#ship-base-speed");
        const baseSpeedValue = baseSpeedInput.value.trim();
        const baseSpeed = Number(baseSpeedValue);
        const hasBaseSpeed = baseSpeedValue !== "" && Number.isFinite(baseSpeed) && baseSpeed > 0;
        updateShipBaseSpeedInputState();
        const overheatSpeedDetails = engine && completeResults
            ? calculateShipOverheatSpeed(
                hasBaseSpeed ? baseSpeed : 1,
                overheat.engineOverheatRateIncreasePercent,
                Number(ship.OverheatRatio),
                Number(engine.overheatPercentage),
                ship.ShipType,
                server.value,
            )
            : {
                calculatorSpeed: null,
                uncappedCalculatorSpeed: null,
                actualSpeed: null,
                isMaxed: false,
            };
        const hasOverheatRate = Number.isFinite(overheatSpeedDetails.shipOverheatContributionPercent)
            && Number.isFinite(overheatSpeedDetails.sailorOverheatContributionPercent);
        const hasOverheatSpeed = hasBaseSpeed && Number.isFinite(overheatSpeedDetails.actualSpeed);
        const overheatSpeedOutput = el("#ship-overheat-speed");
        const needsBaseSpeed = Boolean(engine) && completeResults && !hasBaseSpeed;
        overheatSpeedOutput.textContent = hasOverheatSpeed
            ? overheatSpeedDetails.isMaxed
                ? `${overheatSpeedDetails.actualSpeed} Maxed (${displayGunNumber(overheatSpeedDetails.uncappedCalculatorSpeed)})`
                : `${overheatSpeedDetails.actualSpeed} (${displayGunNumber(overheatSpeedDetails.calculatorSpeed)})`
            : needsBaseSpeed
                ? t().shipOverheatSpeedBaseRequired
                : "-";
        overheatSpeedOutput.classList.toggle(
            "ship-overheat-speed-required",
            needsBaseSpeed && server.value === "korea",
        );
        const speedBaseDetail = el("#ship-overheat-speed-base-detail");
        speedBaseDetail.textContent = hasOverheatSpeed
            ? t().shipOverheatSpeedBaseBreakdown(displayGunNumber(overheatSpeedDetails.baseSpeed))
            : "";
        speedBaseDetail.hidden = !hasOverheatSpeed;
        const speedRateDetail = el("#ship-overheat-speed-rate-detail");
        speedRateDetail.textContent = hasOverheatRate
            ? overheatSpeedDetails.isCombinedRateMaxed
                ? t().shipOverheatSpeedRateMaxed(
                    displayGunNumber(overheatSpeedDetails.appliedCombinedOverheatContributionPercent),
                )
                : t().shipOverheatSpeedRateBreakdown(
                    `+${displayGunNumber(overheatSpeedDetails.shipOverheatContributionPercent)}%`,
                    `+${displayGunNumber(overheatSpeedDetails.sailorOverheatContributionPercent)}%`,
                )
            : "";
        speedRateDetail.hidden = !hasOverheatRate;
        const speedRateSourceDetail = el("#ship-overheat-speed-rate-source-detail");
        speedRateSourceDetail.textContent = hasOverheatRate && overheatSpeedDetails.isCombinedRateMaxed
            ? t().shipOverheatSpeedRateUncappedBreakdown(
                `+${displayGunNumber(overheatSpeedDetails.shipOverheatContributionPercent)}%`,
                `+${displayGunNumber(overheatSpeedDetails.sailorOverheatContributionPercent)}%`,
            )
            : "";
        speedRateSourceDetail.hidden = !hasOverheatRate || !overheatSpeedDetails.isCombinedRateMaxed;
        renderShipGuidelineAdjustment();
        renderShipGunPerformance("R", rGun, layerResults);
        renderShipTGunPerformance(tGun, layerResults, tGun2, tGun2LayerResults);
    }
    function updateShipEquipmentCapacityLabels(ship) {
        const capacityLabel = language() === "ko" ? "용적" : "Capacity";
        for (const [id, label, capacity] of [
            ["fcs", t().shipEquipmentFcs, ship?.FCSCapacity],
            ["engine", t().shipEquipmentEngine, ship?.EngineCapacity],
        ]) {
            el(`#ship-equipment-${id}-label`).textContent = ship
                ? `${label} (${capacityLabel} ${Number(capacity) || 0})` : label;
        }
        for (const [mount, label] of [["R", t().shipEquipmentRGun], ["T", t().shipEquipmentTGun]]) {
            const mountGroups = (ship?.mountGroups || [])
                .filter((group) => group.type === mount && Number(group.capacity) > 0 && Number(group.count) > 0);
            const splitTMounts = mount === "T" && el("#ship-add-t-gun").checked;
            let remainingPrimaryMounts = Math.ceil(mountGroups.reduce(
                (total, group) => total + (Number(group.count) || 0),
                0,
            ) / 2);
            const splitMountCounts = mountGroups.map((group) => {
                const fullCount = Number(group.count) || 0;
                const primaryCount = Math.min(fullCount, remainingPrimaryMounts);
                remainingPrimaryMounts -= primaryCount;
                return { primary: primaryCount, secondary: fullCount - primaryCount };
            });
            const capacityText = (secondary = false) => mountGroups
                .map((group, index) => {
                    const count = splitTMounts
                        ? splitMountCounts[index][secondary ? "secondary" : "primary"]
                        : Number(group.count) || 0;
                    return count > 0 ? `${group.capacity} × ${count}` : null;
                })
                .filter(Boolean)
                .join(" / ") || "0 × 0";
            const capacities = capacityText();
            el(`#ship-equipment-${mount.toLowerCase()}-gun-label`).textContent = ship
                ? `${label} (${capacityLabel} ${capacities})` : label;
            if (mount === "T") {
                el("#ship-equipment-t-gun-2-label").textContent = ship
                    ? `${t().shipEquipmentTGun2} (${capacityLabel} ${capacityText(true)})`
                    : t().shipEquipmentTGun2;
            }
        }
    }
    function updateAdditionalTGunControl() {
        const checkbox = el("#ship-add-t-gun");
        const container = el("#ship-equipment-t-gun-2-container");
        const select = el("#ship-equipment-t-gun-2");
        checkbox.disabled = !selectedShip() || select.disabled;
        if (checkbox.disabled) checkbox.checked = false;
        container.hidden = !checkbox.checked;
    }
    function populateShipEquipmentSettings(ship) {
        updateShipEquipmentCapacityLabels(ship);
        const fcsSelect = el("#ship-equipment-fcs");
        const engineSelect = el("#ship-equipment-engine");
        const rGunSelect = el("#ship-equipment-r-gun");
        const tGunSelect = el("#ship-equipment-t-gun");
        const tGun2Select = el("#ship-equipment-t-gun-2");
        const addTGunCheckbox = el("#ship-add-t-gun");
        const baseSpeedInput = el("#ship-base-speed");
        const targetGuidelineInput = el("#ship-target-guideline");
        const rangeTargetCheckbox = el("#ship-r-gun-range-target");
        const adjustCaptainCheckbox = el("#ship-guideline-adjust-captain");
        if (!fcsSelect || !engineSelect || !rGunSelect || !tGunSelect || !tGun2Select || !addTGunCheckbox || !baseSpeedInput
            || !targetGuidelineInput || !rangeTargetCheckbox || !adjustCaptainCheckbox) return;
        if (!ship) {
            populateShipEquipmentSelect(fcsSelect, [], t().shipEquipmentFcsPlaceholder, shipEquipmentFcsLabel);
            populateShipEquipmentSelect(engineSelect, [], t().shipEquipmentEnginePlaceholder, shipEquipmentEngineLabel);
            populateShipEquipmentSelect(rGunSelect, [], t().shipEquipmentGunPlaceholder, shipEquipmentGunLabel);
            populateShipEquipmentSelect(tGunSelect, [], t().shipEquipmentGunPlaceholder, shipEquipmentGunLabel);
            populateShipEquipmentSelect(tGun2Select, [], t().shipEquipmentGunPlaceholder, shipEquipmentGunLabel);
            addTGunCheckbox.checked = false;
            updateAdditionalTGunControl();
            baseSpeedInput.value = "";
            baseSpeedInput.disabled = true;
            updateShipBaseSpeedInputState();
            targetGuidelineInput.value = "";
            targetGuidelineInput.disabled = true;
            delete targetGuidelineInput.dataset.manualValue;
            delete targetGuidelineInput.dataset.rGunRangeTarget;
            rangeTargetCheckbox.checked = false;
            rangeTargetCheckbox.disabled = true;
            adjustCaptainCheckbox.checked = false;
            adjustCaptainCheckbox.disabled = true;
            resetShipPerformance();
            return;
        }
        const fcsCapacity = Math.max(0, Number(ship.FCSCapacity) || 0);
        const engineCapacity = Math.max(0, Number(ship.EngineCapacity) || 0);
        const rCapacity = shipMountCapacity(ship, "R");
        const tCapacity = shipMountCapacity(ship, "T");
        const compatibleFcsCodes = compatibleFcsClassCodes(ship.ShipType);
        const fcsOptions = [...(nationCatalog?.equipment?.fcs || [])]
            .filter((fcs) => /\((?:Aiming|Power Auto|Auto(?: FCS)? X)\)$/i.test(String(fcs.name || ""))
                && compatibleFcsCodes.has(fcsClassCode(fcs))
                && Number(fcs.requiredCapacity) <= fcsCapacity)
            .sort(compareDefaultShipFcsPriority);
        const engineOptions = [...(nationCatalog?.equipment?.engines || [])]
            .filter((engine) => String(engine.shipType || "").toUpperCase() === String(ship.ShipType || "").toUpperCase()
                && Number(engine.requiredCapacity) > 0
                && Number(engine.requiredCapacity) <= engineCapacity)
            .sort((left, right) =>
                Number(right.output) - Number(left.output)
                || Number(left.requiredWeight) - Number(right.requiredWeight)
                || Number(left.requiredCapacity) - Number(right.requiredCapacity)
                || String(left.name).localeCompare(String(right.name)));
        const gunOptionsForCapacity = (capacity) => capacity <= 0
            ? []
            : [...(nationCatalog?.equipment?.guns || [])]
                .filter((gun) => Number(gun.capacity) > 0
                    && (gun.projectiles || []).some((shell) => {
                        const capacityPerBind = Number(shell.capacityPerBind);
                        return Number.isFinite(capacityPerBind) && capacityPerBind > 0
                            && Number(gun.capacity) + 2 * capacityPerBind <= capacity;
                    }))
                .sort((left, right) =>
                    Number(right.capacity) - Number(left.capacity)
                    || Number(right.caliberInches) - Number(left.caliberInches)
                    || String(left.name).localeCompare(String(right.name)));
        populateShipEquipmentSelect(fcsSelect, fcsOptions, t().shipEquipmentFcsPlaceholder, shipEquipmentFcsLabel);
        if (fcsOptions.length > 0) fcsSelect.value = String(fcsOptions[0].meta);
        populateShipEquipmentSelect(engineSelect, engineOptions, t().shipEquipmentEnginePlaceholder, shipEquipmentEngineLabel);
        if (engineOptions.length > 0) engineSelect.value = String(engineOptions[0].meta);
        const rGunOptions = gunOptionsForCapacity(rCapacity)
            .filter((gun) => String(ship.ShipType || "").toUpperCase() !== "BB"
                || Number(gun.shipyardRange) > 0);
        const tGunOptions = gunOptionsForCapacity(tCapacity);
        populateShipEquipmentSelect(rGunSelect, rGunOptions, t().shipEquipmentGunPlaceholder, (gun) => shipEquipmentGunLabel(gun, true));
        populateShipEquipmentSelect(tGunSelect, tGunOptions, t().shipEquipmentGunPlaceholder, shipEquipmentGunLabel);
        populateShipEquipmentSelect(tGun2Select, tGunOptions, t().shipEquipmentGunPlaceholder, shipEquipmentGunLabel);
        addTGunCheckbox.checked = false;
        updateAdditionalTGunControl();
        updateShipEquipmentCapacityLabels(ship);
        [fcsSelect, engineSelect, rGunSelect, tGunSelect, tGun2Select].forEach(updateShipEquipmentCustomSelection);
        baseSpeedInput.value = "";
        baseSpeedInput.disabled = false;
        updateShipBaseSpeedInputState();
        targetGuidelineInput.value = String(defaultShipTargetGuideline());
        delete targetGuidelineInput.dataset.manualValue;
        delete targetGuidelineInput.dataset.rGunRangeTarget;
        rangeTargetCheckbox.checked = false;
        adjustCaptainCheckbox.checked = ["BB", "BC"].includes(String(ship.ShipType || "").toUpperCase());
        updateShipGuidelineControls();
        renderShipPerformance();
    }
    function shipCatalogItem(value) {
        return (nationCatalog?.equipment?.ships || [])
            .find((ship) => String(ship.ShipID) === String(value)) || null;
    }
    function appendShipOptionDetail(container, text) {
        const span = document.createElement("span");
        span.className = "ship-custom-detail";
        span.textContent = text;
        container.append(span);
    }
    function appendShipOptionContent(container, ship) {
        const name = document.createElement("span");
        name.className = "ship-custom-main";
        name.textContent = ship.ShipName || `Ship ${ship.ShipID}`;
        name.title = name.textContent;
        container.append(name);
        appendShipOptionDetail(container, ship.ShipType || "-");
        appendShipOptionDetail(container, `Lv.${Number(ship.RequiredLevel) || 0}`);
        appendShipOptionDetail(
            container,
            `${language() === "ko" ? "포병석" : "Gunner"} ${Math.max(0, Number(ship.GunnerSailorSlot) || 0)}`,
        );
        appendShipOptionDetail(
            container,
            `${language() === "ko" ? "보조석" : "Support"} ${Math.max(0, Number(ship.SupportSailorSlot) || 0)}`,
        );
    }
    function updateShipCustomSelection() {
        const select = el("#ship-select");
        const toggle = el("#ship-select-toggle");
        const menu = el("#ship-select-menu");
        if (!select || !toggle || !menu) return;
        toggle.replaceChildren();
        const ship = select.value ? shipCatalogItem(select.value) : null;
        if (ship) {
            appendShipOptionContent(toggle, ship);
        } else {
            const placeholder = document.createElement("span");
            placeholder.className = "ship-custom-placeholder";
            placeholder.textContent = select.options[0]?.textContent || t().shipPlaceholder;
            toggle.append(placeholder);
        }
        toggle.disabled = select.disabled;
        menu.querySelectorAll(".ship-custom-option").forEach((button) => {
            const active = button.dataset.shipValue === select.value;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
        });
    }
    function renderShipCustomDropdown() {
        const select = el("#ship-select");
        const menu = el("#ship-select-menu");
        if (!select || !menu) return;
        menu.replaceChildren();
        for (const nativeOption of [...select.options]) {
            if (!nativeOption.value) continue;
            const ship = shipCatalogItem(nativeOption.value);
            if (!ship) continue;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "dropdown-item ship-custom-option";
            button.dataset.shipValue = nativeOption.value;
            appendShipOptionContent(button, ship);
            menu.append(button);
        }
        updateShipCustomSelection();
    }
    function renderShipClassFilterButtons(ships) {
        const container = el("#ship-class-filter-buttons");
        if (!container) return;
        const availableTypes = new Set(ships.map((ship) => String(ship.ShipType || "").toUpperCase()).filter(Boolean));
        const preferredOrder = ["BB", "BC", "CA", "CL", "DD", "FF", "CV", "SS", "PS"];
        const types = [
            ...preferredOrder.filter((type) => availableTypes.has(type)),
            ...[...availableTypes].filter((type) => !preferredOrder.includes(type)).sort(),
        ];
        if (!availableTypes.has(shipClassFilter)) {
            shipClassFilter = availableTypes.has("BB") ? "BB" : (types[0] || "BB");
        }
        container.replaceChildren();
        for (const type of types) {
            const button = document.createElement("button");
            const active = type === shipClassFilter;
            button.type = "button";
            button.className = `btn btn-outline-secondary${active ? " active" : ""}`;
            button.dataset.shipClass = type;
            button.setAttribute("aria-pressed", String(active));
            button.textContent = type;
            button.addEventListener("click", () => {
                if (shipClassFilter === type) return;
                const select = el("#ship-select");
                const previousValue = select.value;
                shipClassFilter = type;
                populateShipOptions(true);
                if (previousValue && select.value !== previousValue) {
                    select.dispatchEvent(new Event("change", { bubbles: true }));
                }
            });
            container.append(button);
        }
    }
    function populateShipOptions(preserveSelection = false) {
        const select = el("#ship-select");
        if (!select) return;
        const previousValue = preserveSelection ? select.value : "";
        select.replaceChildren(option("", t().shipPlaceholder));
        const allShips = [...(nationCatalog?.equipment?.ships || [])].sort((left, right) =>
            (Number(right.RequiredLevel) || 0) - (Number(left.RequiredLevel) || 0)
            || String(left.ShipName || "").localeCompare(String(right.ShipName || ""), language())
            || (Number(left.ShipID) || 0) - (Number(right.ShipID) || 0));
        renderShipClassFilterButtons(allShips);
        const ships = allShips.filter((ship) => String(ship.ShipType || "").toUpperCase() === shipClassFilter);
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
        renderShipCustomDropdown();
    }
    function resetShipSelection() {
        const select = el("#ship-select");
        if (select) {
            select.replaceChildren(option("", t().shipPlaceholder));
            select.disabled = true;
            renderShipCustomDropdown();
        }
        renderShipClassFilterButtons([]);
        layerSets.single = [{ role: "sailor", roleIndex: 1, state: null }];
        layerSets.ship = [{ role: "captain", roleIndex: 1, state: null }];
        activeLayerIndexes.single = 0;
        activeLayerIndexes.ship = 0;
        shipLayers = layerSets[simulatorMode];
        activeShipLayer = 0;
        const capacity = el("#ship-capacity-help");
        if (capacity) capacity.textContent = "";
        populateShipEquipmentSettings(null);
        renderShipLayerTabs();
        updateSimulatorModeUi();
    }
    function resizeShipLayersForShip(ship) {
        populateShipEquipmentSettings(ship);
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
        const seats = [{ role: "captain", roleIndex: 1 }];
        const gunnerSlots = Math.max(0, Math.floor(Number(ship.GunnerSailorSlot) || 0));
        const supportSlots = Math.max(0, Math.floor(Number(ship.SupportSailorSlot) || 0));
        for (let index = 1; index <= gunnerSlots; index += 1) seats.push({ role: "gunner", roleIndex: index });
        for (let index = 1; index <= supportSlots; index += 1) seats.push({ role: "support", roleIndex: index });
        shipLayers = seats.map((seat, index) => ({
            ...seat,
            state: defaultShipLayerState(previousLayers[index]?.state || currentState, seat, ship),
        }));
        layerSets.ship = shipLayers;
        activeShipLayer = Math.min(activeShipLayer, shipLayers.length - 1);
        renderShipLayerTabs();
        restoreShipLayerState(shipLayers[activeShipLayer].state);
        calculateAllShipLayerSummaries();
        el("#ship-capacity-help").textContent = t().shipCapacity(shipLayers.length, gunnerSlots, supportSlots);
    }
    function updateSimulatorModeUi() {
        const shipMode = simulatorMode === "ship";
        const shipSection = el("#ship-selection-section");
        const shipEquipmentSection = el("#ship-equipment-section");
        const rosterSection = el("#ship-roster-section");
        const rosterTitle = el("#ship-roster-title");
        const rosterBody = el("#ship-roster-card-body");
        const shipSailorPresetControls = el("#ship-sailor-preset-controls");
        const layerControls = el("#ship-layer-controls");
        const modeHelp = el("#calculator-mode-help");
        const addButton = el("#sailor-layer-add");
        const removeButton = el("#sailor-layer-remove");
        const showLayerControls = !shipMode || Boolean(selectedShip());
        if (shipSection) shipSection.hidden = !shipMode;
        if (shipEquipmentSection) shipEquipmentSection.hidden = !shipMode || !selectedShip();
        if (rosterSection) {
            rosterSection.hidden = !showLayerControls;
            rosterSection.className = shipMode ? "card sailor-card mb-3" : "mb-3";
        }
        if (rosterTitle) rosterTitle.hidden = !shipMode;
        if (rosterBody) rosterBody.className = shipMode ? "card-body compact-card-body" : "";
        if (shipSailorPresetControls) shipSailorPresetControls.hidden = !shipMode;
        if (layerControls) layerControls.hidden = !showLayerControls;
        if (modeHelp) modeHelp.hidden = !shipMode;
        document.querySelectorAll(".ship-sailor-preset-button").forEach((button) => {
            button.disabled = !shipMode || !selectedShip();
        });
        document.querySelectorAll(".global-ship-specialty-button").forEach((button) => {
            button.disabled = !shipMode || !selectedShip();
        });
        renderCarrierAircraftModeButtons();
        renderShipVeteranBulkControls();
        if (addButton) addButton.hidden = shipMode;
        if (removeButton) {
            removeButton.hidden = shipMode;
            removeButton.disabled = shipLayers.length <= 1;
        }
        if (shipMode) renderShipPerformance();
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
        shipLabel.className = "form-label fw-bold mb-1";
        shipLabel.htmlFor = "ship-select-toggle";
        const shipLabelRow = document.createElement("div");
        shipLabelRow.className = "d-flex flex-wrap align-items-center gap-2";
        const shipClassFilterButtons = document.createElement("div");
        shipClassFilterButtons.id = "ship-class-filter-buttons";
        shipClassFilterButtons.className = "btn-group ship-class-filter-buttons mb-1 flex-wrap";
        shipClassFilterButtons.setAttribute("role", "group");
        shipClassFilterButtons.setAttribute("aria-label", "Ship class filter");
        shipLabelRow.append(shipLabel, shipClassFilterButtons);
        const shipSelect = document.createElement("select");
        shipSelect.id = "ship-select";
        shipSelect.className = "visually-hidden";
        shipSelect.tabIndex = -1;
        shipSelect.setAttribute("aria-hidden", "true");
        shipSelect.disabled = true;
        shipSelect.append(option("", "함선을 선택하세요"));
        const shipDropdown = document.createElement("div");
        shipDropdown.className = "dropdown";
        const shipDropdownToggle = document.createElement("button");
        shipDropdownToggle.id = "ship-select-toggle";
        shipDropdownToggle.className = "form-select ship-custom-toggle";
        shipDropdownToggle.type = "button";
        shipDropdownToggle.dataset.bsToggle = "dropdown";
        shipDropdownToggle.setAttribute("aria-expanded", "false");
        shipDropdownToggle.disabled = true;
        const shipPlaceholder = document.createElement("span");
        shipPlaceholder.className = "ship-custom-placeholder";
        shipPlaceholder.textContent = "함선을 선택하세요";
        shipDropdownToggle.append(shipPlaceholder);
        const shipDropdownMenu = document.createElement("div");
        shipDropdownMenu.id = "ship-select-menu";
        shipDropdownMenu.className = "dropdown-menu ship-custom-menu";
        shipDropdown.append(shipDropdownToggle, shipDropdownMenu);
        const shipCapacityHelp = document.createElement("div");
        shipCapacityHelp.id = "ship-capacity-help";
        shipCapacityHelp.className = "form-text";
        shipSection.append(shipLabelRow, shipSelect, shipDropdown, shipCapacityHelp);
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
        const shipSailorPresetControls = document.createElement("div");
        shipSailorPresetControls.id = "ship-sailor-preset-controls";
        shipSailorPresetControls.className = "d-flex flex-wrap gap-2 mb-2";
        const shipSailorPresetButtons = document.createElement("div");
        shipSailorPresetButtons.id = "ship-sailor-preset-buttons";
        shipSailorPresetButtons.className = "btn-group flex-wrap";
        shipSailorPresetButtons.setAttribute("role", "group");
        const carrierAircraftModeButtons = document.createElement("div");
        carrierAircraftModeButtons.id = "carrier-aircraft-mode-buttons";
        carrierAircraftModeButtons.className = "btn-group flex-wrap";
        carrierAircraftModeButtons.setAttribute("role", "group");
        carrierAircraftModeButtons.setAttribute("aria-label", "Carrier aircraft class");
        carrierAircraftModeButtons.hidden = true;
        const globalShipSpecialtyButtons = document.createElement("div");
        globalShipSpecialtyButtons.id = "global-ship-specialty-buttons";
        globalShipSpecialtyButtons.className = "btn-group flex-wrap";
        globalShipSpecialtyButtons.setAttribute("role", "group");
        globalShipSpecialtyButtons.setAttribute("aria-label", "Global sailor specialty");
        globalShipSpecialtyButtons.hidden = true;
        const shipVeteranBulkControls = document.createElement("div");
        shipVeteranBulkControls.id = "ship-veteran-bulk-controls";
        shipVeteranBulkControls.className = "d-flex flex-wrap align-items-center gap-1 ms-lg-auto";
        const shipVeteranBulkLabel = document.createElement("span");
        shipVeteranBulkLabel.id = "ship-veteran-bulk-label";
        shipVeteranBulkLabel.className = "small text-muted me-1";
        const shipVeteranBulkButtons = document.createElement("div");
        shipVeteranBulkButtons.id = "ship-veteran-bulk-buttons";
        shipVeteranBulkButtons.className = "btn-group flex-wrap";
        shipVeteranBulkButtons.setAttribute("role", "group");
        shipVeteranBulkButtons.setAttribute("aria-label", "Veteran percentage");
        const shipVeteranBulkScopeButtons = document.createElement("div");
        shipVeteranBulkScopeButtons.id = "ship-veteran-bulk-scope-buttons";
        shipVeteranBulkScopeButtons.className = "btn-group flex-wrap";
        shipVeteranBulkScopeButtons.setAttribute("role", "group");
        shipVeteranBulkScopeButtons.setAttribute("aria-label", "Veteran batch input scope");
        const shipVeteranBulkInputGroup = document.createElement("div");
        shipVeteranBulkInputGroup.className = "input-group input-group-sm";
        shipVeteranBulkInputGroup.style.width = "7.5rem";
        const shipVeteranBulkInput = document.createElement("input");
        shipVeteranBulkInput.id = "ship-veteran-bulk-input";
        shipVeteranBulkInput.className = "form-control";
        shipVeteranBulkInput.type = "number";
        shipVeteranBulkInput.inputMode = "numeric";
        shipVeteranBulkInput.min = "0";
        shipVeteranBulkInput.step = "1";
        shipVeteranBulkInputGroup.append(shipVeteranBulkInput);
        shipVeteranBulkControls.append(
            shipVeteranBulkLabel,
            shipVeteranBulkScopeButtons,
            shipVeteranBulkButtons,
            shipVeteranBulkInputGroup,
        );
        shipSailorPresetControls.append(
            shipSailorPresetButtons,
            globalShipSpecialtyButtons,
            carrierAircraftModeButtons,
            shipVeteranBulkControls,
        );
        rosterBody.append(shipSailorPresetControls, layerControls);
        rosterSection.append(rosterTitle, rosterBody);
        el("#ship-equipment-section").after(rosterSection);
        el("#preset-label").closest(".col-12").className = "col-12";
        el("#level-label").closest(".col-12").className = "col-12 col-md-3 col-lg-2";
        el("#sailor-type-label").closest(".col-12").className = "col-12 col-md-9 col-lg-5";
        el("#boost-label").closest(".col-12").className = "col-12 col-lg-5";
        const initialGrowthSection = el("#initial-growth-input-title").closest(".col-12");
        const initialAbilitySection = el("#initial-ability-input-title").closest(".col-12");
        const hiddenGrowthSection = el("#hidden-growth-section");
        [initialGrowthSection, initialAbilitySection, hiddenGrowthSection].forEach((section) => { section.classList.add("initial-source-section"); });
        el("#veteran-title").parentElement.hidden = true;
        const settings = el("#sailor-settings-section");
        const tree = el("#tree-section");
        const result = el("#result-section");
        const layout = document.createElement("div");
        const settingsTreeColumn = document.createElement("div");
        layout.className = "settings-result-layout";
        settingsTreeColumn.className = "settings-tree-column";
        settings.before(layout);
        settingsTreeColumn.append(settings, tree);
        layout.append(settingsTreeColumn, result);
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
    el("#ship-veteran-bulk-input").addEventListener("input", (event) => {
        if (event.target.value !== "") applyVeteranCountToShipRoster(event.target.value);
    });
    el("#ship-select").addEventListener("change", () => {
        updateShipCustomSelection();
        resizeShipLayersForShip(selectedShip());
        updateSimulatorModeUi();
    });
    el("#ship-base-speed").addEventListener("change", (event) => {
        if (event.target.value !== "") {
            const speed = Math.floor(Number(event.target.value) || 10);
            event.target.value = String(Math.max(10, Math.min(99, speed)));
        }
        updateShipBaseSpeedInputState();
        renderShipPerformance();
    });
    el("#ship-base-speed").addEventListener("input", () => {
        updateShipBaseSpeedInputState();
        renderShipPerformance();
    });
    el("#ship-equipment-fcs").addEventListener("change", () => {
        updateShipGuidelineControls();
        renderShipLayerTabs();
        renderShipPerformance();
    });
    el("#ship-equipment-engine").addEventListener("change", renderShipPerformance);
    el("#ship-equipment-r-gun").addEventListener("change", () => {
        updateShipGuidelineControls();
        renderShipLayerTabs();
        const activeLayer = shipLayers[activeShipLayer];
        if (simulatorMode === "ship" && activeLayer?.role === "gunner" && activeLayer.roleIndex <= 2) {
            calculate();
        } else {
            renderShipPerformance();
        }
    });
    el("#ship-equipment-t-gun").addEventListener("change", () => {
        renderShipLayerTabs();
        const activeLayer = shipLayers[activeShipLayer];
        if (simulatorMode === "ship" && activeLayer?.role === "gunner"
            && activeLayer.roleIndex >= 3 && activeLayer.roleIndex <= 4) {
            calculate();
        } else {
            renderShipPerformance();
        }
    });
    el("#ship-equipment-t-gun-2").addEventListener("change", renderShipPerformance);
    el("#ship-add-t-gun").addEventListener("change", () => {
        updateAdditionalTGunControl();
        updateShipEquipmentCapacityLabels(selectedShip());
        renderShipPerformance();
    });
    document.querySelectorAll("#ship-equipment-fcs, #ship-equipment-engine, #ship-equipment-r-gun, #ship-equipment-t-gun, #ship-equipment-t-gun-2")
        .forEach((select) => select.addEventListener("change", () => updateShipEquipmentCustomSelection(select)));
    el("#ship-target-guideline").addEventListener("change", (event) => {
        if (event.target.value !== "") {
            event.target.value = String(normalizeTargetGuideline(event.target.value));
        }
        renderShipPerformance();
    });
    el("#ship-r-gun-range-target").addEventListener("change", (event) => {
        updateShipGuidelineControls();
        if (!event.target.checked && el("#ship-guideline-adjust-captain").checked) {
            resetCaptainCompositionToFullExperts();
        }
        renderShipPerformance();
    });
    el("#ship-guideline-adjust-captain").addEventListener("change", (event) => {
        if (!event.target.checked) {
            resetCaptainCompositionToFullExperts();
        }
        renderShipPerformance();
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
    server.addEventListener("change", () => {
        saveServerPreference(server.value);
        selectServer();
    });
    nation.addEventListener("change", loadNationCatalogs);
    preset.addEventListener("change", () => {
        actualClassChangeLevels = [];
        bulkClassChangeLevel = "";
        el("#performance-fcs-target-gun").checked = false;
        setClassChangeBulkFeedback();
        updatePresetCustomSelection();
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
        else if (event.target.matches("[data-result-ability]")) {
            calculatePerformance();
            refreshActiveLayerSummary();
        }
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
        if (event.target.value !== "") {
            event.target.value = String(normalizeTargetGuideline(event.target.value));
        }
        calculatePerformance();
    });
    el("#performance-fcs-target-gun").addEventListener("change", calculate);
    el("#performance-input-body").addEventListener("change", (event) => {
        if (!event.target.matches(".performance-condition-output")) return;
        performanceSelectedConditionIndex = Number(event.target.dataset.index) || 0;
        document.querySelectorAll(".performance-condition-output").forEach((checkbox) => {
            checkbox.checked = Number(checkbox.dataset.index) === performanceSelectedConditionIndex;
        });
        updatePerformanceConditionHighlights();
        refreshActiveLayerSummary();
    });
    el("#performance-input-body").addEventListener("input", (event) => {
        if (!event.target.matches(".performance-personnel-input")) return;
        disableCaptainAutoAdjustment(shipLayers[activeShipLayer]);
        const index = Number(event.target.dataset.index);
        const field = event.target.dataset.field;
        if (!setPerformancePersonnelValue(index, field, event.target.value)) return;
        refreshActiveLayerSummary();
        calculatePerformance();
    });
    el("#performance-engine-crew-count").addEventListener("input", (event) => {
        performanceEngineCrewCount = Math.min(10, Math.max(1, Math.floor(Number(event.target.value) || 1)));
        event.target.value = String(performanceEngineCrewCount);
        calculate();
    });
    el("#performance-fcs-select").addEventListener("change", () => {
        calculatePerformance();
    });
    el("#performance-gun-select").addEventListener("change", () => {
        updatePerformanceGunSelection();
        calculatePerformance();
    });
    document.addEventListener("click", (event) => {
        const shipOption = event.target.closest(".ship-custom-option");
        if (shipOption instanceof HTMLButtonElement) {
            const select = el("#ship-select");
            select.value = shipOption.dataset.shipValue || "";
            select.dispatchEvent(new Event("change", { bubbles: true }));
            return;
        }
        const equipmentOption = event.target.closest(".equipment-custom-option");
        if (equipmentOption instanceof HTMLButtonElement) {
            const select = document.getElementById(equipmentOption.dataset.equipmentSelect);
            if (select instanceof HTMLSelectElement) {
                select.value = equipmentOption.dataset.equipmentValue || "";
                select.dispatchEvent(new Event("change", { bubbles: true }));
            }
            return;
        }
        const presetOption = event.target.closest(".preset-path-option");
        if (presetOption instanceof HTMLButtonElement) {
            preset.value = presetOption.dataset.presetValue || "";
            preset.dispatchEvent(new Event("change", { bubbles: true }));
            return;
        }
        const button = event.target.closest(".path-filter-button");
        if (!(button instanceof HTMLButtonElement)) return;
        setPathFilterMode(button.dataset.pathFilter);
    });
    selectServer();
})();
