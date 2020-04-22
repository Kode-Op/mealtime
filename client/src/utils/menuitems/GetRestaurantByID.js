//Import libraries
import axios from "axios";

export default function getRestaurantMenuItems(id) {
    return axios.get("/api/menuitems/" + id);
}