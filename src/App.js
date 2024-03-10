import React, { useCallback, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { paginate } from "./utils/paginate";
import Pagination from "./pagination";
import _ from "lodash";

const ITEMS_PER_PAGE = 50;

const date = new Date();
const year = String(date.getFullYear());
const month =
  date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
const fullDate = year + month + day;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [countErrors, setCountErrors] = useState(0);

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
          "http://api.valantis.store:40000/",
          {
            action: "get_ids",
            params: {
              offset:
                currentPage === 1 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
              limit: ITEMS_PER_PAGE,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Auth": CryptoJS.MD5(`Valantis_${fullDate}`),
            },
          }
        );
        const ids = idsData.data.result;

        const { data } = await axios.post(
          "http://api.valantis.store:40000/",
          {
            action: "get_items",
            params: { ids: ids },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Auth": CryptoJS.MD5(`Valantis_${fullDate}`),
            },
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

  const count = items.length;
  // const itemsCrop = paginate(items, currentPage, ITEMS_PER_PAGE);

  return !isLoading ? (
    <div className="container">
      <div className="content">
        <div className="content__title">ID</div>
        <div className="content__title">Наименование</div>
        <div className="content__title">Цена</div>
        <div className="content__title">Бренд</div>
      </div>
      {items.map((item, i) => (
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
