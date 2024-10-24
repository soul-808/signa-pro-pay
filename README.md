# Signa-Pro-Pay

A transaction processing system built with Next.js, Bun, MongoDB, and TypeScript.

Assisted by the Tech Guru: https://chatgpt.com/g/g-cfeVikHQV-tech-guru

## Project Timeline & Development Log

Total Development Time: ~5 hours

## Screenshot
![image](https://github.com/user-attachments/assets/ab9f9c7b-78a5-4b25-9b46-d5e7d18d5676)


### Initial Setup & Environment Configuration
**Duration: 1 hour 26 minutes**
- Project planning and GPT Agent setup
- Initial environment setup and dependencies installation
- Break
- Configuration refinements
- Break

### Core Development
**Duration: 1 hour 10 minutes**
- Transaction upload and processing implementation

### UI Development & Refinements
**Duration: 2 hours 26 minutes**
- Reporting interface and transaction UI development

### Infrastructure & Deployment
**Duration: 11 minutes**
Docker configuration and setup

## Project Setup

### Prerequisites
- Bun (Latest version)
- MongoDB 8.0
- Node.js (LTS version)
- Docker & Docker Compose (for containerization)

### Environment Setup

1. **Install MongoDB**
```bash
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
```

2. **Install Bun**
```bash
curl -fsSL https://bun.sh/install | bash
```

3. **Configure Bun Path**
Add to ~/.zshrc:
```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

### Project Installation

1. **Create Next.js Project**
```bash
bun create next-app ./signa-pro-pay
cd signa-pro-pay
```

2. **Install Dependencies**
```bash
bun add --dev typescript @types/node @types/react @types/mongoose @types/express
bun add mongoose @mui/material @emotion/react @emotion/styled
```

### Development

1. **Start MongoDB**
```bash
brew services start mongodb-community@8.0
```

2. **Start Development Server**
```bash
bun dev
```

### Docker Deployment

1. **Build Containers**
```bash
docker-compose build
```

2. **Run Application**
```bash
docker-compose up
```

## Project Structure

```
signa-pro-pay/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   ├── assets/
│   │   │   └── logo-1024x157.png
│   │   └── page.tsx
│   ├── components/
│   │   └── GroupedTransactionsTable.tsx
│   ├── models/
│   │   ├── Account.ts
│   │   ├── Card.ts
│   │   └── Transaction.ts
│   └── theme.ts
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Key Features

1. **Transaction Processing**
   - Credit/Debit/Transfer transaction support
   - Automated balance calculations
   - Invalid transaction flagging

2. **Account Management**
   - Unique account identification
   - Card-based transaction grouping
   - Balance tracking

3. **User Interface**
   - Material UI components
   - Hierarchical transaction view
   - Interactive data tables
   - File upload with progress tracking

## Security Considerations

- API key authentication (development implementation)
- Headers-based security middleware
- Configurable for production security measures

## Assumptions & Constraints

1. **Transaction Types:**
   - Credit: Increases account balance
   - Debit: Decreases account balance
   - Transfer: Requires source and target accounts

2. **Data Handling:**
   - Account Name serves as unique identifier
   - New transactions per file upload
   - No duplicate transaction handling
   - Non-negative transaction amounts only

## Future Improvements

1. **Security Enhancements**
   - Robust authentication system
   - Rate limiting
   - Input validation

2. **Feature Additions**
   - Duplicate transaction detection
   - Transaction validation rules
   - Audit logging

3. **Performance Optimizations**
   - Caching implementation
   - Batch processing
   - Index optimization

## Challenge Reference
[Original Challenge](https://github.com/signapay/processor-interview)

# VERCEL DOCS #
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

