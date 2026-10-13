export const SONAR_ABILITY_CAP = 3_036_000;
export const SONAR_RANGE_MIN_ABILITY = 350_000;
export const SONAR_RANGE_BASE_PERCENT = 70.6;

function normalizedAbility(seamanAdjustedPotentialAbility) {
    const ability = Number(seamanAdjustedPotentialAbility);
    if (!Number.isFinite(ability)) throw new Error("sonar ability must be finite");
    return Math.max(0, ability);
}

function roundPercent(value) {
    return Math.round(value * 10) / 10;
}

/** 갑판병 보정까지 적용된 잠재 어빌리티의 음탐 캡 진행도다. */
export function calculateSonarCapProgressPercent(seamanAdjustedPotentialAbility) {
    const ability = normalizedAbility(seamanAdjustedPotentialAbility);
    if (ability >= SONAR_ABILITY_CAP) return 100;
    return Math.min(99.9, roundPercent(ability / SONAR_ABILITY_CAP * 100));
}

/**
 * 갑판병 보정까지 적용된 잠재 어빌리티를 음탐 수병범위로 변환한다.
 * 로그 간이식으로 35만 이하에서는 70.6%, 303.6만 이상에서는 100%다.
 */
export function calculateSonarSailorRangePercent(seamanAdjustedPotentialAbility) {
    const ability = Math.max(
        SONAR_RANGE_MIN_ABILITY,
        normalizedAbility(seamanAdjustedPotentialAbility),
    );
    if (ability >= SONAR_ABILITY_CAP) return 100;
    const rangePercent = SONAR_RANGE_BASE_PERCENT
        + (100 - SONAR_RANGE_BASE_PERCENT)
            * Math.log(ability / SONAR_RANGE_MIN_ABILITY)
            / Math.log(SONAR_ABILITY_CAP / SONAR_RANGE_MIN_ABILITY);
    return Math.min(99.9, roundPercent(rangePercent));
}

export function calculateSonarPerformance(seamanAdjustedPotentialAbility) {
    const ability = normalizedAbility(seamanAdjustedPotentialAbility);
    return {
        sonarFormulaVersion: "simple-cap3036000-range70.6-log350000-v4",
        sonarSeamanAdjustedPotentialAbility: ability,
        sonarAbilityCapProgressPercent: calculateSonarCapProgressPercent(ability),
        sonarSailorRangePercent: calculateSonarSailorRangePercent(ability),
    };
}
