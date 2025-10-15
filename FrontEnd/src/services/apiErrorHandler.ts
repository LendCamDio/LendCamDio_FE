import type { ApiResponse } from "@/types/entity.type";
import { AxiosError } from "axios";

export const handleApiError = <T>(error: unknown): ApiResponse<T> => {
  if (error instanceof AxiosError && error.response?.data) {
    const responseData = error.response.data;

    // Check if it's an ASP.NET validation error format
    if (responseData.errors && responseData.status) {
      // Convert validation errors object to a single message
      const errorMessages = Object.entries(responseData.errors)
        .map(
          ([field, messages]) =>
            `${field}: ${(messages as string[]).join(", ")}`
        )
        .join("; ");

      return {
        success: false,
        error: {
          code: responseData.status,
          message: errorMessages || responseData.title,
        },
        timestamp: new Date().toISOString(),
      };
    }

    // If it's already in our format, return it directly
    if ("success" in responseData && "error" in responseData) {
      return responseData as ApiResponse<T>;
    }

    // Other API error formats
    return {
      success: false,
      error: {
        code: error.response.status || 500,
        message:
          responseData.message || responseData.title || "Unknown API error",
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Network or unexpected error
  return {
    success: false,
    error: {
      code: 500,
      message:
        error instanceof Error ? error.message : "Network error occurred",
    },
    timestamp: new Date().toISOString(),
  };
};
