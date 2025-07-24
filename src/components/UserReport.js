import React, { useEffect, useState } from "react";
import { Box, Text, Heading, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

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
        const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/reports?user_id=eq.${user.id}&select=report,name,phone,other_details`;
        const response = await fetch(url, {
          headers: {
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Could not load your report. Please try again later.');
        const data = await response.json();
        setReport(data && data[0] ? data[0] : null);
      } catch (err) {
        setError("Could not load your report. Please try again later.");
        setReport(null);
      } finally {
        setLoading(false);
      }
    }
    getReport();
  }, [user]);

  if (loading) return <Spinner size="md" />;
  if (error) return (<Alert status="error" mb={2}><AlertIcon />{error}</Alert>);
  if (!report) return <Text>No report found.</Text>;

  return (
    <Box mt={4}>
      <Heading size="md" mb={2}>Your Previous Report</Heading>
      <Text><strong>Name:</strong> {report.name}</Text>
      <Text><strong>Phone:</strong> {report.phone || "N/A"}</Text>
      {report.other_details && <Text><strong>Other Details:</strong> {report.other_details}</Text>}
      <Box mt={2}>
        <a href={report.report} target="_blank" rel="noopener noreferrer" style={{ color: '#3182ce', textDecoration: 'underline' }}>
          View / Download Report
        </a>
      </Box>
    </Box>
  );
}

export default UserReport;
