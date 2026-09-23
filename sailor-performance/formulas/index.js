import { REPAIR_SPEED_FORMULAS } from "./repair-speed.js";
import { STRUCTURAL_DEFENSE_FORMULAS } from "./structural-defense.js";

export { calculateAbilityStages } from "./ability-stages.js?v=20260923-rank-terms-v11";
export {
    calculateEngineOverheat,
    calculateShipEngineOverheat,
    calculateShipOverheatSpeed,
} from "./engine-overheat.js";
export { calculateGlobalGunReload, calculateKoreaGunReload } from "./gun-reload.js";
export { calculateGuidelineLength, findGuidelinePersonnelAdjustment } from "./guideline.js?v=20260923-rank-terms-v11";
export {
    calculateShipRepairSpeed,
    calculateShipRepairSpeedDetails,
    SHIP_BASE_REPAIR_SPEED,
    SHIP_REPAIR_SPEED_CAP,
} from "./repair-speed.js";

export const PERFORMANCE_FORMULAS = {
    korea: {
        repairSpeedPerSecond: REPAIR_SPEED_FORMULAS.korea,
        structuralDefense: STRUCTURAL_DEFENSE_FORMULAS.korea,
    },
    global: {
        repairSpeedPerSecond: REPAIR_SPEED_FORMULAS.global,
        structuralDefense: STRUCTURAL_DEFENSE_FORMULAS.global,
    },
};

export function calculateRepairAndStructuralDefense(server, seamanAdjAbilityByType) {
    const formulas = PERFORMANCE_FORMULAS[server];
    if (!formulas) throw new Error("unsupported performance server");
    return {
        repairSpeedPerSecond: formulas.repairSpeedPerSecond(seamanAdjAbilityByType.repair),
        structuralDefense: formulas.structuralDefense(seamanAdjAbilityByType.restore),
    };
}
