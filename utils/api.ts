import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * 1️⃣ Optional: Use EXPO_PUBLIC_API_URL (ideal for ngrok + EAS builds)
 * Just set:
 * EXPO_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.app
 */
const ENV_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * 2️⃣ LAN Auto-detect (works in Expo Dev Tools, same WiFi)
 */
function deriveLanUrl(): string | null {
  const hostUri =
    (Constants as any)?.expoConfig?.hostUri ||
    (Constants as any)?.manifest?.debuggerHost ||
    "";

  const host = typeof hostUri === "string" ? hostUri.split(":")[0] : "";

  if (host) return `http://${host}:8000`;
  return null;
}

/**
 * 3️⃣ Final Base URL Resolver
 * Priority:
 *    EXPO_PUBLIC_API_URL  → ngrok or production
 *    LAN URL              → WiFi development
 *    Android Emulator     → 10.0.2.2
 *    iOS Simulator        → localhost
 */
function getBaseURL(): string {
  if (ENV_URL) {
    console.log("🔗 Using API URL from environment:", ENV_URL);
    return ENV_URL;
  }

  const lanUrl = deriveLanUrl();
  if (lanUrl) {
    console.log("🌐 Using LAN API:", lanUrl);
    return lanUrl;
  }

  if (Platform.OS === "android") {
    console.log("📱 Android emulator fallback → http://10.0.2.2:8000");
    return "http://10.0.2.2:8000";
  }

  console.log("💻 Defaulting to localhost API → http://localhost:8000");
  return "http://localhost:8000";
}

/**
 * 4️⃣ Axios Instance
 */
export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
});

/**
 * 5️⃣ Token Setter
 */
export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

/**
 * 6️⃣ Auto-refresh Token Interceptor
 */
export function setupAxiosInterceptors({
  getRefreshToken,
  onTokens,
}: {
  getRefreshToken: () => string | null;
  onTokens: (access: string, refresh?: string | null) => void;
}) {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refresh = getRefreshToken();

        if (refresh) {
          try {
            const r = await api.post("/auth/refresh", {
              refresh_token: refresh,
            });

            const { access_token, refresh_token } = r.data;

            setAuthToken(access_token);
            onTokens(access_token, refresh_token);

            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${access_token}`,
            };

            return api(originalRequest);
          } catch (e) {
            // fall through
          }
        }
      }

      return Promise.reject(error);
    }
  );
}
