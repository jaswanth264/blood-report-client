// /src/components/UserReport.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";

function UserReport({ user }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function getReport() {
      try {
        const res = await axios.get("/api/report", {
          params: { email: user.email },
        });
        setReport(res.data.report);
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
