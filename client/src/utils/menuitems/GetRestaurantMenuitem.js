//Import libraries
import axios from "axios";

export default function GetRestaurantMenuitem(id) {
    return axios.get("/api/menuitems/" + id);
}