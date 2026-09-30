// NextSlack Messenger Logic
const Messenger = {
  currentTarget: "mentor", // 'mentor', 'lead', 'po'
  members: {
    mentor: {
      name: "김민우 대리 (사수 / 결제코어개발팀)",
      status: "온라인 (언제든 질문하세요!)"
    },
    lead: {
      name: "박수현 수석 (결제코어개발팀 팀장)",
      status: "회의 중 (급한 용무는 DM 남겨주세요)"
    },
    po: {
      name: "이지은 과장 (페이먼트 PO / 기획)",
      status: "온라인 (비즈니스 요구사항 문의 환영)"
    }
  },

  init() {
    // Channel selection
    document.querySelectorAll(".channel-item").forEach(item => {
      item.addEventListener("click", () => {
        document.querySelectorAll(".channel-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        this.currentTarget = item.getAttribute("data-chat-target");
        this.updateChatHeader();
      });
    });

    // Send button & enter key
    document.getElementById("btnSendChat").addEventListener("click", () => this.sendMessage());
    document.getElementById("chatInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  },

  updateChatHeader() {
    const member = this.members[this.currentTarget];
    document.getElementById("chatTargetName").textContent = member.name;
    document.getElementById("chatTargetStatus").textContent = member.status;
  },

  sendMessage() {
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (!msg) return;

    // Render my message
    this.appendMessage({
      sender: "나 (신입 엔지니어)",
      text: msg,
      isMine: true
    });

    input.value = "";

    // API Call
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        target_member: this.currentTarget,
        current_ticket: Editor.currentTicketId
      })
    })
      .then(res => res.json())
      .then(reply => {
        setTimeout(() => {
          this.appendMessage({
            sender: reply.sender,
            avatar: reply.avatar || "💬",
            text: reply.text,
            isMine: false
          });
        }, 300);
      })
      .catch(err => {
        showToast("메시지 전송 실패", "error");
      });
  },

  appendMessage(data) {
    const container = document.getElementById("chatMessages");
    const item = document.createElement("div");
    item.className = `msg-item ${data.isMine ? "mine" : ""}`;

    const avatarHtml = data.isMine ? "" : `<div class="msg-avatar">${data.avatar || "👨‍💻"}</div>`;

    item.innerHTML = `
      ${avatarHtml}
      <div class="msg-body">
        <div class="msg-sender">${data.sender} • 방금</div>
        <div class="msg-bubble">${data.text}</div>
      </div>
    `;

    container.appendChild(item);
    container.scrollTop = container.scrollHeight;
  }
};
