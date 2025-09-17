const API_KEY = "7410686840814eb7bdadd017d9eb386a";
let newsList = [];
const getNews = async() => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    console.log("uuu", url);
    const response = await fetch(url); 
    const data = await response.json();
    newsList = data.articles;
    render ();
    console.log("ddddd", newsList);
};

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
