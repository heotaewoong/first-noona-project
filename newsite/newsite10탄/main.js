const API_KEY = "7410686840814eb7bdadd017d9eb386a";
let newsList = [];
const menus = document.querySelectorAll('.menus button');


menus.forEach(menu => menu.addEventListener('click', (event)=> getNewsByCategory(event)));


// 사이드바 버튼에도 바인딩 추가 + 클릭 후 닫기
const sideMenuButtons = document.querySelectorAll('#menu-list button');
sideMenuButtons.forEach(menu =>
  menu.addEventListener('click', (event) => {
    getNewsByCategory(event);
    closeNav();
  })
);

let urlSample1 = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`); 
// <-- 원래 주소 

// TDZ 오류 해결: page/pageSize/groupSize를 먼저 선언하고 urlSample2를 만듭니다.
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;
let url; // 요청에 사용할 URL 객체(아래에서 값 할당)

// <= 배포 주소(이제 pageSize를 안전하게 참조)
let urlSample2 = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?pageSize=${pageSize}&country=us&apiKey=${API_KEY}`;

document
  .getElementById("search-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      getNewsByKeyword(); // 엔터 키를 눌렀을 때 검색 실행
      event.preventDefault(); // 폼이 실제로 제출되지 않도록 방지
    }
  });

document.getElementById("search-input").addEventListener("focus", function () {
  this.value = ""; // 포커스가 되었을 때 입력창 초기화
});

const getNews = async() => { // 코드 리펙토링
    try{
        url.searchParams.set('page', page); // => $page=page
        url.searchParams.set('pageSize', pageSize); // => $pageSize=pageSize
        const response = await fetch(url);
        const data = await response.json();
        if(response.status === 200){
            if(data.articles.length === 0){
                throw new Error("검색된 결과가 없습니다.");
            }
            newsList = data.articles;
            totalResults = data.totalResults;
            render();
            paginationRender();
        }else{
            throw new Error(data.message);
        }
    }catch(error){
        console.log("error", error.message);  
        errorRender(error.message);  
    }
}   

const getLatestNews = async () => {
    //url = new URL(`${urlSample1}`);
    url = new URL(`${urlSample2}`);
    page = 1; // 최신 뉴스로 돌아갈 때 페이지 1로 초기화
    await getNews(); // await 없으면 render가 안기다림
};

const getNewsByCategory = async event => {
    const category = event.target.textContent.toLowerCase();
    //url = new URL(`${urlSample1}&category=${category}`);
    page = 1; // 카테고리별 뉴스로 갈 때 페이지 1로 초기화
    url = new URL(`${urlSample2}&category=${category}`);
    await getNews();
}
// 모바일에서 검색창 열기/닫기
const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const getNewsByKeyword = async() => {
    const keyword = document.getElementById("search-input").value;
    //url = new URL(`${urlSample1}&q=${keyword}`);
    url = new URL(`${urlSample2}&q=${keyword}`); 
    await getNews();
    
}

// 화면에 뉴스를 그리는 함수
const render = () => {
    let newsHTML = '';
    newsHTML = newsList
    .map((news) => {
      return `<div class="news row">
        <div class="col-lg-4">
            <img class="news-img"
              src="${news.urlToImage}"
              onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';" />
        </div>
        <div class="col-lg-8">
            <a class="title" target="_blank" href="${news.url}">${news.title || "제목 없음"}</a>
            <p>${
              news.description == null || news.description == ""
                ? "내용없음"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name || "no source"}  ${moment(news.publishedAt).fromNow()}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML ;
};

const errorRender = (errorMessage) => {
  const errorHTML = `
    <div class="alert alert-danger" role="alert">
      ${errorMessage}
    </div>`;

    document.getElementById('news-board').innerHTML = errorHTML;
}


const paginationRender = () => {
    // totalResults
    //page
    //pageSize
    //groupSize
    //totalPages
    const totalPages = Math.ceil(totalResults / pageSize);
    //pageGroup
    const pageGroup = Math.ceil(page / groupSize);
    //lastPage
    let lastPage = pageGroup * groupSize;
    // 마지막 페이지그룹이 그룹사이즈보다 작다? lastpage = totalPage
    if(lastPage > totalPages){ 
        lastPage = totalPages;
    }

    //firstPage
    const firstPage = lastPage - (groupSize - 1)<=0 ? 1 : lastPage - (groupSize - 1);

    let pagiNationHTML = "";

// 1) 이전 쪽 네비게이션(첫 페이지/이전 페이지)
if (page != 1) { // 1페이지가 아닐 때만 표시
  if (page > 2) {
    // «: 첫 페이지(1)로 점프
    pagiNationHTML += `<li class="page-item">
      <a class="page-link" onclick="moveToPage(${1})" href="#">
        <i class="fa-solid fa-angles-left"></i>
      </a>
    </li>`;
  }
  // <: 바로 이전 페이지로 이동
  pagiNationHTML += `<li class="page-item">
    <a class="page-link" onclick="moveToPage(${page-1})" href="#">
      <i class="fa-solid fa-angle-left"></i>
    </a>
  </li>`;
}

// 2) 현재 그룹의 숫자 버튼들
for (let i = firstPage; i <= lastPage; i++) {
  // 현재 페이지면 active로 강조
  pagiNationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})">
    <a class="page-link" href="#">${i}</a>
  </li>`;
}

// 3) 다음 쪽 네비게이션(다음 페이지/마지막)
if (page != lastPage) { // 그룹의 마지막 페이지가 아니면
  // >: 다음 페이지로
  pagiNationHTML += `<li class="page-item">
    <a class="page-link" onclick="moveToPage(${page+1})" href="#">
      <i class="fa-solid fa-angle-right"></i>
    </a>
  </li>`;

  if (page < lastPage - 1) {
    // »: 그룹의 끝(lastPage)으로 점프(앞으로 2페이지 이상 남았을 때만)
    pagiNationHTML += `<li class="page-item">
      <a class="page-link" onclick="moveToPage(${lastPage})" href="#">
        <i class="fa-solid fa-angles-right"></i>
      </a>
    </li>`;
  }
}
    document.querySelector('.pagination').innerHTML = pagiNationHTML;

    // <nav aria-label="Page navigation example">
    // <ul class="pagination">
    //     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
    //     <li class="page-item"><a class="page-link" href="#">1</a></li>
    //     <li class="page-item"><a class="page-link" href="#">2</a></li>
    //     <li class="page-item"><a class="page-link" href="#">3</a></li>
    //     <li class="page-item"><a class="page-link" href="#">Next</a></li>
    // </ul>
    // </nav>
};
const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

window.openSearchBox = openSearchBox;
window.getNewsByKeyword = getNewsByKeyword;
window.openNav = openNav;
window.closeNav = closeNav;
window.moveToPage = moveToPage;

// 초기 로드
getLatestNews();



//1. 버튼들에 클릭이벤트주기
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기
