// /src/components/ReportForm.js
import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Textarea,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function ReportForm({ user }) {
  const [report, setReport] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/report", {
        email: user.email,
        report,
      });
      toast({
        title: "Report Submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setReport("");
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err?.response?.data?.message || "Try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mb={6}>
      <Heading size="md" mb={4}>Submit Blood Report</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Report Details</FormLabel>
            <Textarea
              placeholder="Paste your report here"
              value={report}
              onChange={(e) => setReport(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default ReportForm;
