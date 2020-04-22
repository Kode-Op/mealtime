//Import libraries
import axios from "axios";

export default function GetRestaurantData(id) {
  return axios.get("/api/restaurants/" + id);
}