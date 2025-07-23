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
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!file) throw new Error("Please select a file to upload.");
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      let { error: uploadError } = await supabase.storage.from('reports').upload(filePath, file);
      if (uploadError) throw uploadError;
      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(filePath);
      // Upsert file URL in reports table
      const { error } = await supabase
        .from("reports")
        .upsert([
          { user_id: user.id, report: publicUrl }
        ], { onConflict: ["user_id"] });
      if (error) throw error;
      toast({
        title: "Report Uploaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFile(null);
    } catch (err) {
      toast({
        title: "Upload failed",
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
      <Heading size="md" mb={4}>Upload Blood Report</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Report File (PDF, Image, etc.)</FormLabel>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              onChange={e => setFile(e.target.files[0])}
              disabled={loading}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" isLoading={loading} isDisabled={loading}>
            Upload
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default ReportForm;
