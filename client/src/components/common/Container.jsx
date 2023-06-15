import React from "react";

const Container = ({ children }) => {
  return (
    <section className="container" style={{padding:"0 .7rem"}}>
      {children}
    </section>
  );
};

export default Container;
