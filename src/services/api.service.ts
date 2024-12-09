import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BaseResponse, Product } from "../types/api.types.ts";

class ApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://54.37.11.89:3000",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    this.api.interceptors.request.use((config) => {
      console.log("Request Config:", config);
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => {
        console.log("Response Receive", response);
        return response;
      },
      (error) => {
        console.log("API Error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async post<T, D>(endpoint: string, data: D): Promise<T> {
    const response: AxiosResponse<BaseResponse<T>> = await this.api.post(
      endpoint,
      data
    );
    return response.data.data;
  }

  async getProduct(): Promise<Product[]> {
    try {
      const response = await this.api.get("/products");

      console.log("Full Product Response:", response);

      if (response.config.url !== "/products") {
        console.warn("Unexpected route accessed");
        return [];
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      console.error("Unexpected response structure:", response.data);
      return [];

    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async createProduct(
    userData: Omit<Product, "id" | "createAt">
  ): Promise<Product> {
    return this.post<Product, Omit<Product, "id" | "createAt">>(
      "/products",
      userData
    );
  }
}

export const apiService = new ApiService();
