# FrontEnd for Quiz

- A modern, responsive quiz/exam platform frontend built with React.js, Shadcn/UI, and Tailwind CSS.
It supports secure JWT-based authentication, dynamic quiz rendering, navigation, timer functionality, and score calculation.

## Features
- User Authentication

   - Signup, Login, Logout   with JWT authentication

    - Auth state management using AuthContext

- Quiz Interface

    - Start Exam with randomized questions fetched from backend

  - MCQ display with selectable options

  - Next / Previous navigation between questions

- Exam Timer

  - 10-minute countdown 

  - Auto-submit when time runs out

- Results

  - Score calculation and result display


```bash
src/
│
├── components/
│   ├── ui/                 # Reusable UI components (Shadcn)
│   ├── Body/               # Main layout body
│   ├── MainContent/        # Core page content
│   ├── PrivateRoute/       # Route protection for authenticated users
│   ├── Quiz/               # Quiz display & question navigation
│   ├── ResultPage/         # Result display after exam submission
│   ├── Sidebar/            # Sidebar navigation menu
│   └── Signup/             # Signup form component
│
├── Context/
│   ├── AuthContext.js      # Authentication state & logic
│   └── QuizContext.js      # Quiz state & logic
│
├── lib/
│   ├── api.js              # API request functions
│   └── util.js             # Utility functions
│
├── App.js                  
├── index.js                
└── styles.css   
```

```bash
git clone https://github.com/Gangadhar184/LeadMasterAI-Tech-Solutions-Assignment.git
cd client

npm install
npm run dev
```

### Workflow

- User Registration/Login → Backend returns JWT

- AuthContext stores and manages token in local storage

- PrivateRoute protects quiz routes

- Start Exam → Fetch randomized questions from backend

- QuizContext manages questions, selected answers, and timer

- Submit Exam → Score calculated and sent to backend

- ResultPage displays score

