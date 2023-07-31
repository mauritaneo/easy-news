import type { AppType, AppProps } from 'next/app';
import { trpc } from '../utils/trpc';
import React from 'react';
import { useQuery, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import Pagination from "../components/Pagination";
// Currently unused imports
import { Router, useRouter } from 'next/router';
import { withRouter } from 'next/router';

if (typeof window !== "undefined") {
const mountElement = document.getElementById('root');
};



const queryClient = new QueryClient();

const getNewsData = async ({ queryKey }) => {
  let page = queryKey[1];
  let res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=943ab199552749339456e8d246e23d73`
  );
  let data = await res.json();

  // Retrieve theme_posts_per_page from WordPress REST API
  let themePostsPerPageRes = await fetch('http://localhost/easysouls/wp-json/theme_settings/v1/posts_per_page');
  let themePostsPerPage = await themePostsPerPageRes.json();

  // Split articles
  let articlesPerPage = Number(themePostsPerPage.theme_posts_per_page);
  let startIndex = (page - 1) * articlesPerPage;
  let endIndex = startIndex + articlesPerPage;
  let totalResults = data.articles.length;
  let articles = data.articles.slice(startIndex, endIndex);

  return { articles, totalResults, articlesPerPage};
};



const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  const [isLoading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const [themePostsPerPage, setThemePostsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('http://localhost/easysouls/wp-json/theme_settings/v1/posts_per_page')
      .then(response => response.json())
      .then(data => {
        setThemePostsPerPage(data.theme_posts_per_page);
      })
  }, [currentPage]);

  const { isLoading: isNewsLoading, isError, isSuccess, data } = useQuery(
  ["news", currentPage],
  getNewsData,
  {
    keepPreviousData: true,
  }
);

  if (isError) return (
      <div className="center">Something went wrong, Please try again.</div>
    );

    return (
      <>
        {isSuccess && (
          <div id="root" className="container">
            <div>
              {data.articles.map((d) => (
                <div className="news-card" key={d.title}>
                  <h3>{d.title}</h3>
                  <p>{d.description}</p>
                  <a className="more-link" href={d.url} target="_blank">more...</a>
                </div>
              ))}
            </div>
            <Pagination 
              data={data}
              totalResults={data.totalResults}
              currentPage={currentPage}
              onPageChange={currentPage => setCurrentPage(currentPage)}
              articlesPerPage={data.articlesPerPage}
            />
          </div>
        )}
      </>
    );
};

// Client-side rendering
if (typeof window !== "undefined") {
  const mountElement = document.getElementById("root");
  if (mountElement) {
    ReactDOM.createRoot(mountElement).render(
    <QueryClientProvider client={queryClient}>
    <MyApp pageProps={{ pageId: 1 }} Component={() => <></>} router={undefined} />
    </QueryClientProvider>
    );
  }
};

export default trpc.withTRPC(MyApp);