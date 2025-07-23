// /src/components/UserReport.js

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";


function UserReport({ user }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getReport() {
      setLoading(true);
      setError("");
      try {
        // Use fetch to add Accept header for Supabase REST endpoint
        const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/reports?select=report&user_id=eq.${user.id}`;
        const response = await fetch(url, {
          headers: {
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Could not load your report. Please try again later.');
        const data = await response.json();
        setReport(data && data[0]?.report ? data[0].report : null);
      } catch (err) {
        setError("Could not load your report. Please try again later.");
        setReport(null);
      } finally {
        setLoading(false);
      }
    }
    getReport();
  }, [user]);

  return (
    <Box mt={4}>
      <Heading size="md" mb={2}>Your Previous Report</Heading>
      {loading ? (
        <Spinner size="md" />
      ) : error ? (
        <Alert status="error" mb={2}>
          <AlertIcon />
          {error}
        </Alert>
      ) : report ? (
        <Box>
          <Text mb={2}>Your uploaded report:</Text>
          <a href={report} target="_blank" rel="noopener noreferrer" style={{ color: '#3182ce', textDecoration: 'underline' }}>
            View / Download Report
          </a>
        </Box>
      ) : (
        <Text>No report found.</Text>
      )}
    </Box>
  );
}

export default UserReport;
