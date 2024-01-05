'use strict';


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


async function fillTableRouteFromJson() {
  // Получение ссылки на таблицу
  var table = document.getElementById('Table_route');
  
  // Путь к JSON-файлу
  var jsonUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
  
  // Авторизационный заголовок
  var apiKey = '7dfa4a33-0346-4563-82f1-035a7000ddd9';
  var headers = new Headers();
  headers.append('Authorization', 'Bearer ' + apiKey);
  
  // Загрузка JSON-файла
  fetch(jsonUrl, { headers: headers })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var route = data[key];
          
          // Создание новой строки в таблице
          var row = table.insertRow();
  
          // Вставка данных в ячейки строки
          var cell1 = row.insertCell();
          cell1.innerHTML = route['name'];
  
          var cell2 = row.insertCell();
          cell2.innerHTML = route['description'];
  
          var cell3 = row.insertCell();
          cell3.innerHTML = route['mainObject'];
  
          var cell4 = row.insertCell();
  
          var button = document.createElement('button');
          button.textContent = 'Выбрать';
          cell4.appendChild(button);
        }
      }
    })
    .catch(function(error) {
      console.log('Ошибка загрузки JSON-файла:', error);
    });
}
function getBackPage() {
    if (state.page > 1) {// чекаем все ли хорошо 
        state.page--;//а тут минусуем к текущей 
        getRequest(state.page, state.perPage);
    }
}



window.onload = () => {
    fillTableRouteFromJson();
};