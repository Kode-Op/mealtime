//Import libraries
import axios from "axios";

export default function UpdateTags(id, pkg) {
    return axios.post("/api/users/updateTags/" + id, pkg);
}