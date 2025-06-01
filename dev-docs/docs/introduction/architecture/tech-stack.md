---
id: tech-stack
title: 개발 환경 및 기술 스택
sidebar_label: ⚙️ 개발 환경 및 기술 스택
---

> BreadItNow 프로젝트는 프론트엔드와 백엔드가 독립된 모듈로 나뉘어 있으며, 각 파트는 다음과 같은 환경과 기술 스택을 기반으로 개발되었습니다.


## Management

| 항목             | 내용                             |
|-----------------|----------------------------------|
| 버전 관리        | Git + GitHub                     |
| 협업 도구        | Notion, Discord, Figma           |
| 이슈 관리        | GitHub Issues, Notion            |

<br/>

## Frontend

> BreadItNow의 프론트엔드 시스템은 모던 웹 기술을 활용하여 사용자에게 빠르고 매끄러운 경험을 제공합니다.

### 🛠️ 기술 스택

#### 언어 및 프레임워크
- **Next.js**: React 기반의 SSR 및 CSR 가능 프레임워크
- **TypeScript**: 안전한 정적 타입 지원을 통한 높은 코드 안정성 제공

#### 스타일링 및 UI 구성
- **Tailwind CSS**: 간결한 유틸리티 기반 CSS 프레임워크
- **Framer Motion, DND Kit**: 부드러운 애니메이션과 직관적인 드래그 앤 드롭 인터페이스 제공

#### 데이터 및 폼 관리
- **TanStack Query (React Query)**: 효율적인 API 데이터 캐싱 및 상태 관리
- **React Hook Form**: 쉽고 검증 가능한 폼 상태 관리

#### 개발 생산성 도구
- **MSW (Mock Service Worker)**: 브라우저 및 테스트 환경용 API mocking 지원
- **ESLint, Prettier, Husky**: 코드 정적 분석, 일관된 코드 포맷팅 및 커밋 전 자동화된 코드 검사


### 📦 배포 및 운영

- **Vercel**: Next.js 애플리케이션 호스팅 및 CI/CD 자동화

<br/>

## Backend

> BreadItNow의 백엔드 시스템은 모듈화된 구조를 기반으로 하며, 다음과 같은 기술 스택과 개발 환경을 사용합니다.

### 🛠️ 기술 스택

#### 언어 및 프레임워크

- **Java 17**: 안정적인 LTS 버전
- **Spring Boot 3.x**: 빠른 개발을 위한 프레임워크
- **Spring Data JPA**: 데이터 접근 추상화

#### 아키텍처 및 설계

- **모듈 구조**: `Customer`, `Owner`, `Auth`, `Gateway` 모듈로 구성
- **Gateway 모듈**: 인증/인가 및 요청 라우팅을 처리하며, 외부 요청의 관문 역할 수행
- **Auth 모듈**: 고객과 사업자를 구분하여 회원가입, 로그인, 인증번호 발송 등 인증 관련 기능 담당

#### 데이터베이스 및 캐시

- **MySQL**: 메인 데이터베이스, ngram 인덱스를 활용한 자동완성 검색 지원
- **Redis**: 인증 토큰, 인증 번호 등의 임시 데이터 저장

#### 메시징 및 알림

- **FCM (Firebase Cloud Messaging)**: 모바일 알림 전송
- **Discord Webhook + Logback Appender**: 에러 로그 기반 실시간 디스코드 알림 기능

#### 인증 및 보안

- **JWT (JSON Web Token)**: 인증 및 권한 관리
- **ID/PW + OAuth**: 고객은 소셜 로그인과 일반 로그인 지원, 사업자는 일반 로그인만 지원
- **Spring Security**: JWT 기반의 인증 및 권한 관리, OAuth 통합 인증

### 📦 배포 및 운영

#### 도메인 관리

- **가비아**: 도메인 구매 및 관리

#### AWS 인프라

- **IAM**: 접근 권한 및 보안 정책 관리
- **EC2**: 애플리케이션 배포 및 서버 운영
- **Route53**: DNS 서비스 및 도메인 연결
- **ACM (AWS Certificate Manager)**: SSL 인증서 관리 및 HTTPS 설정
- **CloudFront**: 정적 자원 CDN 및 SSL 오프로드

#### CI/CD 및 컨테이너 관리

- **Docker + Docker Compose**: 컨테이너 기반 개발 및 운영 환경 구축
- **GitHub Actions**: CI/CD 자동화 파이프라인

#### 정적 리소스 관리

- **Amazon S3**: 정적 자원 저장 및 관리

### 🔐 환경 변수 관리

- **env 파일**: `.env` 파일을 통한 비밀 키 및 환경 설정 분리
- **git submodule**: `secret-config` 서브모듈로 보안 정보 별도 관리


<br/>


---

이 문서는 팀 내외부 개발자가 프로젝트 구조와 기술 스택을 빠르게 이해하고, 새로운 개발 환경을 세팅하는 데 도움을 주기 위한 문서입니다.