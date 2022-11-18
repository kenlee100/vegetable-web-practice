import './style.css';
// import "virtual:windi.css";
import axios from 'axios';
import { convertPagination } from './modules/convertPagination';

const getUrl =
  'https://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx';
const table = document.querySelector('#table');
// const dataList = document.querySelector('#dataList');
// const layoutContent = document.querySelector('.layout-content');
const create = document.createElement('div');
create.classList.add('page-log');
const page = document.querySelector('.page');

const area = document.querySelector('#area');
const loading = document.querySelector('.loading');
let areaFilterResult = [];

const perPage = 40;

let currentPage = 1;
let filterPage = null;
// let areaCurrent = 1;
let filterData = [];

let currentArea = '全部地區';
let getAllArea = [];
let getData = [];
let dataItemList = [];
axios
  .get(getUrl)
  .then((res) => {
    getData = res.data;

    if (getData.length !== 0) {
      loading.classList.remove('-show');
      init();
    }
    // console.log('dataItemList', dataItemList);
  })
  .catch((err) => {
    console.log(err);
  });
function filterArea(areaText) {
  return getData.filter((item) => {
    if (areaText === '全部地區') {
      return item;
    } else {
      return item['市場名稱'] === areaText;
    }
    // console.log('filterArea', filterData);
    // return filterData;
  });
}
function renderSelect(data) {
  data.forEach(function (item) {
    if (getAllArea.indexOf(item['市場名稱']) === -1) {
      getAllArea.push(item['市場名稱']);
    }
  });
  let selectHTML = '<option value="全部地區">全部地區</option>';
  getAllArea.forEach(function (item) {
    selectHTML += `
      <option value="${item}">
        ${item}
      </option>
    `;
  });
  area.innerHTML = selectHTML;
}
page.addEventListener('click', (e) => {
  e.preventDefault();

  // 取得分頁元素
  const pageLink = e.target.closest('.page-link');
  // console.log('pageLink', pageLink);
  //避免點擊prev,next時抓不到dataset或是抓不到元素
  if (pageLink === null) return;

  currentPage = Number(pageLink.dataset.num);
  filterData = filterArea(currentArea);
  // 取得篩選分頁資料
  filterPage = convertPagination(filterData, currentPage, perPage);

  pageBtnRender(filterPage, currentPage);
  domRender(filterPage.data);
});
area.addEventListener('change', function () {
  //更新選取區域
  currentArea = this.value;
  currentPage = 1;

  filterData = filterArea(currentArea);

  filterPage = convertPagination(filterData, currentPage, perPage);

  domRender(filterPage.data);
  pageBtnRender(filterPage, currentPage);
});
table.addEventListener('click', function (e) {
  if (e.target.nodeName === 'TH') {
    const tableThText = e.target.textContent.trim();
    sortItem(tableThText, e.target);
  }
});
// 印出資料分頁狀態用
function pageLog(data) {
  let html = '';
  for (let prop in data) {
    html += `${prop}:${data[prop]}, `;
  }
  return html;
}
function pageBtnRender(data, current) {
  console.log('pageBtnRender', data.pagination);
  const pageStatus = data.pagination;

  let pagePrev = '';
  let pageItem = '';
  let pageNext = '';

  for (let i = 1; i <= pageStatus.pageTotal; i++) {
    // 分頁 active 狀態
    pageItem += `<li class="page-item ${
      i === Number(current) ? 'active' : ''
    }"><a class="page-link" href="#" data-num="${i}">${i}</a></li>`;
  }
  // 上一頁 邏輯
  if (pageStatus.hasPrev) {
    pagePrev += `<li class="page-item"><a class="page-link" href="#" data-num="${
      current - 1
    }">Previous</a></li>`;
  } else {
    pagePrev += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
  }

  // 下一頁 邏輯
  if (pageStatus.hasNext) {
    pageNext += `<li class="page-item"><a class="page-link" href="#" data-num="${
      current + 1
    }">Next</a></li>`;
  } else {
    pageNext += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
  }

  const paginationElement = `
    <ul class="flex flex-wrap pagination">
      ${pagePrev}
      ${pageItem}
      ${pageNext}
      </ul>
      
      ${pageLog(data.log)}
      
  `;
  page.innerHTML = paginationElement;
}
function getDataKeys(data) {
  data.forEach(function (item) {
    Object.keys(item).forEach(function (item2) {
      if (dataItemList.indexOf(item2) === -1) {
        dataItemList.push(item2);
      }
    });
  });
}
function sortItem(itemName, element) {
  let asc = false;
  let desc = false;
  let sortItemData = [];
  // console.log(itemName, element.dataset.sort);
  filterData = filterArea(currentArea);
  filterPage = convertPagination(filterData, currentPage, perPage);

  dataItemList.forEach(function (item) {
    if (
      item === '交易日期' ||
      item === '種類代碼' ||
      item === '作物代號' ||
      item === '作物名稱' ||
      item === '市場名稱'
    ) {
      return;
    } else {
      if (element.dataset.sort === 'up') {
        // element.dataset.sort = 'down';
        // element.setAttribute('data-sort', 'down');
        // sortItemData = filterPage.data.sort(function (a, b) {
        //   return a[itemName] - b[itemName];
        // });
        console.log('upupup');
        element.setAttribute('data-sort', 'down');
      } else if (element.dataset.sort === 'down') {
        // element.dataset.sort = 'up';
        // element.setAttribute('data-sort', 'up');
        // sortItemData = filterPage.data.sort(function (a, b) {
        //   return b[itemName] - a[itemName];
        // });
        console.log('down');
      }
    }
  });
  console.log(element);
  // element.setAttribute('data-sort', 'down');
  // console.log(sortItemData);
  // domRender(sortItemData);
  // filterPage = convertPagination(filterData, currentPage, perPage);
}

