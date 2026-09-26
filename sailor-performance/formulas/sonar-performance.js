export const SONAR_ABILITY_CAP = 3_010_000;
export const SONAR_RANGE_MIN_ABILITY = 1_500_000;
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
 * 150만 미만은 150만으로 계산하고 최종 결과는 100%로 제한한다.
 */
export function calculateSonarSailorRangePercent(seamanAdjustedPotentialAbility) {
    const ability = Math.max(
        SONAR_RANGE_MIN_ABILITY,
        normalizedAbility(seamanAdjustedPotentialAbility),
    );
    const rangePercent = SONAR_RANGE_BASE_PERCENT * Math.sqrt(
        ability / SONAR_RANGE_MIN_ABILITY,
    );
    if (rangePercent >= 100) return 100;
    return Math.min(99.9, roundPercent(rangePercent));
}

export function calculateSonarPerformance(seamanAdjustedPotentialAbility) {
    const ability = normalizedAbility(seamanAdjustedPotentialAbility);
    return {
        sonarFormulaVersion: "simple-cap3010000-range70.6-sqrt1500000-v1",
        sonarSeamanAdjustedPotentialAbility: ability,
        sonarAbilityCapProgressPercent: calculateSonarCapProgressPercent(ability),
        sonarSailorRangePercent: calculateSonarSailorRangePercent(ability),
    };
}
