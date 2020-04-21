//Import libraries
import axios from "axios";

export default function EditMenuItem(id, pkg) {
    return axios.post("/api/menuItems/update/" + id, pkg);
}