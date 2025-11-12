# UF ACM - DB Workshop

Fall 2025 UF ACM Database Workshop skeleton.
Complete reference version
    > for the skeleton version used during the workshop, go to the `demo` branch.

> Prerequisites

- Node.js LTS: https://nodejs.org

- VS Code + Live Server extension

> Get Started

1. Verify Node is installed
    ```bash
    node -v
    npm -v
    ```

2. Install backend deps
    ```bash
    cd ufacm_dbworkshop/backend
    npm i
    ```

3. Choose the backend (SQL or JSON)
    ```bash
    # backend/.env
    STORE=sql    # or: json
    PORT=3001
    ```

4. Run the API
    ```bash
    node src/server.js
    # You should see: "API on 3001 using STORE=sql" (or json)
    ```

5. Open the frontend

    - In VS Code, open this repo.

        Right-click frontend/index.html → Open with Live Server.
        The page will load at http://127.0.0.1:5500/frontend/index.html.
