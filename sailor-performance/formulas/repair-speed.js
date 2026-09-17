/** 최종 SeamanAdjAbility를 초당 수리속도로 변환한다. */
export function koreaRepairSpeed(seamanAdjAbility) {
    return Math.floor(Math.floor(seamanAdjAbility / 480) / 25.6) / 10;
}

export function globalRepairSpeed(seamanAdjAbility) {
    return koreaRepairSpeed(seamanAdjAbility);
}

export const REPAIR_SPEED_FORMULAS = {
    korea: koreaRepairSpeed,
    global: globalRepairSpeed,
};

export const SHIP_BASE_REPAIR_SPEED = 25;
export const SHIP_REPAIR_SPEED_CAP = 280;

/** 모든 탑승 수병의 수리 SeamanAdjAbility 합계로 함선 최종 수리속도를 계산한다. */
export function calculateShipRepairSpeedDetails(server, totalRepairSeamanAdjAbility) {
    const formula = REPAIR_SPEED_FORMULAS[server];
    if (!formula) throw new Error("unsupported repair-speed server");
    const sailorRepairSpeed = formula(totalRepairSeamanAdjAbility);
    const uncappedRepairSpeed = SHIP_BASE_REPAIR_SPEED + sailorRepairSpeed;
    return {
        repairSpeed: Math.min(SHIP_REPAIR_SPEED_CAP, uncappedRepairSpeed),
        uncappedRepairSpeed,
        sailorRepairSpeed,
        isMaxed: uncappedRepairSpeed >= SHIP_REPAIR_SPEED_CAP,
    };
}

export function calculateShipRepairSpeed(server, totalRepairSeamanAdjAbility) {
    return calculateShipRepairSpeedDetails(server, totalRepairSeamanAdjAbility).repairSpeed;
}
