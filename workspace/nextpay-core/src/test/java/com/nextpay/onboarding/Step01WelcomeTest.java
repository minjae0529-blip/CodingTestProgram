package com.nextpay.onboarding;

public class Step01WelcomeTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("[비트 코딩테스트 1단계] 환영 인사 테스트");
        System.out.println("==================================================");

        Step01Welcome app = new Step01Welcome();
        String result = app.getWelcomeMessage();

        System.out.println("출력된 결과: \"" + result + "\"");

        if ("Hello Beat!".equals(result) || "Hello NextPay!".equals(result)) {
            System.out.println("[PASS] 1단계 통과 성공! (+20점 획득)");
            System.out.println(">>> [BUILD SUCCESS] 채점관에게 제출하여 점수를 획득하세요!");
        } else {
            System.out.println("[FAIL] 아직 'Hello Beat!' 와 일치하지 않습니다.");
            System.out.println(">>> 힌트: return \"Hello Beat!\"; 로 작성해보세요.");
        }
        System.out.println("==================================================");
    }
}
