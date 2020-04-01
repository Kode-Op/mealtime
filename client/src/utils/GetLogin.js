import { getFromStorage } from "./storage";
import axios from "axios";

const GetLogin = setState => {
  const obj = getFromStorage("mealtime");
  let token = "";
  if (obj !== null) {
    token = obj.token;
    // Verify token
    axios
      .get("/api/users/verify/" + token)
      .then(tokenResponse => {
        if (tokenResponse.data.success) {
          axios
            .get("/api/users/getUser/" + token)
            .then(userResponse => {
              axios
                .get("/api/users/" + userResponse.data.userId)
                .then(idResponse => {
                  setState({ user: idResponse.data, isUserLoaded: true });
                })
                .catch(error => {
                  console.log("Error in getting /api/users: " + error);
                  setState({ isUserLoaded: true });
                });
            })
            .catch(error => {
              console.log("Error in getting /api/users/getUser: " + error);
              setState({ isUserLoaded: true });
            });
        } else {
          console.log("Error in getting /api/users/verify");
          setState({ isUserLoaded: true });
        }
      })
      .catch(error => {
        console.log(error);
        setState({ isUserLoaded: true });
      });
  } else {
    console.log("User isn't logged in");
    setState({ isUserLoaded: true });
  }
};

export default GetLogin;
