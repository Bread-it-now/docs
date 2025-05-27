# 🧾 핵심 기능에 대한 사용 가이드

빵잇나우는 고객과 사업자를 연결하여 빵 예약 및 관리 기능을 제공하는 플랫폼입니다.  
아래는 각 사용자 유형별 핵심 기능 요약과 주요 기능별 사용 가이드입니다.

## 👥 사용자 유형별 기능 요약

### 🙋🏻‍♂️ 고객 (일반 사용자)

#### 로그인 및 회원가입

- 일반 및 소셜 로그인 지원
- 간편 회원가입 및 마이페이지에서 정보 수정 가능

#### 빵집 및 빵 탐색

- 위치 기반 추천 (인기 빵집, 오늘의 빵 등)
- 키워드 검색, 자동완성 및 연관 키워드 제공

#### 빵집 상세 정보 확인

- 주소, 운영 시간, 메뉴, 예약 가능 시간 등 확인 가능

#### 메뉴 예약 및 실시간 재고 확인

- 원하는 메뉴와 수량 예약
- 실시간 수량 확인으로 초과 예약 방지

#### 예약 내역 확인 및 취소

- 마이페이지에서 예약 내역 상태별 확인
- 예약 상세 정보 확인 및 직접 취소 가능

#### 즐겨찾기 등록 및 조회

- 마음에 드는 빵/빵집을 즐겨찾기에 등록
- 마이페이지에서 등록된 목록 확인 가능

#### 알림 수신 및 설정

- 예약 확정/취소 등의 실시간 알림 수신
- 개별 빵 알림, 전체 알림 설정
- 방해금지 모드로 알림 수신 제어 가능

---

### 🧑‍🍳 사업자 (매장 관리자)

#### 로그인 및 매장 등록

- 로그인 시 매장 정보 자동 연동
- 최초 로그인 시 빵집 등록 절차 제공

#### 빵집 정보 수정

- 매장명, 주소, 소개 문구, 운영 시간 등 자유롭게 수정
- 휴무일 및 비활성 예약 시간대 설정 가능

#### 빵집 운영상태 관리

- 매장 운영 시간 및 예약 가능 시간 설정
- 메뉴 숨김 처리(판매 중지/준비 중 메뉴)
- 재고 수량 변경
- 신선한 빵이 나왔을 때 즐겨찾기 고객에게 알림 전송 가능

#### 빵집 메뉴 관리 및 등록/수정

- 전체 메뉴 목록 조회 및 관리(순서 조정, 삭제 등)
- 신규 메뉴 등록 및 기존 메뉴 정보 수정 가능

#### 예약 확인 및 접수 처리

- 고객 예약 내역 상태별 조회
- 각 예약 상세 정보(메뉴, 수량, 수령 시간 등) 확인
- 예약 거부, 접수, 부분 접수 처리 가능

#### 예약 알림 수신

- 고객의 예약 요청/변경/취소 등에 대한 실시간 알림 수신
- 빠른 응답으로 원활한 매장 운영 가능

## 🛠 사용 시나리오별 기능 가이드

### ✔︎ 로그인, 회원가입 (고객)

- 일반 또는 소셜 로그인을 통해 간편하게 계정을 생성하고 접근할 수 있어요.
- 회원가입 시 최소 정보만 입력하면 가입이 완료되며, 이후 마이페이지에서 정보 수정이 가능해요.

<br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
<img src="/img/usage-guide/customer/로그인.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/customer/회원가입.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
</div>

<br/>

### ✔︎ 빵집 및 빵 탐색 (고객)

- 메인페이지에서 오늘의 빵, 핫한 빵, 핫한 빵집을 추천으로 확인할 수 있어요.
- 위치 기반으로 주변 인기 매장을 자동으로 노출해요.
- 빵 종류별로 핫한 빵, 인기 많은 빵을 확인할 수 있어요.
- 키워드로 빵 또는 빵집을 검색할 수 있어요.
- 자동 완성 및 연관 추천 키워드로 빠르게 탐색할 수 있어요.
  <br/><br/>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/customer/메인페이지 - 빵집 및 빵 탐색.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/빵 리스트 페이지 - 빵 탐색.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/검색페이지 - 검색.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  </div>

<br/>

### ✔︎ 빵집 상세 정보 확인 (고객)

- 빵집의 주소, 운영시간, 메뉴, 예약 가능 시간 등을 상세히 볼 수 있어요.
  <br/><br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/customer/빵집페이지 상세1.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/빵집페이지 상세2.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
</div>

<br/>

### ✔︎ 상품 예약 (고객)

- 원하는 메뉴와 수량을 선택한 후 예약할 수 있어요.
- 예약 전 실시간 수량 확인으로 초과 예약을 방지해요.
  <br/><br/>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/customer/빵 예약1.png" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/빵 예약2.png" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/빵 예약3.png" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  </div>

<br/>

### ✔︎ 예약 내역 확인 및 취소 (고객)

- 마이페이지에서 내 전체 예약 내역을 상태별로 확인할 수 있어요.
- 각 예약 별 상세 내용을 확인할 수 있어요.
- 예약 상세 화면에서 직접 예약을 취소할 수 있어요.
  <br/><br/>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/customer/마이페이지 - 예약전체.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/마이페이지 - 예약상세.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/마이페이지 - 예약취소.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  </div>