function domRender(data) {
  let thArr = '';
  let thStr = '';
  let tdStr = '';
  data.forEach((item, index) => {
    thArr = Object.keys(item);
    // console.log(thArr);
    tdStr += `<tr>
        <td>
          ${item['交易日期']}
        </td>
        <td>
          ${
            item['種類代碼']
              ? item['種類代碼']
              : '<span class="badge bg-light text-dark">無資料</span>'
          }
        </td>
        <td>
          ${item['作物代號']}
        </td>
        <td>
          ${
            item['作物名稱']
              ? item['作物名稱']
              : '<span class="badge bg-light text-dark">無資料</span>'
          }
        </td>
        <td>${item['市場代號']}</td>
        <td>${item['市場名稱']}</td>
        <td>${item['上價']}</td>
        <td>${item['中價']}</td>
        <td>${item['下價']}</td>
        <td>${item['平均價']}</td>
        <td>${item['交易量']}</td>
      </tr>`;
  });

  thArr.forEach((item) => {
    thStr += `
      <th data-sort="up">
      ${item}
      </th>
    `;
  });

  table.innerHTML = `
    <thead>
      <tr>
        ${thStr}
      </tr>
    </thead>
    <tbody>
      ${tdStr}
    </tbody>
  `;
}

function init() {
  renderSelect(getData);
  getDataKeys(getData);
  area.value = currentArea;
  filterData = filterArea(currentArea);
  filterPage = convertPagination(filterData, currentPage, perPage);

  // 輸出分頁
  pageBtnRender(filterPage, currentPage);

  // 輸出變更的分頁資料
  domRender(filterPage.data);
}
//https://codepen.io/tutsplus/pen/poaQEeq?editors=1010

// 分頁資料 統計 在最後一筆時顯示 有誤
//
// sort可參考
// https://hackmd.io/@as60160/B1O3H720u/%2FN9jpHU-eTmiS1vn8lXJy_Q
