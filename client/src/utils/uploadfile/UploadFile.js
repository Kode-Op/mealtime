//Import libraries
import axios from "axios";

export default function UploadFile(formData) {
  return axios.post("/api/files/upload/", formData);
}
