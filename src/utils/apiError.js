export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) return data;
  if (typeof data?.error === "string" && data.error.trim()) return data.error;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
  if (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) {
    return data.non_field_errors[0];
  }

  if (data && typeof data === "object") {
    const first = Object.entries(data)[0];
    if (first) {
      const [field, msg] = first;
      if (Array.isArray(msg) && msg[0]) {
        return `${field}: ${msg[0]}`;
      }
      if (typeof msg === "string") {
        return `${field}: ${msg}`;
      }
    }
  }

  return fallback;
};
