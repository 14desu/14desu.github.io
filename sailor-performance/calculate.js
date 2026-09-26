import {
    calculateAbilityStages,
    calculateEngineOverheat,
    calculateGlobalGunReload,
    calculateGuidelineLength,
    calculateKoreaGunReload,
    calculateRepairAndStructuralDefense,
    calculateSonarPerformance,
    findGuidelinePersonnelAdjustment,
    PERFORMANCE_FORMULAS,
} from "./formulas/index.js?v=20260926-sonar-v12";

export const PERFORMANCE_SCHEMA_VERSION = 12;
export const PERFORMANCE_ABILITY_KEYS = Object.freeze([
    "potential", "accuracy", "reload", "torpedo", "antiAir", "repair",
    "restore", "engine", "aircraft", "fighter", "bomber",
]);
export const MAX_SHIP_SAILORS = 15;

function integer(value, name, { minimum = 0, maximum = Number.MAX_SAFE_INTEGER } = {}) {
    if (!Number.isInteger(value) || value < minimum || value > maximum) {
        throw new Error(`${name} must be an integer in range`);
    }
    return value;
}

function number(value, name, { minimum = 0, maximum = Number.MAX_SAFE_INTEGER } = {}) {
    if (!Number.isFinite(value) || value < minimum || value > maximum) {
        throw new Error(`${name} is out of range`);
    }
    return value;
}

function object(value, name) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`${name} must be an object`);
    }
    return value;
}

function name(value, fieldName) {
    const normalized = String(value ?? "").trim();
    if (!normalized || normalized.length > 150) throw new Error(`${fieldName} is invalid`);
    return normalized;
}

function normalizeConditions(value, crewCount, server) {
    if (!Array.isArray(value) || value.length !== 5) {
        throw new Error("conditions must contain exactly five entries");
    }
    const maximumVeterans = Math.floor(crewCount * (server === "global" ? 0.5 : 0.45));
    return value.map((condition, index) => {
        object(condition, `conditions[${index}]`);
        const veterans = integer(Number(condition.veterans), `conditions[${index}].veterans`, { maximum: maximumVeterans });
        const experts = integer(Number(condition.experts), `conditions[${index}].experts`, { maximum: crewCount });
        const rookies = integer(Number(condition.rookies), `conditions[${index}].rookies`, { maximum: crewCount });
        const seamanAdjustmentPercent = number(
            Number(condition.seamanAdjustmentPercent ?? 0),
            `conditions[${index}].seamanAdjustmentPercent`,
            { maximum: 12 },
        );
        if (veterans + experts + rookies > crewCount) {
            throw new Error(`conditions[${index}] exceeds crewCount`);
        }
        return { veterans, experts, rookies, seamanAdjustmentPercent };
    });
}

function normalizeAbilities(entries) {
    if (!Array.isArray(entries) || entries.length !== PERFORMANCE_ABILITY_KEYS.length) {
        throw new Error(`abilities must contain exactly ${PERFORMANCE_ABILITY_KEYS.length} entries`);
    }
    const abilities = {};
    entries.forEach((entry, index) => {
        object(entry, `abilities[${index}]`);
        if (!PERFORMANCE_ABILITY_KEYS.includes(entry.key) || abilities[entry.key]) {
            throw new Error(`abilities[${index}].key is invalid or duplicated`);
        }
        if (typeof entry.applySeamanAdjustment !== "boolean") {
            throw new Error(`abilities[${index}].applySeamanAdjustment must be boolean`);
        }
        const seamanAdjustmentPercent = number(
            Number(entry.seamanAdjustmentPercent ?? 0),
            `abilities[${index}].seamanAdjustmentPercent`,
        );
        abilities[entry.key] = {
            ability: integer(Number(entry.ability), `abilities[${index}].ability`),
            applySeamanAdjustment: entry.applySeamanAdjustment,
            seamanAdjustmentPercent,
        };
    });
    if (PERFORMANCE_ABILITY_KEYS.some((key) => !abilities[key])) {
        throw new Error("abilities is incomplete");
    }
    return abilities;
}

function isTorpedoSailorClass(server, sailorClass) {
    return server === "korea"
        ? /어뢰병$/.test(sailorClass)
        : /\bTorpedo\b.*\bMan$/i.test(sailorClass);
}

function isSonarSailorClass(server, sailorClass) {
    return server === "korea"
        ? /^음파 탐지(?:병|장|관)$/.test(sailorClass)
        : /^(?:2nd|1st|Chief) Sonarman$/i.test(sailorClass);
}

function normalizeGun(value) {
    if (value === null || value === undefined) return null;
    const gun = object(value, "gun");
    return {
        name: name(gun.name, "gun.name"),
        reloadSeconds: number(Number(gun.reloadSeconds), "gun.reloadSeconds", { maximum: 3600 }),
        shipyardRange: gun.shipyardRange === null || gun.shipyardRange === undefined
            ? null
            : integer(Number(gun.shipyardRange), "gun.shipyardRange", { minimum: 1, maximum: 100000 }),
    };
}

