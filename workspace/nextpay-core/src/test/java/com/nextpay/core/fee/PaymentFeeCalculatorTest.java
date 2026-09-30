package com.nextpay.core.fee;

/**
 * [NEXTPAY-101] 수수료 계산기 검증 단위 테스트
 */
public class PaymentFeeCalculatorTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("[NextPay CI/CD] PaymentFeeCalculator 단위 테스트 시작");
        System.out.println("==================================================");

        PaymentFeeCalculator calculator = new PaymentFeeCalculator();
        int passed = 0;
        int failed = 0;

        // Test 1: 일반 결제 (100,000원, 수수료율 2.5% -> 2,500원)
        try {
            long fee = calculator.calculateFee(100000L, 0.025);
            if (fee == 2500L) {
                System.out.println("[PASS] Test 1: 일반 결제 수수료 계산 성공 (100,000원 * 2.5% = 2,500원)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 1: 일반 결제 수수료 실패 (예상: 2500원, 실제: " + fee + "원)");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 1 예외 발생: " + e.getMessage());
            failed++;
        }

        // Test 2: 소상공인 우대 수수료율 (33,000원, 0.8% -> 264원)
        try {
            long fee = calculator.calculateFee(33000L, 0.008);
            if (fee == 264L) {
                System.out.println("[PASS] Test 2: 소상공인 우대 수수료 계산 성공 (33,000원 * 0.8% = 264원)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 2: 소상공인 우대 수수료 실패 (예상: 264원, 실제: " + fee + "원 -> 0원 버그 점검 필요)");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 2 예외 발생: " + e.getMessage());
            failed++;
        }

        // Test 3: 최소 수수료 정책 (1,000원, 2.0% -> 계산상 20원이나 최소 수수료 정책으로 50원 반환)
        try {
            long fee = calculator.calculateFee(1000L, 0.02);
            if (fee == 50L) {
                System.out.println("[PASS] Test 3: 최소 수수료(50원) 정책 적용 성공");
                passed++;
            } else {
                System.out.println("[FAIL] Test 3: 최소 수수료 실패 (예상: 50원, 실제: " + fee + "원)");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 3 예외 발생: " + e.getMessage());
            failed++;
        }

        // Test 4: 소수점 반올림 정밀도 (10,550원, 1.25% -> 131.875 -> 132원)
        try {
            long fee = calculator.calculateFee(10550L, 0.0125);
            if (fee == 132L) {
                System.out.println("[PASS] Test 4: 소수점 반올림(HALF_UP) 검증 성공 (10,550원 * 1.25% = 132원)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 4: 반올림 실패 (예상: 132원, 실제: " + fee + "원)");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 4 예외 발생: " + e.getMessage());
            failed++;
        }

        // Test 5: 예외 처리 (금액 0 이하)
        try {
            calculator.calculateFee(-1000L, 0.02);
            System.out.println("[FAIL] Test 5: 음수 결제 금액 예외 방어 실패 (예외 미발생)");
            failed++;
        } catch (IllegalArgumentException e) {
            System.out.println("[PASS] Test 5: 유효하지 않은 파라미터 IllegalArgumentException 방어 성공");
            passed++;
        } catch (Exception e) {
            System.out.println("[FAIL] Test 5: 잘못된 예외 타입 발생: " + e.getClass().getName());
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
