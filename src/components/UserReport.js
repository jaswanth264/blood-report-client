// /src/components/UserReport.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

function UserReport({ user }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function getReport() {
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("report")
          .eq("user_id", user.id)
          .single();
        if (error) throw error;
        setReport(data?.report || null);
      } catch (err) {
        setReport(null);
      }
    }
    getReport();
  }, [user]);

  return (
    <Box mt={4}>
      <Heading size="md" mb={2}>Your Previous Report</Heading>
      {report ? (
        <Text whiteSpace="pre-wrap">{report}</Text>
      ) : (
        <Text>No report found.</Text>
      )}
    </Box>
  );
}

export default UserReport;