function normalizeFcs(value) {
    if (value === null || value === undefined) return null;
    const fcs = object(value, "fcs");
    return {
        name: name(fcs.name, "fcs.name"),
        spottingCorrectionLimitRange: integer(
            Number(fcs.spottingCorrectionLimitRange),
            "fcs.spottingCorrectionLimitRange",
            { minimum: 1, maximum: 100000 },
        ),
    };
}

function targetGunGuideline(selectedGun) {
    if (!selectedGun.shipyardRange) throw new Error("selected gun has no Shipyard Range");
    return {
        source: "gun",
        length: selectedGun.shipyardRange,
        gun: {
            name: selectedGun.name,
            reloadSeconds: selectedGun.reloadSeconds,
        },
    };
}

function normalizeInput(input) {
    object(input, "performance input");
    const server = String(input.server ?? "");
    if (!PERFORMANCE_FORMULAS[server]) throw new Error("unsupported performance server");
    const nationId = integer(Number(input.nationId), "nationId", { minimum: 1 });
    const sailorClass = name(input.sailorClass, "sailorClass");
    const abilities = normalizeAbilities(input.abilities);
    const crewCount = integer(Number(input.crewCount), "crewCount", { minimum: 1, maximum: 10000 });
    const engineSailorCount = integer(Number(input.engineSailorCount ?? 1), "engineSailorCount", { minimum: 1, maximum: 10 });
    const conditions = normalizeConditions(input.conditions, crewCount, server);
    const performanceRole = input.performanceRole ?? "gunner";
    if (performanceRole !== "gunner" && performanceRole !== "captain") {
        throw new Error("unsupported performanceRole");
    }
    const isCaptain = performanceRole === "captain";
    const isSonarSailor = isSonarSailorClass(server, sailorClass);
    const selectedFcs = isCaptain ? normalizeFcs(input.fcs) : null;
    if (isCaptain && !selectedFcs) throw new Error("fcs is required for captain performance");
    const inputTargetGuidelineLength = isCaptain
        && input.targetGuidelineLength !== null
        && input.targetGuidelineLength !== undefined
        ? integer(Number(input.targetGuidelineLength), "targetGuidelineLength", { minimum: 100, maximum: 9999 })
        : null;
    const selectedGun = isTorpedoSailorClass(server, sailorClass)
        ? null
        : normalizeGun(input.gun);
    const guidelineTarget = !isCaptain
        ? null
        : selectedGun
            ? targetGunGuideline(selectedGun)
            : inputTargetGuidelineLength === null
                ? null
                : { source: "input", length: inputTargetGuidelineLength };

    return {
        server,
        nationId,
        sailorClass,
        abilities,
        crewCount,
        engineSailorCount,
        conditions,
        performanceRole,
        isCaptain,
        isSonarSailor,
        selectedFcs,
        selectedGun,
        guidelineTarget,
    };
}

