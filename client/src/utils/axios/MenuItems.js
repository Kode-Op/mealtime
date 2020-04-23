//Import libraries
import axios from "axios";

export function AddMenuItem(pkg) {
  return axios.post("/api/menuItems/add/", pkg);
}

export function DeleteMenuItem(id) {
  return axios.delete("/api/menuItems/" + id);
}

export function UpdateMenuItem(id, pkg) {
  return axios.post("/api/menuItems/update/" + id, pkg);
}

export function GetMenuItemsByRestaurantID(id) {
  return axios.get("/api/menuitems/" + id);
}
