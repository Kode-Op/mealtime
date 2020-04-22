//Import libraries
import axios from "axios";

export default function EditRestaurant(id, pkg) {
  return axios.post("/api/restaurants/update/" + id, pkg);
}