//Import libraries
import axios from "axios";

export default function GetCreditCardByID(id) {
  return axios.get("/api/creditCards/" + id);
}