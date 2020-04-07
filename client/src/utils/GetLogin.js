//Import libraries
import axios from "axios";

//Import utilties
import { getFromStorage } from "./storage";

export default function GetLogin() {
  return new Promise((resolve, reject) => {
    const obj = getFromStorage("mealtime");
    let token = "";
    if (obj !== null) {
      token = obj.token;
      // Verify token
      axios
        .get("/api/users/verify/" + token)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject("Not logged in");
    }
  });
}
