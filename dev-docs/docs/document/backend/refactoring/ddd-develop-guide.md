---
id: ddd-develop-guide
title: DDD 개발 가이드
sidebar_label: ✨ DDD 개발 가이드
---

## 1. 도메인(domain)

도메인(domain) 패키지는 애플리케이션의 핵심 비즈니스 로직을 담고 있으며, 명확한 역할 분리와 유지보수를 위해 다음과 같은 원칙을 지켜야 합니다.

### 1.1 순수 자바 코드 (POJO)

도메인 패키지에는 Spring, JPA와 같은 프레임워크나 라이브러리 의존성이 없어야 하며, 순수한 Java 코드(POJO)로만 구성되어야 합니다.

### 1.2 일급 객체의 명확한 분리

상태나 데이터를 가지는 객체는 `record`로 정의하여 명확성을 높이고 불변성을 유지해야 합니다.

### 1.3 @Builder 사용 원칙

`@Builder`는 다음과 같은 제한된 상황에서만 사용합니다.

- 단위 테스트에서 특정 객체 상태를 쉽게 설정하기 위한 용도

- Entity 객체를 Domain 객체로 변환할 때

도메인의 핵심 비즈니스 로직이나 서비스 로직에서 무분별한 사용을 피하고, 생성자를 통해 명시적으로 객체를 생성합니다.

### 1.4 다른 애그리거트 참조 방식

다른 애그리거트를 직접 객체 참조하는 것이 아니라, 반드시 ID를 통해 참조하여 애그리거트 간의 명확한 경계를 유지합니다.

```java
public class Order {
    private CustomerId customerId; // 직접 참조가 아닌 ID 참조
}
```

<br/>

## 2. 엔티티(Entity)

엔티티(Entity)는 도메인 모델의 상태를 영속화하기 위해 사용됩니다. 아래 규칙을 준수하여 작성해야 합니다.

### 2.1 애그리거트 루트는 @Entity로 매핑

애그리거트 루트는 반드시 @Entity로 설정하며 JPA에서 관리됩니다.

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    private Long id;
    private String orderNumber;
}
```

### 2.2 엔티티와 밸류가 함께 있는 경우

값 타입(Value Object)은 @Embeddable, 값 타입을 사용하는 프로퍼티는 @Embedded를 사용합니다.

```java
@Entity
public class Member {
@Id
private Long id;

    @Embedded
    private Address address; // Value Object

}

@Embeddable
public class Address {
    private String city;
    private String street;
    private String zipcode;
}
```

### 2.3 AttributeConverter로 값 타입 매핑

도메인에서 사용하는 값 타입과 DB의 컬럼 타입을 다르게 매핑할 때 사용합니다.

```java
// 기본 형태
public interface AttributeConverter<X, Y> {
    Y convertToDatabaseColumn(X attribute);
    X convertToEntityAttribute(Y dbData);
}
```

```java
// 예시 (Money 타입 ↔︎ Integer 컬럼)
public class MoneyConverter implements AttributeConverter<Money, Integer> {

    @Override
    public Integer convertToDatabaseColumn(Money money) {
        return money == null ? null : money.getValue();
    }

    @Override
    public Money convertToEntityAttribute(Integer value) {
        return value == null ? null : new Money(value);
    }
}
```

```java
// 사용
@Entity
public class Product {
    @Id
    private Long id;

    @Convert(converter = MoneyConverter.class)
    private Money price;
}
```

### 2.4 값 컬렉션을 별도 테이블로 매핑

컬렉션 타입(예: List)을 별도의 테이블로 관리합니다. 인덱스가 필요한 경우 @OrderColumn을 사용합니다.

```java
@Entity
@Table(name = "purchase_order")
public class Order {
@EmbeddedId
private OrderNo number;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_line", joinColumns = @JoinColumn(name = "order_number"))
    @OrderColumn(name = "line_idx")
    private List<OrderLine> orderLines;
}

@Embeddable
public class OrderLine {
    @Embedded
    private ProductId productId;

    @Column(name = "price")
    private Money price;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "amounts")
    private Money amounts;
}
```

### 2.5 값 컬렉션을 단일 컬럼에 매핑

여러 값을 하나의 컬럼에 저장할 때는 새로운 값 타입을 정의하고 AttributeConverter를 사용합니다.

예시: 여러 이메일을 하나의 컬럼에 저장

```java
// 도메인 값 타입
public class EmailSet {
    private final Set<Email> emails;

