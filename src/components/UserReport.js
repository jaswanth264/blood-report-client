import React, { useEffect, useState } from "react";
import { Box, Text, Heading, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

function UserReport({ user }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getReport() {
      setLoading(true); setError("");
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("report, name, phone, other_details")
          .eq("user_id", user.id)
          .single();
        if (error) throw error;
        setReport(data || null);
      } catch (err) { setError("Could not load your report. Please try again later."); setReport(null); }
      finally { setLoading(false); }
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
