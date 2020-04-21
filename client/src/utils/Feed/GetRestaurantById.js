//Import libraries
import axios from "axios";

export default function GetRestaurantById() {
  return axios.get("/api/restaurants");
}