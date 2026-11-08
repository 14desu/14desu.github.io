/** 선택된 갑판병(한국 최대 3명, 글로벌 인원 상한 없음)의 누적 어빌로 복수탑승 보정률을 계산한다. */
export function calculateSeamanAdjustmentPercent(server, accumulatedAbilities, enhancedSailors = []) {
    if (accumulatedAbilities.length === 0) return 0;
    const contribution = accumulatedAbilities.reduce((sum, value, index) => {
        // 사관·숙련병 가중치와 충원율은 갑판병 보정 원천에 적용하지 않는다.
        const ability = Math.max(0, Number(value) || 0);
        // 글로벌 20% 강화는 보정 원천에서만 제거하고, 서버계수 0.9는 적용하지 않는다.
        const unenhancedAbility = server === "global" && enhancedSailors[index]
            ? ability * 9 / 11
            : ability;
        const percent = Math.floor(unenhancedAbility / 300);
        return sum + percent;
    }, 0);
    return Math.floor(contribution / Math.sqrt(accumulatedAbilities.length));
}
