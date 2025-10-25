export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export const handleAPIError = (error: unknown): string => {
  if (error instanceof APIError) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input."
      case 401:
        return "Unauthorized. Please log in again."
      case 403:
        return "You don't have permission to perform this action."
      case 404:
        return "Resource not found."
      case 500:
        return "Server error. Please try again later."
      default:
        return error.message || "An error occurred."
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred."
}

export const logError = (error: unknown, context?: string) => {
  console.error(`[Error${context ? ` - ${context}` : ""}]`, error)
}
