# Sailor performance modules

브라우저에서 실행되는 수병 성능 계산의 단일 원본입니다.

## 파일 역할

- `calculate.js`: 입력 검증, 수병 1명 계산, 함선 최대 15명 일괄 계산
- `formulas/ability-stages.js`: `Ability` 이후 공통 보정 단계
- `formulas/seaman-adjustment.js`: 갑판병 누적 어빌의 서버별 보정률과 복수탑승 페널티
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

## 갑판병 보정률

수병계산기는 한국서버에서 탑승 순서상 첫 갑판병 최대 3명의 누적 어빌을 사용합니다.
글로벌서버는 갑판병 인원 상한 없이 탑승한 갑판병 전원의 누적 어빌을 사용합니다.
함선 모드에서 함선을 선택했을 때는 주포석·부포석·보조석의 갑판병을 선택합니다.
한국서버의 3명 상한은 함선 슬롯 순서(주포석·부포석·보조석)에 따라 적용합니다.
함선을 선택하지 않은 개별 계산에서는 기본 슬롯의 갑판병도 보정 대상에 포함합니다.
사관·숙련병 가중치와 충원율은 적용하지 않습니다.
각 어빌 항목에 대해 수병별 보정률을 먼저 계산합니다 (`floor`는 버림).

- 한국: `floor(누적 어빌 / 300)`
- 글로벌: `floor(floor(누적 어빌 * 0.9 / 300) * 11 / 9)`

최종 보정률은 `floor(수병별 보정률 합계 / sqrt(선택된 갑판병 수))`이며,
갑판병이 없으면 0%입니다. 글로벌의 `* 11 / 9`와 두 번째 버림은 수병별로 적용한 뒤
합산합니다. 계산된 보정률은 기존 `ServerAdjAbility -> SeamanAdjAbility` 단계에서 적용합니다.

공식을 변경할 때는 해당 `formulas` 파일만 수정하고, 반환 필드가 바뀌면
`PERFORMANCE_SCHEMA_VERSION`과 `simulator.html`의 스크립트 캐시 버전을 함께 올립니다.
