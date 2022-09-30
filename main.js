import './style.css';
// import "virtual:windi.css";
import axios from 'axios';
import { convertPagination } from './modules/convertPagination';

const getUrl =
  'https://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx';
const table = document.querySelector('#table');
const dataList = document.querySelector('#dataList');
const layoutContent = document.querySelector('.layout-content');
const create = document.createElement('div');
create.classList.add('page-log');
const page = document.querySelector('.page');

const area = document.querySelector('#area');

let areaFilterResult = [];

const perPage = 40;
let pagination = null;
let currentPage = 1;

let areaCurrent = 1;
axios
  .get(getUrl)
  .then((res) => {
    const getData = res.data;

    // 切換分頁事件

    page.addEventListener('click', (e) => {
      e.preventDefault();

      // 取得分頁元素
      const pageLink = e.target.closest('.page-link');
      //避免點擊prev,next時抓不到dataset或是抓不到元素
      if (pageLink === null) return;

      // 取得分頁數字
      currentPage = Number(pageLink.dataset.num);

      // 儲存改變頁碼的資料
      const changePage = convertPagination(getData, currentPage, perPage);

      // 輸出分頁
      pageBtnRender(changePage, currentPage);

      // 輸出變更的分頁資料
      domRender(changePage.data);
    });
    // 取得篩選分頁資料
    pagination = convertPagination(getData, currentPage, perPage);
    const pageData = pagination.data;
    console.log('pagination', pagination.data);
    pageBtnRender(pagination, currentPage);
    domRender(pageData);

    // 顯示市場名稱選單
    areaSelect(getData);

    // 市場名稱選單篩選
    area.addEventListener('change', function () {
      console.log(this.value);

      const selectCurrent = getData.filter((item) => {
        console.log(item);
        return item['市場名稱'] === this.value;
      });
      areaFilterResult = selectCurrent;
      const areafilterPage = convertPagination(
        areaFilterResult,
        currentPage,
        perPage
      );
      // console.log('selectCurrent', areafilterPage);
      pageBtnRender(areafilterPage, areaCurrent);
      domRender(areafilterPage.data);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// 印出資料分頁狀態用
function pageLog(data) {
  // console.log(create);
  let html = '';
  for (let prop in data) {
    html += `${prop}:${data[prop]}, `;
    // console.log(prop);
  }
  return html;
  // create.innerHTML = html;
  // console.log(create);
  // layoutContent.insertBefore(create, page);
}
function pageBtnRender(data, current) {
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
function domRender(data) {
  let thArr = '';
  let thStr = '';
  let tdStr = '';
  data.forEach((item, index) => {
    thArr = Object.keys(item);
    // console.log(index, item);
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
        <td>
          ${item['市場代號']}
        </td>
        <td>
          ${item['市場名稱']}
        </td>
        <td>
        ${item['上價']}
        </td>
        <td>
        ${item['中價']}
        </td>
        <td>
        ${item['下價']}
        </td>
        <td>
        ${item['平均價']}
        </td>
        <td>
          ${item['交易量']}
        </td>
      </tr>`;
  });

  thArr.forEach((item) => {
    thStr += `
      <th>
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

function areaSelect(data) {
  let areaArr = [];
  let selectStr = '';
  data.forEach((item) => {
    if (areaArr.indexOf(item['市場名稱']) === -1) {
      areaArr.push(item['市場名稱']);
    }
    // console.log(areaArr.indexOf(item['市場名稱']) === -1);
  });
  areaArr.forEach((item) => {
    selectStr += `
        <option>${item}</option>
      `;
  });
  area.innerHTML = selectStr;
}
//https://codepen.io/tutsplus/pen/poaQEeq?editors=1010

// 篩選區域後 切換分頁 還是使用 原本分頁的資料，應該要記錄 篩選區域的狀態
