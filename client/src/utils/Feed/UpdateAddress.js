//Import libraries
import axios from "axios";

export default function UpdateAddress(id, pkg) {
  return axios.post("/api/users/updateAddress/" + id, pkg);
}