    public EmailSet(Set<Email> emails) {
        this.emails = new HashSet<>(emails);
    }

    public Set<Email> getEmails() {
        return Collections.unmodifiableSet(emails);
    }
}
```

```java
// 컨버터
public class EmailSetConverter implements AttributeConverter<EmailSet, String> {

    @Override
    public String convertToDatabaseColumn(EmailSet attribute) {
        if (attribute == null) return null;
        return attribute.getEmails().stream()
				.map(Email::getAddress).collect(Collectors.joining(","));
    }

    @Override
    public EmailSet convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        Set<Email> emailSet = Arrays.stream(dbData.split(","))
				.map(Email::new).collect(Collectors.toSet());
        return new EmailSet(emailSet);
    }
}
```

```java
// 엔티티에서 적용
@Entity
public class Member {
    @Id
    private Long id;

    @Convert(converter = EmailSetConverter.class)
    @Column(name = "emails")
    private EmailSet emailSet;

}
```

### 2.6 값 타입을 ID로 매핑

식별자를 값 타입으로 매핑할 때는 @EmbeddedId를 사용합니다.

JPA의 식별자 타입은 반드시 Serializable 인터페이스를 구현해야 합니다.

```java
@Entity
@Table(name = "purchase_order")
public class Order {
    @EmbeddedId
    private OrderNo number;
}
```

```java
@Embeddable
public class OrderNo implements Serializable {
    @Column(name = "order_number")
    private String number;

    // equals, hashCode 구현 필요
```

<br/>

## 3 응용 서비스(Application Service)

응용 서비스는 표현 영역과 도메인 영역을 연결하며, 주로 도메인 객체를 사용하여 사용자의 요청을 처리합니다. `파사드(Facade) 패턴`과 같은 역할을 수행합니다.

### 3.1 응용 서비스의 역할

- 데이터 유효성 검사
- 도메인 객체 조회 및 변경
- 결과 반환 및 트랜잭션 관리
- 값 검증은 표현 영역이 아닌 응용 서비스 영역에서 필수 값 검증과 논리적 검증을 모두 처리

```java
@Service
public class SomeApplicationService {

    private final SomeAggRepository someAggRepository;

    // 도메인 객체 간의 흐름을 제어
    public Result doSomeFunc(SomeReq req) {
        // 1. 리포지토리에서 애그리거트를 구한다.
        SomeAgg agg = someAggRepository.findById(req.getId());
        // checkNull(agg); 도메인에서 처리하도록 한다.

        // 2. 애그리거트의 도메인 기능을 실행한다.
        agg.doFunc(req.getValue());

        // 3. 결과를 리턴한다.
        return createSuccessResult(agg);
    }

    // 새로운 애그리거트 생성 응용 서비스
    @Transactional
    public Result doSomeCreation(CreateSomeReq req) {
        // 1. 데이터 중복 등 데이터가 유효한지 검사한다.
        validate(req);

        // 2. 애그리거트 생성
        SomeAgg newAgg = createSome(req);

        // 3. 리포지토리에 애그리거트를 저장한다.
        someAggRepository.save(newAgg);

        // 4. 결과를 리턴한다.
        return createSuccessResult(newAgg);
    }
}
```

<br/>

## 4. 도메인 서비스(Domain Service)

도메인 서비스는 여러 애그리거트가 연관된 복잡한 로직이나 외부 시스템 연동 로직을 처리하기 위해 도메인 영역에 위치하며, 상태 없이 순수한 로직만 구현합니다.

### 4.1 도메인 서비스 사용 예시

- 계산 로직 : 여러 애그리거트가 필요한 계산 로직이나 한 애그리거트에 넣기에는 다소 복잡한 계산 로직
- 외부 시스템 연동이 필요한 도메인 로직 : 구현하기 위해 타 시스템을 사용해야 하는 도메인 로직

### 4.2 도메인 서비스 사용 방법

```java
public class DiscountCalculationService {
	public Money calculateDiscountAmounts(List<OrderLine> orderLines, List<Coupon> coupons, MemberGrade grade) {

       Money couponDiscount = coupons.stream()
				.map(coupon -> calculateDiscount(coupon))
				.reduce(Money(0), (v1, v2) -> v1.add(v2));
        Money membershipDiscount = calculateDiscount(orderer.getMember().getGrade());
        return couponDiscount.add(membershipDiscount);
    }

