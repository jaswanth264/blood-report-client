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
import { supabase } from "../supabaseClient";

// ...existing code...
function ReportForm({ user }) {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upsert report for the user in Supabase (fix: remove invalid columns param, add Accept header)
      const { error } = await supabase
        .from("reports")
        .upsert([
          { user_id: user.id, report }
        ], { onConflict: ["user_id"] })
        .select()
        .single({
          headers: { Accept: "application/json" }
        });
      if (error) throw error;
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
        description: err.message || "Try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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
              isDisabled={loading}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" isLoading={loading} isDisabled={loading}>
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default ReportForm;
