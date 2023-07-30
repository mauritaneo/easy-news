export const createPaginationArray = (currentPage: number, totalPages: number) => {
  let loopableArray: (number | string)[] = [];

  if (1 === totalPages) {
    return loopableArray;
  }

  loopableArray.push(1);

  if (totalPages > 4) {
    loopableArray.push('...');
  }

  if (0 < currentPage - 2) {
    loopableArray.push(currentPage - 2);
  }

  if (0 < currentPage - 1) {
    loopableArray.push(currentPage - 1);
  }

  loopableArray.push(currentPage);

  if (totalPages >= currentPage + 1) {
    loopableArray.push(currentPage + 1);
  }

  if (totalPages >= currentPage + 2) {
    loopableArray.push(currentPage + 2);
  }

  if (-1 === loopableArray.indexOf(totalPages)) {
    loopableArray.push(totalPages);
  }

  if (totalPages > 4) {
    const ellipsisIndex = loopableArray.findIndex((element) => element === "...");
    const totalPagesIndex = loopableArray.findIndex((element) => element === totalPages);

    if (ellipsisIndex !== -1 && totalPagesIndex !== -1) {
      loopableArray.splice(ellipsisIndex, 1); // Remove the "..." element
      loopableArray.splice(totalPagesIndex - 1, 0, "..."); // Insert the "..." element before totalPages
    }
  }

  if (totalPages === currentPage) {
    const ellipsisIndex = loopableArray.findIndex((element) => element === "...");
    const pageOneIndex = loopableArray.findIndex((element) => element === 1);

    if (ellipsisIndex !== -1 && pageOneIndex !== -1) {
      loopableArray.splice(ellipsisIndex, totalPages); // Remove the "..." element
      loopableArray.splice(pageOneIndex +1, 0, "..."); // Insert the "..." element after 1
    }
  }

  if (currentPage === 2 || currentPage === 3) {
    loopableArray.splice(1, 1);
  }

  if (currentPage >= 2 && currentPage !== 3) {
    // Add the ... element after the first element of the array
    loopableArray.splice(1, 0, '...');
  }

  if (currentPage === 3) {
    // Add the ... element after the first element of the array
    loopableArray.splice(2, 0, '...');
  }

  if (currentPage === totalPages) {
    loopableArray.splice(1, 1);
  }


  return loopableArray;
};


