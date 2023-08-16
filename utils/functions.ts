import { PaginationItem } from '../components/Pagination';
export const createPaginationArray = (currentPage: number, totalPages: number) => {
  let loopableArray: PaginationItem[] = [];
  const finalLink = `https://easysoul.netlify.app/news/page/pageno/#index`;

  if (1 === totalPages) {
    return loopableArray;
  }

  loopableArray.push({ pageNo: 1, link: getPageLink(1) });

  if (totalPages > 4) {
    loopableArray.push({ pageNo: '...', link: '#' });
  }

  if (0 < currentPage - 2) {
    loopableArray.push({ pageNo: currentPage - 2, link: getPageLink(currentPage - 2) });
  }

  if (0 < currentPage - 1) {
    loopableArray.push({ pageNo: currentPage - 1, link: getPageLink(currentPage - 1) });
  }

  loopableArray.push({ pageNo: currentPage, link: getPageLink(currentPage) });

  if (totalPages >= currentPage + 1) {
    loopableArray.push({ pageNo: currentPage + 1, link: getPageLink(currentPage + 1) });
  }

  if (totalPages >= currentPage + 2) {
    loopableArray.push({ pageNo: currentPage + 2, link: getPageLink(currentPage + 2) });
  }

  if (-1 === loopableArray.findIndex((item) => item.pageNo === totalPages)) {
    loopableArray.push({ pageNo: totalPages, link: getPageLink(totalPages) });
  }

  if (totalPages > 4) {
    const ellipsisIndex = loopableArray.findIndex((element) => element.pageNo === "...");
    const totalPagesIndex = loopableArray.findIndex((element) => element.pageNo === totalPages);

    if (ellipsisIndex !== -1 && totalPagesIndex !== -1) {
      loopableArray.splice(ellipsisIndex, 1); // Remove the "..." element
      loopableArray.splice(totalPagesIndex - 1, 0, { pageNo: '...', link: '#' }); // Insert the "..." element before totalPages
    }
  }

  if (totalPages === currentPage) {
    const ellipsisIndex = loopableArray.findIndex((element) => element.pageNo === "...");
    const pageOneIndex = loopableArray.findIndex((element) => element.pageNo === 1);

    if (ellipsisIndex !== -1 && pageOneIndex !== -1) {
      loopableArray.splice(ellipsisIndex, totalPages); // Remove the "..." element
      loopableArray.splice(pageOneIndex +1, 0, { pageNo: '...', link: '#' }); // Insert the "..." element after 1
    }
  }

  if (currentPage === 2 || currentPage === 3) {
    loopableArray.splice(1, 1);
  }

  if (currentPage >= 2 && currentPage !== 3) {
    // Add the ... element after the first element of the array
    loopableArray.splice(1, 0, { pageNo: '...', link: '#' });
  }

  if (currentPage === 3) {
    // Add the ... element after the first element of the array
    loopableArray.splice(2, 0, { pageNo: '...', link: '#' });
  }

  if (currentPage === totalPages) {
    loopableArray.splice(1, 1);
  }

  function getPageLink(pageNo: number) {
    return finalLink.replace('pageno', pageNo.toString());
  }

  return loopableArray;
};


