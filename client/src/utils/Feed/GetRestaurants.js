//Import libraries
import axios from "axios";

export default function GetRestaurants() {
  return axios.get("/api/restaurants");
}