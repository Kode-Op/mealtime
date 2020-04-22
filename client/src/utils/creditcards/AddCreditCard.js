//Import libraries
import axios from "axios";

export default function AddCreditCard(id) {
  return axios.post("/api/creditCards/add/" + id);
}