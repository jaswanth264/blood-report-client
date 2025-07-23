// /src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

function AdminDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      const res = await axios.get("/api/admin/reports");
      setReports(res.data);
    }
    fetchReports();
  }, []);

  return (
    <Box>
      <Heading mb={4}>Admin Dashboard</Heading>
      <VStack spacing={4} align="stretch">
        {reports.map((r, i) => (
          <Box key={i} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">{r.email}</Text>
            <Text whiteSpace="pre-wrap">{r.report}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default AdminDashboard;
