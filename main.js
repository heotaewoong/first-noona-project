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

let taskInput = document.getElementById("task-input");
let tabs =  document.querySelectorAll(".task-tabs div");
let addButton = document.getElementById("add-task-button");
let taskList = [];
let mode = "all"; // all, ongoing, done
let filterList = [];
let underLine = document.getElementById("under-line");

let taskBoard = document.getElementById('task-board'); 
let taskCount = document.getElementById("task-count");

// 초기 로드
window.addEventListener('DOMContentLoaded', ()=>{
  load();
  render();
  // 시작 시 active 탭 밑줄 위치 세팅
  const current = document.querySelector('.tab-btn.active');
  if(current) moveUnderline(current);
});

addButton.addEventListener("click", addTask);
console.log(tabs);

// 탭에 클릭 리스너 등록 (under-line 요소는 제외되도록 index 구조에 맞게 1부터 시작한 코드가 원래 의도라면 유지)
for (let i = 1; i < tabs.length; i++) {
    tabs[i].addEventListener("click", filter); // event.currentTarget 사용 가능
    console.log(tabs[i]);
}

function addTask() {
    if (!taskInput) return; 
    const taskValue = taskInput.value.trim(); 
    if (taskValue === "") return;        // 빈 값 추가 방지(클릭/엔터 공통)
    let task = {
        id: randomIDGenerate(),
        taskContent: taskInput.value,
        isComplete: false,
    }
    taskList.push(task);
    taskInput.value = '';
    render();
}

if (taskInput) {
    taskInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault(); // form 자동 제출 막기
            if (taskInput.value.trim() === "") return;
            addTask();
        }
    });
}

function render() {
    let list = [];
    if (mode == "all") {
        list = taskList;
    } else {
        list = filterList;
    }

    let resultHTML = '';
    for (let i = 0; i < list.length; i++) {
        if (list[i].isComplete) {
            resultHTML += `<div class="task task-done-area">
                <div class="task-done">${list[i].taskContent}</div>
                <div>
                    <button onclick="toggleComplete('${list[i].id}')" aria-label="undo"><i class="fa-solid fa-rotate-left"></i></button>
                    <button onclick="deleteTask('${list[i].id}')" aria-label="delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;
        } else {
            resultHTML += `<div class="task">
                <div>${list[i].taskContent}</div>
                <div>
                    <button onclick="toggleComplete('${list[i].id}')" aria-label="toggle complete"><i class="fa-solid fa-check"></i></button>
                    <button onclick="deleteTask('${list[i].id}')" aria-label="delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;
        }
    }
    document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === id) {
            taskList[i].isComplete = !taskList[i].isComplete;
            break;
        }
    }
    filter(); // 현재 모드에 맞춰 갱신
}

function deleteTask(id) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === id) {
            taskList.splice(i, 1);
            break;
        }
    }
    filter();
}

function filter(event) {
  if (event && event.target) {
    mode = event.target.id;
    underLine.style.width = event.target.offsetWidth + "px";
    underLine.style.left = event.target.offsetLeft + "px";
    underLine.style.top =
      event.target.offsetTop + (event.target.offsetHeight - 4) + "px";
  } // 진행중 상태에서 끝남으로 표시하면 바로 사라지는 부분은 event가 없음 그래서 조건추가

    filterList = [];
    if (mode === "all") {
        render();
        return;
    } else if (mode === "ongoing") {
        for (let i = 0; i < taskList.length; i++) {
            if (!taskList[i].isComplete) filterList.push(taskList[i]);
        }
    } else if (mode === "done") {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].isComplete) filterList.push(taskList[i]);
        }
    }
    render();
}

function randomIDGenerate() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
