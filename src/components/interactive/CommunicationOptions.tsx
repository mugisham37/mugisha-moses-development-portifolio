"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Video, 
  Phone, 
  Mail, 
  Share2,
  Mic,
  MicOff,
  Play,
  Pause,
  Download,
  Send,
  X,
  ExternalLink,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Globe
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { toast } from "react-hot-toast";

interface CommunicationOptionsProps {
  className?: string;
}

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
  url: string;
  handle: string;
  color: string;
  description: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    name: "Twitter",
    icon: <Twitter className="w-5 h-5" />,
    url: "https://twitter.com/yourusername",
    handle: "@yourusername",
    color: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600",
    description: "Follow for tech insights and project updates"
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: "https://linkedin.com/in/yourusername",
    handle: "/in/yourusername",
    color: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600",
    description: "Connect for professional networking"
  },
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
    url: "https://github.com/yourusername",
    handle: "@yourusername",
    color: "hover:bg-gray-50 hover:border-gray-200 hover:text-gray-800",
    description: "Explore my open source projects"
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    url: "https://instagram.com/yourusername",
    handle: "@yourusername",
    color: "hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600",
    description: "Behind the scenes and creative process"
  },
  {
    name: "YouTube",
    icon: <Youtube className="w-5 h-5" />,
    url: "https://youtube.com/@yourusername",
    handle: "@yourusername",
    color: "hover:bg-red-50 hover:border-red-200 hover:text-red-600",
    description: "Tutorials and project walkthroughs"
  },
  {
    name: "Website",
    icon: <Globe className="w-5 h-5" />,
    url: "https://yourwebsite.com",
    handle: "yourwebsite.com",
    color: "hover:bg-green-50 hover:border-green-200 hover:text-green-600",
    description: "Visit my personal website"
  }
];

export function CommunicationOptions({ className }: CommunicationOptionsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showVoiceMessage, setShowVoiceMessage] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success("Recording started!");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      toast.success("Recording stopped!");
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.play();
      setIsPlaying(true);
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-message-${new Date().toISOString().slice(0, 19)}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Recording downloaded!");
    }
  };

  const sendVoiceMessage = async () => {
    if (audioBlob) {
      // In production, this would upload the audio file
      toast.success("Voice message sent! I'll get back to you soon.");
      setAudioBlob(null);
      setShowVoiceMessage(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async (platform: SocialPlatform) => {
    const shareText = "Check out this amazing developer portfolio!";
    const shareUrl = window.location.href;

    if (platform.name === "Twitter") {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank');
    } else if (platform.name === "LinkedIn") {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      window.open(linkedinUrl, '_blank');
    } else {
      // For other platforms, just open their profile
      window.open(platform.url, '_blank');
    }
  };

  const handleLiveChatSend = () => {
    if (chatMessage.trim()) {
      // In production, this would integrate with a live chat service
      toast.success("Message sent! I'll respond as soon as possible.");
      setChatMessage("");
      setShowLiveChat(false);
    }
  };

  const openVideoCall = () => {
    // In production, this would integrate with a video calling service
    toast.success("Redirecting to video call platform...");
    // Example: window.open("https://meet.google.com/your-meeting-room", "_blank");
  };

  const openPhoneCall = () => {
    // In production, this would show phone number or integrate with calling service
    toast.success("Phone number copied to clipboard!");
    navigator.clipboard.writeText("+1 (555) 123-4567");
  };

  return (
    <div className={className}>
      <Card className="p-6">
        {/* Header */}
        <div className="text-center mb-8"></div>MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Let&apos;s Connect</h2>
          <p className="text-muted-foreground">
            Choose your preferred way to get in touch
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => setShowVoiceMessage(true)}
          >
            <Mic className="w-6 h-6" />
            <span className="text-sm">Voice Message</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={openVideoCall}
          >
            <Video className="w-6 h-6" />
            <span className="text-sm">Video Call</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={openPhoneCall}
          >
            <Phone className="w-6 h-6" />
            <span className="text-sm">Phone Call</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => setShowLiveChat(true)}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm">Live Chat</span>
          </Button>
        </div>

        {/* Social Media Integration */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Social Media & Sharing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform) => (
              <motion.div
                key={platform.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all ${platform.color}`}
                  onClick={() => handleShare(platform)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{platform.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {platform.handle}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {platform.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Professional Introduction Video */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Professional Introduction</h3>
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Watch My Introduction</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get to know me better through this 2-minute introduction video
                </p>
                <Button size="sm" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch Video
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Voice Message Modal */}
        <AnimatePresence>
          {showVoiceMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowVoiceMessage(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-background rounded-lg p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Voice Message</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVoiceMessage(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {isRecording ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Mic className="w-12 h-12 text-primary" />
                      </motion.div>
                    ) : (
                      <MicOff className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  
                  {isRecording && (
                    <div className="text-2xl font-mono font-bold text-primary mb-2">
                      {formatTime(recordingTime)}
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    {isRecording 
                      ? "Recording... Click stop when finished"
                      : "Click the microphone to start recording"
                    }
                  </p>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive" className="flex items-center gap-2">
                      <MicOff className="w-4 h-4" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {audioBlob && (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={playRecording}
                        className="flex items-center gap-2"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadRecording}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                    
                    <Button
                      onClick={sendVoiceMessage}
                      className="w-full flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Voice Message
                    </Button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Chat Modal */}
        <AnimatePresence>
          {showLiveChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowLiveChat(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-background rounded-lg p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Live Chat</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLiveChat(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="bg-secondary/50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Online</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hi! I&apos;m currently available for a quick chat. What can I help you with?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                  />
                  
                  <Button
                    onClick={handleLiveChatSend}
                    disabled={!chatMessage.trim()}
                    className="w-full flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  I typically respond within a few minutes during business hours
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}