//Import libraries
import axios from "axios";

export default function UpdateName(id, pkg) {
    return axios.post("/api/users/updateName/" + id, pkg);
}