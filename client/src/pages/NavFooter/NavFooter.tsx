import React from "react";
import "./NavFooter.css";
import { Outlet } from "react-router-dom";

export default function Nav() {
    return (
        <>
            <nav className="nav"></nav>
            <Outlet />
            <footer></footer>
        </>
    );
}
