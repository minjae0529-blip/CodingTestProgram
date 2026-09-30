package com.nextpay.onboarding;

public class Step02SumTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("[신입 온보딩 평가 2단계] 두 수의 합 테스트");
        System.out.println("==================================================");

        Step02Sum solver = new Step02Sum();
        int passed = 0;

        if (solver.add(10, 20) == 30) {
            System.out.println("[PASS] Case 1: add(10, 20) = 30 성공");
            passed++;
        } else {
            System.out.println("[FAIL] Case 1: add(10, 20) 실패 (예상 30, 실제 " + solver.add(10, 20) + ")");
        }

        if (solver.add(125, 75) == 200) {
            System.out.println("[PASS] Case 2: add(125, 75) = 200 성공");
            passed++;
        } else {
            System.out.println("[FAIL] Case 2: add(125, 75) 실패");
        }

        if (passed == 2) {
            System.out.println(">>> [BUILD SUCCESS] 2단계 모든 테스트 통과! (+20점 획득)");
            System.out.println(">>> 이지은 과장님께 제출하여 점수를 누적하세요!");
        } else {
            System.out.println(">>> [BUILD FAILURE] 힌트: return a + b; 로 작성해보세요.");
        }
        System.out.println("==================================================");
    }
}
