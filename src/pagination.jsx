import React from "react";
import _ from "lodash";

const Pagination = ({ itemsCount, pageSize, onPageChange, currentPage }) => {
  const pageCount = Math.ceil(itemsCount / pageSize);
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1);
  console.log(pages);
  const pagesOnScreen = pages.filter((p) => {
    return (
      p === 1 ||
      p === currentPage ||
      p === currentPage - 1 ||
      p === currentPage + 1 ||
      p === pages.length ||
      p === pages.length - 1
    );
  });

  pagesOnScreen.map((p, i) => {
    const def = pagesOnScreen[i + 1] - pagesOnScreen[i];
    return def > 1 ? pagesOnScreen.splice(i + 1, 0, "...") : pagesOnScreen;
  });

  //   console.log(pagesOnScreenWithDots);

  return (
    <nav>
      <ul className="pagination">
        {pagesOnScreen.map((page, i) => (
          <li
            className={"page-item" + (page === currentPage ? " active" : "")}
            key={i}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
