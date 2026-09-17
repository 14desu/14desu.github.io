const RELOAD_ABILITY_UNIT = 10_000;
const RELOAD_DENOMINATOR_BASE = 100;
const RELOAD_EFFICIENCY_NUMERATOR = 10_000;
const MAX_SUGGESTED_SEAMAN_ADJUSTMENT_PERCENT = 12;
const GLOBAL_MIN_RELOAD_EFFICIENCY_PERCENT = 34;
// 10,000 단위로 반올림된 SeamanAdjAbility의 글로벌 연사캡 경계다.
const GLOBAL_RELOAD_ABILITY_CAP = 1_860_000;

function calculateSeamanAdjAbility(serverAdjAbility, seamanAdjustmentPercent = 0) {
    return Math.max(0, serverAdjAbility) * (1 + seamanAdjustmentPercent / 100);
}

export function koreaGunReloadEfficiencyPercent(seamanAdjAbility) {
    return Math.floor(RELOAD_EFFICIENCY_NUMERATOR / (
        Math.floor(Math.max(0, seamanAdjAbility) / RELOAD_ABILITY_UNIT)
        + RELOAD_DENOMINATOR_BASE
    ));
}

/** 기존 홈페이지의 25Hz 프레임 및 +1.87 호환식을 적용한다. */
export function koreaAverageGunReloadSeconds(baseReloadSeconds, efficiencyPercent) {
    const baseFrames = Math.round(baseReloadSeconds * 25);
    const abilityAdjustedFrames = Math.floor(baseFrames * efficiencyPercent / 100);
    return Math.round(abilityAdjustedFrames * 1.3 + 1.87) / 25;
}

export function globalRoundedReloadAbility(seamanAdjAbility) {
    return Math.round(Math.max(0, seamanAdjAbility) / RELOAD_ABILITY_UNIT) * RELOAD_ABILITY_UNIT;
}

export function globalGunReloadEfficiencyPercent(seamanAdjAbility) {
    const roundedSeamanAdjAbility = globalRoundedReloadAbility(seamanAdjAbility);
    return Math.max(
        GLOBAL_MIN_RELOAD_EFFICIENCY_PERCENT,
        Math.floor(RELOAD_EFFICIENCY_NUMERATOR / (
            roundedSeamanAdjAbility / RELOAD_ABILITY_UNIT
            + RELOAD_DENOMINATOR_BASE
        )),
    );
}

function nextGlobalSeamanAdjustment(serverAdjAbility, baseReloadSeconds) {
    const currentEfficiency = globalGunReloadEfficiencyPercent(serverAdjAbility);
    for (let percent = 1; percent <= MAX_SUGGESTED_SEAMAN_ADJUSTMENT_PERCENT; percent += 1) {
        const adjustedAbility = calculateSeamanAdjAbility(serverAdjAbility, percent);
        const adjustedEfficiency = globalGunReloadEfficiencyPercent(adjustedAbility);
        if (adjustedEfficiency < currentEfficiency) {
            return {
                requiredSeamanAdjustmentPercent: percent,
                averageGunReloadSecondsWithRequiredSeamanAdjustment:
                    koreaAverageGunReloadSeconds(baseReloadSeconds, adjustedEfficiency),
            };
        }
    }
    return {
        requiredSeamanAdjustmentPercent: null,
        averageGunReloadSecondsWithRequiredSeamanAdjustment: null,
    };
}

