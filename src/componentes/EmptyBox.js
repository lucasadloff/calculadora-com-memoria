import React from "react";
import "./EmptyBox.css";

export const EmptyBox = props => 
    <div className="empty-box">
        {props.input}
    </div>;