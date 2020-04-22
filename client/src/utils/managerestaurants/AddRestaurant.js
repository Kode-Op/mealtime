//Import libraries
import axios from "axios";

export default function AddRestaurant(pkg) {
  return axios.post("/api/restaurants/add/", pkg);
}