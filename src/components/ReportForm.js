import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Heading,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

function ReportForm({ user }) {
  const toast = useToast();
  const [name, setName] = useState(user.user_metadata?.full_name || "");
  const [phone, setPhone] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const formWidth = useBreakpointValue({ base: "100%", md: "600px" });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Please select a file to upload.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    if (!name) {
      toast({ title: "Name is required.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('blood-reports').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('blood-reports').getPublicUrl(filePath);
      const { error: upsertError } = await supabase.from('reports').upsert([
        { user_id: user.id, report: publicUrl, name, phone, other_details: otherDetails }
      ], { onConflict: ["user_id"] });
      if (upsertError) throw upsertError;
      toast({ title: "Report uploaded successfully!", status: "success", duration: 3000, isClosable: true });
      setFile(null); setOtherDetails(""); setPhone("");
    } catch (error) {
      toast({ title: "Upload failed", description: error.message || "Please try again.", status: "error", duration: 4000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mb={6} width={formWidth}>
      <Heading size="md" mb={4}>Upload Blood Report</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" isDisabled={loading} />
          </FormControl>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number (optional)" isDisabled={loading} />
          </FormControl>
          <FormControl>
            <FormLabel>Other Details</FormLabel>
            <Textarea value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)} placeholder="Additional details (optional)" isDisabled={loading} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Report File (PDF, Image, etc.)</FormLabel>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt" onChange={handleFileChange} disabled={loading} />
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
