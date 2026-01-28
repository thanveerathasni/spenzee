// import axios from "axios";
// import type { AxiosInstance, AxiosRequestConfig } from "axios";
// import { store } from "../store/store";
// import { clearAuth, setAuth } from "../store/auth";

// /* --------------------
//    Types
// -------------------- */

// interface RetryAxiosRequestConfig extends AxiosRequestConfig {
//   _retry?: boolean;
// }

// /* --------------------
//    Axios Instance
// -------------------- */

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// export const api: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /* --------------------
//    Request Interceptor
// -------------------- */

// // api.interceptors.request.use((config) => {
// //   const accessToken = store.getState().auth.accessToken;

// //   if (accessToken) {
// //     config.headers = config.headers ?? {};
// //     config.headers.Authorization = `Bearer ${accessToken}`;
// //   }

// //   return config;
// // });


// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       store.dispatch(clearAuth());
//     }
//     return Promise.reject(error);
//   }
// );

// /* --------------------
//    Refresh State
// -------------------- */

// let isRefreshing = false;

// type FailedRequest = {
//   resolve: (token: string) => void;
//   reject: (error: unknown) => void;
// };

// let failedQueue: FailedRequest[] = [];

// const processQueue = (error: unknown, token: string | null) => {
//   failedQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error);
//     } else if (token) {
//       promise.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// /* --------------------
//    Response Interceptor
// -------------------- */

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config as RetryAxiosRequestConfig | undefined;

//     if (!originalRequest || error.response?.status !== 401) {
//       return Promise.reject(error);
//     }

//     // Never retry auth endpoints
//     if (
//   originalRequest.url?.endsWith("/auth/login") ||
//   originalRequest.url?.endsWith("/auth/refresh")
// ) {

//       store.dispatch(clearAuth());
//       return Promise.reject(error);
//     }

//     // Prevent infinite loop
//     if (originalRequest._retry) {
//       store.dispatch(clearAuth());
//       return Promise.reject(error);
//     }

//     // Queue requests while refreshing
//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({
//           resolve: (token: string) => {
//             originalRequest.headers = originalRequest.headers ?? {};
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(api(originalRequest));
//           },
//           reject,
//         });
//       });
//     }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     try {
//       const response = await api.post<{ accessToken: string }>("/auth/refresh");
//       const newAccessToken = response.data.accessToken;

//       store.dispatch(
//         setAuth({
//           accessToken: newAccessToken,
//           user: store.getState().auth.user!,
//         })
//       );

//       processQueue(null, newAccessToken);

//       originalRequest.headers = originalRequest.headers ?? {};
//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//       return api(originalRequest);
//     } catch (refreshError) {
//       processQueue(refreshError, null);
//       store.dispatch(clearAuth());
//       return Promise.reject(refreshError);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );








import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "../store/store";
import { clearAuth, setAuth } from "../store/auth";

/* --------------------
   Types
-------------------- */

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/* --------------------
   Axios Instance
-------------------- */

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // baseURL: "",
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

/* --------------------
   Request Interceptor
-------------------- */

api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* --------------------
   Refresh State
-------------------- */

let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else if (token) promise.resolve(token);
  });

  failedQueue = [];
};

/* --------------------
   Response Interceptor (ONLY ONE)
-------------------- */

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config as RetryAxiosRequestConfig;

//     if (error.response?.status !== 401) {
//       return Promise.reject(error);
//     }

//     // ❌ Never refresh on auth endpoints
//     if (
//       originalRequest.url?.includes("/auth/login") ||
//       originalRequest.url?.includes("/auth/refresh")
//     ) {
//       // store.dispatch(clearAuth());
//       return Promise.reject(error);
//     }

//     // ❌ Prevent infinite loop
//     if (originalRequest._retry) {
//       store.dispatch(clearAuth());
//       return Promise.reject(error);
//     }

//     // ⏳ Queue while refreshing
//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({
//           resolve: (token) => {
//             originalRequest.headers = originalRequest.headers ?? {};
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(api(originalRequest));
//           },
//           reject,
//         });
//       });
//     }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     try {
//       const { data } = await api.post("/auth/refresh");

//       store.dispatch(
//         setAuth({
//           accessToken: data.accessToken,
//           user: data.user,
//         })
//       );

//       processQueue(null, data.accessToken);

//       originalRequest.headers = originalRequest.headers ?? {};
//       originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

//       return api(originalRequest);
//     } catch (err) {
//       processQueue(err, null);
//       store.dispatch(clearAuth());
//       return Promise.reject(err);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );




api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as RetryAxiosRequestConfig;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ❌ NEVER refresh auth routes
    if (original.url?.includes("/auth")) {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    if (original._retry) {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const { data } = await api.post("/auth/refresh");

      store.dispatch(
        setAuth({
          accessToken: data.accessToken,
          user: data.user,
        })
      );

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${data.accessToken}`;

      return api(original);
    } catch {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }
  }
);



