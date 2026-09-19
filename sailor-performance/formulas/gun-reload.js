const RELOAD_ABILITY_UNIT = 10_000;
const RELOAD_DENOMINATOR_BASE = 100;
const RELOAD_EFFICIENCY_NUMERATOR = 10_000;
const MAX_SUGGESTED_SEAMAN_ADJUSTMENT_PERCENT = 12;
const GLOBAL_CAPPED_RELOAD_EFFICIENCY_PERCENT = 34.6;
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

/** 한국 서버: 계수 적용 후 버림하고, 13/10 및 1.87 적용 후 반올림한다. */
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
    if (roundedSeamanAdjAbility >= GLOBAL_RELOAD_ABILITY_CAP) {
        return GLOBAL_CAPPED_RELOAD_EFFICIENCY_PERCENT;
    }
    return Math.floor(RELOAD_EFFICIENCY_NUMERATOR / (
        roundedSeamanAdjAbility / RELOAD_ABILITY_UNIT
        + RELOAD_DENOMINATOR_BASE
    ));
}

/** 글로벌 서버: 계수와 13/10 및 1.87을 모두 적용한 뒤 한 번만 버림한다. */
function globalAverageGunReloadSeconds(baseReloadSeconds, efficiencyPercent) {
    const baseFrames = Math.round(baseReloadSeconds * 25);
    const averageFrames = Math.floor(
        baseFrames * efficiencyPercent / 100 * 1.3 + 1.87,
    );
    return averageFrames / 25;
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
                    globalAverageGunReloadSeconds(
                        baseReloadSeconds,
                        adjustedEfficiency,
                    ),
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
        reloadFormulaVersion: "global-server-adj-seaman-adj-round10000-efficiency34.6-v12",
        serverAdjReloadAbility: serverAdjAbility,
        seamanAdjReloadAbility: seamanAdjAbility,
        roundedSeamanAdjReloadAbility: roundedSeamanAdjAbility,
        appliedSeamanAdjustmentPercent,
        uncappedGunReloadEfficiencyPercent: uncappedEfficiencyPercent,
        gunReloadEfficiencyPercent: efficiencyPercent,
        gunReloadEfficiencyChangePercent: efficiencyPercent - 100,
        gunReloadAbilityCapProgressPercent: capProgressPercent,
        averageGunReloadSeconds: globalAverageGunReloadSeconds(
            baseReloadSeconds,
            efficiencyPercent,
        ),
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
        reloadFormulaVersion: "korea-server-adj-seaman-adj-floor10000-efficiency-v5",
        serverAdjReloadAbility: serverAdjAbility,
        seamanAdjReloadAbility: seamanAdjAbility,
        appliedSeamanAdjustmentPercent,
        gunReloadEfficiencyPercent: efficiencyPercent,
        gunReloadEfficiencyChangePercent: efficiencyPercent - 100,
        averageGunReloadSeconds: koreaAverageGunReloadSeconds(baseReloadSeconds, efficiencyPercent),
        ...suggestion,
    };
}
