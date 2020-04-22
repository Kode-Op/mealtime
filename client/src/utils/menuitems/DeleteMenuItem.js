//Import libraries
import axios from "axios";

export default function DeleteMenuItem(id) {
    return axios.delete("/api/menuItems/" + id);
}