package com.nextpay.core;

import com.nextpay.core.fee.PaymentFeeCalculator;
import com.nextpay.core.model.PaymentRequest;
import com.nextpay.core.validation.PaymentRequestValidator;
import com.nextpay.core.discount.*;

/**
 * 넥스트페이 결제 코어 서비스 메인 시뮬레이션
 */
public class NextPayApplication {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   [주식회사 넥스트페이] 결제 코어 엔진 v2.4.0   ");
        System.out.println("   서버 부팅 완료: Spring Boot Microservice Ready   ");
        System.out.println("==================================================");

        try {
            PaymentRequest request = new PaymentRequest(
                "ORD-20260930-9901",
                "MCH-STARBUCKS-01",
                12500L,
                "CARD",
                "customer@example.com"
            );

            System.out.println("[Step 1] 결제 승인 요청 수신:");
            System.out.println(" - 주문번호: " + request.getOrderId());
            System.out.println(" - 가맹점: " + request.getMerchantId());
            System.out.println(" - 원금: " + request.getAmount() + "원");
            System.out.println(" - 수단: " + request.getPaymentMethod());

            System.out.println("\n[Step 2] 파라미터 유효성 검증(Validation)...");
            PaymentRequestValidator validator = new PaymentRequestValidator();
            validator.validate(request);
            System.out.println(" -> 검증 통과 (VALID)");

            System.out.println("\n[Step 3] 가맹점 우대 수수료 계산 (수수료율 0.8%)...");
            PaymentFeeCalculator feeCalc = new PaymentFeeCalculator();
            long fee = feeCalc.calculateFee(request.getAmount(), 0.008);
            System.out.println(" -> 수수료: " + fee + "원 (정산액: " + (request.getAmount() - fee) + "원)");

            System.out.println("\n[Step 4] 쿠폰 할인 적용 (정률 10% 쿠폰)...");
            DiscountPolicy discount = new RateDiscountPolicy(0.10, 2000L);
            long discountAmount = discount.calculateDiscount(request.getAmount());
            long finalPayAmount = request.getAmount() - discountAmount;
            System.out.println(" -> 적용 정책: " + discount.getPolicyName());
            System.out.println(" -> 할인액: -" + discountAmount + "원");
            System.out.println(" -> 최종 고객 결제 승인 금액: " + finalPayAmount + "원");

            System.out.println("\n>>> [결제 승인 완료] SUCCESS: 결제 트랜잭션 정상 커밋되었습니다.");

        } catch (Exception e) {
            System.err.println(">>> [결제 처리 실패] Exception: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
