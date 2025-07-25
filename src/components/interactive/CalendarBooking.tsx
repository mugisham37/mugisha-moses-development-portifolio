"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MessageCircle, 
  User, 
  Globe,
  CheckCircle,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface CalendarBookingProps {
  className?: string;
}

interface MeetingType {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
  type: "video" | "phone" | "in-person";
  available: boolean;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  timezone: string;
}

interface AvailabilityStatus {
  status: "available" | "busy" | "away";
  message: string;
  nextAvailable?: string;
}

const meetingTypes: MeetingType[] = [
  {
    id: "consultation",
    title: "Project Consultation",
    description: "Discuss your project requirements and get a detailed proposal",
    duration: 60,
    icon: <MessageCircle className="w-5 h-5" />,
    type: "video",
    available: true,
  },
  {
    id: "discovery",
    title: "Discovery Call",
    description: "Quick 30-minute call to understand your needs",
    duration: 30,
    icon: <Phone className="w-5 h-5" />,
    type: "phone",
    available: true,
  },
  {
    id: "technical",
    title: "Technical Review",
    description: "Deep dive into technical requirements and architecture",
    duration: 90,
    icon: <Video className="w-5 h-5" />,
    type: "video",
    available: true,
  },
  {
    id: "follow-up",
    title: "Follow-up Meeting",
    description: "Check progress and discuss next steps",
    duration: 30,
    icon: <CheckCircle className="w-5 h-5" />,
    type: "video",
    available: true,
  },
];

// Mock availability data - in production, this would come from a calendar API
const mockAvailability: AvailabilityStatus = {
  status: "available",
  message: "Available for meetings this week",
  nextAvailable: "Today at 2:00 PM EST",
};

// Mock time slots - in production, this would come from calendar API
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Generate morning slots (9 AM - 12 PM)
    for (let hour = 9; hour <= 11; hour++) {
      slots.push({
        id: `${date.toISOString().split('T')[0]}-${hour}:00`,
        date: date.toISOString().split('T')[0],
        time: `${hour}:00`,
        available: Math.random() > 0.3, // 70% chance of being available
        timezone: "EST",
      });
    }
    
    // Generate afternoon slots (2 PM - 5 PM)
    for (let hour = 14; hour <= 16; hour++) {
      slots.push({
        id: `${date.toISOString().split('T')[0]}-${hour}:00`,
        date: date.toISOString().split('T')[0],
        time: `${hour}:00`,
        available: Math.random() > 0.3,
        timezone: "EST",
      });
    }
  }
  
  return slots;
};

export function CalendarBooking({ className }: CalendarBookingProps) {
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [availability, setAvailability] = useState<AvailabilityStatus>(mockAvailability);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userTimezone, setUserTimezone] = useState("EST");

  useEffect(() => {
    // Detect user timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
    
    // Load available time slots
    setAvailableSlots(generateTimeSlots());
  }, []);

  const handleMeetingTypeSelect = (meetingType: MeetingType) => {
    setSelectedMeetingType(meetingType);
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentStep(3);
  };

  const handleBooking = async () => {
    if (!selectedMeetingType || !selectedTimeSlot) return;
    
    setIsLoading(true);
    
    try {
      // In production, this would integrate with Calendly/Cal.com API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // For now, redirect to external calendar booking
      const calendlyUrl = `https://calendly.com/your-username/${selectedMeetingType.id}`;
      window.open(calendlyUrl, '_blank');
      
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string, timezone: string) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-red-500';
      case 'away': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getAvailabilityIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'busy': return <Clock className="w-4 h-4" />;
      case 'away': return <Globe className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={className}>
      <Card className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Schedule a Meeting</h2>
          <p className="text-muted-foreground">
            Let&apos;s discuss your project and how I can help bring your ideas to life
          </p>
        </div>

        {/* Availability Status */}
        <div className="mb-8">
          <Card className="p-4 bg-secondary/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${getAvailabilityColor(availability.status)}`}>
                  {getAvailabilityIcon(availability.status)}
                  <span className="font-medium capitalize">{availability.status}</span>
                </div>
                <span className="text-muted-foreground">{availability.message}</span>
              </div>
              {availability.nextAvailable && (
                <div className="text-sm text-muted-foreground">
                  Next available: {availability.nextAvailable}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step < currentStep ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-muted-foreground">
              {currentStep === 1 && "Choose Meeting Type"}
              {currentStep === 2 && "Select Time Slot"}
              {currentStep === 3 && "Confirm Booking"}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Meeting Type Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-center">
                What type of meeting would you like to schedule?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetingTypes.map((meetingType) => (
                  <motion.div
                    key={meetingType.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`p-6 cursor-pointer transition-colors hover:border-primary ${
                        !meetingType.available ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => meetingType.available && handleMeetingTypeSelect(meetingType)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {meetingType.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{meetingType.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {meetingType.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {meetingType.duration} min
                            </span>
                            <span className="capitalize">{meetingType.type}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Time Slot Selection */}
          {currentStep === 2 && selectedMeetingType && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  Select a time for your {selectedMeetingType.title}
                </h3>
                <p className="text-muted-foreground">
                  Duration: {selectedMeetingType.duration} minutes • Your timezone: {userTimezone}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {availableSlots
                  .filter(slot => slot.available)
                  .slice(0, 21) // Show first 21 available slots
                  .map((slot) => (
                    <motion.div
                      key={slot.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="p-4 cursor-pointer transition-colors hover:border-primary"
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        <div className="text-center">
                          <div className="font-medium">
                            {formatDate(slot.date)}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {formatTime(slot.time, slot.timezone)}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Change Meeting Type
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Booking Confirmation */}
          {currentStep === 3 && selectedMeetingType && selectedTimeSlot && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">Confirm Your Booking</h3>
                <p className="text-muted-foreground">
                  Please review your meeting details before confirming
                </p>
              </div>

              <Card className="p-6 mb-6 bg-secondary/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {selectedMeetingType.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{selectedMeetingType.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedMeetingType.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"></div>                   <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(selectedTimeSlot.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatTime(selectedTimeSlot.time, selectedTimeSlot.timezone)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{selectedMeetingType.type} meeting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span>{userTimezone}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Change Time
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="text-xs text-muted-foreground">
                  You&apos;ll be redirected to complete your booking on Calendly
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* External Calendar Integration Info */}
        <div className="mt-8 pt-6 border-t">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Prefer to use your own calendar?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              You can also book directly through these platforms:
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://calendly.com/your-username', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Calendly
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://cal.com/your-username', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Cal.com
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}