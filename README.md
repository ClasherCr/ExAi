# ExAi App  

ExAi is a chat application built with Expo, Firebase, and Docker. It leverages Firebase Realtime Database for storing API keys, IP addresses, and chat history. The app integrates AI functionality powered by Open WebUI, Ollama, and OpenAI APIs.  

## Features  
- **Google Login Integration**  
- **Home Screen for Chats**  
- **AI Chat Powered by Llama 3.2 and OpenAI**  
- **Real-time Database for API Key and IP Storage**  
- **Chat History Stored for Future Reference**  

---

## Prerequisites  

### Installations  
1. [Node.js](https://nodejs.org/)  
2. [Expo CLI](https://docs.expo.dev/get-started/installation/)  
3. [Firebase Project Setup](https://firebase.google.com/)  
4. [Docker](https://www.docker.com/)  

### Firebase Configuration  
- Create a Firebase project.  
- Enable **Firebase Authentication** (Google Login).  
- Configure **Firebase Realtime Database** and store:  
  - `API_KEY`: Your OpenAI API Key.  
  - `IP_ADDRESS`: IP address for Open WebUI/Ollama server.  

---

## Setup Instructions  

### 1. Clone the Repository  
bash
git clone https://github.com/your-username/exai.git
cd exai
2. Install Dependencies
bash
Copy code
npm install
3. Firebase Configuration
Replace firebaseConfig in your app's firebase.js file with your Firebase project's credentials:

javascript
Copy code
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  databaseURL: "your_database_url",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
};
Running the App
1. Start the Expo App
bash
Copy code
expo start
Scan the QR code to open the app on your mobile device or run it in an emulator.

2. Configure Docker
Default Configuration (Ollama on the same machine):
bash
Copy code
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
Ollama on a Different Server:
Replace https://example.com with your server's URL:

bash
Copy code
docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
Open WebUI with Nvidia GPU Support:
bash
Copy code
docker run -d -p 3000:8080 --gpus all --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:cuda
Installation for OpenAI API Usage Only
If you are exclusively using the OpenAI API:

bash
Copy code
docker run -d -p 3000:8080 -e OPENAI_API_KEY=your_secret_key -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
Installing Open WebUI with Bundled Ollama
With GPU Support:
bash
Copy code
docker run -d -p 3000:8080 --gpus=all -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
For CPU Only:
bash
Copy code
docker run -d -p 3000:8080 -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
Firebase Configuration in Expo
Use Firebase Authentication for user login.
Fetch API_KEY and IP_ADDRESS from the Realtime Database:
javascript
Copy code
import { getDatabase, ref, get } from 'firebase/database';

const fetchConfig = async () => {
  const db = getDatabase();
  const apiKeyRef = ref(db, 'API_KEY');
  const ipAddressRef = ref(db, 'IP_ADDRESS');

  const apiKeySnapshot = await get(apiKeyRef);
  const ipAddressSnapshot = await get(ipAddressRef);

  return {
    apiKey: apiKeySnapshot.val(),
    ipAddress: ipAddressSnapshot.val(),
  };
};
Troubleshooting
Docker Issues
Ensure Docker is running on your machine.
Verify ports (3000 and 8080) are not blocked.
Expo Issues
Clear Expo cache:
bash
Copy code
expo start -c
License
This project is licensed under the MIT License.

