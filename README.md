# LearnHub
Your Platform for Skill Enhancement

```markdown
# 📘 LearnHub – E-Learning Platform

**LearnHub** is a full-stack e-learning web application that enables users to **register as teachers or students**, **create and enroll in courses**, **view course content**, and **generate completion certificates**.

---

## 🌐 Live Demo

[🚀 Click here to explore LearnHub](https://your-live-link.com)  
*(https://likhi9680.github.io/LearnHub/)*

---

## 🛠 Tech Stack

**Frontend:**
- React.js
- React Router DOM
- Bootstrap / CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (for file uploads)
- PDFKit (for generating certificates)

---

## 📌 Features

### 👥 Authentication
- Register/login as Student or Teacher
- Secure JWT-based authentication

### 🎓 Teacher Functionality
- Create courses with title, description, category, and content
- View courses created by the logged-in teacher
- Auto-generate certificates for students

### 👩‍🎓 Student Functionality
- View all available courses
- Enroll in any course
- View enrolled courses
- Complete courses and download personalized PDF certificate

### 📜 Certificate Generator
- Professionally styled PDF certificate with:
  - Student name
  - Course title
  - Instructor name
  - Date
  - "APPROVED" stamp and signature area

---

## 📂 Folder Structure

```

learnhub/
│
├── backend/                     # Node.js & Express API
│   ├── models/                  # Mongoose models (User, Course)
│   ├── routes/                  # Auth & Course API routes
│   ├── middleware/              # JWT auth middleware
│   └── index.js                 # Backend entry point
│
├── frontend/                    # React frontend
│   ├── pages/                   # Page components (Login, Register, Dashboard, etc.)
│   ├── components/              # Navbar, Card, etc.
│   └── App.jsx                  # App router setup
│
└── public/                      # Static assets (images, etc.)

````

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/learnhub.git
cd learnhub
````

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
node index.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Contributing

Pull requests are welcome. Feel free to open an issue to discuss improvements.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

* [React](https://reactjs.org/)
* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [PDFKit](https://pdfkit.org/)
* [Bootstrap](https://getbootstrap.com/)

---

## 👤 Author

**Likhitha Nasaka**
📧 Email: [likhithagayatri36@gmail.com](mailto:likhithagayatri36@gmail.com)
🔗 GitHub: [Likhi9680](https://github.com/Likhi9680)

