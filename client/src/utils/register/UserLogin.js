//Import libraries
import axios from "axios";

export default function UserLogin(userLogin) {
  return axios.post("/api/users/login", userLogin);
}