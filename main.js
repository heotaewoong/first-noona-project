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
console.log(taskInput);

let addButton = document.getElementById("add-task-button");
let taskList = [];
addButton.addEventListener("click", addTask); // 버튼에다가 이벤트를 주고 싶으면 addEventListener를 쓴다.

function addTask() {
    let task = { // 객체로 바꾸기 : 객체로 저장하면 한 항목에 여러 속성(내용, 완료 상태, id, 생성시간 등)을 같이 묶어 관리할 수 있어 체크 상태를 켜고 끄기(토글)하기 쉽습니다.
        id: randomIDGenerate(), // id를 줌으로써 나중에 특정 아이템을 쉽게 찾고 조작할 수 있습니다.
        taskContent: taskInput.value,
        isComplete: false, 
    }
    taskList.push(task); 
    console.log(taskList); 
    taskInput.value = ''; 
    render();
}

function render() { // 그려주는 함수 
    let resultHTML = '';
    for (let i = 0; i < taskList.length; i++) {
        if(taskList[i].isComplete == true){
            resultHTML += `<div class="task">
            <div class="task-done">${taskList[i].taskContent}</div>
            <div>
                <button onclick="toggleComplete('${taskList[i].id}')">check</button>
                <i class="fa-regular fa-square-check"></i>
                <button onclick="deleteTask('${taskList[i].id}')">delete</button>
            </div>
        </div>`;
        }else{
            resultHTML += `<div class="task">
            <div>${taskList[i].taskContent}</div>
            <div>
                <button onclick="toggleComplete('${taskList[i].id}')">check</button>
                <button onclick="deleteTask('${taskList[i].id}')">delete</button>
            </div>
        </div>`;
        }
    }
    document.getElementById("task-board").innerHTML = resultHTML;
}
// addEventListener가 아니라 onclick 속성으로 이벤트를 주는 방법

function toggleComplete(id) { // id는 render에서 전달한 문자열(예: '_abc123')
    console.log("id:", id);
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === id) {
            taskList[i].isComplete = !taskList[i].isComplete; // false가 아니라 !를 쓰면 스위치로 왔다갔다 할 수 있다.
            break
        } 
    }
    render();
    console.log(taskList)
} 

function deleteTask(id) {
    console.log("id:", id);
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === id) {
            taskList.splice(i, 1); // i번째에서 1개 지워라
            break
        }
    }
    render();
    console.log(taskList)
}


function randomIDGenerate() {
    return '_' + Math.random().toString(36).substr(2, 9); // 함수를 다른 곳에 넣을때 return 값 쓴다 
}