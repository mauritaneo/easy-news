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
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    },
  },
});

const useThemeSettings = () => {
  const { isLoading, isError, data } = useQuery(
    ["themeSettings"],
    async () => {
      const response = await fetch('https://517e-82-61-220-104.ngrok-free.app/easysouls/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              themeSettings {
                postsPerPage
              }
            }
          `
        })
      });
      const { data } = await response.json();
      return data.themeSettings.postsPerPage;
    }
  );

  return { isLoading, isError, data };
};

const getNewsData = async ({ queryKey }, themeSettings) => {
  let page = queryKey[1];
  let cacheKey = `news:${page}`;
  let cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  let res = await fetch(
    `https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=11a109f090b2d2bfa163bd4c277743d5`
  );

  // Retrieve theme_posts_per_page from GraphQL endpoint
  if (themeSettings.isError) {
    console.error("Error fetching theme settings");
    return;
  }

  // Split articles
  let articlesPerPage = Number(themeSettings.data);
  let startIndex = (page - 1) * articlesPerPage;
  let endIndex = startIndex + articlesPerPage;
  let data = await res.json();
  let totalResults = data.articles.length;
  let articles = data.articles.slice(startIndex, endIndex);

  // Cache the data with a TTL of 24 hours
  localStorage.setItem(cacheKey, JSON.stringify({ articles, totalResults, articlesPerPage }));

  return { articles, totalResults, articlesPerPage};
};

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  const [isLoading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const [currentPage, setCurrentPage] = useState(1);

  const themeSettings = useThemeSettings();

  const { isLoading: isNewsLoading, isError, isSuccess, data } = useQuery(
    ["news", currentPage],
    (queryKey) => getNewsData(queryKey, themeSettings),
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
