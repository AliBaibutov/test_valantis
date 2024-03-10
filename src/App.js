import React, { useCallback, useEffect, useMemo, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { paginate } from "./utils/paginate";
import Pagination from "./pagination";
import _ from "lodash";
import Filters from "./filters";

const date = new Date();
const year = String(date.getFullYear());
const month =
  date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
const fullDate = year + month + day;

export const API_URL = "http://api.valantis.store:40000/";
export const HEADERS = {
  "Content-Type": "application/json",
  "X-Auth": CryptoJS.MD5(`Valantis_${fullDate}`),
};

const ITEMS_PER_PAGE = 50;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [countErrors, setCountErrors] = useState(0);
  const [filteredIds, setFilteredIds] = useState(null);

  useEffect(function initialDataFetch() {
    if (!isInitialDataLoaded) {
      getItems();
      setIsInitialDataLoaded(true);
    }
  }, []);

  useEffect(
    function fetchItems() {
      if (isInitialDataLoaded) {
        getItems();
      }
    },
    [currentPage]
  );

  const getItems = useCallback(
    async function () {
      try {
        const idsData = await axios.post(
          API_URL,
          {
            action: "get_ids",
            params: {
              offset:
                currentPage === 1 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
              limit: ITEMS_PER_PAGE,
            },
          },
          {
            headers: HEADERS,
          }
        );
        const ids = idsData.data.result;

        const { data } = await axios.post(
          API_URL,
          {
            action: "get_items",
            params: { ids: ids },
          },
          {
            headers: HEADERS,
          }
        );
        const items = data.result;
        const filteredItems = _.uniqBy(items, "id");
        setItems(filteredItems);
        console.log(filteredItems);
      } catch (error) {
        if (countErrors === 0) {
          setCountErrors(countErrors + 1);
          getItems();
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, countErrors]
  );

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const preparedItems = useMemo(() => {
    if (filteredIds === null) {
      return items;
    }

    if (_.isEmpty(filteredIds)) {
      return [];
    }
    return items.filter((item) => {
      return filteredIds.includes(item.id);
    });
  }, [items, filteredIds]);

  return !isLoading ? (
    <div className="container">
      <Filters setFilteredIds={setFilteredIds} />
      <div className="content">
        <div className="content__title">ID</div>
        <div className="content__title">Наименование</div>
        <div className="content__title">Цена</div>
        <div className="content__title">Бренд</div>
      </div>
      {preparedItems.map((item, i) => (
        <div key={i} className="content">
          <div className="content__item">{item.id}</div>
          <div className="content__item">{item.product}</div>
          <div className="content__item">{item.price}</div>
          <div className="content__item">{item.brand}</div>
        </div>
      ))}
      <Pagination
        itemsCount={ITEMS_PER_PAGE * currentPage}
        pageSize={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
