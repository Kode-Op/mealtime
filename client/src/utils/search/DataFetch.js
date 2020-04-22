//Import libraries
import axios from "axios";

export default function DataFetch(user) {
  return axios.get("/api/restaurants");
}