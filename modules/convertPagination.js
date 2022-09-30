export function convertPagination(
  resource,
  currentPage = 1,
  perPage = 3,
  category = ''
) {
  //分頁
  //-總共有幾頁 total_pages
  //-目前在第幾頁 current_page
  //-每頁有多少數量 perpage
  //-當前頁面資料

  const totalResult = resource.length;
  // const perPage = 3; //每頁幾筆
  //無條件進位
  const pageTotal = Math.ceil(totalResult / perPage); //總頁數

  //要避免 目前頁數 比 總頁數 多
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }

  //使用結果反推公式
  const minItem = currentPage * perPage - perPage + 1; // 4;
  const maxItem = currentPage * perPage; // 6;
  const data = [];
  resource.forEach(function (item, i) {
    //有10筆資料，0~9，所以i + 1，來配合上面頁數
    let itemNum = i + 1;
    if (itemNum >= minItem && itemNum <= maxItem) {
      data.push(item);
    }
  });
  console.log(
    '總資料',
    totalResult,
    '每頁數量',
    perPage,
    '總頁數',
    pageTotal,
    '每一頁第一筆',
    minItem,
    maxItem
  );
  return {
    pagination: {
      pageTotal: pageTotal,
      currentPage,
      hasPrev: currentPage > 1,
      hasNext: currentPage < pageTotal,
      category,
    },
    data,
    log: {
      總資料: totalResult,
      每頁數量: perPage,
      總頁數: pageTotal,
      每一頁第一筆: minItem,
      每一頁最後一筆: maxItem,
    },
  };
}
