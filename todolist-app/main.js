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

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Website Todo</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <script src="main.js" defer></script> <!-- defer로 DOM 파싱 후 실행 -->
</head>
<body>
  <div class="app-wrap">
    <header class="app-header d-flex align-items-center gap-2 px-3">
      <!-- 제목 + 우측 개수 표시 -->
      <h1 class="app-title m-0">Todo</h1>
      <div class="header-spacer"></div>
      <span class="task-count">총 <strong id="task-count">0</strong>개</span>
    </header>

    <section class="task-area">
      <!-- 탭 + 언더라인 -->
      <div class="task-tabs">
        <div id="all" class="active" aria-pressed="true">All</div>
        <div id="ongoing" aria-pressed="false">InProgress</div>
        <div id="done" aria-pressed="false">Done</div>
        <div id="under-line"></div>
      </div>

      <!-- 입력 + 추가 버튼 -->
      <div class="card-footer">
        <div class="add-area">
          <input id="task-input" type="text" placeholder="할 일을 입력하세요" />
          <button id="add-task-button" class="add-new">추가</button>
        </div>
      </div>

      <!-- 목록 -->
      <div id="task-board" class="task-list"></div>
    </section>
  </div>
</body>
</html>
