# 🖥️ AI Document Intelligence System – Frontend

Frontend application for uploading invoice PDFs, visualizing extracted structured data, validating results, and enabling manual corrections.

---

## 🚀 Overview

This UI enables users to:

- Upload invoice PDFs (single & bulk)
- View processed documents
- Inspect extracted structured data
- Identify validation errors and confidence scores
- Manually correct extracted fields
- Monitor processing metrics

---

## 🧠 Features

- 📤 Drag & drop / file upload interface  
- 📄 Document list with status tracking  
- 🔍 Detailed invoice view  
- ⚠️ Validation error highlighting  
- ✏️ Inline editing for corrections  
- 📊 Dashboard for:
  - Processing time
  - Extraction success rate
  - Error distribution  

---

## 🛠️ Tech Stack

- React (Vite)
- Axios (API calls)
- Tailwind CSS / CSS Modules
- React Router
- Charting library (e.g., Recharts / Chart.js)

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
├── public/
└── vite.config.js
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🔌 API Integration

The frontend interacts with backend APIs:

- `POST /documents` → Upload invoices  
- `GET /documents` → Fetch all documents  
- `GET /documents/:id` → Fetch extracted data  
- `POST /reprocess/:id` → Retry extraction  

---

## 🔍 Core Screens

### 📤 Upload Page
- Upload single or multiple PDFs  
- Displays upload status  

### 📄 Documents List
- Shows all processed invoices  
- Status: pending / processed / failed  

### 📑 Document Detail View
- Extracted fields display  
- Line items table  
- Confidence score  
- Validation errors  

### ✏️ Manual Correction
- Edit extracted fields  
- Save corrected values  

### 📊 Dashboard
- Processing metrics  
- Error insights  
- Success rate  

---

## ▶️ Getting Started

### 1. Clone the repo
```
git clone <repo_url>
cd frontend
```

### 2. Install dependencies
```
npm install
```

### 3. Setup environment variables
Create `.env` file

### 4. Run development server
```
npm run dev
```

---

## 🌐 Deployment

Frontend is deployed using Vercel:

```
https://ai-document-intelligence-system-fro.vercel.app/
```

---

## 📊 Future Improvements

- Real-time processing status (WebSockets)
- Better table extraction visualization
- Role-based access (admin/user)
- File preview with PDF annotations
- Improved UX for large datasets

---

## 🧠 Notes

- Designed for handling semi-structured invoice data  
- UI focuses on clarity, validation visibility, and correction workflow  
- Works seamlessly with backend extraction pipeline  

---

## 📬 Submission

- Fully functional UI integrated with backend APIs  
- Supports document upload, review, validation, and correction  
- Built for scalability and extensibility  
