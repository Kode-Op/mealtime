//Import libraries
import axios from "axios";

export default function TokenCreation(user) {
  return axios.post("/api/users/login", user);
}