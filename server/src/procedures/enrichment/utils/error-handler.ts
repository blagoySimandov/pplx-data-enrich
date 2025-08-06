export function extractErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unknown error";
  }

  let errorMessage = error.message;

  if ("response" in error && typeof error.response === "object" && error.response) {
    const response = error.response as {
      data?: { error?: { message?: string }; message?: string };
    };
    
    if (response.data) {
      console.error("Error response data:", response.data);
      errorMessage = response.data.error?.message || response.data.message || errorMessage;
    }
  }

  return errorMessage;
}