'use strict';

const BASE_URL = new URL("http://cat-facts-api.std-900.ist.mospolytech.ru/");
async function showMessage(title="Уведомление!", message="Успешно", type = "alert-success") {
    const alert = document.getElementById("alert-template").content.firstElementChild.cloneNode(true);
    const stitle = document.createElement("strong");
    stitle.innerHTML = title;
    alert.querySelector(".msg").innerHTML = `${stitle.outerHTML} ${message}`;
    alert.classList.add(type);
    setTimeout(() => alert.remove(), 3000);
    document.querySelector('.alerts').append(alert);
}

function showAlert() {
    showMessage("Важное сообщение", "Товары находятся в разработке!", "alert-info");
}

function openLkPage() {
    window.location.href = "lk.html";
}

const state = {
    page: 1,
    perPage: 10,
    pageCount: 0
};

async function showMessage(title="Уведомление!", message="Успешно", type = "alert-success") {
    const alert = document.getElementById("alert-template").content.firstElementChild.cloneNode(true);
    const stitle = document.createElement("strong");
    stitle.innerHTML = title;
    alert.querySelector(".msg").innerHTML = `${stitle.outerHTML} ${message}`;
    alert.classList.add(type);
    setTimeout(() => alert.remove(), 3000);
    document.querySelector('.alerts').append(alert);
}

function showAlert() {
    showMessage("Важное сообщение", "Товары находятся в разработке!", "alert-info");
}

function openLkPage() {
    window.location.href = "lk.html";
}

function openMainPage() {
    window.location.href = "index.html";
}

const fillPageByCollection = (collection) => {
    let template = document.getElementById("post_t"); //получаем элемент с id "post_t"
    const main = document.querySelector(".posts"); //получаем элемент с классом "posts"
    for (let record of collection) { //проходимся по каждой записи в коллекции
        let post = template.content.cloneNode(true); //клонируем шаблон post_t для дальнейшего заполнения
        post.querySelector("p").textContent = record.text; //находим элемент <p> для того, чтобы внести в него данные
        post.querySelector(".userCard").textContent = 
            record?.user?.name?.first +
            " " + //находим элемент с классом "userCard" для того чтобы внести в туда имя и фамилию, если они есть
            record?.user?.name?.last; 
        main.append(post); //добавляем, то что мы скопировали ранее, но уже с данными, в главный контейнер
    }
};

function getRequest(page = 1, perPage = 10, q = "") {
    let url = new URL("facts", BASE_URL); //берем и создаем новый url с добавление "facts" используя наш URL
    url.searchParams.set("page", page);
    url.searchParams.set("per-page", perPage);
    if (q != "") url.searchParams.set("q", q); //устанавливаем q для поиска в URL
    let xhr = new XMLHttpRequest(); //креэйтим XMLHttpRequest для выполнения AJAX запроса
    xhr.open("GET", url); //опеним соединение 
    xhr.send(); //не поверите, отправляем
    xhr.onload = function() {
        let json = JSON.parse(xhr.response); //Конвертируем в JSON
        cleanPosts(); 
        fillRouteByCollection(json.records); //Заполнение
        pageCounter(json._pagination); 
        numeration();
    };
}
function cleanPosts() {
    let main = document.querySelector(".posts");
    main.innerHTML = "";//чистим чистим
}

function pageCounter(objectPagination) {
    state.pageCount = objectPagination.total_pages;//берет и ставит общее количество страниц
}

function numeration() {

    //тут мы объявляем первую и последнюю
    let first = Math.max(1, state.page - 2);  //первая
    let last = Math.min(state.page + 2, state.pageCount);  //ластовая

    let btnp = document.getElementById('btn-p');  //получаем id контейнера кнопки 
    btnp.innerHTML = "";  //чистим всё, не помню заче, но вот чистим по приколу

    //берем и создаем кнопки от первой до ластовой
    for (let i = first; i <= last; i++) {
        let btn = document.createElement("button");  //берем и создаем кнопку
        btn.innerHTML = i;  //а тут мы пихаем ее номер, неожиданно, да? Я сам в шоке

        //делаем ее кликабельной
        btn.onclick = () => goToPage(i);

        btn.setAttribute("class", "pageButton");  //берем и даем ей атрибут из класса pageButton
        if (i === state.page) btn.setAttribute("id", "activePage");  //берем и даем ей атрибут в виде id, естесно учитываем активная ли страница или нет
        btnp.append(btn);  //пушим кнопку на страницу
    }
}



function goToPage(pageNum) {
    state.page = pageNum;// пихаем текущую страницу в соответсвие с pageNum
    getRequest(state.page, state.perPage);
}

function getNextPage() {
    if (state.page < state.pageCount) {// чекаем все ли хорошо 
        state.page++;//плюсуем к текущей 
        getRequest(state.page, state.perPage);
    }
}


function getBackPage() {
    if (state.page > 1) {// чекаем все ли хорошо 
        state.page--;//а тут минусуем к текущей 
        getRequest(state.page, state.perPage);
    }
}



window.onload = () => {
    fillTableFromJson();
    getRequest(state.page, state.perPage); //опять запрос
    document.getElementById('Per-page').onchange = onPagesChange; //присваиваем onPagesChange на элемента с id 'Per-page' 
    document.querySelector('.search-btn').onclick = onSearchButtonClick; // тут тоже присваиваем onSearchButtonClick обработчику события на клик на элемент с классом 'search-btn'
    document.querySelector(".search-field").onkeyup = onKeyPress; // тут присваеваем onKeyPress обработчику события опускания клавиши в поле ввода с классом 'search-field'
    document.querySelector('.lines').onclick = (event) => { // а тут у нас анонимная функция которая дает обработчк события на клик на элемент с классом 'lines'
        if (event.target.tagName == "P") { // чекаем произшло ли чтото с тегом p
            state.page = 1; //ставим первую страницу
            getRequest(state.page, state.pageCount, event.target.innerHTML); //и опять запрос да сколько можно
            hideLines(); // что то прячем
        }
    };
    // Здесь можно добавить комментарий о том, что эти функции выполняются при загрузке страницы и устанавливают обработчики событий для соответствующих элементов. Они также инициируют GET-запрос для получения данных и выполняют другие действия, связанные с интерфейсом пользователя.
};