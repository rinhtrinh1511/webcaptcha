import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ATM from "./Pages/Topup/ATM";
import Card from "./Pages/Topup/Card";
import Control from "./Pages/Control/Control";
import Detail from "./Components/Detail/detail";
import HomePage from "./Pages/Main/main";
import Notfound from "./Components/404/404";
import CaptchaMB from "./Pages/CaptchaMB/captchaMB";
import ProtectedRoute from "./utils/protectedRoute";
import PublicRoute from "./utils/publicRoute";
import Tool from "./Pages/Tool/tool";
import CaptchaNro from "./Pages/CaptchaNro/captchaNro";
import ResetPassword from "./Pages/Reset-password/restpassword";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/captcha-nro" element={<CaptchaNro />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/atm"
            element={
              <ProtectedRoute>
                <ATM />
              </ProtectedRoute>
            }
          />
          <Route
            path="/card"
            element={
              <ProtectedRoute>
                <Card />
              </ProtectedRoute>
            }
          />
          <Route
            path="/control"
            element={
              <ProtectedRoute>
                <Control />
              </ProtectedRoute>
            }
          />
          <Route path="/view/:id" element={<Detail />} />
          <Route path="/captcha-mbbank" element={<CaptchaMB />} />
          <Route path="/tools" element={<Tool />} />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
