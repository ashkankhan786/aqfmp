import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg text-white py-4 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} Copyright by <span className="font-semibold">Kuldeep Singh</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
