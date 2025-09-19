const BASE_URL = "https://noona-times-be-5ca9402f90d9.herokuapp.com";
const PAGE_SIZE = 10;
let newsList = [];

// Map various button labels to valid NewsAPI categories
const CATEGORY_MAP = {
  business: "business",
  entertainment: "entertainment",
  general: "general",
  health: "health",
  science: "science",
  sports: "sports",
  sport: "sports", // alias
  technology: "technology",
  tech: "technology" // alias
};

const FALLBACK_IMAGE = "https://via.placeholder.com/400x250?text=Image+Not+Available";

// Attach click listeners to both desktop menu and mobile side-menu
function wireMenuClicks() {
  const allButtons = document.querySelectorAll('.menus button, #menu-list button');
  allButtons.forEach(btn => {
    // Avoid duplicate handlers if rerun
    btn.removeEventListener('click', handleCategoryClick);
    btn.addEventListener('click', handleCategoryClick);
  });
}

function handleCategoryClick(event) {
  getNewsByCategory(event);
}


const getNews = async() => {
  try {
    const url = new URL(`${BASE_URL}/top-headlines`);
    url.searchParams.set('country', 'kr');
    url.searchParams.set('pageSize', PAGE_SIZE);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    newsList = data.articles || [];
    render();
  } catch (err) {
    console.error('Failed to load news:', err);
    newsList = [];
    render();
  }
};

const getNewsByCategory = async (eventOrLabel) => {
  // Close side menu if open (mobile UX)
  try { closeNav(); } catch (_) {}

  // Accept an event or a plain string label
  const rawLabel = typeof eventOrLabel === 'string'
    ? eventOrLabel
    : (eventOrLabel?.target?.textContent || '');
  const label = rawLabel.trim().toLowerCase();

  // Normalize to supported category, else fallback to keyword search
  const category = CATEGORY_MAP[label];

  if (!category) {
    // Fallback: treat as keyword search (e.g., "world", "finance", etc.)
    return getNewsByKeyword(label);
  }

  try {
    const url = new URL(`${BASE_URL}/top-headlines`);
    url.searchParams.set('country', 'kr');
    url.searchParams.set('category', category);
    url.searchParams.set('pageSize', PAGE_SIZE);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    newsList = data.articles || [];
    render();
  } catch (err) {
    console.error('Failed to load category news:', err);
    newsList = [];
    render();
  }
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

const getNewsByKeyword = async(keywordParam) => {
  try {
    const keyword = (keywordParam ?? document.getElementById("search-input")?.value ?? "").trim();
    if (!keyword) return; // no-op if empty
    const url = new URL(`${BASE_URL}/everything`);
    url.searchParams.set('q', keyword);
    url.searchParams.set('pageSize', PAGE_SIZE);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    newsList = data.articles || [];
    render();
  } catch (err) {
    console.error('Failed to search news:', err);
    newsList = [];
    render();
  }
}

const truncate = (text = '', max = 200) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
};

const render = () => {
  const formatDate = (iso) => iso ? new Date(iso).toLocaleString('ko-KR') : '';
  const newsHTML = (newsList || []).map((news) => {
    const title = news?.title || '';
    const desc = truncate(news?.description || '');
    const source = news?.rights || news?.source?.name || 'no source';
    const published = (typeof moment !== 'undefined' && news?.published_date)
      ? moment(news.published_date).fromNow()
      : formatDate(news?.publishedAt || news?.published_date);
    const img = news?.urlToImage || FALLBACK_IMAGE;
    return `
      <div class="row news">
        <div class="col-lg-4">
          <img class="news-img-size" src="${img}" alt="${title.replace(/"/g, '&quot;')}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';" />
        </div>
        <div class="col-lg-8">
          <h2>${title}</h2>
          <p>${desc}</p>
          <div>${source} * ${published}</div>
        </div>
      </div>`;
  }).join('');

  document.getElementById('news-board').innerHTML = newsHTML || '';
}

// Initial load and event wiring
wireMenuClicks();
getNews();

//1. 버튼들에 클릭이벤트주기
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기

// Alias for new search button in HTML 
function searchNews(){
  if (typeof getNewsByKeyword === 'function') {
    getNewsByKeyword();
  }
}
