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
  const paginationArray = createPaginationArray(currentPage, totalPages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [updatedPaginationArray, setUpdatedPaginationArray] = useState<PaginationItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    const finalLink = `http://localhost/easysouls/news/page/pageno/#index`;
    let updatedPaginationArray: PaginationItem[] = [];

    if (Array.isArray(paginationArray)) {
      updatedPaginationArray = paginationArray.map(pageNo => {
        return {
          pageNo,
          link: finalLink.replace('pageno', pageNo.toString())
        }
      });
    }

    setUpdatedPaginationArray(updatedPaginationArray);
    setIsLoading(false);
    setIsSuccess(true);
  }, [currentPage, paginationArray]);

  const getPageLink = (pageNo: number) => {
    return `news/page/${pageNo}/#index`
  };

  if (isLoading) return <div className="center">Loading...</div>;
  else if (isError) return <div className="center">Something went wrong, Please try again.</div>;
  else if (isSuccess)
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