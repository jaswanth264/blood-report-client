// /src/components/Register.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";



function Register() {
  const [form, setForm] = useState({ name: "", age: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sign up user with Supabase Auth
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            age: parseInt(form.age, 10)
          }
        }
      });
      if (error) throw error;
      toast({
        title: "Registered successfully. Please check your email to verify.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast({
        title: err.message || "Registration failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Register</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} isDisabled={loading} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Age</FormLabel>
            <Input name="age" type="number" value={form.age} onChange={handleChange} isDisabled={loading} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} isDisabled={loading} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} isDisabled={loading} />
          </FormControl>
          <Button type="submit" colorScheme="teal" isLoading={loading} isDisabled={loading}>
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Register;