    private Money calculateDiscount(Coupon coupon){ ... }
    private Money calculateDiscount(MemberGrade grade) { ... }
}
```

### 4.3 도메인 서비스 사용 주체

도메인 서비스를 사용하는 주체는 애그리거트가 될 수도 있고, 응용 서비스가 될 수도 있습니다. 애그리거트 객체에 도메인 서비스를 전달하는 것은 응용 서비스의 책임입니다.

```java
public class Order {
    // 안티 패턴 : DiscountCaculationService을 절대 의존 주입하지 말고 인자로 받아야 한다!
    // @Autowired private DiscountCaculationService discountCalculationService
    public void calculateAmounts(DiscountCaculationService disCalSvc, MemberGrade grade) {
        Money totalAmounts = getTotalAmounts();
        Money discountAmounts = disCalSvc.calculateDiscountAmounts(this.orderLines, this.coupons, grade);
        this.paymentAmounts = totalAmounts.minus(discountAmounts);
    }
}
```

```java
public class OrderService {
    private DiscountCaculationService discountCalculationService

    @Transactaion
    public OrderNo placeOrder(OrderRequest orderRequest) {
        OrderNo orderNo = orderRepository.nextId();
        Order order = createOrder(orderNo, orderRequest);
        orderRepository.save(order);
        return orderNo;
    }

    private Order createOrder(OrderNo orderNo, OrderRequest orderReq){
        Member member = findMember(orderReq.getOrdererId());
        Order order = new Order(orderNo, orderReq.getOrderLines(), orderReq.getCoupons(), createOrderer(member), orderReq.getShippingInfo());
        order.calculateAmounts(this.discountCalculationService, member.getGrade());
        return null;
    }
}
```

![이미지 설명](/img/ddd-guide/image1.png)

도메인 서비스의 구현이 특정 기술에 의존하거나 외부 시스템의 API를 실행한다면 도메인 영역의 도메인 서비스는 인터페이스로 추상화한다.

![이미지 설명](/img/ddd-guide/image2.png)

특정 기능이 응용 서비스인지 도메인 서비스인지 감이 안 잡힐 경우, `해당 로직이 애그리거트의 상태를 변경하거나 애그리거트의 상태 값을 게산하는지 검사해 보면 된다.`

예를 들어, 계좌 이체 로직은 계좌 애그리거트의 상태를 변경한다. 결제 금액 로직은 주문
애그리거트의 주문 금액을 계산한다.

이 두 로직은 각각 애그리거트를 변경하고 애그리거트의 값을 계산하는 도메인 로직이다. 도메인 로직이면서 한 애그리거트에 넣기에 적합하지 않음로 이 두 로직은 도메인 서비스로 구현하게 된다.

<br/>

## 5. CQRS

CQRS는 Command(명령)와 Query(조회)를 명확히 분리하여 시스템을 보다 효율적으로 설계하는 패턴입니다.

![이미지 설명](/img/ddd-guide/image3.png)

![이미지 설명](/img/ddd-guide/image4.png)

### 5.1 명령(Command): 상태 변경을 담당

**상태 변경** : 상태 변경 기능은 주로 한 애그리거트의 상태를 변경합니다. 현재 저장하고 있는 데이터를 변경하는 방식으로 기능을 구현한다.

- 저장, 변경, 삭제 레포지토리 DAO : `CommandRepository`

- 저장, 변경, 삭제는 JPA를 통해 엔티티를 저장하는 방식을 사용한다.

- 주문 생성, 배송지 정보 변경, 회원 암호 변경

- command 관련 로직들의 `request`, `response`는 application 계층에 위치시킨다.

<br/>

### 5.2 조회(Query): 데이터를 조회하는 기능

- 조회 DAO : `QueryRepository`

- 주문 상세 내역 보기, 게시글 목록 보기, 회원 정보 보기, 판매 통계 보기

- 조회 모델에서 단순히 데이터를 읽어와 조회하는 기능은 응용 로직이 복잡하지 않기 때문에 표현 영역에서 바로 DAO를 실행해도 된다.

- query는 presentation에서 직접 repository를 호출하여 dto를 반환시키는 것으로 한다.

- 만약 추가적으로 로직 처리가 필요하다면 application 패키지에 `dto`를 만든다. application 계층에서 `response`로 변환하여 반환시켜준다.

![이미지 설명](/img/ddd-guide/image5.png)
