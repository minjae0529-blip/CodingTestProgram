package com.nextpay.core.validation;

import com.nextpay.core.model.PaymentRequest;

public class PaymentRequestValidatorTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("[NextPay CI/CD] PaymentRequestValidator 단위 테스트 시작");
        System.out.println("==================================================");

        PaymentRequestValidator validator = new PaymentRequestValidator();
        int passed = 0;
        int failed = 0;

        // Test 1: 정상 요청 통과
        try {
            PaymentRequest valid = new PaymentRequest("ORD-101", "MCH-01", 50000L, "CARD", "user@test.com");
            validator.validate(valid);
            System.out.println("[PASS] Test 1: 정상 결제 요청 통과");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 1: 정상 요청인데 예외 발생: " + e.getMessage());
            failed++;
        }

        // Test 2: orderId 누락
        try {
            PaymentRequest req = new PaymentRequest("", "MCH-01", 50000L, "CARD", "user@test.com");
            validator.validate(req);
            System.out.println("[FAIL] Test 2: 빈 orderId 예외 방어 실패");
            failed++;
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("INVALID_ORDER_ID")) {
                System.out.println("[PASS] Test 2: orderId 누락 방어 성공 (INVALID_ORDER_ID)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 2: 예외 메시지에 INVALID_ORDER_ID 포함 필요");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 2: 올바른 예외 미발생: " + e);
            failed++;
        }

        // Test 3: 금액 범위 오류 (최소 금액 미달)
        try {
            PaymentRequest req = new PaymentRequest("ORD-102", "MCH-01", 50L, "CARD", "user@test.com");
            validator.validate(req);
            System.out.println("[FAIL] Test 3: 100원 미만 금액 방어 실패");
            failed++;
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("INVALID_AMOUNT")) {
                System.out.println("[PASS] Test 3: 최소 금액 미달 방어 성공 (INVALID_AMOUNT)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 3: 예외 메시지에 INVALID_AMOUNT 포함 필요");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 3: 올바른 예외 미발생: " + e);
            failed++;
        }

        // Test 4: 미지원 결제 수단
        try {
            PaymentRequest req = new PaymentRequest("ORD-103", "MCH-01", 50000L, "BITCOIN", "user@test.com");
            validator.validate(req);
            System.out.println("[FAIL] Test 4: 미지원 결제 수단 방어 실패");
            failed++;
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("UNSUPPORTED_METHOD")) {
                System.out.println("[PASS] Test 4: 미지원 결제수단 방어 성공 (UNSUPPORTED_METHOD)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 4: 예외 메시지에 UNSUPPORTED_METHOD 포함 필요");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 4: 올바른 예외 미발생: " + e);
            failed++;
        }

        // Test 5: 이메일 형식 오류
        try {
            PaymentRequest req = new PaymentRequest("ORD-104", "MCH-01", 50000L, "CARD", "invalid-email");
            validator.validate(req);
            System.out.println("[FAIL] Test 5: 이메일 형식 오류 방어 실패");
            failed++;
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().contains("INVALID_EMAIL")) {
                System.out.println("[PASS] Test 5: 이메일 형식 오류 방어 성공 (INVALID_EMAIL)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 5: 예외 메시지에 INVALID_EMAIL 포함 필요");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 5: 올바른 예외 미발생: " + e);
            failed++;
        }

        System.out.println("--------------------------------------------------");
        System.out.println("테스트 결과: 총 5건 중 " + passed + "건 통과 / " + failed + "건 실패");
        if (failed == 0) {
            System.out.println(">>> [BUILD SUCCESS] 모든 테스트 통과! 코드 리뷰를 위해 PR을 생성해주세요.");
        } else {
            System.out.println(">>> [BUILD FAILURE] 실패한 테스트 케이스를 수정한 후 다시 실행해주세요.");
        }
        System.out.println("==================================================");
    }
}
