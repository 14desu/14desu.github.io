/** 서버 및 Seaman 보정까지 적용된 SeamanAdjAbility를 입력받는다. */
export function koreaEngineOverheatTime(seamanAdjAbility) {
    return Math.round(seamanAdjAbility / 10000) / 10;
}

export function koreaEngineOverheatRateIncrease(seamanAdjAbility) {
    return Math.floor(Math.floor(seamanAdjAbility / 8000) / 2) / 10;
}

function calculateEngineOverheatValues(server, seamanAdjAbility) {
    return {
        timeSeconds: koreaEngineOverheatTime(seamanAdjAbility),
        // 속도 상한은 수병 단독 수치가 아니라 함선 기여율과 합산한 뒤 적용한다.
        rateIncreasePercent: koreaEngineOverheatRateIncrease(seamanAdjAbility),
    };
}

export function calculateEngineOverheat(server, oneSailorSeamanAdjAbility, engineSailorCount = 1) {
    const oneSailor = calculateEngineOverheatValues(server, oneSailorSeamanAdjAbility);
    const multipleSailorSeamanAdjAbility = oneSailorSeamanAdjAbility * engineSailorCount;
    const multipleSailorTime = calculateEngineOverheatValues(server, multipleSailorSeamanAdjAbility);
    const multipleSailorRate = calculateEngineOverheatValues(
        server,
        multipleSailorSeamanAdjAbility / Math.sqrt(engineSailorCount),
    );

    return {
        engineOverheatTimeOneSailorSeconds: oneSailor.timeSeconds,
        engineOverheatRateOneSailorPercent: oneSailor.rateIncreasePercent,
        engineOverheatTimeMultipleSailorsSeconds: multipleSailorTime.timeSeconds,
        engineOverheatRateMultipleSailorsPercent: multipleSailorRate.rateIncreasePercent,
    };
}

/** 서로 다른 기관병들의 보정 어빌리티를 합산해 함선 전체 오버힛 성능을 계산한다. */
export function calculateShipEngineOverheat(
    server,
    engineSeamanAdjAbilities = [],
    engineOverheatTime = 0,
) {
    const abilities = engineSeamanAdjAbilities
        .map(Number)
        .filter((ability) => Number.isFinite(ability) && ability >= 0);
    const totalAbility = abilities.reduce((sum, ability) => sum + ability, 0);
    const catalogOverheatTime = Number(engineOverheatTime);
    const shipOverheatTimeSeconds = Number.isFinite(catalogOverheatTime) && catalogOverheatTime >= 0
        ? Math.floor(catalogOverheatTime * 0.8)
        : 0;
    const sailorOverheatTimeSeconds = calculateEngineOverheatValues(server, totalAbility).timeSeconds;
    return {
        // 시간은 기관병 어빌 합계를 그대로 사용한다.
        engineOverheatTimeSeconds: shipOverheatTimeSeconds + sailorOverheatTimeSeconds,
        shipOverheatTimeSeconds,
        sailorOverheatTimeSeconds,
        // 효율은 합산 후 √탑승인원으로 나누는 복수 탑승 페널티를 적용한다.
        engineOverheatRateIncreasePercent: abilities.length > 0
            ? calculateEngineOverheatValues(
                server,
                totalAbility / Math.sqrt(abilities.length),
            ).rateIncreasePercent
            : 0,
    };
}

/**
 * 함선 오버힛 속도의 계산기 출력값(소수 둘째 자리 버림)과
 * 인게임 적용값(정수 버림)을 함께 반환한다.
 */
export function calculateShipOverheatSpeed(
    baseSpeed,
    sailorOverheatMarginPercent,
    shipOverheatMarginPercent,
    engineOverheatMarginPercent,
    shipType,
    server,
) {
    const values = [
        baseSpeed,
        sailorOverheatMarginPercent,
        shipOverheatMarginPercent,
        engineOverheatMarginPercent,
    ].map(Number);
    if (values.some((value) => !Number.isFinite(value)) || values[0] < 0) {
        return {
            calculatorSpeed: null,
            uncappedCalculatorSpeed: null,
            actualSpeed: null,
            isMaxed: false,
            baseSpeed: null,
            shipOverheatContributionPercent: null,
            sailorOverheatContributionPercent: null,
            combinedOverheatContributionPercent: null,
            appliedCombinedOverheatContributionPercent: null,
            isCombinedRateMaxed: false,
        };
    }
    const [base, sailorMargin, shipMargin, engineMargin] = values;
    const shipOverheatContributionPercent = shipMargin * engineMargin / 100;
    const combinedOverheatContributionPercent = shipOverheatContributionPercent + sailorMargin;
    const hasCombinedRateCap = server === "global";
    const appliedCombinedOverheatContributionPercent = hasCombinedRateCap
        ? Math.min(70, combinedOverheatContributionPercent)
        : combinedOverheatContributionPercent;
    const isCombinedRateMaxed = hasCombinedRateCap && combinedOverheatContributionPercent > 70;
    const rawSpeed = base * (1 + combinedOverheatContributionPercent / 100);
    const uncappedCalculatorSpeed = Math.floor(rawSpeed * 100) / 100;
    const rateCappedRawSpeed = base * (1 + appliedCombinedOverheatContributionPercent / 100);
    const rateCappedCalculatorSpeed = Math.floor(rateCappedRawSpeed * 100) / 100;
    const speedCapByShipType = {
        SS: 40,
        BB: 50,
        BC: 50,
        CA: 60,
        PS: 60,
    };
    const speedCap = speedCapByShipType[String(shipType || "").toUpperCase()] ?? null;
    const isMaxed = Number.isFinite(speedCap) && rateCappedCalculatorSpeed >= speedCap;
    const calculatorSpeed = isMaxed ? speedCap : rateCappedCalculatorSpeed;
    return {
        calculatorSpeed,
        uncappedCalculatorSpeed,
        actualSpeed: Math.floor(calculatorSpeed),
        isMaxed,
        baseSpeed: base,
        shipOverheatContributionPercent,
        sailorOverheatContributionPercent: sailorMargin,
        combinedOverheatContributionPercent,
        appliedCombinedOverheatContributionPercent,
        isCombinedRateMaxed,
    };
}
