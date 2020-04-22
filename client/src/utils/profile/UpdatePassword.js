//Import libraries
import axios from "axios";

export default function UpdatePassword(id, pkg) {
    return axios.post("/api/users/updatePassword/" + id, pkg);
}