---
id: sign-up
title: 고객 - 회원가입 기능 명세서
sidebar_label: ✨ 회원가입
---

# 🍞 회원가입 기능 명세서

"빵잇나우" Auth 모듈의 회원가입 프로세스는 직접 회원가입(이메일/비밀번호)과 소셜 로그인 두 가지 방식을 지원하며,  
회원 생성 이후의 후속 처리는 비동기 이벤트 기반 아키텍처(RabbitMQ)를 통해 안정성과 확장성을 확보합니다.  
아래 문서는 데이터 모델(ERD), 요청/처리 흐름(Sequence), API 명세, 이벤트 페이로드 및 예외 조건을 정리한 내용입니다.

---

## 1. 데이터 모델 (ERD)

Auth 모듈의 핵심 엔티티는 계정(Account), 자체 인증(Local Auth), 소셜 인증(Social Auth)으로 구성됩니다.  
역할과 책임을 분리해 확장성과 무결성을 확보하도록 설계되어 있습니다.

<img
src="/img/backend/auth/auth-erd.png"
style={{ maxWidth: '700px', width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}
alt="Auth Domain" />

- ACCOUNT: 시스템 전반에서 사용자 식별의 단일 근원
- LOCAL_AUTH: 이메일 기반 인증 전담, 이메일 유니크 제약 적용
- SOCIAL_AUTH: 다중 소셜 계정 연계 가능(한 계정에 여러 provider 연결)

---

## 2. 직접 회원가입 (Email / Direct Sign-up)

### 2.1 핵심 로직 흐름 (Sequence Diagram)

<img
src="/img/backend/auth/auth-direct-signup-sequence.png"
style={{ maxWidth: '800px', width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}/>

### 2.2 상세 명세

- 기능 요구사항

  - 입력: email, password, role (CUSTOMER | OWNER)
  - 이메일 중복 검사 필수
  - 성공 시 생성된 userId 반환
  - AccountCreatedEvent 비동기 발행

- API

  - 엔드포인트: `POST /api/v1/auth/sign-up`

  - 요청 예시

    ```json
    {
      "email": "customer@example.com",
      "password": "password123!",
      "role": "CUSTOMER"
    }
    ```

  - 성공 응답(200 OK)
    ```json
    {
      "status": "SUCCESS",
      "data": {
        "userId": 1
      }
    }
    ```

- 핵심 처리 흐름(요약)

  1. Controller에서 요청 수신 및 기본 검증(@Valid)
  2. Service에서 LocalAuthRepository.findByEmail(email)로 중복 검사
     - 중복 시: BA003 (EMAIL_ALREADY_EXISTS) 반환
  3. Account 엔티티 생성 및 저장(accountRepository.save)
  4. 비밀번호 BCrypt 해시 후 LocalAuth 생성 및 저장(localAuthRepository.save)
  5. 트랜잭션 커밋 완료 후 AccountCreatedEvent(accountId, role) 발행(rabbitTemplate.convertAndSend)
  6. 이벤트 발행 호출 완료 후 클라이언트에 회원가입 성공(userId) 응답 반환
  7. 소비자들은 비동기적으로 AccountCreatedEvent를 수신하여 각자 도메인 엔티티 생성 수행

<br/>

- 주요 예외 코드
  - EMAIL_ALREADY_EXISTS — 이미 가입된 이메일
  - ROLE_INVALID — role 값 유효하지 않음
  - INVALID_PASSWORD — 비밀번호 정책 위반
  - REQUIRED_FIELD_MISSING — 필수 입력값 누락

---

## 3. 소셜 로그인 (신규 가입 포함)

### 3.1 핵심 로직 흐름 (Sequence Diagram)

<img
src="/img/backend/auth/auth-social-signup-sequence.png"
style={{ maxWidth: '800px', width: '100%', height: "auto", border: '1px solid #e8eaec', borderRadius: '20px' }}/>

### 3.2 상세 명세

- 기능 요구사항

  - 사용자 소셜 인증 시작: `/oauth2/authorization/{provider}`
  - 소셜 제공자에서 전달된 provider + providerId로 SOCIAL_AUTH 존재 여부 확인
  - 신규 사용자: ACCOUNT 생성 + SOCIAL_AUTH 저장 + AccountCreatedEvent 발행
  - 기존 사용자: 로그인 처리 및 토큰 발급

<br/>

- 토큰/리디렉션

  - 인증 성공 시 Oauth2AuthenticationSuccessHandler가 Access/Refresh Token 발급 및 리디렉션 처리
  - 실패 시 Oauth2AuthenticationFailureHandler가 지정 URI로 에러 쿼리 파라미터 포함 리디렉션

---

## 4. 비동기 이벤트 처리

회원가입 직후 생성된 계정 정보를 각 도메인 서비스(Customer, Owner)에 전파하기 위한 비동기 프로세스입니다.

가. 이벤트 명세: AccountCreatedEvent

- 목적: 신규 계정 생성이 완료되었음을 시스템 내 다른 서비스에 알립니다.
- Exchange: `account.events.exchange` (Topic Exchange)
- Routing Key: `account.created`
- 페이로드 예시 (AccountCreatedEvent)

  ```json
  {
    "accountId": 1,
    "role": "CUSTOMER"
  }
  ```

<br/>

나. 소비자(Consumer) 동작

- Customer API: `customer.account-created.queue`를 구독하며, role이 `CUSTOMER`인 이벤트 수신 시 해당 `accountId`로 `customer` 테이블에 사용자 생성.
- Owner API: `owner.account-created.queue`를 구독하며, role이 `OWNER`인 이벤트 수신 시 해당 `accountId`로 `owner` 테이블에 사용자 생성.

---
