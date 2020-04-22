//Import libraries
import axios from "axios";

export default function DelCreditCardByID(id) {
  return axios.delete("/api/creditCards/" + id);
}