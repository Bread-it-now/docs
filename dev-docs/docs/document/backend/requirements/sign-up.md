---
id: sign-up
title: 회원가입 기능 명세서
sidebar_label: ✨ 회원가입
---

# 🍞 회원가입 기능 명세서

`auth-api`는 직접 회원가입(이메일/비밀번호)과 소셜 로그인을 포함한 모든 사용자 인증 및 계정 생성을 책임지는 서비스입니다.

회원가입이 완료되면 후속 처리를 위해 비동기 이벤트 기반 아키텍처(RabbitMQ)를 통해 `AccountCreatedEvent`를 발행하여 `customer-api`, `owner-api` 등 다른 서비스와의 데이터 정합성을 보장하고 시스템 확장성을 확보합니다.

---

## 1. 데이터 모델 (ERD)

Auth 모듈의 핵심 엔티티는 **ACCOUNT(계정)**, **LOCAL_AUTH(자체 인증)**, **SOCIAL_AUTH(소셜 인증)**으로 구성됩니다. 각 엔티티의 역할을 명확히 분리하여 확장성과 데이터 무결성을 높이도록 설계되었습니다.

<img
src="/img/backend/auth/auth-erd.png"
style={{ maxWidth: '700px', width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
alt="Auth Domain ERD" />

- **ACCOUNT**: 시스템 전반에서 사용자를 식별하는 유일한 근원(Source of Truth)입니다.
- **LOCAL_AUTH**: 이메일 기반의 자체 인증 정보를 전담하며, 이메일에 대한 유니크 제약 조건을 가집니다.
- **SOCIAL_AUTH**: 여러 소셜 계정(KAKAO, NAVER 등)을 하나의 `ACCOUNT`에 연동할 수 있도록 1:N 관계로 설계되었습니다.

---

## 2. 직접 회원가입 (Email / Direct Sign-up)

### 2.1. 핵심 로직 흐름 (Sequence Diagram)

<img
src="/img/backend/auth/auth-direct-signup-sequence.png"
style={{ maxWidth: '800px', width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
alt="Direct Sign-up Sequence" />

### 2.2. 상세 명세

| **Method** | **Endpoint**           |
| :--------- | :--------------------- |
| `POST`     | `/api/v1/auth/sign-up` |

- **기능 요구사항**

  - **입력**: `email`, `password`, `role` (`CUSTOMER` 또는 `OWNER`)
  - 이메일 중복 검사는 필수적으로 수행해야 합니다.
  - 성공 시 생성된 사용자의 고유 ID(`userId`)를 반환합니다.
  - 회원가입 완료 후 `AccountCreatedEvent`를 비동기적으로 발행해야 합니다.

- **요청 (Request Body)**

  ```json
  {
    "email": "customer@example.com",
    "password": "password123!",
    "role": "CUSTOMER"
  }
  ```

- **응답 (200 OK)**

  ```json
  {
    "status": "SUCCESS",
    "data": {
      "userId": 1
    }
  }
  ```

- **핵심 처리 흐름**
  1.  **요청 수신 및 검증**: Controller에서 `@Valid`를 통해 요청 파라미터의 기본 유효성을 검증합니다.
  2.  **이메일 중복 검사**: `AuthService`에서 `LocalAuthRepository`를 통해 이메일 존재 여부를 확인하고, 중복 시 `EMAIL_ALREADY_EXISTS` 예외를 발생시킵니다.
  3.  **계정 생성**: `Account` 엔티티를 생성하고 데이터베이스에 저장합니다.
  4.  **인증 정보 생성**: 비밀번호를 BCrypt로 해시한 후 `LocalAuth` 엔티티를 생성하여 데이터베이스에 저장합니다. 이 모든 과정은 단일 트랜잭션으로 처리됩니다.
  5.  **이벤트 발행**: 트랜잭션이 성공적으로 커밋된 후, `AccountCreatedEvent`를 RabbitMQ로 발행합니다.
  6.  **성공 응답**: 클라이언트에게 생성된 `userId`를 포함한 성공 응답을 반환합니다.
  7.  **후속 처리**: 이벤트를 구독하는 각 서비스(`customer-api`, `owner-api`)는 비동기적으로 `AccountCreatedEvent`를 수신하여 자체 도메인에 필요한 데이터를 생성합니다.

---

## 3. 소셜 로그인 (신규 가입 포함)

### 3.1. 핵심 로직 흐름 (Sequence Diagram)

<img
src="/img/backend/auth/auth-social-signup-sequence.png"
style={{ maxWidth: '800px', width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
alt="Social Sign-up Sequence" />

### 3.2. 상세 명세

| **Method** | **Endpoint**                       |
| :--------- | :--------------------------------- |
| `GET`      | `/oauth2/authorization/{provider}` |

- **기능 요구사항**

  - 사용자는 제공된 소셜 로그인 경로(`{provider}`는 `kakao`, `naver` 등)를 통해 인증을 시작합니다.
  - 시스템은 소셜 제공자로부터 받은 `provider`와 `providerId`를 기준으로 기가입 여부를 확인합니다.
  - **신규 사용자**인 경우, `ACCOUNT`와 `SOCIAL_AUTH` 정보를 자동으로 생성하고 `AccountCreatedEvent`를 발행합니다.
  - **기존 사용자**인 경우, 로그인 처리를 완료하고 토큰을 발급합니다.

- **토큰 발급 및 리디렉션**
  - **성공 시**: `Oauth2AuthenticationSuccessHandler`가 Access Token과 Refresh Token을 발급하고, 사전에 약속된 URI로 사용자를 리디렉션합니다.
  - **실패 시**: `Oauth2AuthenticationFailureHandler`가 에러 코드를 쿼리 파라미터에 담아 지정된 URI로 리디렉션합니다.

---

## 4. 비동기 이벤트 처리

회원가입 직후 생성된 계정 정보를 다른 도메인 서비스에 전파하기 위한 명세입니다.

### 4.1. 이벤트: `AccountCreatedEvent`

| 항목            | 설명                                                            |
| :-------------- | :-------------------------------------------------------------- |
| **목적**        | 신규 계정 생성이 완료되었음을 시스템 내 다른 서비스에 알립니다. |
| **Exchange**    | `account.events.exchange` (Topic Exchange)                      |
| **Routing Key** | `account.created`                                               |

- **페이로드 (Payload)**

  ```json
  {
    "accountId": 1,
    "role": "CUSTOMER"
  }
  ```

### 4.2. 소비자(Consumer) 동작

- **Customer API**: `customer.account-created.queue`를 구독합니다. `role`이 `CUSTOMER`인 이벤트를 수신하면, 해당 `accountId`를 사용하여 `customer` 테이블에 새로운 레코드를 생성합니다.
- **Owner API**: `owner.account-created.queue`를 구독합니다. `role`이 `OWNER`인 이벤트를 수신하면, 해당 `accountId`를 사용하여 `owner` 테이블에 새로운 레코드를 생성합니다.

---

## 5. 주요 예외 코드

| 코드                     | 설명                               |
| :----------------------- | :--------------------------------- |
| `EMAIL_ALREADY_EXISTS`   | 이미 가입된 이메일입니다.          |
| `ROLE_INVALID`           | 유효하지 않은 역할(role) 값입니다. |
| `INVALID_PASSWORD`       | 비밀번호 정책을 위반했습니다.      |
| `REQUIRED_FIELD_MISSING` | 필수 입력값이 누락되었습니다.      |
