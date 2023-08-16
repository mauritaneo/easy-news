import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPaginationArray } from '../utils/functions';

interface PaginationProps {
  data: any;
  totalResults: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  articlesPerPage: number;
}

type PaginationItem = {
  pageNo: string | number;
  link: string;
};

export const Pagination: React.FC<PaginationProps> = ({
  data,
  totalResults,
  currentPage,
  onPageChange,
  articlesPerPage
}) => {
  const totalArticles = data.totalResults;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const isThereNextPage = currentPage < totalPages;
  const isTherePreviousPage = currentPage > 1;

const [updatedPaginationArray, setUpdatedPaginationArray] = useState<PaginationItem[]>([]);


    useEffect(() => {
    const newPaginationArray = createPaginationArray(currentPage, totalPages);
    setUpdatedPaginationArray(newPaginationArray);
  }, [currentPage, totalPages]);

  const getPageLink = (pageNo: number) => {
    return `news/page/${pageNo}/#index`
  };

  return (
    <div className='pagination-links'>
      {isTherePreviousPage &&
        <Link
          href={getPageLink(currentPage)}
          className='prev page-numbers'
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage - 1);
          }}
        >
          « Previous
        </Link>
      }

      {updatedPaginationArray.map((item: any, index: number) => {
        if (currentPage !== item.pageNo) {
          return (            
            <React.Fragment key={`${item.pageNo}-${index}`}>
              {item.pageNo === '...' ? (
                // ... element
                <span className='page-numbers dots'>
                  {item.pageNo}
                </span>
              ) : (
                // Page number links
                <Link
                  className="page-numbers"
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(item.pageNo);
                  }}
                >
                  {item.pageNo}
                </Link>
              )}
            </React.Fragment>
          );
        }
      })}

      {isThereNextPage &&
        <Link
          href={getPageLink(currentPage)}
          className='next page-numbers'
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage + 1);
          }}
        >
          Next »
        </Link>
      }
    </div>
  );
};

export default Pagination;

export type { PaginationItem };