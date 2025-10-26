# CRDT Simple Explain

This project serves as a practical demonstration and explanation of Conflict-free Replicated Data Types (CRDTs) in a web application context. It showcases two distinct CRDT implementations: a simple counter and a collaborative text editor, built with modern web technologies.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **Vite**: A fast build tool that provides an instant development server.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **TanStack Router**: A powerful routing library for React applications.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly styling applications.
*   **oRPC**: Used for efficient communication and synchronization of CRDT events between clients and the server.

## Features

### 1. Counter CRDT

A basic implementation of a CRDT for a numerical counter. It demonstrates how simple operations like incrementing and decrementing can be made conflict-free across multiple replicas, ensuring eventual consistency without complex reconciliation logic.

### 2. Collaborative Text Editor CRDT

A more advanced CRDT implementation designed for real-time collaborative text editing. This feature showcases how character insertions and deletions can be managed across distributed clients, allowing multiple users to edit a document concurrently with automatic conflict resolution.

## Project Structure Highlights

*   `src/main.tsx`: Entry point of the React application, setting up the TanStack Router.
*   `src/routes/index.tsx`: The new main route, providing links to the different CRDT examples.
*   `src/routes/editor.tsx`: The route for the collaborative text editor.
*   `src/components/counter/crdt.ts`: Contains the logic for the Counter CRDT.
*   `src/components/editor/crdt.ts`: Contains the core logic for the Collaborative Text Editor CRDT.
*   `src/components/counter/sync-worker.worker.ts` and `src/components/editor/sync-worker.worker.ts`: These files handle synchronization, likely using Web Workers for background processing.

## Getting Started

To run this project locally:

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```
2.  **Start the development server**:
    ```bash
    pnpm dev
    ```
    This will typically start the application on `http://localhost:5173`.

## Deployment

This project is configured to deploy to GitHub Pages automatically on pushes to the `main` branch.

To manually deploy:

```bash
pnpm run deploy
```

## How to Explore

*   Navigate to the root URL (`/`) to see the introduction page with links to the CRDT examples.
*   Explore the `/editor` route to interact with the collaborative text editor.
*   Explore the `/counter` route to interact with the simple counter.
*   Examine the `src/components/counter/crdt.ts` and `src/components/editor/crdt.ts` files to understand the CRDT implementations.
*   Examine the `src/components/counter/sync-worker.worker.ts` and `src/components/editor/sync-worker.worker.ts` files to see how synchronization is handled, likely using Web Workers for background processing.
