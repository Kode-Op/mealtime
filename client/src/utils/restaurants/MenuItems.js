//Import libraries
import axios from "axios";

export default function MenuItems(id) {
  return axios.get("/api/menuitems/" + id);
}