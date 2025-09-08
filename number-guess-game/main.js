// 랜덤번호 지정
//유저가 번호를 입력한다 그리고 go라는 버튼을 누름
// 만약에 유저가 랜덤번호를 맞추면 맞췄습니다!
// 랜덤번호가 < 유저번호 Down!!
// 랜덤번호가 > 유저번호 Up!!
// reset 버튼을 누르면 게임이 리셋된다.
// 5번의 기회를 다쓰면 게임이 끝난다. (더이상 추측 불가, 버튼이 disable)
// 유저가 1~100 범위 밖에 숫자를 입력하면 알려준다. 기회를 깎지 않는다.
// 유저가 이미 입력한 숫자를 또 입력하면 알려준다. 기회를 깎지 않는다.

let computerNum = 0
let playButton = document.getElementById("play-button");
let userInput = document.getElementById("user-input"); // input창에 입력한 값을 가져옴
let resultAreaImg = document.querySelector(".main-img"); 
let resultArea = document.querySelector(".result-text");
let resetButton = document.getElementById("reset-button");
let chances = 5;
let gameOver = false;
let chanceArea = document.getElementById("chance-area");
let history = []; 

playButton.addEventListener("click", play) // click을 누를 때만 play가 실행되므로 play()가 불가능
resetButton.addEventListener("click", reset)
userInput.addEventListener("focus",function(){
    userInput.value = "";
}) // 익명함수 : userInput에서 잠깐 쓰고 끝날 함수

console.log(playButton); 
function pickRandomNumber() {
    computerNum = Math.floor(Math.random() * 100) +1; // math.floor은 소숫점 버림 : 0~99 // 0~99 + 1
    console.log("정답", computerNum);  // 정답이 잘 나오는지 확인
}

function play(){
    const userValue = Number(userInput.value); // userInput에 입력한 값을 숫자로 변환해 저장
    if(userValue<1 || userValue>100){
        resultArea.textContent = "1과 100사이 숫자를 입력해주세요";
        return; //함수 종료
    }

    if(history.includes(userValue)){
        resultArea.textContent = "이미 입력한 숫자입니다. 다른 숫자를 입력해주세요";
        return;
    }

    chances -- ;
    chanceArea.textContent = `남은 기회: ${chances}번`; // 동적인 값을 넣기 위해 백틱 사용, 정적 결과 : "남은기회: chance번"
    console.log("chances", chances); // 남은 기회를 콘솔에 출력

    console.log(userValue); // userValue에 입력한 값을 콘솔창에 출력
    if(userValue < computerNum){
        resultAreaImg.src = "https://media0.giphy.com/media/3ov9jExd1Qbwecoqsg/200.gif"
        resultArea.textContent = "Up!!";
        console.log("Up!!")
    } else if(userValue > computerNum){
        resultAreaImg.src = "https://media.giphy.com/media/r2puuhrnjG7vy/giphy.gif"
        resultArea.textContent = "Down!!";
        console.log("Down!!")
    } else {
        resultAreaImg.src = "https://media.tenor.com/images/0a81b89954678ebe228e15e35044f7a5/tenor.gif"
        resultArea.textContent = "맞췄습니다!";
        console.log("맞췄습니다!")
        gameOver = true;
    } 

    history.push(userValue);
    console.log(history);

    if(chances < 1){
        gameOver = true
    }

    if (gameOver == true){
        playButton.disabled = true;
    }
}

function reset(){
    // user input 창이 깨끗하게 정리되고
    userInput.value = "";
    // 새로운 번호가 생성되고
    pickRandomNumber(); 
    resultArea.textContent = "죽기 싫다면 맞춰라!!";
    resultAreaImg.src = "https://media1.giphy.com/media/9DinPR8bzFsmf74j9W/giphy.gif"
    chances = 5;
    chanceArea.textContent = `남은 기회: ${chances}번`;
    playButton.disabled = false; // Go 버튼 활성화
    history = [];
    gameOver = false;
}

pickRandomNumber();
