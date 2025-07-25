import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  company: z.string().optional(),
  projectType: z
    .enum(["web-development", "mobile-app", "consulting", "other"])
    .optional(),
  budget: z
    .enum(["under-5k", "5k-15k", "15k-50k", "50k-plus", "discuss"])
    .optional(),
  timeline: z
    .enum(["asap", "1-3-months", "3-6-months", "6-plus-months", "flexible"])
    .optional(),
});

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string): string {
  return `contact_${ip}`;
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 requests per 15 minutes

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

function sanitizeInput(input: string): string {
  // Basic HTML sanitization - remove potentially dangerous tags
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

function detectSpam(data: any): boolean {
  const spamKeywords = [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "congratulations",
    "click here",
    "free money",
    "make money fast",
    "work from home",
    "weight loss",
    "lose weight",
    "diet pills",
  ];

  const text =
    `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase();

  // Check for spam keywords
  const hasSpamKeywords = spamKeywords.some((keyword) =>
    text.includes(keyword)
  );

  // Check for excessive links
  const linkCount = (text.match(/https?:\/\//g) || []).length;
  const hasExcessiveLinks = linkCount > 3;

  // Check for suspicious patterns
  const hasRepeatedChars = /(.)\1{10,}/.test(text);
  const hasAllCaps =
    data.message &&
    data.message.length > 50 &&
    data.message === data.message.toUpperCase();

  return hasSpamKeywords || hasExcessiveLinks || hasRepeatedChars || hasAllCaps;
}

async function sendEmail(
  data: any,
  attachments: File[] = []
): Promise<boolean> {
  // In a real application, you would integrate with an email service like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Nodemailer with SMTP

  console.log("📧 Email would be sent with the following data:");
  console.log("To: your-email@example.com");
  console.log("Subject:", `New Contact Form Submission: ${data.subject}`);
  console.log("From:", `${data.name} <${data.email}>`);
  console.log("Message:", data.message);
  console.log("Company:", data.company || "Not specified");
  console.log("Project Type:", data.projectType || "Not specified");
  console.log("Budget:", data.budget || "Not specified");
  console.log("Timeline:", data.timeline || "Not specified");
  console.log("Attachments:", attachments.length);

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return true; // Simulate successful email sending
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // Parse form data
    const formData = await request.formData();

    // Extract form fields
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      company: (formData.get("company") as string) || undefined,
      projectType: (formData.get("projectType") as string) || undefined,
      budget: (formData.get("budget") as string) || undefined,
      timeline: (formData.get("timeline") as string) || undefined,
    };

    // Extract attachments
    const attachments: File[] = [];
    const attachmentEntries = formData.getAll("attachments");
    for (const entry of attachmentEntries) {
      if (entry instanceof File && entry.size > 0) {
        attachments.push(entry);
      }
    }

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    data.name = sanitizeInput(data.name);
    data.subject = sanitizeInput(data.subject);
    data.message = sanitizeInput(data.message);
    if (data.company) data.company = sanitizeInput(data.company);

    // Validate with Zod
    const validationResult = contactSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data",
          details: validationResult.error.errors,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // Check for spam
    if (detectSpam(data)) {
      console.log("🚫 Spam detected from IP:", ip);
      return NextResponse.json(
        {
          success: false,
          error: "Message flagged as spam",
          code: "SPAM_DETECTED",
        },
        { status: 400 }
      );
    }

    // Validate attachments
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    for (const file of attachments) {
      if (file.size > maxFileSize) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name} is too large. Maximum size is 10MB.`,
            code: "FILE_TOO_LARGE",
          },
          { status: 400 }
        );
      }

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name} has an unsupported format.`,
            code: "UNSUPPORTED_FILE_TYPE",
          },
          { status: 400 }
        );
      }
    }

    if (attachments.length > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 5 files allowed",
          code: "TOO_MANY_FILES",
        },
        { status: 400 }
      );
    }

    // Send email
    const emailSent = await sendEmail(validationResult.data, attachments);

    if (!emailSent) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email. Please try again later.",
          code: "EMAIL_SEND_FAILED",
        },
        { status: 500 }
      );
    }

    // Log successful submission (in production, save to database)
    console.log("✅ Contact form submission successful:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      timestamp: new Date().toISOString(),
      ip,
      attachmentCount: attachments.length,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
