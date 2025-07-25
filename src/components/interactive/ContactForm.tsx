"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Upload,
  X,
  CheckCircle,
  User,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

// Validation schemas for each step
const step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
});

const step2Schema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  projectType: z.enum(
    ["web-development", "mobile-app", "consulting", "other"],
    {
      required_error: "Please select a project type",
    }
  ),
  budget: z.enum(["under-5k", "5k-15k", "15k-50k", "50k-plus", "discuss"], {
    required_error: "Please select a budget range",
  }),
  timeline: z.enum(
    ["asap", "1-3-months", "3-6-months", "6-plus-months", "flexible"],
    {
      required_error: "Please select a timeline",
    }
  ),
});

const step3Schema = z.object({
  message: z.string().min(20, "Message must be at least 20 characters"),
  attachments: z.array(z.instanceof(File)).optional(),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type ContactFormData = z.infer<typeof fullSchema>;

interface ContactFormProps {
  className?: string;
}

const projectTypes = [
  { value: "web-development", label: "Web Development", icon: "🌐" },
  { value: "mobile-app", label: "Mobile App", icon: "📱" },
  { value: "consulting", label: "Consulting", icon: "💡" },
  { value: "other", label: "Other", icon: "🔧" },
];

const budgetRanges = [
  { value: "under-5k", label: "Under $5,000", icon: "💰" },
  { value: "5k-15k", label: "$5,000 - $15,000", icon: "💵" },
  { value: "15k-50k", label: "$15,000 - $50,000", icon: "💸" },
  { value: "50k-plus", label: "$50,000+", icon: "🏦" },
  { value: "discuss", label: "Let's Discuss", icon: "🤝" },
];

const timelines = [
  { value: "asap", label: "ASAP", icon: "⚡" },
  { value: "1-3-months", label: "1-3 Months", icon: "📅" },
  { value: "3-6-months", label: "3-6 Months", icon: "🗓️" },
  { value: "6-plus-months", label: "6+ Months", icon: "📆" },
  { value: "flexible", label: "Flexible", icon: "🔄" },
];

export function ContactForm({ className }: ContactFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
  });

  const watchedValues = watch();

  const validateCurrentStep = async () => {
    let isStepValid = false;

    switch (currentStep) {
      case 1:
        isStepValid = await trigger(["name", "email", "company"]);
        break;
      case 2:
        isStepValid = await trigger([
          "subject",
          "projectType",
          "budget",
          "timeline",
        ]);
        break;
      case 3:
        isStepValid = await trigger(["message"]);
        break;
    }

    return isStepValid;
  };

  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      const isValidType = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
      ].includes(file.type);

      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      if (!isValidType) {
        toast.error(`${file.name} is not a supported file type.`);
        return false;
      }

      return true;
    });

    const newAttachments = [...attachments, ...validFiles];
    if (newAttachments.length > 5) {
      toast.error("Maximum 5 files allowed.");
      return;
    }

    setAttachments(newAttachments);
    setValue("attachments", newAttachments);
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    setValue("attachments", newAttachments);
  };

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "attachments" && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append("attachments", file);
          });
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSubmitted(true);
      toast.success("Message sent successfully! I'll get back to you soon.");

      // Reset form after successful submission
      setTimeout(() => {
        reset();
        setCurrentStep(1);
        setAttachments([]);
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => (currentStep / 3) * 100;

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${className} flex items-center justify-center min-h-[500px]`}
      >
        <Card className="p-8 text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for reaching out. I&apos;ll get back to you within 24
            hours.
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      <Card className="max-w-2xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 3</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(getStepProgress())}% Complete
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getStepProgress()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <User className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">
                    Let&apos;s Get Acquainted
                  </h3>
                  <p className="text-muted-foreground">
                    Tell me a bit about yourself
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company (Optional)
                    </label>
                    <input
                      {...register("company")}
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <Briefcase className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">Project Details</h3>
                  <p className="text-muted-foreground">
                    Help me understand your needs
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      {...register("subject")}
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Brief description of your project"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Project Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {projectTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            watchedValues.projectType === type.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input
                            {...register("projectType")}
                            type="radio"
                            value={type.value}
                            className="sr-only"
                          />
                          <span className="text-2xl mr-3">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.projectType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.projectType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Budget Range *
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {budgetRanges.map((budget) => (
                        <label
                          key={budget.value}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            watchedValues.budget === budget.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input
                            {...register("budget")}
                            type="radio"
                            value={budget.value}
                            className="sr-only"
                          />
                          <span className="text-xl mr-3">{budget.icon}</span>
                          <span className="font-medium">{budget.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Timeline *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {timelines.map((timeline) => (
                        <label
                          key={timeline.value}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            watchedValues.timeline === timeline.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <input
                            {...register("timeline")}
                            type="radio"
                            value={timeline.value}
                            className="sr-only"
                          />
                          <span className="text-xl mr-3">{timeline.icon}</span>
                          <span className="font-medium">{timeline.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.timeline && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.timeline.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Message and Attachments */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">Your Message</h3>
                  <p className="text-muted-foreground">
                    Tell me more about your project
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Project Description *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={6}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Please describe your project in detail. Include any specific requirements, features, or goals you have in mind..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drop files here or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB each, 5 files
                        max)
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        Choose Files
                      </Button>
                    </div>

                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                          >
                            <span className="text-sm truncate">
                              {file.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
