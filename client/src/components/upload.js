import React, { Component } from "react";
import axios from "axios";

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("path", "myfile.png"); // CHANGE THIS TO BE SAVE PATH

    axios
      .post("/api/files/upload/", formData)
      .then((response) => {
        console.log(response.data.location); // UPLOAD SUCCESSFUL
      })
      .catch(() => {
        console.log("Upload Failed"); // UPLOAD UNSUCCESSFUL
      });
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>File Upload</h1>
        <input type="file" name="myImage" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
    );
  }
}
