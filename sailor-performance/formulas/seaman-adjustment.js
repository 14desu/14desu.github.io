/** 선택된 갑판병(한국 최대 3명, 글로벌 인원 상한 없음)의 누적 어빌로 복수탑승 보정률을 계산한다. */
export function calculateSeamanAdjustmentPercent(server, accumulatedAbilities) {
    if (accumulatedAbilities.length === 0) return 0;
    const contribution = accumulatedAbilities.reduce((sum, value) => {
        // 사관·숙련병 가중치와 충원율은 갑판병 보정 원천에 적용하지 않는다.
        const ability = Math.max(0, Number(value) || 0);
        const basePercent = Math.floor((server === "global" ? ability * 0.9 : ability) / 300);
        const percent = server === "global" ? Math.floor(basePercent * 11 / 9) : basePercent;
        return sum + percent;
    }, 0);
    return Math.floor(contribution / Math.sqrt(accumulatedAbilities.length));
}