/** 수병 한 명의 다섯 성능 조건을 브라우저에서 계산한다. */
export function calculateSailorPerformance(input) {
    const normalized = normalizeInput(input);
    const {
        server,
        nationId,
        sailorClass,
        abilities,
        crewCount,
        engineSailorCount,
        conditions,
        performanceRole,
        isCaptain,
        isSonarSailor,
        selectedFcs,
        selectedGun,
        guidelineTarget,
    } = normalized;

    return {
        schemaVersion: PERFORMANCE_SCHEMA_VERSION,
        server,
        nationId,
        sailorClass,
        crewCount,
        performanceRole,
        gun: selectedGun,
        fcs: selectedFcs,
        guidelineTarget,
        results: conditions.map((condition, index) => {
            const abilityStages = Object.fromEntries(
                Object.entries(abilities).map(([key, entry]) => [key, calculateAbilityStages({
                    server,
                    ability: entry.ability,
                    crewCount,
                    condition: {
                        ...condition,
                        seamanAdjustmentPercent: entry.seamanAdjustmentPercent,
                    },
                    applySeamanAdjustment: entry.applySeamanAdjustment,
                })]),
            );
            const performance = calculateRepairAndStructuralDefense(server, {
                repair: abilityStages.repair.seamanAdjAbility,
                restore: abilityStages.restore.seamanAdjAbility,
            });
            Object.assign(performance, calculateEngineOverheat(
                server,
                abilityStages.engine.seamanAdjAbility,
                engineSailorCount,
            ));
            const multipleEngineSupportingPerformance = calculateRepairAndStructuralDefense(server, {
                repair: abilityStages.repair.seamanAdjAbility * engineSailorCount,
                restore: abilityStages.restore.seamanAdjAbility * engineSailorCount,
            });
            performance.repairSpeedMultipleEngineSailorsPerSecond = multipleEngineSupportingPerformance.repairSpeedPerSecond;
            performance.structuralDefenseMultipleEngineSailors = multipleEngineSupportingPerformance.structuralDefense;

            if (isSonarSailor) {
                Object.assign(performance, calculateSonarPerformance(
                    abilityStages.potential.seamanAdjAbility,
                ));
            }

            if (isCaptain) {
                Object.assign(performance, calculateGuidelineLength(
                    server,
                    abilityStages.potential.seamanAdjAbility,
                    selectedFcs.spottingCorrectionLimitRange,
                ));
                applyGuidelineAdjustment({
                    performance,
                    server,
                    abilities,
                    crewCount,
                    condition,
                    selectedFcs,
                    guidelineTarget,
                });
            } else if (!isSonarSailor && !isTorpedoSailorClass(server, sailorClass)) {
                if (selectedGun && selectedGun.reloadSeconds <= 0) throw new Error("selected gun has no reload time");
                const calculateGunReload = server === "global"
                    ? calculateGlobalGunReload
                    : calculateKoreaGunReload;
                const reloadPerformance = calculateGunReload(
                    abilityStages.reload.serverAdjAbility,
                    selectedGun?.reloadSeconds ?? 1,
                    abilities.reload.seamanAdjustmentPercent,
                    abilities.reload.applySeamanAdjustment,
                );
                if (!selectedGun) {
                    delete reloadPerformance.averageGunReloadSeconds;
                    delete reloadPerformance.averageGunReloadSecondsWithRequiredSeamanAdjustment;
                }
                Object.assign(performance, reloadPerformance);
            }

            return {
                index,
                condition,
                currentCrew: condition.veterans + condition.experts + condition.rookies,
                seamanAdjAbilities: Object.fromEntries(
                    ["potential", "repair", "restore", "engine", "reload"]
                        .map((key) => [key, abilityStages[key].seamanAdjAbility]),
                ),
                performance,
            };
        }),
    };
}

function applyGuidelineAdjustment({
    performance,
    server,
    abilities,
    crewCount,
    condition,
    selectedFcs,
    guidelineTarget,
}) {
    if (!guidelineTarget) return;
    performance.guidelineTargetLength = guidelineTarget.length;
    performance.guidelineAdjustmentRequired = performance.guidelineLength > guidelineTarget.length;
    if (!performance.guidelineAdjustmentRequired) return;

    const potentialCondition = {
        ...condition,
        seamanAdjustmentPercent: abilities.potential.seamanAdjustmentPercent,
    };
    const adjustment = findGuidelinePersonnelAdjustment({
        server,
        potentialAbility: abilities.potential.ability,
        crewCount,
        condition: potentialCondition,
        applySeamanAdjustment: abilities.potential.applySeamanAdjustment,
        fcsRangeLimit: selectedFcs.spottingCorrectionLimitRange,
        targetGuidelineLength: guidelineTarget.length,
    });
    if (!adjustment) {
        performance.guidelineAdjustment = { possible: false };
        return;
    }

    const adjustedAbility = (key) => calculateAbilityStages({
        server,
        ability: abilities[key].ability,
        crewCount,
        condition: {
            ...adjustment.condition,
            seamanAdjustmentPercent: abilities[key].seamanAdjustmentPercent,
        },
        applySeamanAdjustment: abilities[key].applySeamanAdjustment,
    }).seamanAdjAbility;
    const adjustedSupportingPerformance = calculateRepairAndStructuralDefense(server, {
        repair: adjustedAbility("repair"),
        restore: adjustedAbility("restore"),
    });
    const currentCrew = adjustment.condition.veterans
        + adjustment.condition.experts
        + adjustment.condition.rookies;
    performance.guidelineAdjustment = {
        possible: true,
        veterans: adjustment.condition.veterans,
        experts: adjustment.condition.experts,
        rookies: adjustment.condition.rookies,
        currentCrew,
        crewRatePercent: Number((currentCrew / crewCount * 100).toFixed(1)),
        guidelineLength: adjustment.guidelineLength,
        repairSpeedPerSecond: adjustedSupportingPerformance.repairSpeedPerSecond,
        structuralDefense: adjustedSupportingPerformance.structuralDefense,
    };
}

/** 함선 수병을 최대 15명까지 같은 계산 코어로 일괄 처리한다. */
export function calculateShipPerformance(sailors) {
    if (!Array.isArray(sailors) || sailors.length < 1 || sailors.length > MAX_SHIP_SAILORS) {
        throw new Error(`ship sailors must contain 1 to ${MAX_SHIP_SAILORS} entries`);
    }
    return sailors.map((sailor, index) => ({
        slotId: sailor.slotId ?? String(index),
        result: calculateSailorPerformance(sailor),
    }));
}
