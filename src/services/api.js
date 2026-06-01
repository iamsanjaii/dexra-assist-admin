// This file contains all API calls. In the future, these will be replaced with real endpoints.

export const fetchDashboardStats = async () => {
  // GET /api/dashboard/stats
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalDocuments: 124,
        totalQAPairs: 856,
        totalConversations: 3420,
        activeKnowledgeSources: 12,
      });
    }, 800);
  });
};

export const fetchRecentUploads = async () => {
  // GET /api/documents/recent
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Employee_Handbook.pdf", type: "PDF", date: "2024-05-12", status: "Ready" },
        { id: 2, name: "Q1_Financial_Report.xlsx", type: "XLSX", date: "2024-05-10", status: "Processing" },
        { id: 3, name: "Company_Policies.docx", type: "DOCX", date: "2024-05-09", status: "Ready" },
        { id: 4, name: "Support_Logs_April.csv", type: "CSV", date: "2024-05-08", status: "Failed" },
      ]);
    }, 600);
  });
};

export const fetchActivityFeed = async () => {
  // GET /api/dashboard/activity
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, action: "Uploaded", item: "Employee_Handbook.pdf", time: "2 hours ago" },
        { id: 2, action: "Updated", item: "Q&A: Reset Password", time: "5 hours ago" },
        { id: 3, action: "Deleted", item: "Old_Policies_2023.pdf", time: "1 day ago" },
      ]);
    }, 500);
  });
};

export const fetchDocuments = async () => {
  // GET /api/documents
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Employee_Handbook.pdf", type: "PDF", size: "2.4 MB", date: "2024-05-12", status: "Ready" },
        { id: 2, name: "Q1_Financial_Report.xlsx", type: "XLSX", size: "1.1 MB", date: "2024-05-10", status: "Processing" },
        { id: 3, name: "Company_Policies.docx", type: "DOCX", size: "540 KB", date: "2024-05-09", status: "Ready" },
        { id: 4, name: "Support_Logs_April.csv", type: "CSV", size: "12 MB", date: "2024-05-08", status: "Failed" },
      ]);
    }, 600);
  });
};

export const uploadDocumentMock = async (file) => {
  // POST /api/documents/upload
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Document uploaded successfully." });
    }, 1500);
  });
};

export const deleteDocumentMock = async (id) => {
  // DELETE /api/documents/:id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Document deleted successfully." });
    }, 500);
  });
};

export const fetchQAPairs = async () => {
  // GET /api/qa
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, question: "How do I reset my password?", answer: "Go to settings > security and click 'Reset Password'. A link will be sent to your email.", date: "2024-05-11" },
        { id: 2, question: "What are your business hours?", answer: "We are open Monday to Friday, from 9 AM to 6 PM EST.", date: "2024-05-10" },
        { id: 3, question: "Do you offer refunds?", answer: "Yes, we offer a 30-day money-back guarantee for all new subscriptions.", date: "2024-05-09" },
      ]);
    }, 600);
  });
};

export const saveQAPairMock = async (data) => {
  // POST /api/qa or PUT /api/qa/:id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, id: data.id || Date.now(), ...data });
    }, 800);
  });
};

export const deleteQAPairMock = async (id) => {
  // DELETE /api/qa/:id
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export const fetchChatSessions = async () => {
  // GET /api/chat/sessions
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Onboarding query", time: "10 mins ago" },
        { id: 2, title: "Password reset help", time: "2 hours ago" },
        { id: 3, title: "Billing issues", time: "1 day ago" },
      ]);
    }, 500);
  });
};

export const sendChatMessageMock = async (message) => {
  // POST /api/chat/message
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        role: "bot",
        content: `Here is a simulated response to: "${message}".\n\nI found relevant information in the **Employee Handbook**.\n\nPlease let me know if you need anything else!`,
        sources: [
          { name: "Employee_Handbook.pdf", chunk: "Section 3.2 - Onboarding" }
        ]
      });
    }, 1500); // simulate some thinking time
  });
};

export const saveSettingsMock = async (settings) => {
  // PUT /api/settings
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, settings });
    }, 800);
  });
};
