import React from "react";
import {
  MdOutlineStarPurple500,
  MdOutlineStarOutline,
  MdOutlineStarHalf,
} from "react-icons/md";

function Rating({ rating, numReviews }) {
  return (
    <div className="rating">
      <span className="review-star">
        {rating >= 1 ? (
          <MdOutlineStarPurple500 />
        ) : rating >= 0.5 ? (
          <MdOutlineStarHalf />
        ) : (
          <MdOutlineStarOutline />
        )}
      </span>
      <span className="review-star">
        {rating >= 2 ? (
          <MdOutlineStarPurple500 />
        ) : rating >= 1.5 ? (
          <MdOutlineStarHalf />
        ) : (
          <MdOutlineStarOutline />
        )}
      </span>
      <span className="review-star">
        {rating >= 3 ? (
          <MdOutlineStarPurple500 />
        ) : rating >= 2.5 ? (
          <MdOutlineStarHalf />
        ) : (
          <MdOutlineStarOutline />
        )}
      </span>
      <span className="review-star">
        {rating >= 4 ? (
          <MdOutlineStarPurple500 />
        ) : rating >= 3.5 ? (
          <MdOutlineStarHalf />
        ) : (
          <MdOutlineStarOutline />
        )}
      </span>
      <span className="review-star">
        {rating >= 5 ? (
          <MdOutlineStarPurple500 />
        ) : rating >= 4.5 ? (
          <MdOutlineStarHalf />
        ) : (
          <MdOutlineStarOutline />
        )}
      </span>
      <span>
        <p>{numReviews} reviews</p>
      </span>
    </div>
  );
}

export default Rating;
