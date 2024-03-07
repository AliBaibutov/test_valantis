import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { paginate } from "./utils/paginate";
import Pagination from "./pagination";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getItems();
  }, []);

  const date = new Date();
  const year = String(date.getFullYear());
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const fullDate = year + month + day;

  async function getItems() {
    try {
      const idsData = await axios.post(
        "http://api.valantis.store:40000/",
        {
          action: "get_ids",
          // params: { ids: ["1789ecf3-f81c-4f49-ada2-83804dcc74b0"] },
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
      setItems(items);
      setIsLoading(false);
      console.log(items);
    } catch (error) {
      console.error(error);
    }
  }

  const pageSize = 50;

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  // const filteredUsers = searchQuery
  //     ? users.filter(
  //           (user) =>
  //               user.name
  //                   .toLowerCase()
  //                   .indexOf(searchQuery.toLowerCase()) !== -1
  //       )
  //     : selectedProf
  //     ? users.filter(
  //           (user) =>
  //               JSON.stringify(user.profession) ===
  //               JSON.stringify(selectedProf)
  //       )
  //     : users;

  const count = items.length;
  // const sortedUsers = _.orderBy(
  //     filteredUsers,
  //     [sortBy.path],
  //     [sortBy.order]
  // );
  const itemsCrop = paginate(items, currentPage, pageSize);
  // const clearFilter = () => {
  //     setSelectedProf();
  // }

  return !isLoading ? (
    <>
      <div>
        <ul>
          {itemsCrop.map((item, i) => (
            <li key={i}>{item.product}</li>
          ))}
        </ul>
      </div>
      <Pagination
        itemsCount={count}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
