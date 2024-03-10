import { useEffect, useState } from "react";
import { API_URL, HEADERS } from "./App";
import axios from "axios";
import { isEmpty } from "lodash";

const Filters = ({ setFilteredIds }) => {
  const [fields, setFields] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    requestFields();
  }, []);

  useEffect(() => {
    requestFilters();
  }, [filters]);

  async function requestFields() {
    try {
      const fieldsResponse = await axios.post(
        API_URL,
        {
          action: "get_fields",
        },
        {
          headers: HEADERS,
        }
      );

      if (fieldsResponse) {
        console.log(fieldsResponse);
        setFields(fieldsResponse.data.result);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function requestFilters() {
    try {
      const filtersResponse = await axios.post(
        API_URL,
        {
          action: "filter",
          params: filters,
        },
        {
          headers: HEADERS,
        }
      );

      setFilteredIds(filtersResponse.data.result);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFilters = (e) => {
    setFilters((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  if (isEmpty(fields)) {
    return null;
  }
  return (
    <div className="d-flex gap-10">
      {fields.map((field) => {
        return (
          <div key={field}>
            <input
              name={field}
              type="text"
              value={filters[field]}
              placeholder={field}
              onChange={handleFilters}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Filters;
