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
      // Fetch all reports with user info
      const { data, error } = await supabase
        .from("reports")
        .select("report, user_id, name, phone, other_details, inserted_at")
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
            <Text><strong>Name:</strong> {r.name || 'N/A'}</Text>
            <Text><strong>Phone:</strong> {r.phone || 'N/A'}</Text>
            {r.other_details && <Text><strong>Other Details:</strong> {r.other_details}</Text>}
            <Text><strong>Submitted:</strong> {r.inserted_at ? new Date(r.inserted_at).toLocaleString() : 'N/A'}</Text>
            <Box mt={2}>
              <a href={r.report} target="_blank" rel="noopener noreferrer" style={{ color: '#3182ce', textDecoration: 'underline' }}>
                View / Download Report
              </a>
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default AdminDashboard;
