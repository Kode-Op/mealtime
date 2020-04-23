//Import libraries
import axios from "axios";

export function UpdateUserAddress(id, pkg) {
  return axios.post("/api/users/updateAddress/" + id, pkg);
}

export function UpdateUserPhoneNumber(id, pkg) {
  return axios.post("/api/users/updatePhone/" + id, pkg);
}

export function UpdateUserEmail(id, pkg) {
  return axios.post("/api/users/updateEmail/" + id, pkg);
}

export function UpdateUserName(id, pkg) {
  return axios.post("/api/users/updateName/" + id, pkg);
}

export function UpdateUserPassword(id, pkg) {
  return axios.post("/api/users/updatePassword/" + id, pkg);
}

export function UpdateUserTags(id, pkg) {
  return axios.post("/api/users/updateTags/" + id, pkg);
}

export function AddUser(user) {
  return axios.post("/api/users/add", user);
}

export function AddUserToken(user) {
  return axios.post("/api/users/login", user);
}

export function DeleteUserToken(token) {
  return axios.get("/api/users/logout/" + token);
}
