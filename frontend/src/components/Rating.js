import React from "react";
import propTypes from "prop-types";

const Rating = ({ value, text, color }) => {
    return (
        <div className="rating">
            {[1, 2, 3, 4, 5].map((num) => (
                <span key={num}>
                    <i
                        style={{ color }}
                        className={
                            value >= num
                                ? "fas fa-star"
                                : value >= num - 0.5
                                ? "fas fa-star-half-alt"
                                : "far fa-star"
                        }
                    />
                </span>
            ))}
            <span>{text && text}</span>
        </div>
    );
};

Rating.defaultProps = {
    color: "#f8e825",
};

Rating.propTypes = {
    value: propTypes.number.isRequired,
    text: propTypes.string.isRequired,
    color: propTypes.string,
};

export default Rating;
