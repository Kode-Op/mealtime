import React from "react";

const ReviewComponent = props => (
  <tr>
    <td>{props.Review._id}</td>
    <td>
      {props.Review.review.map((currentReview, i) => (
        <React.Fragment>
          Question {i + 1}: {currentReview + ""}
          <br />
        </React.Fragment>
      ))}
    </td>
    <td>{props.Review.restaurantid}</td>
    <td>{props.Review.userid}</td>
    <td>{props.Review.createdAt}</td>
    <td>{props.Review.updatedAt}</td>
    <td>{props.Review.__v}</td>
  </tr>
);

export default ReviewComponent;
