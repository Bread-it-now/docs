---
id: reservation
title: 예약 기능 명세서
sidebar_label: ✨ 예약
---

# 🍞 예약 기능 명세서

`reservation-api`는 고객의 예약 생성부터 점주의 예약 관리(승인, 부분 승인, 취소)까지 예약의 전체 라이프사이클을 책임지는 서비스입니다.

동기 통신(HTTP)을 통해 `owner-api`, `customer-api`로부터 필요한 정보를 조회하고, 비동기 통신(RabbitMQ)으로 재고 관리, 알림 등 후속 처리를 다른 서비스에 위임하여 안정성과 확장성을 확보합니다.

---

## 1. 데이터 모델 (ERD)

예약 도메인은 **RESERVATION(예약)** 과 **RESERVATION_PRODUCTS(예약 상품)** 두 엔티티로 구성됩니다.

<img
src="/img/backend/reservation/reservation-erd.png"
style={{ maxWidth: '400px', width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
alt="Reservation ERD" />

- **RESERVATION**: 한 번의 예약에 대한 메타데이터(예약자, 빵집 정보, 예약 번호, 상태, 총액 등)를 관리합니다.
  - `reservation_id` (PK)
  - `bakeryId`, `bakeryName`, `bakeryAddress`, `bakeryPhone`, `bakeryProfileImageUrl`
  - `ordererId`, `ordererPhoneNumber`, `ordererNickname`
  - `reservationNumber` (일일 순번)
  - `reservationStatus` (WAITING, APPROVED, PARTIAL_APPROVED, CANCELLED)
  - `cancellationReason`, `totalPrice`
- **RESERVATION_PRODUCTS**: 예약에 포함된 개별 상품 목록과 각 품목의 수량, 단가, 합계 정보를 관리합니다.
  - `reservation_id` (FK)
  - `productId`, `productName`, `productImageUrl`, `productPrice`, `quantity`, `totalPrice`

---

## 2. 핵심 기능 및 API 명세

예약 모듈의 모든 데이터 변경 작업(예약 생성 및 상태 변경)은 **트랜잭션**으로 원자성을 보장하며, 트랜잭션이 성공적으로 커밋된 후에 관련된 **이벤트를 RabbitMQ로 발행**하여 후속 조치를 비동기적으로 처리합니다.

### 2.1. 고객 기능 (`MyReservationController`)

#### **1. 예약 생성**

| **Method** | **Endpoint**             |
| :--------- | :----------------------- |
| `POST`     | `/api/v1/my/reservation` |

- **핵심 로직 흐름**

<img
src="/img/backend/reservation/reservation-created-sequence.png"
style={{width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
/>

- **요청 (Request Body)**

  ```json
  {
    "bakeryId": 123,
    "items": [
      { "productId": 10, "quantity": 2 },
      { "productId": 11, "quantity": 1 }
    ],
    "scheduledAt": "2025-10-10T10:00:00"
  }
  ```

- **응답 (201 Created)**

  ```json
  {
    "status": "SUCCESS",
    "data": { "reservationId": 1001 }
  }
  ```

- **핵심 처리 상세**
  1.  `Owner API`를 호출하여 빵집 정보를 조회하고, 존재하지 않으면 `BAKERY_NOT_FOUND` 예외를 발생시킵니다.
  2.  `BakeryValidator`를 통해 빵집의 운영 상태를 검증하며, 영업 중이 아닐 경우 `BAKERY_IS_NOT_OPENED` 예외를 발생시킵니다.
  3.  `Owner API`에서 요청된 상품들의 상세 정보를 조회하고, 존재하지 않는 상품이 있으면 `PRODUCT_NOT_FOUND` 예외를 발생시킵니다.
  4.  `Customer API`에서 주문자 정보(전화번호, 닉네임 등)를 조회합니다.
  5.  조회된 모든 정보를 바탕으로 `Reservation` 엔티티를 생성하고 데이터베이스에 저장합니다. 이 과정은 단일 트랜잭션으로 처리됩니다.
  6.  트랜잭션이 성공적으로 커밋된 후, 점주에게 알리기 위한 `ReservationCreatedEvent`를 발행합니다.

#### **2. 내 예약 목록/상세 조회**

| **Method** | **Endpoint**                             | **설명**                                        |
| :--------- | :--------------------------------------- | :---------------------------------------------- |
| `GET`      | `/api/v1/my/reservation`                 | 자신의 예약 목록을 페이지네이션으로 조회합니다. |
| `GET`      | `/api/v1/my/reservation/{reservationId}` | 특정 예약의 상세 정보를 조회합니다.             |

- **설명**: `ReservationQueryService`가 데이터베이스에서 예약 정보를 조회하여 `MyReservationPageResponse` 또는 `MyReservationDetailResponse` DTO로 변환 후 반환합니다.
- **필터링**: 목록 조회 시 `status` 쿼리 파라미터(`WAITING`, `APPROVED`)를 통해 상태별 조회가 가능합니다.

#### **3. 내 예약 취소**

| **Method** | **Endpoint**                                    |
| :--------- | :---------------------------------------------- |
| `POST`     | `/api/v1/my/reservation/{reservationId}/cancel` |

- **핵심 로직 흐름**

<img
src="/img/backend/reservation/reservation-cancel-sequence.png"
style={{width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
/>

- **핵심 처리 상세**
  1.  대상 예약을 조회하고, 없으면 `RESERVATION_NOT_FOUND` 예외를 발생시킵니다.
  2.  예약 상태를 `CANCELLED`로 변경하고 취소 사유를 기록합니다.
  3.  점주에게 취소 사실을 알리기 위해 `NotificationRequiredEvent`를 발행합니다.
  4.  만약 예약이 이전에 승인되어 재고가 차감된 상태(`APPROVED`, `PARTIAL_APPROVED`)였다면, 재고 복구를 위해 `StockIncreaseRequestedEvent`를 추가로 발행합니다.

---

### 2.2. 점주 기능 (`ReservationController`)

#### **1. 예약 승인 (전체)**

| **Method** | **Endpoint**                                                    |
| :--------- | :-------------------------------------------------------------- |
| `POST`     | `/api/v1/bakery/{bakeryId}/reservation/{reservationId}/approve` |

- **핵심 로직 흐름**

<img
src="/img/backend/reservation/reservation-approved-sequence.png"
style={{width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
/>

- **핵심 처리 상세**
  1.  `@Authorize(OWNER)` 및 `BakeryValidator`를 통해 API 호출자가 해당 빵집의 점주인지 검증하며, 권한이 없으면 `NOT_BAKERY_OWNER` 예외를 발생시킵니다.
  2.  예약 상태를 확인하여 이미 처리된 예약에 대한 중복 요청을 방지합니다 (`ALREADY_PROCESSED_RESERVATION`).
  3.  `owner-api`에 재고 차감을 요청하기 위해 `StockDecreaseRequestedEvent`를 발행합니다.
  4.  이후 `owner-api`로부터 재고 처리 결과(`StockUpdateResultEvent`)를 비동기적으로 수신하면, `ReservationResultHandler`가 예약의 최종 상태를 확정합니다.
  5.  최종 상태 변경이 완료되면, 고객에게 알리기 위한 `NotificationRequiredEvent`를 발행합니다.

#### **2. 예약 부분 승인**

| **Method** | **Endpoint**                                                            |
| :--------- | :---------------------------------------------------------------------- |
| `POST`     | `/api/v1/bakery/{bakeryId}/reservation/{reservationId}/partial-approve` |

- **핵심 로직 흐름**

<img
src="/img/backend/reservation/reservation-partial-approved-sequence.png"
style={{width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
/>

- **요청 (Request Body)**

  ```json
  {
    "items": [
      { "productId": 10, "approvedQuantity": 1 },
      { "productId": 11, "approvedQuantity": 1 }
    ],
    "note": "일부 품목은 재고 부족으로 조정됩니다."
  }
  ```

- **핵심 처리 상세**
  - `Reservation` 도메인 객체의 `partialApprove` 메서드를 호출하여 예약 상품 목록과 총액을 재계산합니다.
  - 조정된 수량만큼 재고를 차감하도록 `StockDecreaseRequestedEvent`를 발행합니다.
  - 이후 과정은 전체 승인과 동일하게 `StockUpdateResultEvent` 수신을 통해 최종 상태를 확정하고 알림 이벤트를 발행합니다.

#### **3. 예약 취소 (점주)**

| **Method** | **Endpoint**                                                   |
| :--------- | :------------------------------------------------------------- |
| `POST`     | `/api/v1/bakery/{bakeryId}/reservation/{reservationId}/cancel` |

- **처리**: 고객의 예약 취소 로직과 동일하며, 취소 주체가 점주임을 기록합니다. 이는 향후 운영 정책에 따라 환불 및 수수료 처리 로직과 연계될 수 있습니다.

#### **4. 빵집 예약 목록/상세 조회**

| **Method** | **Endpoint**                                            | **설명**                                 |
| :--------- | :------------------------------------------------------ | :--------------------------------------- |
| `GET`      | `/api/v1/bakery/{bakeryId}/reservation`                 | 해당 빵집의 모든 예약을 조회합니다.      |
| `GET`      | `/api/v1/bakery/{bakeryId}/reservation/{reservationId}` | 해당 빵집의 특정 예약을 상세 조회합니다. |

- **설명**: `ReservationQueryService`가 `bakeryId`를 기준으로 예약 정보를 조회하여 `ReservationPageResponse` 또는 `ReservationDetailResponse`로 변환 후 반환합니다.

---

## 3. 비동기 이벤트 처리

`reservation-api`는 다른 서비스와 상호작용하기 위해 다양한 이벤트를 발행하고 구독합니다.

### 3.1. 발행(Publish) 이벤트

| 이벤트                        | 용도                                     | 수신 서비스        |
| :---------------------------- | :--------------------------------------- | :----------------- |
| `ReservationCreatedEvent`     | 고객 예약 생성 시 발행                   | `notification-api` |
| `StockDecreaseRequestedEvent` | 점주가 예약을 승인할 때 재고 차감 요청   | `owner-api`        |
| `StockIncreaseRequestedEvent` | 승인된 예약을 취소할 때 재고 복구 요청   | `owner-api`        |
| `NotificationRequiredEvent`   | 예약 상태가 최종 변경되었을 때 알림 요청 | `notification-api` |

### 3.2. 구독(Consume) 이벤트

| 이벤트                   | 용도                                | 송신 서비스 |
| :----------------------- | :---------------------------------- | :---------- |
| `StockUpdateResultEvent` | 재고 변경 처리 결과(성공/실패) 통지 | `owner-api` |

- **동작 상세**
  - **`StockDecreaseResultConsumer`**: 재고 차감 결과를 받아 예약 상태를 `APPROVED`, `PARTIAL_APPROVED` 등으로 최종 확정하고, 고객 알림을 위한 `NotificationRequiredEvent`를 발행합니다.
  - **`StockIncreaseResultConsumer`**: 재고 복구 결과를 받아 예약 취소 절차를 최종 마무리하고 관련 알림 이벤트를 발행합니다.

### 3.3. 신뢰성 및 운영 정책

- **발행 시점**: 데이터베이스 트랜잭션이 성공적으로 커밋된 이후에만 이벤트를 발행하여 데이터 정합성을 보장합니다. (`@TransactionalEventListener(phase = AFTER_COMMIT)`)
- **소비자 설계**
  - **멱등성(Idempotency)**: `reservationId`를 기준으로 동일한 이벤트를 여러 번 수신하더라도 중복 처리되지 않도록 설계합니다.
  - **재시도 및 DLQ**: 일시적인 오류로 이벤트 처리에 실패할 경우, 설정된 횟수만큼 재시도합니다. 재시도 횟수 초과 시 해당 메시지는 Dead-Letter-Queue(DLQ)로 이동하여 데이터 유실을 방지합니다.

---

## 4. 주요 예외 코드

| 코드                               | 설명                                                          |
| :--------------------------------- | :------------------------------------------------------------ |
| `BAKERY_NOT_FOUND`                 | 요청한 빵집 정보가 존재하지 않을 때 발생합니다.               |
| `BAKERY_IS_NOT_OPENED`             | 빵집이 현재 영업 중이 아닐 때 발생합니다.                     |
| `PRODUCT_NOT_FOUND`                | 요청한 상품이 존재하지 않을 때 발생합니다.                    |
| `RESERVATION_NOT_FOUND`            | 대상 예약을 찾을 수 없을 때 발생합니다.                       |
| `ALREADY_PROCESSED_RESERVATION`    | 이미 처리된 예약에 중복 요청을 시도할 때 발생합니다.          |
| `NOT_BAKERY_OWNER`                 | 해당 빵집의 점주가 아닌 사용자가 관리를 시도할 때 발생합니다. |
| `CANNOT_PARTIALLY_APPROVE`         | 부분 승인이 불가능한 상태의 예약일 때 발생합니다.             |
| `INVALID_PARTIAL_APPROVE_QUANTITY` | 부분 승인 시 요청 수량이 유효하지 않을 때 발생합니다.         |
