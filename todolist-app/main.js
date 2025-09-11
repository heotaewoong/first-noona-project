//유저가 값을 입력한다. 
// + 버튼을 클릭하면 할일이 추가된다. 
// delete 버튼을 클릭하면 할일이 삭제된다.
// check 버튼을 클릭하면 할일이 끝나면서 밑줄이 간다.
// 1. check 버튼을 클릭하면 isComplete 속성이 true가 된다. 
// 2. true이면 끝난걸로 간주하고 밑줄을 보여주기
// 3. false이면 안끝난걸로 간주하고 밑줄 제거(그대로)
// 진행중 끝남 탭을 누르면, 언더바가 이동
// 끝남탭은, 끝난 아이템만, 진행중탭은 진행중인 아이템만 보여준다.
// 전체탭을 누르면 다시 전체 아이템으로 돌아온다.

const taskInput   = document.getElementById("task-input");
const addButton   = document.getElementById("add-task-button");
const taskBoard   = document.getElementById("task-board");
const taskCount   = document.getElementById("task-count");
const underLine   = document.getElementById("under-line");
// under-line 제외
const tabs        = [...document.querySelectorAll(".task-tabs > div")].filter(el => el.id !== "under-line");

let taskList   = [];
let mode       = "all"; // all | ongoing | done
let filterList = [];

addButton.addEventListener("click", addTask);
if (taskInput) {
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });
}
tabs.forEach((tab) => tab.addEventListener("click", filter));

// 초기 표시(언더라인 위치 + 첫 렌더)
window.addEventListener("DOMContentLoaded", () => {
  const current = document.querySelector(".task-tabs > div.active") || document.getElementById("all");
  if (current) {
    underLine.style.width = current.offsetWidth + "px";
    underLine.style.left  = current.offsetLeft  + "px";
  }
  render();
});

// ===== 함수들 =====
function addTask() {
  const value = (taskInput?.value || "").trim();
  if (!value) return;   // 빈 값 방지

  taskList.push({
    id: randomID(),
    taskContent: value,
    isComplete: false
  });

  taskInput.value = "";
  render();
}

function render() {
  const list = (mode === "all") ? taskList : filterList;

  let html = "";
  for (const t of list) {
    html += `
      <div class="task-item ${t.isComplete ? "done" : ""}" data-id="${t.id}">
        <span class="bullet" role="checkbox" aria-checked="${t.isComplete}"
              onclick="toggleComplete('${t.id}')"></span>
        <span class="task-text">${escapeHtml(t.taskContent)}</span>
        <button class="delete-btn" aria-label="delete" onclick="deleteTask('${t.id}')">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `;
  }

  taskBoard.innerHTML = html; 
  if (taskCount) taskCount.textContent = String(taskList.length); 
}

function toggleComplete(id) {
  const t = taskList.find(v => v.id === id);
  if (!t) return;
  t.isComplete = !t.isComplete;
  filter(); // 현재 모드 유지한 채 다시 렌더
}

function deleteTask(id) {
  taskList = taskList.filter(v => v.id !== id);
  filter();
}

function filter(e) {
  // 탭 클릭 시: 모드 변경 + 밑줄 이동
  if (e && e.currentTarget) {
    const target = e.currentTarget;
    mode = target.id;
    underLine.style.width = target.offsetWidth + "px";
    underLine.style.left  = target.offsetLeft  + "px";

    // active 토글
    tabs.forEach(t => t.classList.remove("active"));
    target.classList.add("active");
  }

  if (mode === "all") {
    filterList = [];
    render();
    return;
  }
  if (mode === "ongoing") {
    filterList = taskList.filter(v => !v.isComplete);
  } else if (mode === "done") {
    filterList = taskList.filter(v =>  v.isComplete);
  }
  render();
}

function randomID() {
  return "_" + Math.random().toString(36).slice(2, 11);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])
  );
}
