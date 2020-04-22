//Import libraries
import axios from "axios";

export default function UserAdd(user) {
  return axios.post("/api/users/add", user);
}