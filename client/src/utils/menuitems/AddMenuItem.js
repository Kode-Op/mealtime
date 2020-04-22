//Import libraries
import axios from "axios";

export default function AddMenuItem(pkg) {
    return axios.post("/api/menuItems/add/" + pkg);
}