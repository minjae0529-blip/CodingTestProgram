package com.nextpay.onboarding;

public class Step03EvenOddTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("[신입 온보딩 평가 3단계] 짝수/홀수 판별 테스트");
        System.out.println("==================================================");

        Step03EvenOdd solver = new Step03EvenOdd();
        int passed = 0;

        if ("Even".equals(solver.checkEvenOrOdd(4))) {
            System.out.println("[PASS] Case 1: 4는 짝수(Even) 통과");
            passed++;
        } else {
            System.out.println("[FAIL] Case 1: 4는 Even 이어야 합니다.");
        }

        if ("Odd".equals(solver.checkEvenOrOdd(7))) {
            System.out.println("[PASS] Case 2: 7은 홀수(Odd) 통과");
            passed++;
        } else {
            System.out.println("[FAIL] Case 2: 7은 Odd 이어야 합니다.");
        }

        if ("Even".equals(solver.checkEvenOrOdd(0))) {
            System.out.println("[PASS] Case 3: 0은 짝수(Even) 통과");
            passed++;
        } else {
            System.out.println("[FAIL] Case 3: 0은 Even 이어야 합니다.");
        }

        if (passed == 3) {
            System.out.println(">>> [BUILD SUCCESS] 3단계 모든 테스트 통과! (+20점 획득)");
            System.out.println(">>> 사수 김민우 대리에게 제출하여 점수를 누적하세요!");
        } else {
            System.out.println(">>> [BUILD FAILURE] 조건문(if (num % 2 == 0))을 다시 확인해보세요.");
        }
        System.out.println("==================================================");
    }
}
