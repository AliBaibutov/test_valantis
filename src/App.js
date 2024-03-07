import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

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

      const itemsData = await axios.post(
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
      setItems(itemsData);
      setIsLoading(false);
      console.log(itemsData);
    } catch (error) {
      console.error(error);
    }
  }

  return !isLoading ? (
    <>
      <div>
        <ul>
          {items.data.result.map((item, i) => (
            <li key={i}>{item.product}</li>
          ))}
        </ul>
      </div>
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
