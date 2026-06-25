import { b as apiConfig } from './AppHeader-CiIf_B2g.mjs';

const isObject = (obj) => obj !== null && typeof obj === "object" && !Array.isArray(obj) && !(obj instanceof Date);
const isArray = (obj) => Array.isArray(obj);
const toSnake = (obj) => {
  if (isArray(obj)) {
    return obj.map(toSnake);
  }
  if (isObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
        toSnake(v)
      ])
    );
  }
  return obj;
};
const toCamel = (obj) => {
  if (isArray(obj)) {
    return obj.map(toCamel);
  }
  if (isObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, m) => m.toUpperCase()),
        toCamel(v)
      ])
    );
  }
  return obj;
};
class ApiError extends Error {
  status;
  payload;
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}
const buildUrl = (path) => {
  const trimmedPath = path.replace(/^\/+/, "");
  return `${apiConfig.baseUrl}/${trimmedPath}`;
};
async function apiRequest(path, init = {}) {
  const url = buildUrl(path);
  const headers = new Headers(init.headers ?? {});
  const { body, responseType = "json", ...rest } = init;
  {
    headers.set("x-api-key", apiConfig.apiKey);
  }
  const requestInit = {
    ...rest,
    headers
  };
  if (body !== void 0) {
    if (body instanceof FormData) {
      requestInit.body = toSnake(body);
    } else if (typeof body === "object") {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      requestInit.body = JSON.stringify(toSnake(body));
    } else {
      requestInit.body = String(body);
    }
  }
  const response = await fetch(url, requestInit);
  if (responseType === "blob") {
    if (!response.ok) {
      throw new ApiError(response.statusText, response.status);
    }
    return {
      statusCode: response.status,
      success: true,
      message: void 0,
      data: await response.blob()
    };
  }
  if (responseType === "arrayBuffer") {
    if (!response.ok) {
      throw new ApiError(response.statusText, response.status);
    }
    return {
      statusCode: response.status,
      success: true,
      message: void 0,
      data: await response.arrayBuffer()
    };
  }
  const text = await response.text();
  let parsed = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }
  const payload = typeof parsed === "object" && parsed !== null ? parsed : null;
  const serverResponse = {
    statusCode: response.status,
    success: payload?.["success"] ?? response.ok,
    message: payload?.["message"] ?? (response.ok ? void 0 : response.statusText),
    data: toCamel(payload?.["data"] ?? parsed ?? null)
  };
  if (!response.ok) {
    throw new ApiError(
      serverResponse.message ?? response.statusText,
      response.status,
      serverResponse
    );
  }
  return serverResponse;
}

export { apiRequest as a };
//# sourceMappingURL=client-DcOxoYBd.mjs.map
