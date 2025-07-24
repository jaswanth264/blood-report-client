import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ReportForm from "./components/ReportForm";
import UserReport from "./components/UserReport";
import AdminDashboard from "./components/AdminDashboard";
import { ChakraProvider, Box, Button, VStack } from "@chakra-ui/react";
import { supabase } from "./supabaseClient";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Admin check using 'role' from profiles table
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    async function checkAdmin() {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(data?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [session]);

  if (loading) return <div>Loading...</div>;

  return (
    <ChakraProvider>
      <Router>
        <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="md" boxShadow="md">
          {session && (
            <VStack mb={4} align="stretch">
              <Button colorScheme="red" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </Button>
            </VStack>
          )}
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={setSession} />} />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={
                session ? (
                  <>
                    <ReportForm user={session.user} />
                    <UserReport user={session.user} />
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
