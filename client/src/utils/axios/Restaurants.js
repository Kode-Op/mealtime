//Import libraries
import axios from "axios";

export function AddRestaurant(pkg) {
  return axios.post("/api/restaurants/add/", pkg);
}

export function DeleteRestaurant(id) {
  return axios.delete("/api/restaurants/" + id);
}

export function UpdateRestaurant(id, pkg) {
  return axios.post("/api/restaurants/update/" + id, pkg);
}

export function GetRestaurantByUserID(id) {
  return axios.get("/api/restaurants/byOwner/" + id);
}

export function GetRestaurantByID(id) {
  return axios.get("/api/restaurants/" + id);
}

export function GetRestaurants() {
  return axios.get("/api/restaurants");
}
