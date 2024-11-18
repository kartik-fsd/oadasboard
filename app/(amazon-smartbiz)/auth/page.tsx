"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle, Phone } from "lucide-react";

export default function ProfessionalTaskerDetailsForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const isFormValid =
    name.trim() !== "" && phone.replace(/\D/g, "").length === 10;

  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return (
        match[1] +
        (match[2] ? "-" + match[2] : "") +
        (match[3] ? "-" + match[3] : "")
      );
    }
    return input;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Form submitted:", { name, phone });
      // Here you would typically send the data to your backend
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Tasker Details
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  placeholder="Enter tasker's full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="123-456-7890"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full transition-all duration-200 ease-in-out transform hover:scale-105"
              disabled={!isFormValid}
            >
              Submit Details
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