<br/>

### ✔︎ 즐겨찾기 등록 및 조회 (고객)

- 마음에 드는 빵 및 빵집을 즐겨찾기에 등록할 수 있어요.
- 각 빵집 상세 페이지에서 간편하게 즐겨찾기를 추가할 수 있어요.
- 마이페이지 내 즐겨찾기 탭에서 내가 저장한 빵 및 빵집 목록을 한눈에 확인할 수 있어요.
  <br/><br/>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/customer/빵 즐겨찾기.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/빵집 즐겨찾기.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/customer/즐겨찾기 조회.gif" width="250" height="460"/>
  </div>

<br/>

### ✔︎ 알림 수신 및 설정 (고객)

- 예약 확정, 취소 등의 실시간 알림을 받아볼 수 있어요.
- 알림이 수신되지 않도록 방해금지 모드를 설정할 수 있어요.
- 개별 빵에 대해 알림을 설정할 수 있어요.
- 전체 알림을 설정할 수 있어요.

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
<img src="/img/usage-guide/customer/알림 내역 조회.gif" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/customer/개별 빵 알림 onoff.gif" width="300"
height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/customer/방해금지 - 토글.gif" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/customer/전체 알림 설정.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
</div>

<br/>

### ✔︎ 로그인, 회원가입 (사업자)

- 일반 로그인을 통해 간편하게 계정을 생성하고 접근할 수 있어요.
- 로그인 후 본인에게 연결된 매장 정보가 자동으로 조회돼요.
- 처음 로그인 시 매장 정보가 없을 경우, 빵집 등록 절차로 자동 이동돼요.

<br/><br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/owner/로그인.png" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/owner/빵집등록.png" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/owner/빵집등록2.png" width="250" height="460"/>
</div>

<br/>

### ✔︎ 빵집 운영상태 관리 (사업자)

- 매장 운영 시간 및 예약 가능 시간대를 자유롭게 설정할 수 있어요.
- 판매 중지하거나 준비 중인 메뉴는 숨김 처리하여 고객 화면에서 보이지 않게 할 수 있어요.
- 신선한 빵이 준비되었을 때, 즐겨찾기한 고객에게 알림을 보낼 수 있어요.

<br/><br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/owner/영업 일시 관리.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/owner/메뉴 숨김 관리.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/owner/재고 변경.gif" width="250" height="460"/>
</div>

<br/>

### ✔︎ 빵집 정보 수정 (사업자)

- 기존 등록된 매장 정보를 자유롭게 수정할 수 있어요.
- 매장 이름, 주소, 운영 시간, 소개 문구 등을 변경할 수 있어요.
- 휴무일과 비활성화된 예약 시간대 설정도 가능해요.
- 해당 기능은 ‘빵집 메뉴’ 탭에서 편리하게 이용할 수 있어요.

<br/><br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
<img src="/img/usage-guide/owner/빵집 정보 수정1.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/owner/빵집 정보 수정2.png" width="300"
height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/owner/빵집 정보 수정3.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/owner/빵집 정보 수정4.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
</div>

<br/>

### ✔︎ 빵집 메뉴 관리 (사업자)

- 전체 메뉴 목록을 한눈에 확인하고 빠르게 관리할 수 있어요.
- 메뉴 비활성화, 삭제, 순서 정렬 등의 작업을 간편하게 할 수 있어요.
- ‘빵집 메뉴’ 탭에서 관리 기능을 쉽게 사용할 수 있어요.

<br/><br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/owner/빵집메뉴 조회.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/owner/메뉴 순서 조정.gif" width="250" height="460" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/owner/빵집 메뉴 삭제.gif" width="250" height="460"/>
</div>

<br/>

### ✔︎ 빵집 메뉴 등록/수정 (사업자)

- 새로운 빵 메뉴를 직접 등록할 수 있어요.
- 메뉴 이름, 가격, 설명, 이미지 등을 입력해 상세 정보를 추가할 수 있어요.
- 기존 메뉴에 대한 정보도 수정 가능해요.

<br/><br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/owner/메뉴 생성.gif" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
  <img src="/img/usage-guide/owner/메뉴 수정.gif" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
</div>

<br/>

### ✔︎ 예약 확인 및 접수 (사업자)

- 고객의 예약 전체 내역을 상태별로 조회할 수 있어요.
- 각 예약의 상세 내역(메뉴, 수량, 수령 시간 등) 을 확인할 수 있어요.
- 예약을 상황에 따라 거부하거나 접수, 부분 접수할 수 있어요.

<br/><br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
<img src="/img/usage-guide/owner/예약 내역 조회.gif" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/owner/예약 상세내역.gif" width="300"
height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/owner/예약 거부.gif" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
<img src="/img/usage-guide/owner/예약 부분 접수.gif" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
</div>

<br/>

### ✔︎ 알림 수신 (사업자)

- 고객 예약 요청/취소/확정에 대한 알림을 실시간으로 받아요.
- 빠르게 응답하여 원활한 매장 운영이 가능해요.

<br/><br/>

<div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
  <img src="/img/usage-guide/owner/알림 내역 조회.png" width="300" height="550" style={{ border: '1px solid #e8eaec' }} />
</div>
