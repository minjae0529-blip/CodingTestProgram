package com.nextpay.core.discount;

public class DiscountPolicyTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("[NextPay CI/CD] DiscountPolicy 단위 테스트 시작");
        System.out.println("==================================================");

        int passed = 0;
        int failed = 0;

        // Test 1: 정액할인 기본 (50,000원 결제 시 3,000원 할인)
        try {
            DiscountPolicy flat = new FlatDiscountPolicy(3000L);
            long discount = flat.calculateDiscount(50000L);
            if (discount == 3000L) {
                System.out.println("[PASS] Test 1: 정액할인 3,000원 적용 성공");
                passed++;
            } else {
                System.out.println("[FAIL] Test 1: 정액할인 실패 (예상 3000원, 실제 " + discount + "원)");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 1 예외: " + e.getMessage());
            failed++;
        }

        // Test 2: 정액할인이 원금보다 큰 경우 (2,000원 결제 시 5,000원 할인 쿠폰 -> 2,000원만 할인되어 결제액 0원)
        try {
            DiscountPolicy flat = new FlatDiscountPolicy(5000L);
            long discount = flat.calculateDiscount(2000L);
            if (discount == 2000L) {
                System.out.println("[PASS] Test 2: 원금 초과 할인 방어 성공 (할인액이 원금을 넘지 않음)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 2: 원금 초과 할인 실패 (예상 2000원, 실제 " + discount + "원)");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 2 예외: " + e.getMessage());
            failed++;
        }

        // Test 3: 정률할인 기본 (40,000원 결제, 15% 할인 -> 6,000원 할인, 한도 10,000원)
        try {
            DiscountPolicy rate = new RateDiscountPolicy(0.15, 10000L);
            long discount = rate.calculateDiscount(40000L);
            if (discount == 6000L) {
                System.out.println("[PASS] Test 3: 정률할인(15%) 계산 성공 (40,000원 * 15% = 6,000원)");
                passed++;
            } else {
                System.out.println("[FAIL] Test 3: 정률할인 계산 실패 (예상 6000원, 실제 " + discount + "원)");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 3 예외: " + e.getMessage());
            failed++;
        }

        // Test 4: 정률할인 한도 초과 (100,000원 결제, 20% 할인(20,000원)이나 최대 한도 5,000원 적용)
        try {
            DiscountPolicy rate = new RateDiscountPolicy(0.20, 5000L);
            long discount = rate.calculateDiscount(100000L);
            if (discount == 5000L) {
                System.out.println("[PASS] Test 4: 정률할인 최대 한도(5,000원) 캡 적용 성공");
                passed++;
            } else {
                System.out.println("[FAIL] Test 4: 정률할인 한도 실패 (예상 5000원, 실제 " + discount + "원)");
                failed++;
            }
        } catch (Exception e) {
            System.out.println("[FAIL] Test 4 예외: " + e.getMessage());
            failed++;
        }

        System.out.println("--------------------------------------------------");
        System.out.println("테스트 결과: 총 4건 중 " + passed + "건 통과 / " + failed + "건 실패");
        if (failed == 0) {
            System.out.println(">>> [BUILD SUCCESS] 모든 테스트 통과! 코드 리뷰를 위해 PR을 생성해주세요.");
        } else {
            System.out.println(">>> [BUILD FAILURE] 실패한 테스트 케이스를 수정한 후 다시 실행해주세요.");
        }
        System.out.println("==================================================");
    }
}
