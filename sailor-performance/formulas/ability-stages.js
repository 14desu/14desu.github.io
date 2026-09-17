const GLOBAL_SERVER_ADJ_MULTIPLIER = 0.9;

/**
 * Ability 이후의 공통 성능 계산 단계를 한곳에서 적용한다.
 * Ability -> WeightedAbility -> HeadWeightedAbility
 * -> ServerAdjAbility -> SeamanAdjAbility
 */
export function calculateAbilityStages({
    server,
    ability,
    crewCount,
    condition,
    applySeamanAdjustment = true,
}) {
    const currentCrew = condition.officers + condition.veterans + condition.rookies;
    const personnelWeight = condition.officers * 4 + condition.veterans;
    const weightedAbility = ability * personnelWeight;
    const headWeightRatio = currentCrew / crewCount;
    const headWeightedAbility = weightedAbility * headWeightRatio;
    const serverAdjAbility = server === "global"
        ? headWeightedAbility * GLOBAL_SERVER_ADJ_MULTIPLIER
        : headWeightedAbility;
    const seamanAdjMultiplier = applySeamanAdjustment
        ? 1 + condition.seamanAdjustmentPercent / 100
        : 1;
    const seamanAdjAbility = serverAdjAbility * seamanAdjMultiplier;

    return {
        ability,
        personnelWeight,
        weightedAbility,
        headWeightRatio,
        headWeightedAbility,
        serverAdjAbility,
        seamanAdjMultiplier,
        seamanAdjAbility,
    };
}
