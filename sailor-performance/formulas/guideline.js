import { calculateAbilityStages } from "./ability-stages.js";

const GUIDELINE_ABILITY_SCALE = 2000;
const GUIDELINE_LENGTH_STEP = 2;

function guidelineLength(seamanAdjAbility, fcsRangeLimit) {
    const sailorGuidelineIncrease = Math.floor(
        seamanAdjAbility / GUIDELINE_ABILITY_SCALE,
    ) * GUIDELINE_LENGTH_STEP;
    return {
        guidelineLength: fcsRangeLimit + sailorGuidelineIncrease,
        fcsGuidelineLength: fcsRangeLimit,
        sailorGuidelineIncrease,
        guidelineSeamanAdjPotential: seamanAdjAbility,
    };
}

export function calculateGuidelineLength(server, seamanAdjAbility, fcsRangeLimit) {
    if (server !== "korea" && server !== "global") {
        throw new Error("unsupported guideline server");
    }
    return guidelineLength(seamanAdjAbility, fcsRangeLimit);
}

function potentialForComposition(server, potentialAbility, crewCount, condition, applySeamanAdjustment) {
    const { seamanAdjAbility } = calculateAbilityStages({
        server,
        ability: potentialAbility,
        crewCount,
        condition,
        applySeamanAdjustment,
    });
    return calculateGuidelineLength(server, seamanAdjAbility, 0);
}

function upperBoundRookies({
    server,
    potentialAbility,
    crewCount,
    officers,
    veterans,
    seamanAdjustmentPercent,
    applySeamanAdjustment,
    maximumRookies,
    targetSailorLength,
}) {
    let low = 0;
    let high = maximumRookies;
    let found = -1;
    while (low <= high) {
        const rookies = Math.floor((low + high) / 2);
        const calculated = potentialForComposition(server, potentialAbility, crewCount, {
            officers,
            veterans,
            rookies,
            seamanAdjustmentPercent,
        }, applySeamanAdjustment);
        if (calculated.guidelineLength <= targetSailorLength) {
            found = rookies;
            low = rookies + 1;
        } else {
            high = rookies - 1;
        }
    }
    return found;
}

function lowerBoundRookiesForLength({
    server,
    potentialAbility,
    crewCount,
    officers,
    veterans,
    seamanAdjustmentPercent,
    applySeamanAdjustment,
    maximumRookies,
    targetLength,
}) {
    let low = 0;
    let high = maximumRookies;
    let found = maximumRookies;
    while (low <= high) {
        const rookies = Math.floor((low + high) / 2);
        const calculated = potentialForComposition(server, potentialAbility, crewCount, {
            officers,
            veterans,
            rookies,
            seamanAdjustmentPercent,
        }, applySeamanAdjustment);
        if (calculated.guidelineLength >= targetLength) {
            found = rookies;
            high = rookies - 1;
        } else {
            low = rookies + 1;
        }
    }
    return found;
}

/** 목표 가이드라인을 만족하는 가장 효율적인 숙련병/신병 구성을 찾는다. */
export function findGuidelinePersonnelAdjustment({
    server,
    potentialAbility,
    crewCount,
    condition,
    applySeamanAdjustment,
    fcsRangeLimit,
    targetGuidelineLength,
}) {
    const targetSailorLength = targetGuidelineLength - fcsRangeLimit;
    if (targetSailorLength < 0) return null;

    const officers = condition.officers;
    const maximumVeterans = crewCount - officers;
    let bestSailorLength = -1;
    const candidates = [];

    for (let veterans = 0; veterans <= maximumVeterans; veterans += 1) {
        const maximumRookies = crewCount - officers - veterans;
        const rookies = upperBoundRookies({
            server,
            potentialAbility,
            crewCount,
            officers,
            veterans,
            seamanAdjustmentPercent: condition.seamanAdjustmentPercent,
            applySeamanAdjustment,
            maximumRookies,
            targetSailorLength,
        });
        if (rookies < 0) continue;
        const calculated = potentialForComposition(server, potentialAbility, crewCount, {
            officers,
            veterans,
            rookies,
            seamanAdjustmentPercent: condition.seamanAdjustmentPercent,
        }, applySeamanAdjustment);
        if (calculated.guidelineLength > bestSailorLength) {
            bestSailorLength = calculated.guidelineLength;
            candidates.length = 0;
        }
        if (calculated.guidelineLength === bestSailorLength) {
            candidates.push({ veterans, maximumRookies });
        }
    }
    if (bestSailorLength < 0) return null;

    let best = null;
    for (const candidate of candidates) {
        const rookies = lowerBoundRookiesForLength({
            server,
            potentialAbility,
            crewCount,
            officers,
            veterans: candidate.veterans,
            seamanAdjustmentPercent: condition.seamanAdjustmentPercent,
            applySeamanAdjustment,
            maximumRookies: candidate.maximumRookies,
            targetLength: bestSailorLength,
        });
        const adjustedCondition = {
            officers,
            veterans: candidate.veterans,
            rookies,
            seamanAdjustmentPercent: condition.seamanAdjustmentPercent,
        };
        const calculated = potentialForComposition(
            server,
            potentialAbility,
            crewCount,
            adjustedCondition,
            applySeamanAdjustment,
        );
        if (!best
            || rookies < best.condition.rookies
            || (rookies === best.condition.rookies
                && calculated.guidelineSeamanAdjPotential > best.guidelineSeamanAdjPotential)) {
            best = {
                condition: adjustedCondition,
                sailorGuidelineIncrease: calculated.guidelineLength,
                guidelineLength: fcsRangeLimit + calculated.guidelineLength,
                guidelineSeamanAdjPotential: calculated.guidelineSeamanAdjPotential,
            };
        }
    }
    return best;
}
