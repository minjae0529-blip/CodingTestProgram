// NextIDE Code Editor Logic (Onboarding, Clear Answer Zone & Quick Input)
const Editor = {
  currentTaskId: "STEP-01",
  currentFilePath: "src/main/java/com/nextpay/onboarding/Step01Welcome.java",
  nextTaskId: null,
  textarea: null,
  lineNumbers: null,

  taskFileMap: {
    "STEP-01": "src/main/java/com/nextpay/onboarding/Step01Welcome.java",
    "STEP-02": "src/main/java/com/nextpay/onboarding/Step02Sum.java",
    "STEP-03": "src/main/java/com/nextpay/onboarding/Step03EvenOdd.java",
    "STEP-04": "src/main/java/com/nextpay/onboarding/Step04AdultCheck.java",
    "STEP-05": "src/main/java/com/nextpay/onboarding/Step05SimpleDiscount.java",
    "USER_MAIN": "src/main/java/com/korai/study/ch05/UserMain.java",
    "NEXTPAY-101": "src/main/java/com/nextpay/core/fee/PaymentFeeCalculator.java"
  },

  guideInfoMap: {
    "STEP-01": {
      guideText: '아래 11번째 줄의 return ""; 에서 큰따옴표("") 안에 Hello Beat! 를 적으세요!',
      placeholder: '예: Hello Beat!',
      quickFill: (val) => `package com.nextpay.onboarding;

public class Step01Welcome {

    public String getWelcomeMessage() {

        // =================================================================
        // 👇👇👇 [1단계 정답 작성란] 아래 줄의 큰따옴표("") 사이에 답을 적어주세요!
        // =================================================================

        return "${val}";

        // 👆👆👆 [작성 끝]
        // =================================================================
    }

    public static void main(String[] args) {
        Step01Welcome welcome = new Step01Welcome();
        System.out.println("결과: " + welcome.getWelcomeMessage());
    }
}
`
    },
    "STEP-02": {
      guideText: '아래 11번째 줄의 return 0; 에서 0 대신 a + b 를 적으세요!',
      placeholder: '예: a + b',
      quickFill: (val) => `package com.nextpay.onboarding;

public class Step02Sum {

    public int add(int a, int b) {

        // =================================================================
        // 👇👇👇 [2단계 정답 작성란] 아래 0 대신 a + b 를 적어주세요!
        // =================================================================

        return ${val};

        // 👆👆👆 [작성 끝]
        // =================================================================
    }
}
`
    },
    "STEP-03": {
      guideText: '아래 11번째 줄의 return ""; 대신 짝수/홀수 판별 코드를 적으세요!',
      placeholder: '예: Even / Odd 조건문',
      quickFill: (val) => `package com.nextpay.onboarding;

public class Step03EvenOdd {

    public String checkEvenOrOdd(int num) {

        // =================================================================
        // 👇👇👇 [3단계 정답 작성란] 짝수면 "Even", 홀수면 "Odd"를 반환해주세요!
        // =================================================================

        if (num % 2 == 0) {
            return "Even";
        } else {
            return "Odd";
        }

        // 👆👆👆 [작성 끝]
        // =================================================================
    }
}
`
    },
    "STEP-04": {
      guideText: '아래 11번째 줄의 return false; 에서 false 대신 age >= 19 를 적으세요!',
      placeholder: '예: age >= 19',
      quickFill: (val) => `package com.nextpay.onboarding;

public class Step04AdultCheck {

    public boolean canPurchase(int age) {

        // =================================================================
        // 👇👇👇 [4단계 정답 작성란] 아래 false 대신 age >= 19 를 적어주세요!
        // =================================================================

        return ${val};

        // 👆👆👆 [작성 끝]
        // =================================================================
    }
}
`
    },
    "STEP-05": {
      guideText: '아래 11번째 줄의 return 0; 에서 0 대신 price * 90 / 100 을 적으세요!',
      placeholder: '예: price * 90 / 100',
      quickFill: (val) => `package com.nextpay.onboarding;

public class Step05SimpleDiscount {

    public int applyTenPercentDiscount(int price) {

        // =================================================================
        // 👇👇👇 [5단계 정답 작성란] 아래 0 대신 10% 할인 금액 수식을 적어주세요!
        // =================================================================

        return ${val};

        // 👆👆👆 [작성 끝]
        // =================================================================
    }
}
`
    },
    "USER_MAIN": {
      guideText: '수업 예제 코드입니다! 상단 [▶ 단위 테스트 실행]을 누르면 전체 유저와 남성 필터링 결과가 출력됩니다.',
      placeholder: '실행 버튼을 눌러보세요',
      quickFill: null
    },
    "NEXTPAY-101": {
      guideText: 'PaymentFeeCalculator.java 파일의 calculateFee 메서드 안을 수정하세요.',
      placeholder: '수수료 계산 수식',
      quickFill: null
    }
  },

  init() {
    this.textarea = document.getElementById("codeEditor");
    this.lineNumbers = document.getElementById("lineNumbers");

    this.textarea.addEventListener("input", () => this.updateLineNumbers());
    this.textarea.addEventListener("scroll", () => {
      this.lineNumbers.scrollTop = this.textarea.scrollTop;
    });

    this.textarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const val = this.textarea.value;
        this.textarea.value = val.substring(0, start) + "    " + val.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
        this.updateLineNumbers();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        this.saveCurrentFile();
      }
    });

    // Dropdown change
    const dropdown = document.getElementById("selectTaskDropdown");
    dropdown.addEventListener("change", (e) => {
      this.switchTask(e.target.value);
    });

    // Action buttons
    document.getElementById("btnSaveFile").addEventListener("click", () => this.saveCurrentFile());
    document.getElementById("btnRunTest").addEventListener("click", () => this.runTest());
    document.getElementById("btnSubmitTask").addEventListener("click", () => this.submitCode());
    document.getElementById("btnHint").addEventListener("click", () => this.showHint());
    document.getElementById("btnClearConsole").addEventListener("click", () => this.clearConsole());

    // Quick Input Bar
    const quickBtn = document.getElementById("btnApplyQuickAnswer");
    const quickInput = document.getElementById("quickAnswerInput");

    quickBtn.addEventListener("click", () => this.applyQuickInput());
    quickInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.applyQuickInput();
      }
    });

    // Console tabs
    document.querySelectorAll(".console-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".console-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const type = tab.getAttribute("data-con");
        if (type === "terminal") {
          document.getElementById("consoleTerminal").style.display = "block";
          document.getElementById("consoleReview").style.display = "none";
        } else {
          document.getElementById("consoleTerminal").style.display = "none";
          document.getElementById("consoleReview").style.display = "block";
        }
      });
    });

    // Modal buttons
    document.getElementById("btnApplyHint").addEventListener("click", () => this.applyHintCode());
    document.getElementById("btnCloseHintModal").addEventListener("click", () => {
      document.getElementById("hintModal").style.display = "none";
    });
    document.getElementById("btnCloseSubmitModal").addEventListener("click", () => {
      document.getElementById("submitResultModal").style.display = "none";
    });
    document.getElementById("btnNextStep").addEventListener("click", () => {
      document.getElementById("submitResultModal").style.display = "none";
      if (this.nextTaskId) {
        this.switchTask(this.nextTaskId);
      }
    });

    // Initial load
    this.switchTask(this.currentTaskId);
  },

  switchTask(taskId) {
    this.currentTaskId = taskId;
    const dropdown = document.getElementById("selectTaskDropdown");
    dropdown.value = taskId;

    // Update Guide Banner & Quick Input
    const info = this.guideInfoMap[taskId] || this.guideInfoMap["STEP-01"];
    document.getElementById("answerLocationText").textContent = info.guideText;
    const quickInput = document.getElementById("quickAnswerInput");
    quickInput.placeholder = info.placeholder;
    quickInput.value = "";

    const relPath = this.taskFileMap[taskId] || "src/main/java/com/nextpay/onboarding/Step01Welcome.java";
    this.loadFile(relPath);
  },

  applyQuickInput() {
    const input = document.getElementById("quickAnswerInput");
    const val = input.value.trim();
    if (!val) {
      showToast("간편 정답 입력창에 작성할 내용을 입력해주세요!", "warning");
      return;
    }

    const info = this.guideInfoMap[this.currentTaskId];
    if (info && info.quickFill) {
      const code = info.quickFill(val);
      this.textarea.value = code;
      this.updateLineNumbers();
      this.saveCurrentFile();
      showToast(`✨ 작성하신 답 [${val}]이(가) 코드에 바로 채워졌습니다! [단위 테스트 실행]을 눌러보세요.`);
    } else {
      this.applyHintCode();
    }
  },

  updateLineNumbers() {
    const lines = this.textarea.value.split("\n").length;
    let numbers = "";
    for (let i = 1; i <= lines; i++) {
      numbers += i + "\n";
    }
    this.lineNumbers.textContent = numbers;
  },

  loadFile(relPath) {
    this.currentFilePath = relPath;
    document.getElementById("ideActiveFilePath").textContent = relPath.split("/").pop();

    document.querySelectorAll(".tree-node").forEach(node => {
      if (node.getAttribute("data-path") === relPath) {
        node.classList.add("active-file");
      } else {
        node.classList.remove("active-file");
      }
    });

    fetch(`/api/file?path=${encodeURIComponent(relPath)}`)
      .then(res => res.json())
      .then(data => {
        if (data.content !== undefined) {
          this.textarea.value = data.content;
          this.updateLineNumbers();
        }
      })
      .catch(() => {
        showToast("파일 로드 실패", "error");
      });
  },

  saveCurrentFile(silent = false) {
    const content = this.textarea.value;
    return fetch("/api/file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: this.currentFilePath,
        content: content
      })
    })
      .then(res => res.json())
      .then(() => {
        if (!silent) {
          showToast("💾 파일이 저장되었습니다!");
        }
        return true;
      })
      .catch(() => {
        showToast("파일 저장 실패", "error");
        return false;
      });
  },

  async runTest() {
    await this.saveCurrentFile(true);
    const term = document.getElementById("consoleTerminal");
    term.textContent = `[NextPay Runner] 검증 테스트 시작...\n과제: ${this.currentTaskId}\n잠시만 기다려주세요...\n\n`;

    document.querySelector('.console-tab[data-con="terminal"]').click();

    fetch("/api/run_test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id: this.currentTaskId })
    })
      .then(res => res.json())
      .then(data => {
        term.textContent = data.output;
        if (data.passed) {
          showToast("🎉 테스트 통과! 상사(과장/팀장)께 제출하고 점수를 받으세요.");
        } else {
          showToast("⚠️ 테스트에 실패했습니다. 힌트를 확인해보세요.", "warning");
        }
      })
      .catch(err => {
        term.textContent += "\n[오류] 테스트 실패: " + err;
      });
  },

  async submitCode() {
    await this.saveCurrentFile(true);
    showToast("📋 상사(과장/팀장)에게 과제를 제출했습니다. 채점 중...");

    fetch("/api/submit_code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: this.currentTaskId })
    })
      .then(res => res.json())
      .then(result => {
        this.nextTaskId = result.next_id;
        this.renderSubmitModal(result);
        this.renderSubmitConsole(result);
        App.loadUserStatus();
        App.loadQuests();
        App.loadTickets();
      })
      .catch(() => {
        showToast("제출 통신 오류", "error");
      });
  },

  renderSubmitModal(res) {
    const modal = document.getElementById("submitResultModal");
    const banner = document.getElementById("submitModalBanner");
    const bannerText = document.getElementById("submitBannerText");
    const stamp = document.getElementById("submitStamp");
    const summary = document.getElementById("submitModalSummary");
    const reviewer = document.getElementById("submitReviewer");
    const score = document.getElementById("submitTotalScore");
    const grade = document.getElementById("submitGrade");
    const nextBtn = document.getElementById("btnNextStep");

    reviewer.textContent = res.reviewer || "채점관";
    score.textContent = `${res.total_score} / 100점`;
    grade.textContent = res.grade || "수습 사원";
    summary.textContent = res.summary || "";

    if (res.approved) {
      banner.style.background = "rgba(16, 185, 129, 0.2)";
      banner.style.border = "1px solid #10b981";
      banner.style.color = "#34d399";
      bannerText.innerHTML = `<strong>${res.title}</strong><br>채점관의 결재가 완료되었습니다!`;
      stamp.style.display = "block";
      stamp.textContent = "결재완료";
      stamp.style.borderColor = "#10b981";
      stamp.style.color = "#10b981";

      if (res.next_id) {
        nextBtn.style.display = "inline-flex";
        nextBtn.textContent = `다음 단계(${res.next_id})로 이동하기 ➔`;
      } else {
        nextBtn.textContent = "확인";
      }
    } else {
      banner.style.background = "rgba(239, 68, 68, 0.2)";
      banner.style.border = "1px solid #ef4444";
      banner.style.color = "#f87171";
      bannerText.innerHTML = `<strong>${res.title}</strong><br>아직 요구사항이 충족되지 않았습니다.`;
      stamp.style.display = "block";
      stamp.textContent = "반려(보완)";
      stamp.style.borderColor = "#ef4444";
      stamp.style.color = "#ef4444";
      nextBtn.textContent = "다시 풀기";
    }

    modal.style.display = "flex";
  },

  renderSubmitConsole(res) {
    const revCons = document.getElementById("consoleReview");
    let txt = `==================================================\n`;
    txt += `[상사 결재 및 평가 리포트]\n`;
    txt += `결과: ${res.approved ? "승인 (점수 적립 성공!)" : "보완 요청"}\n`;
    txt += `채점관: ${res.reviewer}\n`;
    txt += `누적 온보딩 점수: ${res.total_score}점 / 100점\n`;
    txt += `사원 등급: ${res.grade}\n`;
    txt += `==================================================\n\n`;
    txt += `[채점관 한마디]\n${res.summary}\n`;
    revCons.textContent = txt;
  },

  showHint() {
    const modal = document.getElementById("hintModal");
    const body = document.getElementById("hintModalBody");

    const hints = {
      "STEP-01": {
        title: "[1단계] 비트 시작 인사 힌트",
        desc: "문자열을 돌려줄 때는 큰따옴표(\"\")로 감싸서 반환(return)하면 됩니다.",
        code: `return "Hello Beat!";`
      },
      "STEP-02": {
        title: "[2단계] 두 수의 합 힌트",
        desc: "더하기 기호(+)를 사용하여 a와 b를 더한 값을 반환하세요.",
        code: `return a + b;`
      },
      "STEP-03": {
        title: "[3단계] 짝수/홀수 판별 힌트",
        desc: "2로 나눈 나머지(%)가 0이면 짝수(Even), 아니면 홀수(Odd)입니다.",
        code: `if (num % 2 == 0) {\n    return "Even";\n} else {\n    return "Odd";\n}`
      },
      "STEP-04": {
        title: "[4단계] 성인 인증 힌트",
        desc: "19세 이상인지 비교 연산자(>=)로 판별합니다.",
        code: `return age >= 19;`
      },
      "STEP-05": {
        title: "[5단계] 10% 할인 금액 계산 힌트",
        desc: "원래 금액의 90%를 계산하면 10% 할인가가 됩니다.",
        code: `return price * 90 / 100;`
      },
      "NEXTPAY-101": {
        title: "[실무] 소상공인 수수료 핫픽스 힌트",
        desc: "BigDecimal과 최소 수수료 50원 정책을 적용하세요.",
        code: `if (amount <= 0 || feeRate <= 0.0 || feeRate > 1.0) {\n    throw new IllegalArgumentException("유효하지 않은 값");\n}\nBigDecimal amt = BigDecimal.valueOf(amount);\nBigDecimal rate = BigDecimal.valueOf(feeRate);\nlong calculated = amt.multiply(rate).setScale(0, RoundingMode.HALF_UP).longValue();\nreturn Math.max(calculated, MINIMUM_FEE);`
      }
    };

    const hint = hints[this.currentTaskId] || hints["STEP-01"];
    body.innerHTML = `
      <h4 style="color:#60a5fa; margin-bottom:8px;">💡 ${hint.title}</h4>
      <p style="color:#cbd5e1; margin-bottom:12px;">${hint.desc}</p>
      <div style="background:#0b0f17; border:1px solid #334155; padding:12px; border-radius:6px;">
        <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:6px;">추천 정답 코드:</div>
        <pre style="color:#38bdf8; font-family:monospace; font-size:13px; margin:0;">${hint.code}</pre>
      </div>
      <p style="font-size:0.8rem; color:#94a3b8; margin-top:10px;">하단 [정답 코드를 에디터에 자동 채우기] 버튼을 누르면 에디터에 자동 적용됩니다.</p>
    `;

    modal.style.display = "flex";
  },

  applyHintCode() {
    const solutions = {
      "STEP-01": `package com.nextpay.onboarding;

public class Step01Welcome {

    public String getWelcomeMessage() {

        // =================================================================
        // 👇👇👇 [1단계 정답 작성란] 아래 줄의 큰따옴표("") 사이에 답을 적어주세요!
        // =================================================================

        return "Hello Beat!";

        // 👆👆👆 [작성 끝]
        // =================================================================
    }

    public static void main(String[] args) {
        Step01Welcome welcome = new Step01Welcome();
        System.out.println("결과: " + welcome.getWelcomeMessage());
    }
}
`,
      "STEP-02": `package com.nextpay.onboarding;

public class Step02Sum {

    public int add(int a, int b) {

        // =================================================================
        // 👇👇👇 [2단계 정답 작성란] 아래 0 대신 a + b 를 적어주세요!
        // =================================================================

        return a + b;

        // 👆👆👆 [작성 끝]
        // =================================================================
    }
}
`,
      "STEP-03": `package com.nextpay.onboarding;

public class Step03EvenOdd {

    public String checkEvenOrOdd(int num) {

        // =================================================================
        // 👇👇👇 [3단계 정답 작성란] 짝수면 "Even", 홀수면 "Odd"를 반환해주세요!
        // =================================================================

        if (num % 2 == 0) {
            return "Even";
        } else {
            return "Odd";
        }

        // 👆👆👆 [작성 끝]
        // =================================================================
    }
}
`,
      "STEP-04": `package com.nextpay.onboarding;

public class Step04AdultCheck {

    public boolean canPurchase(int age) {

        // =================================================================
        // 👇👇👇 [4단계 정답 작성란] 아래 false 대신 age >= 19 를 적어주세요!
        // =================================================================

        return age >= 19;

        // 👆👆👆 [작성 끝]
        // =================================================================
    }
}
`,
      "STEP-05": `package com.nextpay.onboarding;

public class Step05SimpleDiscount {

    public int applyTenPercentDiscount(int price) {

        // =================================================================
        // 👇👇👇 [5단계 정답 작성란] 아래 0 대신 10% 할인 금액 수식을 적어주세요!
        // =================================================================

        return price * 90 / 100;

        // 👆👆👆 [작성 끝]
        // =================================================================
    }
}
`,
      "NEXTPAY-101": `package com.nextpay.core.fee;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PaymentFeeCalculator {

    public static final long MINIMUM_FEE = 50L;

    public long calculateFee(long amount, double feeRate) {
        if (amount <= 0 || feeRate <= 0.0 || feeRate > 1.0) {
            throw new IllegalArgumentException("유효하지 않은 결제 금액 또는 수수료율입니다.");
        }

        BigDecimal amt = BigDecimal.valueOf(amount);
        BigDecimal rate = BigDecimal.valueOf(feeRate);
        long calculatedFee = amt.multiply(rate).setScale(0, RoundingMode.HALF_UP).longValue();

        return Math.max(calculatedFee, MINIMUM_FEE);
    }
}
`
    };

    const sol = solutions[this.currentTaskId];
    if (sol) {
      this.textarea.value = sol;
      this.updateLineNumbers();
      this.saveCurrentFile();
      document.getElementById("hintModal").style.display = "none";
      showToast("💡 정답 코드가 에디터에 적용되었습니다! 이제 [단위 테스트 실행]을 눌러보세요.");
    }
  },

  clearConsole() {
    document.getElementById("consoleTerminal").textContent = "";
  }
};
