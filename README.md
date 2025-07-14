# SurveyMaster Dashboard 🚀

Welcome to **SurveyMaster Dashboard** — the modern, user-friendly frontend for managing surveys with ease! This project is built with React 18, TypeScript, Vite, and integrates with AWS and SurveyJS. Whether you're a beginner or a seasoned developer, this guide will help you get started quickly.

---

## 📋 Features

- **Create, edit, and manage surveys**
- **Interactive dashboard UI** with real-time updates
- **User authentication** (AWS Cognito)
- **SurveyJS** integration for advanced survey logic
- **Internationalization (i18n)** support
- **Responsive design** with Tailwind CSS
- **Role-based access control**
- **Export survey results** (Excel, CSV)
- **Notifications & custom UI components**

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Sass](https://sass-lang.com/), [Ant Design](https://ant.design/)
- **State Management:** Redux Toolkit, Redux Saga
- **i18n:** i18next, react-i18next
- **Testing:** Jest, React Testing Library
- **Code Quality:** ESLint, Prettier, Stylelint, Husky
- **Integrations:** AWS SDK, SurveyJS, Axios

---

## 📁 Project Structure

```text
survey-master-dashboard/
├── src/                # React source code
│   ├── app/            # App entry, global styles
│   ├── customize-components/ # Custom UI components
│   ├── enums/          # TypeScript enums
│   ├── fonts/          # Custom fonts
│   ├── hooks/          # Custom React hooks
│   ├── icons/          # SVG icon components
│   ├── images/         # Image assets
│   ├── interfaces/     # TypeScript interfaces
│   ├── locales/        # i18n translations & config
│   ├── modules/        # Feature modules (auth, dashboard, etc.)
│   ├── redux/          # Redux store & slices
│   ├── services/       # API services
│   ├── styles/         # Global styles
│   ├── type/           # Shared types
│   ├── utils/          # Utility functions
│   └── index.tsx       # App entry point
├── public/             # Static assets (favicon, images)
├── internals/          # i18n tools, code generators (Plop)
├── .env / .env.dev     # Environment configs
├── vite.config.ts      # Vite configuration
├── tailwind.config.cjs # Tailwind CSS config
├── package.json        # Project scripts & dependencies
└── README.md           # This file
```

---

## 🚦 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Raodroid/survey-master-dashboard.git
cd survey-master-dashboard
```

### 2️⃣ Install dependencies

Using **Yarn** (recommended):

```bash
yarn install
```

Or with **npm**:

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the root directory. Here’s an example:

```env
# .env.example
VITE_API_URL=https://api.example.com
VITE_AWS_REGION=ap-southeast-1
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_CLIENT_ID=your_client_id
VITE_SURVEYJS_LICENSE_KEY=your_surveyjs_license
# Add other variables as needed
```

> **Tip:** For development, you can use `.env.dev` and run `yarn start:dev`.

### 4️⃣ Run the app in development

```bash
yarn start
# or
npm start
```

The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

### 5️⃣ Build for production

```bash
yarn build:prod
# or
npm run build:prod
```

### 6️⃣ Preview production build locally

```bash
npx serve dist
```

---

## 🗝️ Environment Variables

- `VITE_API_URL` — Backend API endpoint
- `VITE_AWS_REGION` — AWS region for Cognito
- `VITE_COGNITO_USER_POOL_ID` — Cognito User Pool ID
- `VITE_COGNITO_CLIENT_ID` — Cognito App Client ID
- `VITE_SURVEYJS_LICENSE_KEY` — SurveyJS license key
- _(Add any other required variables as needed)_

---

## 📜 Available Scripts

| Script                  | Description                      |
| ----------------------- | -------------------------------- |
| `yarn start`            | Start dev server with `.env`     |
| `yarn start:dev`        | Start dev server with `.env.dev` |
| `yarn start:stg`        | Start dev server with `.env.stg` |
| `yarn build:prod`       | Build for production             |
| `yarn build:stg`        | Build for staging                |
| `yarn test`             | Run all tests                    |
| `yarn lint`             | Lint TypeScript/JavaScript files |
| `yarn lint:fix`         | Lint and auto-fix                |
| `yarn lint:css`         | Lint CSS files                   |
| `yarn prettify`         | Format code with Prettier        |
| `yarn generate`         | Run Plop code generators         |
| `yarn extract-messages` | Extract i18n messages            |

---

## ⚡️ Code Generation (Plop)

This project uses [Plop](https://plopjs.com/) for code scaffolding. To generate boilerplate code (e.g., components, modules):

```bash
yarn generate
```

Plop generators are configured in `internals/`. Follow the CLI prompts to scaffold new code.

---

## 🎨 Styling & UI

- **Tailwind CSS** is enabled for utility-first styling. See `tailwind.config.cjs` for custom theme settings.
- **Ant Design** is used for ready-made UI components.
- **Sass** is available for custom styles.

---

## 📝 SurveyJS Integration

Survey rendering and logic are powered by [SurveyJS](https://surveyjs.io/). You can customize survey forms, logic, and export results. Make sure to set your SurveyJS license key in the `.env` file.

---

## 🌐 Internationalization (i18n)

- **i18next** and **react-i18next** provide multi-language support.
- Default language: English (`en`)
- Add new languages in `src/locales/`.
- Extract messages for translation with:
  ```bash
  yarn extract-messages
  ```

---

## 🐛 Troubleshooting

- **Port in use?** Change the port in `vite.config.ts` or stop the conflicting process.
- **Env issues?** Double-check your `.env` values and file name.
- **Build errors?** Run `yarn lint` and `yarn checkTs` to catch issues early.
- **AWS errors?** Ensure your AWS credentials and permissions are set up correctly.
- **SurveyJS not rendering?** Check your license key and SurveyJS integration.

---

## ☁️ Deployment

You can deploy the production build (`dist/` folder) to any static hosting service:

- **Netlify**: Drag and drop `dist/` or connect your repo
- **Vercel**: Connect your repo, set build command to `yarn build:prod`
- **AWS S3 + CloudFront**: Use the provided scripts (`yarn deploy:stg`, etc.)
- **Other**: Any service that supports static site hosting

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please follow the code style and add tests where appropriate.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> _Happy coding! Need help? Open an issue or reach out to the maintainers._
