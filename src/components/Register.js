// /src/components/Register.js
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", age: "", email: "", password: "" });
  const toast = useToast();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", form);
      toast({
        title: "Registered successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setForm({ name: "", age: "", email: "", password: "" });
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Registration failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Register</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Age</FormLabel>
            <Input name="age" type="number" value={form.age} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Register
          </Button>
          <Text textAlign="center">
            Already have an account? <Link to="/login" style={{ color: "#3182ce" }}>Login</Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}

export default Register;
