# Inventory Warehouse Management System

A full-stack web application for managing warehouse inventory, including item records, categories, suppliers, stock movements, and current stock tracking.

## Features

### Inventory Management
- Manage inventory items and their related information.
- Organize items by category.
- Maintain supplier information.
- View inventory records and current stock quantities.

### Stock Movement
- Record **stock-in** transactions when items enter the warehouse.
- Record **stock-out** transactions when items leave the warehouse.
- Keep a history of stock movements for tracking inventory changes.
- Use stock movement records to help monitor warehouse activity.

### User Interface
- React-based frontend built with Vite.
- Backend API built with Node.js and Express.
- Separate frontend and backend applications.

> **Note:** Excel/CSV export is not implemented yet. It can be added as a future enhancement.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| UI / Styling | Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | Configured through the backend environment |

## Project Structure

```text
inventaris-gudang/
├── backend/   # Backend API and database logic
└── frontend/  # React frontend application
```

## Getting Started

### Prerequisites

- Node.js and npm
- A database supported by the Prisma schema
- Git

### 1. Clone the repository

```bash
git clone https://github.com/hizkiasiahaandev/inventaris-gudang.git
cd inventaris-gudang
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Configure the backend environment variables in a `.env` file. Set the database connection string and any other variables required by the project.

If the repository contains Prisma migrations, apply them using the workflow configured for this project. Common Prisma commands include:

```bash
npx prisma generate
npx prisma migrate dev
```

Use the project's existing scripts and migration setup where applicable.

Start the backend with the development script defined in `backend/package.json`. The expected backend URL is:

```text
http://localhost:3000
```

For example, if a `dev` script is available:

```bash
npm run dev
```

Keep the backend terminal running.

### 3. Set up the frontend

Open another terminal from the repository root:

```bash
cd frontend
npm install
```

If the frontend uses an environment variable for the API base URL, configure it to point to the backend, for example:

```text
http://localhost:3000
```

Start the Vite development server:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

If the port is already in use, Vite may choose another available port unless the configuration requires a fixed port.

## Stock Movement Workflow

1. Create or select an inventory item.
2. Record a stock movement as **IN** when stock is received.
3. Record a stock movement as **OUT** when stock is issued.
4. Review the movement history to track changes to inventory.
5. Check the current stock quantity after recording a movement.

The exact validation rules and status behavior follow the implementation in the application.

## Roadmap

Potential improvements for future development:

- Export inventory and stock movement reports to Excel (`.xlsx`) or CSV.
- Add date-range filters for stock movement reports.
- Add more dashboard analytics and low-stock indicators if required.
- Improve automated tests for stock movement and inventory consistency.

## Development Notes

- Keep database credentials and secrets in environment variables.
- Do not commit `.env` files or sensitive operational data.
- Validate stock movement quantities on the backend.
- Use database transactions where appropriate to keep stock changes consistent.

## Author

**Hizkia Siahaan**

- GitHub: [@hizkiasiahaandev](https://github.com/hizkiasiahaandev)
- Repository: [inventaris-gudang](https://github.com/hizkiasiahaandev/inventaris-gudang)
