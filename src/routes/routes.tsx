/**
 * AppRoutes
 */
import { lazy, Suspense } from "react";
import { Route } from "react-router";
import { HashRouter as Router, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AppLoader } from "../components/app-loader";
import { NotFound } from "../pages/not-found";

const Instruments = lazy(() => import("../pages/instruments"));
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
          <Route path="/instruments" element={<Instruments />} />
          <Route path="/quotes/:symbol" element={<Quotes />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/instruments" />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default AppRoutes;
