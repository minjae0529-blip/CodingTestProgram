class ChatBot:
    def __init__(self):
        self.team_members = {
            "mentor": {
                "name": "김민우 멘토 (비트 코딩 튜터)",
                "role": "1·3단계 채점관 & 1:1 학습 튜터",
                "avatar": "👨‍💻",
                "status": "온라인 (언제든 질문하세요!)"
            },
            "po": {
                "name": "이지은 출제위원 (알고리즘 기획)",
                "role": "2·4단계 채점관 & 문제 출제",
                "avatar": "📋",
                "status": "온라인 (문제 설명 문의 환영)"
            },
            "lead": {
                "name": "박수현 수석 (비트 총괄 평가위원장)",
                "role": "5단계 최종 채점관 & 마스터 승인",
                "avatar": "👩‍💼",
                "status": "평가실 (100점 마스터 인증권자)"
            }
        }

    def reply(self, user_message, target_member="mentor", current_ticket="STEP-01"):
        msg = user_message.strip()
        lower = msg.lower()

        # 수석 평가위원장 (박수현)
        if target_member == "lead":
            if any(w in lower for w in ["5단계", "할인", "마스터", "졸업", "100점"]):
                return {
                    "sender": self.team_members["lead"]["name"],
                    "avatar": "👩‍💼",
                    "text": "5단계 10% 할인 금액 계산 문제는 비트 Lv.0의 최종 관문입니다! 원가 price에서 10%를 뺀 수식(price * 90 / 100)을 반환하시면 됩니다. 100점을 채우시면 제가 직접 비트 마스터 인증서를 발급해드릴게요!"
                }
            return {
                "sender": self.team_members["lead"]["name"],
                "avatar": "👩‍💼",
                "text": "도전자님, 비트 코딩테스트에 오신 것을 환영합니다! 비전공자라도 포기하지 않고 1단계부터 차근차근 점수를 쌓으시면 누구나 코딩테스트 기초를 완벽히 마스터할 수 있습니다. 김민우 튜터와 이지은 출제위원의 채점 가이드를 잘 따라와보세요!"
            }

        # 출제위원 (이지은)
        if target_member == "po":
            if any(w in lower for w in ["2단계", "더하기", "합", "sum"]):
                return {
                    "sender": self.team_members["po"]["name"],
                    "avatar": "📋",
                    "text": "2단계는 두 수를 더하는 기초 연산 문제입니다! 자바에서 더하기는 '+' 기호만 쓰면 됩니다. 'return a + b;' 로 한 줄만 적고 [단위 테스트 실행]을 눌러보세요!"
                }
            elif any(w in lower for w in ["4단계", "성인", "나이", "19"]):
                return {
                    "sender": self.team_members["po"]["name"],
                    "avatar": "📋",
                    "text": "4단계는 조건 비교 문제입니다. 나이가 19세 이상(age >= 19)일 때 true를 반환하면 됩니다. 'return age >= 19;' 로 작성하시면 바로 통과되어 20점을 드립니다!"
                }
            return {
                "sender": self.team_members["po"]["name"],
                "avatar": "📋",
                "text": "안녕하세요! 비트 출제위원 이지은입니다. 2단계(두 수의 합)와 4단계(성인 인증 비교) 채점을 담당하고 있어요. 문제 의도가 헷갈리시면 언제든 질문 남겨주세요!"
            }

        # 튜터 (김민우 멘토)
        if any(w in lower for w in ["1단계", "환영", "hello", "beat"]):
            return {
                "sender": self.team_members["mentor"]["name"],
                "avatar": "👨‍💻",
                "text": "1단계는 아주 간단해요! 글자를 돌려줄 때는 큰따옴표(\"\")로 감싸주면 됩니다. 'return \"Hello Beat!\";' 로 작성하고 [단위 테스트 실행] ➔ [채점관에게 제출]을 누르시면 제가 바로 20점을 찍어드릴게요!"
            }
        elif any(w in lower for w in ["3단계", "짝수", "홀수", "even"]):
            return {
                "sender": self.team_members["mentor"]["name"],
                "avatar": "👨‍💻",
                "text": "3단계는 2로 나눈 나머지(%)를 확인하면 됩니다! 'if (num % 2 == 0) return \"Even\"; else return \"Odd\";' 이렇게 작성하시면 됩니다. 막히면 에디터의 [💡 사수 힌트]를 눌러보세요!"
            }
        elif any(w in lower for w in ["점수", "어떻게", "제출", "마스터"]):
            return {
                "sender": self.team_members["mentor"]["name"],
                "avatar": "👨‍💻",
                "text": "에디터 상단에 [▶ 단위 테스트 실행]을 눌러서 통과한 뒤, 초록색 [📋 채점관에게 제출 & 점수 받기] 버튼을 누르시면 됩니다! 한 문제당 20점씩 누적되며 100점을 채우면 비트 마스터로 등극합니다 :)"
            }
        else:
            return {
                "sender": self.team_members["mentor"]["name"],
                "avatar": "👨‍💻",
                "text": f"네, 도전자님! 현재 {current_ticket} 과제 진행 중이신가요? 문법이나 로직이 헷갈리시면 '1단계 힌트 줘', '더하기 어떻게 해?', '짝수 홀수 알려줘' 처럼 언제든 편하게 물어보세요!"
            }
