//Import libraries
import axios from "axios";

export default function UpdateEmail(id, pkg) {
    return axios.post("/api/users/updateEmail/" + id, pkg);
}