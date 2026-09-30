package com.nextpay.onboarding;

public class Step04AdultCheckTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("[신입 온보딩 평가 4단계] 성인 인증 테스트");
        System.out.println("==================================================");

        Step04AdultCheck checker = new Step04AdultCheck();
        int passed = 0;

        if (checker.canPurchase(20)) {
            System.out.println("[PASS] Case 1: 20세 -> 구매 가능(true) 통과");
            passed++;
        } else {
            System.out.println("[FAIL] Case 1: 20세는 true여야 합니다.");
        }

        if (checker.canPurchase(19)) {
            System.out.println("[PASS] Case 2: 19세(경계값) -> 구매 가능(true) 통과");
            passed++;
        } else {
            System.out.println("[FAIL] Case 2: 19세는 true여야 합니다. (>= 기호 확인)");
        }

        if (!checker.canPurchase(17)) {
            System.out.println("[PASS] Case 3: 17세 -> 구매 불가(false) 통과");
            passed++;
        } else {
            System.out.println("[FAIL] Case 3: 17세는 false여야 합니다.");
        }

        if (passed == 3) {
            System.out.println(">>> [BUILD SUCCESS] 4단계 모든 테스트 통과! (+20점 획득)");
            System.out.println(">>> 이지은 과장님께 제출하여 점수를 누적하세요!");
        } else {
            System.out.println(">>> [BUILD FAILURE] 힌트: return age >= 19; 로 작성해보세요.");
        }
        System.out.println("==================================================");
    }
}
