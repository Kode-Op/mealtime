//Import libraries
import axios from "axios";

export default function DeleteRestaurant(id) {
    return axios.delete("/api/restaurants/" + id);
}