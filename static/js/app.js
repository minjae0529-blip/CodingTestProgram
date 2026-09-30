// Main Application Logic (Onboarding & Score Dashboard)
const App = {
  tasks: [],

  init() {
    this.bindNavigation();
    this.loadUserStatus();
    this.loadFileTree();
    this.loadQuests();
    this.loadTickets();

    Editor.init();
    Messenger.init();
  },

  bindNavigation() {
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const targetView = tab.getAttribute("data-view");
        document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
        const targetSection = document.getElementById(`view-${targetView}`);
        if (targetSection) {
          targetSection.classList.add("active");
        }
      });
    });
  },

  loadUserStatus() {
    fetch("/api/user_status")
      .then(res => res.json())
      .then(data => {
        const scoreElem = document.getElementById("headerUserScore");
        const barElem = document.getElementById("headerScoreBar");
        const gradeElem = document.getElementById("headerUserGrade");

        scoreElem.textContent = data.score;
        barElem.style.width = `${Math.min(data.score, 100)}%`;
        gradeElem.textContent = `(${data.grade})`;
      })
      .catch(() => {});
  },

  loadQuests() {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => {
        this.tasks = data.tasks;
        this.renderQuests(data.tasks);
      });
  },

  renderQuests(tasks) {
    const container = document.getElementById("questListContainer");
    container.innerHTML = "";

    tasks.filter(t => t.level === "Lv.0 기초").forEach(task => {
      const isDone = task.status === "Done";
      const card = document.createElement("div");
      card.className = `quest-card ${isDone ? "done" : ""}`;

      card.innerHTML = `
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 0.75rem; background: ${isDone ? "#10b981" : "#3b82f6"}; color: white; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
              ${task.level}
            </span>
            <span style="font-weight: 700; font-size: 1rem; color: #f1f5f9;">${task.title}</span>
            ${isDone ? '<span class="stamp-badge" style="font-size: 0.72rem; padding: 1px 6px; border-color: #10b981; color: #10b981;">결재완료</span>' : ''}
          </div>
          <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px; line-height: 1.4;">
            ${task.description}
          </p>
          <div style="display: flex; gap: 16px; font-size: 0.8rem; color: #cbd5e1;">
            <span>👨‍💼 <strong>채점관:</strong> ${task.reviewer}</span>
            <span>⚡ <strong>배점:</strong> <span style="color: #fbbf24; font-weight: 700;">+${task.points}점</span></span>
            <span>📌 <strong>상태:</strong> ${task.status}</span>
          </div>
        </div>

        <div style="margin-left: 20px;">
          <button class="btn ${isDone ? 'btn-success' : 'btn-primary'}" style="min-width: 110px; justify-content: center;">
            ${isDone ? '다시 보기' : '문제 풀기 ➔'}
          </button>
        </div>
      `;

      card.querySelector("button").addEventListener("click", () => {
        this.openTaskInIde(task.id);
      });

      container.appendChild(card);
    });
  },

  openTaskInIde(taskId) {
    Editor.switchTask(taskId);
    document.querySelector('.nav-tab[data-view="ide"]').click();
    showToast(`🚀 [${taskId}] 과제를 시작합니다! 코드를 작성하고 상사께 제출하세요.`);
  },

  loadFileTree() {
    fetch("/api/file_tree")
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById("fileTreeContainer");
        container.innerHTML = "";
        this.renderTree(data.tree, container, 0);
      });

    document.getElementById("btnRefreshFiles").addEventListener("click", () => {
      this.loadFileTree();
      showToast("파일 목록을 새로고침했습니다.");
    });
  },

  renderTree(nodes, parentEl, depth) {
    nodes.forEach(node => {
      const item = document.createElement("div");
      item.className = "tree-node";
      item.setAttribute("data-path", node.path);
      item.style.paddingLeft = `${12 + depth * 14}px`;

      const isDir = node.type === "directory";
      const icon = isDir ? "📁" : (node.name.endsWith(".java") ? "☕" : "📄");

      item.innerHTML = `
        <span class="tree-icon">${icon}</span>
        <span class="tree-name">${node.name}</span>
      `;

      if (isDir) {
        parentEl.appendChild(item);
        if (node.children && node.children.length > 0) {
          const childContainer = document.createElement("div");
          this.renderTree(node.children, childContainer, depth + 1);
          parentEl.appendChild(childContainer);
        }
      } else {
        item.addEventListener("click", () => {
          Editor.loadFile(node.path);
        });
        parentEl.appendChild(item);
      }
    });
  },

  loadTickets() {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => {
        const colTodo = document.getElementById("colTodo");
        const colInProgress = document.getElementById("colInProgress");
        const colDone = document.getElementById("colDone");

        colTodo.innerHTML = "";
        colInProgress.innerHTML = "";
        colDone.innerHTML = "";

        let countTodo = 0, countInProg = 0, countD = 0;

        data.tasks.forEach(task => {
          const card = document.createElement("div");
          card.className = "jira-card";
          card.innerHTML = `
            <div class="card-top">
              <span class="card-key">${task.id}</span>
              <span class="card-prio" style="background: rgba(59, 130, 246, 0.2); color: #93c5fd;">${task.level}</span>
            </div>
            <div class="card-title">${task.title}</div>
            <div class="card-meta">
              <span>👤 ${task.reviewer}</span>
              <span>⚡ +${task.points}점</span>
            </div>
          `;

          card.addEventListener("click", () => {
            this.openTaskInIde(task.id);
          });

          if (task.status === "To Do") {
            colTodo.appendChild(card);
            countTodo++;
          } else if (task.status === "In Progress") {
            colInProgress.appendChild(card);
            countInProg++;
          } else if (task.status === "Done") {
            colDone.appendChild(card);
            countD++;
          }
        });

        document.getElementById("countTodo").textContent = countTodo;
        document.getElementById("countInProgress").textContent = countInProg;
        document.getElementById("countDone").textContent = countD;
      });
  }
};

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.borderColor = type === "error" ? "#ef4444" : (type === "warning" ? "#f59e0b" : "#3b82f6");
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
