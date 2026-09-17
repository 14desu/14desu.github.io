# Sailor performance modules

브라우저에서 실행되는 수병 성능 계산의 단일 원본입니다.

## 파일 역할

- `calculate.js`: 입력 검증, 수병 1명 계산, 함선 최대 15명 일괄 계산
- `formulas/ability-stages.js`: `Ability` 이후 공통 보정 단계
- `formulas/gun-reload.js`: 함포 재장전
- `formulas/repair-speed.js`: 수리속도
- `formulas/structural-defense.js`: 구조방어
- `formulas/engine-overheat.js`: 기관 오버힛
- `formulas/guideline.js`: 함장 가이드라인과 인원 조정 탐색
- `formulas/index.js`: 공식 공개 진입점
- `index.js`: 화면 코드가 사용하는 공개 진입점

## 계산 단계

시뮬레이터 화면에서 `InitialGrowth -> HiddenGrowth -> Ability`를 계산한 뒤 이 모듈에
`Ability`를 전달합니다. 이후 단계는 다음 순서로 한 번만 적용합니다.

`Ability -> WeightedAbility -> HeadWeightedAbility -> ServerAdjAbility -> SeamanAdjAbility`

공식을 변경할 때는 해당 `formulas` 파일만 수정하고, 반환 필드가 바뀌면
`PERFORMANCE_SCHEMA_VERSION`과 `simulator.html`의 스크립트 캐시 버전을 함께 올립니다.
