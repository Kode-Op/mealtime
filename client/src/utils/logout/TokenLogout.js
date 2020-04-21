//Import libraries
import axios from "axios";

export default function TokenLogout(token) {
  return axios.get("/api/users/logout/" + token);
}