'use strict';

const baseUrlRouter = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
const baseUrlGuid = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/{id-маршрута}/guides';
const apiKey = '7dfa4a33-0346-4563-82f1-035a7000ddd9';

const stateRoute = {
  page: 1,
  perPage: 4,
  pageCount: 0,
  query: ""
};


async function fillTableRouteFromJson() {
  try {
    let url = new URL(baseUrlRouter);
    url.searchParams.append('api_key', apiKey);

    let response = await fetch(url);
    console.log(response);
    if (response.ok) {
      let data = await response.json();
      fillRouteByCollection(data);
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log('Ошибка загрузки JSON-файла:', error);
  }
}

async function sendGuidesRequest(routeId) {
  try {
    let url = new URL(baseUrlGuid.replace('{id-маршрута}', routeId));
    url.searchParams.append('api_key', apiKey);

    let response = await fetch(url);
    if (response.ok) {
      let data = await response.json();
      console.log(data);
      fillGuidByCollection(data);
    } else {
      console.log("Ошибка запроса к API по гидам");
    }
  } catch (error) {
    console.log('Ошибка запроса к API:', error);
  }
}
function fillGuidByCollection(data) {
  var table = document.getElementById('Table_guid');
  var tbody = table.getElementsByTagName('tbody')[0];

  if (!tbody) {
    tbody = table.createTBody();
  }

  tbody.innerHTML = ''; 

  data.forEach(function(item) {
    var row = tbody.insertRow();

    var nameCell = row.insertCell();
    nameCell.textContent = item.name;

    var languageCell = row.insertCell();
    languageCell.textContent = item.language;

    var experienceCell = row.insertCell();
    experienceCell.textContent = item.workExperience + ' лет'; 

    var priceCell = row.insertCell();
    priceCell.textContent = item.pricePerHour + ' в час'; 

    var buttonCell = row.insertCell();
    var button = document.createElement('button');
    button.textContent = 'Выбрать';
    button.classList.add('btn');
    buttonCell.appendChild(button);
  });
}


function fillRouteByCollection(data) {
  var table = document.getElementById('Table_route');
  var tbody = table.getElementsByTagName('tbody')[0];
  
  if (!tbody) {
    tbody = table.createTBody();
  }

  tbody.innerHTML = ''; 
  stateRoute.pageCount = Math.ceil(data.length / stateRoute.perPage);

  var start = (stateRoute.page - 1) * stateRoute.perPage;
  var end = start + stateRoute.perPage;
  var displayedData = data.slice(start, end);

  for (var i = 0; i < displayedData.length; i++) {
    var item = displayedData[i];

    var row = tbody.insertRow();

    var cell1 = row.insertCell();
    cell1.innerHTML = item['name'];

    var cell2 = row.insertCell();
    cell2.innerHTML = item['description'];

    var cell3 = row.insertCell();
    var cell4 = row.insertCell();

    var mainObjectItems = item['mainObject'].split(/[-,–](?=.)/);
    var mainObjectList = document.createElement('ul');
    
    mainObjectItems.forEach(function(mainObjectItem) {
      var listItem = document.createElement('li');
      listItem.textContent = mainObjectItem.trim();
      mainObjectList.appendChild(listItem);
    });
    cell3.appendChild(mainObjectList);
    
    var button = document.createElement('button');
    
    button.textContent = 'Выбрать';
    button.classList.add('btn');
    var itemID = item['id']; 
    button.id = itemID; 
        
    button.addEventListener('click', (function(itemID) {
      console.log(itemID); 
      sendGuidesRequest(itemID);
    }).bind(null, item.id));
    cell4.appendChild(button);
  }
}



function getNextPage() {
  if (stateRoute.page < stateRoute.pageCount) {
    stateRoute.page++;
    fillTableRouteFromJson();
  }
}

function getBackPage() {
  if (stateRoute.page > 1) {
    stateRoute.page--;
    fillTableRouteFromJson();
  }
}

window.onload = () => {
  fillTableRouteFromJson();
};