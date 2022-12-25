/**
 * AppRoutes
 */
import { lazy, Suspense } from "react";
import { Route } from "react-router";
import { HashRouter as Router, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AppLoader } from "../components/app-loader";
import { NotFound } from "../pages/not-found";

const Stocks = lazy(() => import("../pages/stocks"));
const Quotes = lazy(() => import("../pages/quotes"));

/**
 * @function @name AppRoutes
 * @returns jsx
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<AppLoader />}>
      <Router>
        <Routes>
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/quotes/:symbol" element={<Quotes />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/stocks" />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default AppRoutes;
