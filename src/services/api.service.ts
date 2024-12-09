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
    });
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<BaseResponse<T>> = await this.api.get(
      endpoint
    );
    return response.data.data;
  }

  async post<T, D>(endpoint: string, data: D): Promise<T> {
    const response: AxiosResponse<BaseResponse<T>> = await this.api.post(
      endpoint,
      data
    );
    return response.data.data;
  }

  async getProduct(): Promise<Product[]> {
    return this.get<Product[]>("/products");
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
