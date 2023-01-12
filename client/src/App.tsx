import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NavFooter from "./pages/NavFooter";

const Home = React.lazy(() => import("./pages/Home"));

export default function App() {
    return (
        <Router>
            <Suspense fallback={<h1>Loading...</h1>}>
                <Routes>
                    <Route path="/" element={<NavFooter />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}
