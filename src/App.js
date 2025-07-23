// /src/App.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import ReportForm from "./components/ReportForm";
import UserReport from "./components/UserReport";
import AdminDashboard from "./components/AdminDashboard";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <Flex p={4} bg="teal.500" color="white" alignItems="center">
      <Heading size="md" cursor="pointer" onClick={() => navigate("/")}>
        Blood Report App
      </Heading>
      <Spacer />
      {user && (
        <>
          <Button variant="link" color="white" onClick={() => navigate("/admin")}>
            Admin
          </Button>
          <Button ml={4} variant="outline" color="white" onClick={onLogout}>
            Logout
          </Button>
        </>
      )}
    </Flex>
  );
}

function AppRoutes({ user, setUser }) {
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    toast({
      title: "Login successful!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    navigate("/login");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Box maxW="600px" mx="auto" my={6} p={4}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <>
                  <ReportForm user={user} />
                  <UserReport user={user} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              user ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}

export default App;
