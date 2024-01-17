import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header";

import LandingPage from "./components/LandingPage";
function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <LandingPage />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Header />
                </>
              }
            />
          </Routes>
        </Router>

        <div className="Footer">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}

export default App;
