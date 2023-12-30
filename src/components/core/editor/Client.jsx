import React from "react";
import Avatar from "react-avatar";

const Client = ({ username ,size}) => {
  return (
    <div className="client">
      <Avatar name={username} size={size} round="14px" />
      <span className="userName">{username}</span>
    </div>
  );
};

export default Client;
