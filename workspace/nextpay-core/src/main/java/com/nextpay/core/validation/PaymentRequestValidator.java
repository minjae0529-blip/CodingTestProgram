package com.nextpay.core.validation;

import com.nextpay.core.model.PaymentRequest;

/**
 * ============================================================================
 * [NEXTPAY-102] 결제 요청 유효성 검증(Validation) 및 사내 표준 에러 처리
 * ----------------------------------------------------------------------------
 * 담당자: 결제코어개발팀 신입 개발자
 * 사수: 김민우 대리 (코드 리뷰어)
 * 
 * [현업 이슈 배경]
 * PG사 연동 시 잘못된 파라미터(음수 금액, 빈 주문번호, 지원하지 않는 결제수단 등)가
 * 유입되어 런타임 NullPointerException이 발생하고 있습니다.
 * 컨트롤러 진입 전 필수 비즈니스 유효성 검증 로직을 구현해주세요.
 * 
 * [업무 요구사항]
 * 1. orderId는 null이거나 빈 문자열(trim 후 공백 포함)일 수 없습니다. 위반 시 "INVALID_ORDER_ID" 예외.
 * 2. amount는 최소 100원 이상, 최대 10,000,000원(1천만원) 이하이어야 합니다. 위반 시 "INVALID_AMOUNT" 예외.
 * 3. paymentMethod는 "CARD", "TRANSFER", "EASY_PAY" 3가지만 허용합니다. 위반 시 "UNSUPPORTED_METHOD" 예외.
 * 4. customerEmail은 null이 아니어야 하며 "@" 기호가 포함되어야 합니다. 위반 시 "INVALID_EMAIL" 예외.
 * ============================================================================
 */
public class PaymentRequestValidator {

    public void validate(PaymentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("PAYMENT_REQUEST_NULL: 결제 요청 객체가 null입니다.");
        }

        // [TODO: 신입사원 업무]
        // 1. 주문번호(orderId) 필수 검증
        // 2. 결제금액(amount) 범위 검증 (100원 ~ 1,000만 원)
        // 3. 결제수단(paymentMethod) 허용 목록 검증 ("CARD", "TRANSFER", "EASY_PAY")
        // 4. 이메일(customerEmail) 기본 형식 검증
    }
}
