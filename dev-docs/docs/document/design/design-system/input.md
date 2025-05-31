---
id: input
title: 🏷️ 인풋 컴포넌트
sidebar_label: 🏷️ 인풋 컴포넌트
---

### 구성 유형

* **Text Field**: 한 줄 텍스트 입력용 기본 필드
* **Search Input**: 검색 전용 입력 필드 (돋보기 아이콘 포함)
* **Text Area**: 여러 줄 입력이 가능한 필드
* **Password Input**: 비밀번호 입력용 필드 (보이기/숨기기 기능 포함)

<br/>

### 상태 정의

| 상태        | 설명                      |
| --------- | ----------------------- |
| Default   | 아무 입력도 없는 초기 상태         |
| Typing    | 사용자가 입력 중인 상태           |
| Completed | 필수 조건을 모두 만족한 입력 완료 상태  |
| Error     | 입력 조건에 맞지 않는 오류 상태      |
| Success   | 올바르게 입력되었음을 명확히 보여주는 상태 |
| Disabled  | 비활성화된 상태. 입력 불가 상태        |

상태에 따라 **테두리 컬러**, **아이콘**, **헬퍼 텍스트** 등이 달라지며
접근성과 가시성을 고려해 시각적 피드백이 명확히 제공됩니다.

<br/>

<img
  src="/img/design-system/03_input_01.png"
  style={{ maxWidth: "50%", height: "auto" }}
  alt="텍스트 필드 이미지" />
<img
  src="/img/design-system/03_input_02.png"
  style={{ maxWidth: "50%", height: "auto" }}
  alt="이외 인풋 이미지" />