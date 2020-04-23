//Import libraries
import axios from "axios";

export function AddOrder(pkg) {
  return axios.post("/api/orders/add/", pkg);
}

export function GetOrderByID(id) {
  return axios.get("/api/orders/" + id);
}

export function GetOrdersByRestaurantID(id) {
  return axios.get("/api/orders/byRestaurant/" + id);
}

export function GetOrdersByUserID(id) {
  return axios.get("/api/orders/byUser/" + id);
}

export function DeleteOrder(id) {
  return axios.get("/api/orders/cancel/" + id);
}
