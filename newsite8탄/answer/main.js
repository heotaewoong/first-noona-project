const API_KEY = "7410686840814eb7bdadd017d9eb386a";
let newsList = [];
const menus = document.querySelectorAll('.menus button, .side-menu-list button');
menus.forEach(menu => menu.addEventListener('click', (event)=> getNewsByCategory(event)));

// Mobile side menu controls
const openNav = () => { document.getElementById("mySidenav").style.width = "250px"; };
const closeNav = () => { document.getElementById("mySidenav").style.width = "0"; };

// Toggle search box on mobile
const openSearchBox = () => {
    const inputArea = document.getElementById("input-area");
    if (!inputArea) return;
    inputArea.style.display = inputArea.style.display === "inline" ? "none" : "inline";
};


const getNews = async() => {
    let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`);
    console.log("uuu", url);
    const response = await fetch(url); 
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log("ddddd", newsList);
};

const getNewsByCategory = async event => {
    const category = event.target.textContent.toLowerCase();
    console.log("category", category);
    let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    console.log("Ddd", data)
    newsList = data.articles;
    render();

}

const getNewsByKeyword = async() => {
    const keyword = document.getElementById("search-input").value;
    let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`);
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
