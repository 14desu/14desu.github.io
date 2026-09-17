const MAX_STRUCTURAL_DEFENSE = 900;

/** 최종 SeamanAdjAbility를 구조방어로 변환한다. */
export function koreaStructuralDefense(seamanAdjAbility) {
    return Math.min(MAX_STRUCTURAL_DEFENSE, Math.floor(Math.floor(seamanAdjAbility / 480) / 16));
}

export function globalStructuralDefense(seamanAdjAbility) {
    return koreaStructuralDefense(seamanAdjAbility);
}

export const STRUCTURAL_DEFENSE_FORMULAS = {
    korea: koreaStructuralDefense,
    global: globalStructuralDefense,
};
