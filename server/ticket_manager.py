import os

class TicketManager:
    def __init__(self, workspace_root):
        self.workspace_root = workspace_root
        self.user_score = 0
        self.completed_steps = set()

        self.onboarding_steps = {
            "STEP-01": {
                "id": "STEP-01",
                "level": "Lv.0 기초",
                "title": "[1단계] 비트 시작 인사 출력하기 (\"Hello Beat!\")",
                "type": "기초 과제",
                "priority": "필수 (P0)",
                "status": "In Progress",
                "assignee": "도전자 (나)",
                "reviewer": "김민우 멘토 (채점관)",
                "points": 20,
                "description": "비전공자를 위한 코딩테스트 '비트'의 첫걸음입니다! 콘솔/화면에 환영 문구 \"Hello Beat!\"를 반환하도록 작성해보세요.",
                "guide": "return \"Hello Beat!\"; 코드를 작성하면 됩니다. 큰따옴표(\"\")로 글자를 감싸주는 것이 핵심입니다.",
                "target_files": [
                    "src/main/java/com/nextpay/onboarding/Step01Welcome.java",
                    "src/test/java/com/nextpay/onboarding/Step01WelcomeTest.java"
                ]
            },
            "STEP-02": {
                "id": "STEP-02",
                "level": "Lv.0 기초",
                "title": "[2단계] 두 수의 합 구하기 (더하기 연산)",
                "type": "기초 과제",
                "priority": "필수 (P0)",
                "status": "To Do",
                "assignee": "도전자 (나)",
                "reviewer": "이지은 과장 (출제위원)",
                "points": 20,
                "description": "두 정수 a, b를 받아 합을 구하는 add(int a, int b) 메서드를 완성해주세요.",
                "guide": "return a + b; 더하기 기호(+)를 사용하여 두 변수를 더해주면 됩니다.",
                "target_files": [
                    "src/main/java/com/nextpay/onboarding/Step02Sum.java",
                    "src/test/java/com/nextpay/onboarding/Step02SumTest.java"
                ]
            },
            "STEP-03": {
                "id": "STEP-03",
                "level": "Lv.0 기초",
                "title": "[3단계] 짝수와 홀수 판별하기 (조건문 분기)",
                "type": "기초 과제",
                "priority": "필수 (P0)",
                "status": "To Do",
                "assignee": "도전자 (나)",
                "reviewer": "김민우 멘토 (채점관)",
                "points": 20,
                "description": "숫자 num이 짝수면 \"Even\", 홀수면 \"Odd\"를 반환하세요.",
                "guide": "나머지 연산자(%)를 사용합니다. if (num % 2 == 0) return \"Even\"; else return \"Odd\";",
                "target_files": [
                    "src/main/java/com/nextpay/onboarding/Step03EvenOdd.java",
                    "src/test/java/com/nextpay/onboarding/Step03EvenOddTest.java"
                ]
            },
            "STEP-04": {
                "id": "STEP-04",
                "level": "Lv.0 기초",
                "title": "[4단계] 성인 인증 조건 판별 (비교 연산자)",
                "type": "기초 과제",
                "priority": "필수 (P0)",
                "status": "To Do",
                "assignee": "도전자 (나)",
                "reviewer": "이지은 과장 (출제위원)",
                "points": 20,
                "description": "나이(age)가 만 19세 이상이면 true, 미만이면 false를 반환하세요.",
                "guide": "비교 연산자(>=)를 사용합니다. return age >= 19;",
                "target_files": [
                    "src/main/java/com/nextpay/onboarding/Step04AdultCheck.java",
                    "src/test/java/com/nextpay/onboarding/Step04AdultCheckTest.java"
                ]
            },
            "STEP-05": {
                "id": "STEP-05",
                "level": "Lv.0 기초",
                "title": "[5단계] 10% 할인 금액 계산기 (비트 최종 졸업)",
                "type": "기초 과제",
                "priority": "필수 (P0)",
                "status": "To Do",
                "assignee": "도전자 (나)",
                "reviewer": "박수현 수석 (수석 채점관)",
                "points": 20,
                "description": "원가 price에서 10%를 할인한 최종 금액을 정수(int)로 계산하세요. (10,000원 -> 9,000원)",
                "guide": "수식: return price * 90 / 100; 또는 return price - (price * 10 / 100);",
                "target_files": [
                    "src/main/java/com/nextpay/onboarding/Step05SimpleDiscount.java",
                    "src/test/java/com/nextpay/onboarding/Step05SimpleDiscountTest.java"
                ]
            }
        }

        self.pro_tickets = {
            "NEXTPAY-101": {
                "id": "NEXTPAY-101",
                "level": "실무 응용",
                "title": "[실무 응용] 정밀 결제 수수료 계산 버그 픽스 (BigDecimal)",
                "type": "심화 과제",
                "priority": "도전 (P0)",
                "status": "To Do",
                "assignee": "도전자 (나)",
                "reviewer": "김민우 멘토",
                "points": 50,
                "description": "정밀 소수점 연산(BigDecimal)과 최소 수수료 50원 보장 정책을 구현합니다.",
                "guide": "Math.max(calculated, MINIMUM_FEE)와 BigDecimal 연산을 적용하세요.",
                "target_files": [
                    "src/main/java/com/nextpay/core/fee/PaymentFeeCalculator.java",
                    "src/test/java/com/nextpay/core/fee/PaymentFeeCalculatorTest.java"
                ]
            }
        }

    def get_user_status(self):
        grade = "비트 입문자 (Lv.0)"
        if self.user_score >= 100:
            grade = "🎉 비트 마스터 (Lv.1 합격 / 100점 달성!)"
        elif self.user_score >= 60:
            grade = "비트 중급 도전자 (Lv.0.6)"
        elif self.user_score >= 20:
            grade = "비트 초급 도전자 (Lv.0.2)"

        return {
            "score": self.user_score,
            "max_score": 100,
            "grade": grade,
            "completed_count": len(self.completed_steps)
        }

    def get_all_tasks(self):
        items = list(self.onboarding_steps.values()) + list(self.pro_tickets.values())
        return items

    def get_task(self, task_id):
        if task_id in self.onboarding_steps:
            return self.onboarding_steps[task_id]
        return self.pro_tickets.get(task_id)

    def submit_code(self, task_id):
        if task_id == "STEP-01":
            file_path = os.path.join(self.workspace_root, "src/main/java/com/nextpay/onboarding/Step01Welcome.java")
            with open(file_path, "r", encoding="utf-8") as f:
                code = f.read()

            if "Hello Beat!" in code or "Hello NextPay!" in code:
                return self._pass_task("STEP-01", 20, "김민우 멘토 (채점관)",
                    "첫 문제 정답입니다! 비트 코딩테스트의 첫 단추를 멋지게 꿰셨네요. 자바 문자열 반환 문법을 완벽히 이해하셨습니다. +20점 적립 완료!",
                    next_id="STEP-02")
            else:
                return self._fail_task("김민우 멘토 (채점관)", "아직 \"Hello Beat!\" 문자열이 반환되지 않았어요. return \"Hello Beat!\"; 로 적어보세요!")

        elif task_id == "STEP-02":
            file_path = os.path.join(self.workspace_root, "src/main/java/com/nextpay/onboarding/Step02Sum.java")
            with open(file_path, "r", encoding="utf-8") as f:
                code = f.read()

            if "a + b" in code or "b + a" in code:
                return self._pass_task("STEP-02", 20, "이지은 과장 (출제위원)",
                    "두 수의 합산 테스트 정답입니다! 비전공자도 쉽게 이해할 수 있는 더하기 연산을 완벽하게 통과하셨습니다! +20점 적립!",
                    next_id="STEP-03")
            else:
                return self._fail_task("이지은 과장 (출제위원)", "a와 b를 더한 값이 반환되지 않았습니다. return a + b; 를 작성해보세요!")

        elif task_id == "STEP-03":
            file_path = os.path.join(self.workspace_root, "src/main/java/com/nextpay/onboarding/Step03EvenOdd.java")
            with open(file_path, "r", encoding="utf-8") as f:
                code = f.read()

            if "Even" in code and "Odd" in code and "%" in code:
                return self._pass_task("STEP-03", 20, "김민우 멘토 (채점관)",
                    "짝수/홀수 조건문 분기 테스트 정답입니다! 핵심 알고리즘의 기초인 조건 분기를 훌륭히 구현하셨습니다. +20점 적립!",
                    next_id="STEP-04")
            else:
                return self._fail_task("김민우 멘토 (채점관)", "나머지 연산자(%)와 조건문(if-else)을 활용하여 Even과 Odd를 반환하도록 작성해보세요!")

        elif task_id == "STEP-04":
            file_path = os.path.join(self.workspace_root, "src/main/java/com/nextpay/onboarding/Step04AdultCheck.java")
            with open(file_path, "r", encoding="utf-8") as f:
                code = f.read()

            if "19" in code and (">=" in code or "> 18" in code):
                return self._pass_task("STEP-04", 20, "이지은 과장 (출제위원)",
                    "성인 인증 비교 조건식 정답입니다! boolean(참/거짓) 논리 연산의 핵심을 정확히 짚어내셨습니다. +20점 적립!",
                    next_id="STEP-05")
            else:
                return self._fail_task("이지은 과장 (출제위원)", "19세 이상(age >= 19)일 때 true가 반환되도록 작성해주세요!")

        elif task_id == "STEP-05":
            file_path = os.path.join(self.workspace_root, "src/main/java/com/nextpay/onboarding/Step05SimpleDiscount.java")
            with open(file_path, "r", encoding="utf-8") as f:
                code = f.read()

            if ("90" in code and "/ 100" in code) or ("10" in code and "/ 100" in code and "price -" in code) or ("0.9" in code):
                return self._pass_task("STEP-05", 20, "박수현 수석 (수석 채점관)",
                    "🎊 축하합니다! 비트 코딩테스트 Lv.0 전 과정을 통과하여 총 100점 만점을 달성하셨습니다! 비전공자 맞춤 기초 트레이닝을 훌륭하게 완주하셨습니다!",
                    next_id="NEXTPAY-101")
            else:
                return self._fail_task("박수현 수석 (수석 채점관)", "10% 할인 금액 계산 수식을 다시 확인해주세요. 힌트: price * 90 / 100")

        elif task_id == "NEXTPAY-101":
            file_path = os.path.join(self.workspace_root, "src/main/java/com/nextpay/core/fee/PaymentFeeCalculator.java")
            with open(file_path, "r", encoding="utf-8") as f:
                code = f.read()

            if "50" in code and "IllegalArgumentException" in code and not "return 0L;" in code:
                return self._pass_task("NEXTPAY-101", 50, "김민우 멘토 (채점관)",
                    "심화 실무 과제 완벽 통과! 정밀 소수점 연산과 예외 처리가 아주 훌륭합니다!",
                    next_id=None)
            else:
                return self._fail_task("김민우 멘토 (채점관)", "최소 수수료 50원 정책과 유효성 검사 예외 처리를 확인해주세요.")

        return self._fail_task("채점관", "작업 대상 파일을 확인해주세요.")

    def _pass_task(self, task_id, points, reviewer, message, next_id=None):
        is_first = task_id not in self.completed_steps
        if is_first:
            self.completed_steps.add(task_id)
            self.user_score += points

        if task_id in self.onboarding_steps:
            self.onboarding_steps[task_id]["status"] = "Done"
        elif task_id in self.pro_tickets:
            self.pro_tickets[task_id]["status"] = "Done"

        if next_id:
            if next_id in self.onboarding_steps:
                self.onboarding_steps[next_id]["status"] = "In Progress"
            elif next_id in self.pro_tickets:
                self.pro_tickets[next_id]["status"] = "In Progress"

        status = self.get_user_status()

        return {
            "approved": True,
            "points_earned": points if is_first else 0,
            "total_score": self.user_score,
            "grade": status["grade"],
            "reviewer": reviewer,
            "title": f"🎉 채점 통과! (+{points}점 획득)" if is_first else "✅ 통과 (점수 획득 완료)",
            "summary": message,
            "next_id": next_id
        }

    def _fail_task(self, reviewer, message):
        return {
            "approved": False,
            "points_earned": 0,
            "total_score": self.user_score,
            "reviewer": reviewer,
            "title": "⚠️ 오답 (보완 필요)",
            "summary": message
        }
