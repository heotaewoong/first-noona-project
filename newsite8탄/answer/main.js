const API_KEY = "7410686840814eb7bdadd017d9eb386a";
let newsList = [];
const menus = document.querySelectorAll('.menus button');
menus.forEach(menu => menu.addEventListener('click', (event)=> getNewsByCategory(event)));


const getNews = async() => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    console.log("uuu", url);
    const response = await fetch(url); 
    const data = await response.json();
    newsList = data.articles;
    render ();
    console.log("ddddd", newsList);
};

const getNewsByCategory = async event => {
    const category = event.target.textContent.toLowerCase();
    console.log("category", category);
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    console.log("Ddd", data)
    newsList = data.articles;
    render();

}

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

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
    const url = new URL(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}`);
    const response = await fetch(url); 
    const data = await response.json(); 
    console.log("Ddd", data)
    newsList = data.articles;
    render ();
}

const render = () => {
    const newsHTML = newsList.map(
        news => `<div class ="row news">
            <div class="col-lg-4">
            <img class ="news-img-size" src="${news.urlToImage}">
            </div>
            <div class ="col-lg-8">
                <h2>${news.title}</h2>
                <p>
                ${news.description}
                </p>
                <div>
                    ${news.source.name} * ${news.publishedAt}
                </div>
            </div>
        </div>`).join('');

    document.getElementById('news-board').innerHTML = newsHTML;
}

getNews();
for (let i=0; i<20; i++){
    console.log("after", i);
} 

//1. 버튼들에 클릭이벤트주기
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기

// Alias for new search button in HTML
function searchNews(){
  if (typeof getNewsByKeyword === 'function') {
    getNewsByKeyword();
  }
}
