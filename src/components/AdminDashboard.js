// /src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

function AdminDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("report, user_id")
        .order("inserted_at", { ascending: false });
      if (error) {
        setReports([]);
      } else {
        setReports(data || []);
      }
    }
    fetchReports();
  }, []);

  return (
    <Box>
      <Heading mb={4}>Admin Dashboard</Heading>
      <VStack spacing={4} align="stretch">
        {reports.map((r, i) => (
          <Box key={i} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">User ID: {r.user_id}</Text>
            <Text whiteSpace="pre-wrap">{r.report}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default AdminDashboard;
