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
        const { data, error } = await supabase
          .from("reports")
          .select("report")
          .eq("user_id", user.id)
          .single({
            headers: { Accept: "application/json" }
          });
        if (error) throw error;
        setReport(data?.report || null);
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
        <Text whiteSpace="pre-wrap">{report}</Text>
      ) : (
        <Text>No report found.</Text>
      )}
    </Box>
  );
}

export default UserReport;
