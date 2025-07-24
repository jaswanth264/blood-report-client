import React, { useEffect, useState } from "react";
import {
  Box, Text, Heading, Spinner, Alert, AlertIcon, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, useDisclosure, Flex
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

function UserReport({ user }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState({ name: "", phone: "", other_details: "" });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function getReport() {
      setLoading(true);
      setError("");
      try {
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

  // Open modal and set edit fields
  const handleEditOpen = () => {
    setEdit({
      name: report?.name || "",
      phone: report?.phone || "",
      other_details: report?.other_details || ""
    });
    onOpen();
  };

  // Update details in Supabase
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("reports")
        .update({ name: edit.name, phone: edit.phone, other_details: edit.other_details })
        .eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "Details updated!", status: "success", duration: 2000, isClosable: true });
      onClose();
      // Refresh report
      setLoading(true);
      const url = `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/reports?user_id=eq.${user.id}&select=report,name,phone,other_details`;
      const response = await fetch(url, {
        headers: {
          'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setReport(data && data[0] ? data[0] : null);
    } catch (err) {
      toast({ title: "Update failed", description: err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setUpdating(false);
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="lg" thickness="4px" color="teal.500" mt={8} />;
  if (error) return (<Alert status="error" mb={2}><AlertIcon />{error}</Alert>);
  if (!report) return <Text>No report found.</Text>;

  return (
    <Box mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="md">Your Previous Report</Heading>
        <Button colorScheme="teal" size="sm" onClick={handleEditOpen} variant="outline">Update Details</Button>
      </Flex>
      <Text fontSize="lg" mb={1}><strong>Name:</strong> {report.name}</Text>
      <Text fontSize="lg" mb={1}><strong>Phone:</strong> {report.phone || "N/A"}</Text>
      {report.other_details && <Text fontSize="md" mb={1}><strong>Other Details:</strong> {report.other_details}</Text>}
      <Box mt={3}>
        <a href={report.report} target="_blank" rel="noopener noreferrer" style={{ color: '#3182ce', textDecoration: 'underline', fontWeight: 600 }}>
          View / Download Report
        </a>
      </Box>

      {/* Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Your Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Name</FormLabel>
              <Input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input value={edit.phone} onChange={e => setEdit({ ...edit, phone: e.target.value })} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Other Details</FormLabel>
              <Textarea value={edit.other_details} onChange={e => setEdit({ ...edit, other_details: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUpdate} isLoading={updating}>
              Save
            </Button>
            <Button onClick={onClose} variant="ghost">Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default UserReport;
