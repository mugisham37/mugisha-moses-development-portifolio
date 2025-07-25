"use client";

import { ContactForm } from "@/components/interactive/ContactForm";
import { Toaster } from "react-hot-toast";

export default function TestContactPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Contact Form Test
        </h1>
        <ContactForm />
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
