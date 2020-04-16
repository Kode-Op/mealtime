import React, { Component } from "react";
import axios from "axios";
 
export default class Upload extends Component {
  
  onSubmit(e) {
    e.preventDefault();
    console.log("was here");
  }
  /*
  <form action="../../../routes/images/upload" method="POST" encType="multipart/form-data">
  */
  render() {
    return (
  <div className="container">
    <div className="row">
      <div className="col-md-6 m-auto">
        <h1 className="text-center display-4 my-4">File Uploads</h1>
        <form onSubmit={this.onSubmit} encType="multipart/form-data">
          <div class="custom-file mb-3">
            <input type="file" name="file" id="file" class="custom-file-input" accept="image/*"/>
            <label htmlFor="file" class="custom-file-label">Choose File</label>
          </div>
          <input type="submit" value="Submit" class="btn btn-primary btn-block"/>
        </form>
      </div>
    </div>
  </div>
      );
    }
  }
