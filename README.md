
# Minimalistic RAG Starter

Starter project for your GenAI RAG application.

## 🛠️ Tech Stack

The project is built using the following open source tools:

- **Frontend:** [Vue 3](https://vuejs.org/), [HeadlessUI](https://headlessui.com/), [Prism](https://prismjs.com/)
- **Backend:** [Redis](https://redis.io/), [Nest.js](https://nestjs.com/)
- **DevOps:** [Docker](https://docs.docker.com/compose/)
- **Others:** [LangChain](https://js.langchain.com/), [Socket.io](https://socket.io/)
- **Database:** [Qdrant](https://qdrant.tech/)


## 📦 Prerequisites

In order to run the app you should have the following installed:

- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Node 20](https://nodejs.org/en/download/package-manager)
- [Docker](https://docs.docker.com/engine/install) (or [Colima](https://github.com/abiosoft/colima))

## ⚙️  Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/zaikinv/rag-starter.git
    cd rag-starter
    ```

2. Install the dependencies:

    ```bash
    npm i
    ```

## 📊 Ingest the data

1. Create a `docs` folder

    ```bash
    mkdir docs
    ```

2. Add your docs to folder.


   🚨 Currently supports `.md` files only. Adjust `packages/scripts/loader` if needed.


3. Run the script

    ```bash
    npm run ingest
    ```
   
## 🤖 Run Locally

Clone the project

1. Create `.env` in the root folder:

    ```bash
    touch .env
    ```

2. Set environment variables in `.env:

    ```bash    
    OPENAI_API_KEY=
    OPENAI_API_BASE_URL=

    VECTOR_STORE_DEFAULT_COLLECTION_NAME=
    VECTOR_STORE_API_KEY=
    VECTOR_STORE_URL=

    REDIS_HOST=
    REDIS_PORT=

    DOCS_FOLDER_NAME=
    ```
   
    <details>
   
      <summary>Example</summary>

   ```bash    
   OPENAI_API_KEY=sk-JsdnaErYVIPuej4kqweT7BmzkGH7FXIDPR6u4fGyUF8W1ET
   OPENAI_API_BASE_URL=https://api.openai.com/v1/

   VECTOR_STORE_DEFAULT_COLLECTION_NAME=my-embeddings
   VECTOR_STORE_API_KEY=JsdnaErYVIPuej4kqweT7Bmzk
   VECTOR_STORE_URL=http://localhost:6333
	
   REDIS_HOST=localhost
   REDIS_PORT=6379

   DOCS_FOLDER_NAME=docs
    ```

    </details>

3. Configure the assistant web component:

    ```html
    <ask-docs-widget
      ui-theme=""
      api-url=""
      vector-store-collection-name=""
      external-source-base-url="">
    </ask-docs-widget>
    ```

   | Parameter                      | Example                 | Description                                   |
   |:-------------------------------|:------------------------|:----------------------------------------------|
   | `ui-theme`                     | `light`                 | Can be customized in `src/styles/themes.scss` |
   | `api-url`                      | `http://localhost:3000` | Base URL of Nest backend                      |
   | `vector-store-collection-name` | `my-embeddings`         | Name of Qdrant collection                     |
   | `external-source-base-url`     | `https://google.com`    | Optional, used to prefix links                |


4. Run the containers:

    ```bash
    docker compose -f docker-compose.yml up --build --remove-orphans
    ```

5. Run the app:

    ```bash
    npm run start:all 
    ```