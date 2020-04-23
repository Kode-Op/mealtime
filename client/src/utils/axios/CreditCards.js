//Import libraries
import axios from "axios";

export function AddCreditCard(pkg) {
  return axios.post("/api/creditCards/add/", pkg);
}

export function DeleteCreditCard(id) {
  return axios.delete("/api/creditCards/" + id);
}

export function GetCreditCardByID(id) {
  return axios.get("/api/creditCards/" + id);
}
