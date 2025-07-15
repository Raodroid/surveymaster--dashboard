# SurveyMaster Dashboard

A modern web dashboard built with React, Vite, and SurveyJS for managing and analyzing surveys. This project is part of the SurveyMaster suite.

## Dependencies and Related Repositories

<!-- Diagram placeholder -->
<img width="880" height="642" alt="SurveyMaster Architecture" src="https://github.com/user-attachments/assets/076bd256-3730-4ea8-856b-e6e6f1c0fef9" />

- **SurveyMaster Frontend:** https://github.com/Raodroid/surveymaster--dashboard.git
- **SurveyMaster Backend:** https://github.com/yeotzunkai/survey-master-api
- **SurveyJS Backend:** https://github.com/AmiliAsia/surveyjs_patient_platform_be

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **UI Components:**
  - Tailwind CSS
  - Ant Design
  - SurveyJS
- **State Management:** Redux Toolkit, Redux Saga
- **Form Handling:** Formik + Yup
- **Authentication:** AWS Cognito (via backend)
- **API:** Custom backend (see `VITE_API_URL`)
- **Styling:** Tailwind CSS, Sass
- **i18n:** i18next, react-i18next

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Raodroid/surveymaster--dashboard.git
   cd surveymaster-dashboard
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   VITE_API_URL=https://api.example.com
   VITE_AWS_REGION=ap-southeast-1
   VITE_COGNITO_USER_POOL_ID=your_user_pool_id
   VITE_COGNITO_CLIENT_ID=your_client_id
   VITE_SURVEYJS_LICENSE_KEY=your_surveyjs_license
   # Add other variables as needed
   ```

4. Start the development server:
   ```bash
   yarn start
   # or
   npm start
   ```

## 🏗️ Project Structure

```
survey-master-dashboard/
├── src/
│   ├── app/                 # App entry, global styles
│   ├── customize-components/ # Custom UI components
│   ├── enums/               # TypeScript enums
│   ├── fonts/               # Custom fonts
│   ├── hooks/               # Custom React hooks
│   ├── icons/               # SVG icon components
│   ├── images/              # Image assets
│   ├── interfaces/          # TypeScript interfaces
│   ├── locales/             # i18n translations & config
│   ├── modules/             # Feature modules (auth, dashboard, etc.)
│   ├── redux/               # Redux store & slices
│   ├── services/            # API services
│   ├── styles/              # Global styles
│   ├── type/                # Shared types
│   ├── utils/               # Utility functions
│   └── index.tsx            # App entry point
├── public/                  # Static assets
├── internals/               # i18n tools, code generators (Plop)
├── .env / .env.dev          # Environment configs
├── vite.config.ts           # Vite configuration
├── tailwind.config.cjs      # Tailwind CSS config
├── package.json             # Project scripts & dependencies
└── README.md                # This file
```

### Key Scripts

- `yarn start` - Start development server
- `yarn build:prod` - Build for production
- `yarn test` - Run all tests
- `yarn lint` - Run ESLint
- `yarn generate` - Run Plop code generators
- `yarn extract-messages` - Extract i18n messages

## 🔒 Environment Variables

Required environment variables:

- `VITE_API_URL`: Base URL for backend API (e.g., `https://api.example.com`)
- `VITE_AWS_REGION`: AWS region for Cognito
- `VITE_COGNITO_USER_POOL_ID`: Cognito User Pool ID
- `VITE_COGNITO_CLIENT_ID`: Cognito App Client ID
- `VITE_SURVEYJS_LICENSE_KEY`: SurveyJS license key

## 🚀 Deployment

SurveyMaster consists of both a **frontend dashboard** and a **backend API**. To run the full application in a production or staging environment, set up survey-master-api (https://github.com/yeotzunkai/survey-master-api.git)



## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

_Happy coding! Need help? Open an issue or reach out to the maintainers._
