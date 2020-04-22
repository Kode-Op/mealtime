//Import libraries
import axios from "axios";

export default function GetRestaurantByID(id) {
  return axios.get("/api/restaurants/byOwner/" + id);
}