export function calculateGlobalGunReload(
    serverAdjAbility,
    baseReloadSeconds,
    seamanAdjustmentPercent = 0,
    applySeamanAdjustment = true,
) {
    const appliedSeamanAdjustmentPercent = applySeamanAdjustment ? seamanAdjustmentPercent : 0;
    const seamanAdjAbility = calculateSeamanAdjAbility(
        serverAdjAbility,
        appliedSeamanAdjustmentPercent,
    );
    const roundedSeamanAdjAbility = globalRoundedReloadAbility(seamanAdjAbility);
    const uncappedEfficiencyPercent = koreaGunReloadEfficiencyPercent(roundedSeamanAdjAbility);
    const efficiencyPercent = globalGunReloadEfficiencyPercent(seamanAdjAbility);
    const capProgressPercent = Math.min(
        100,
        Math.round(roundedSeamanAdjAbility / GLOBAL_RELOAD_ABILITY_CAP * 1_000) / 10,
    );
    const suggestion = applySeamanAdjustment && appliedSeamanAdjustmentPercent === 0
        ? nextGlobalSeamanAdjustment(serverAdjAbility, baseReloadSeconds)
        : {
            requiredSeamanAdjustmentPercent: null,
            averageGunReloadSecondsWithRequiredSeamanAdjustment: null,
        };

    return {
        reloadFormulaVersion: "global-server-adj-seaman-adj-round10000-efficiency34-v6",
        serverAdjReloadAbility: serverAdjAbility,
        seamanAdjReloadAbility: seamanAdjAbility,
        roundedSeamanAdjReloadAbility: roundedSeamanAdjAbility,
        appliedSeamanAdjustmentPercent,
        uncappedGunReloadEfficiencyPercent: uncappedEfficiencyPercent,
        gunReloadEfficiencyPercent: efficiencyPercent,
        gunReloadEfficiencyChangePercent: efficiencyPercent - 100,
        gunReloadAbilityCapProgressPercent: capProgressPercent,
        averageGunReloadSeconds: koreaAverageGunReloadSeconds(baseReloadSeconds, efficiencyPercent),
        ...suggestion,
    };
}

function nextKoreaSeamanAdjustment(serverAdjAbility, baseReloadSeconds) {
    const currentEfficiency = koreaGunReloadEfficiencyPercent(serverAdjAbility);
    for (let percent = 1; percent <= MAX_SUGGESTED_SEAMAN_ADJUSTMENT_PERCENT; percent += 1) {
        const adjustedAbility = calculateSeamanAdjAbility(serverAdjAbility, percent);
        const adjustedEfficiency = koreaGunReloadEfficiencyPercent(adjustedAbility);
        if (adjustedEfficiency < currentEfficiency) {
            return {
                requiredSeamanAdjustmentPercent: percent,
                averageGunReloadSecondsWithRequiredSeamanAdjustment:
                    koreaAverageGunReloadSeconds(baseReloadSeconds, adjustedEfficiency),
            };
        }
    }
    return {
        requiredSeamanAdjustmentPercent: null,
        averageGunReloadSecondsWithRequiredSeamanAdjustment: null,
    };
}

export function calculateKoreaGunReload(
    serverAdjAbility,
    baseReloadSeconds,
    seamanAdjustmentPercent = 0,
    applySeamanAdjustment = true,
) {
    const appliedSeamanAdjustmentPercent = applySeamanAdjustment ? seamanAdjustmentPercent : 0;
    const seamanAdjAbility = calculateSeamanAdjAbility(
        serverAdjAbility,
        appliedSeamanAdjustmentPercent,
    );
    const efficiencyPercent = koreaGunReloadEfficiencyPercent(seamanAdjAbility);
    const suggestion = applySeamanAdjustment && appliedSeamanAdjustmentPercent === 0
        ? nextKoreaSeamanAdjustment(serverAdjAbility, baseReloadSeconds)
        : {
            requiredSeamanAdjustmentPercent: null,
            averageGunReloadSecondsWithRequiredSeamanAdjustment: null,
        };

    return {
        reloadFormulaVersion: "korea-server-adj-seaman-adj-floor10000-efficiency-v3",
        serverAdjReloadAbility: serverAdjAbility,
        seamanAdjReloadAbility: seamanAdjAbility,
        appliedSeamanAdjustmentPercent,
        gunReloadEfficiencyPercent: efficiencyPercent,
        gunReloadEfficiencyChangePercent: efficiencyPercent - 100,
        averageGunReloadSeconds: koreaAverageGunReloadSeconds(baseReloadSeconds, efficiencyPercent),
        ...suggestion,
    };
}
