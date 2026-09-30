package com.nextpay.onboarding;

public class Step05SimpleDiscountTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("[신입 온보딩 최종 5단계] 10% 할인 금액 테스트");
        System.out.println("==================================================");

        Step05SimpleDiscount discount = new Step05SimpleDiscount();
        int passed = 0;

        if (discount.applyTenPercentDiscount(10000) == 9000) {
            System.out.println("[PASS] Case 1: 10,000원 -> 9,000원 성공");
            passed++;
        } else {
            System.out.println("[FAIL] Case 1: 10,000원 결과 오류 (실제: " + discount.applyTenPercentDiscount(10000) + ")");
        }

        if (discount.applyTenPercentDiscount(50000) == 45000) {
            System.out.println("[PASS] Case 2: 50,000원 -> 45,000원 성공");
            passed++;
        } else {
            System.out.println("[FAIL] Case 2: 50,000원 결과 오류");
        }

        if (discount.applyTenPercentDiscount(1000) == 900) {
            System.out.println("[PASS] Case 3: 1,000원 -> 900원 성공");
            passed++;
        } else {
            System.out.println("[FAIL] Case 3: 1,000원 결과 오류");
        }

        if (passed == 3) {
            System.out.println(">>> [BUILD SUCCESS] 5단계 최종 테스트 통과! (+20점 획득)");
            System.out.println(">>> 박수현 개발팀장님께 최종 제출하여 정직원 발령장을 수여받으세요!");
        } else {
            System.out.println(">>> [BUILD FAILURE] 힌트: return price * 90 / 100; 로 작성해보세요.");
        }
        System.out.println("==================================================");
    }
}
