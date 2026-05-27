import type { HttpClient, HttpRequest } from "./HttpClient";
import { UnauthorizedError } from "@/shared/errors/UnauthorizedError";
import { RequestAbortedError } from "@/shared/errors/RequestAbortedError";
import { HttpError } from "@/shared/errors/HttpError";


function mergeSignals(signals: Array<AbortSignal | undefined>): AbortSignal | undefined {
  const valid = signals.filter(Boolean) as AbortSignal[];
  if (valid.length === 0) return undefined;
  if (valid.length === 1) return valid[0];


  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.any === "function") {
    return AbortSignal.any(valid);
  }

  // fallback
  const controller = new AbortController();
  const onAbort = () => controller.abort();

  for (const s of valid) {
    if (s.aborted) {
      controller.abort();
      break;
    }
    s.addEventListener("abort", onAbort, { once: true });
  }

  return controller.signal;
}

export function createApiClient(baseUrl = ""): HttpClient {
  return {
    async request<T>(req: HttpRequest): Promise<T> {
      const {
        url,
        method = "GET",
        body,
        headers,
        withCredentials = true,
        signal,
        timeoutMs,
      } = req;

      // abort por timeout (interno)
      const timeoutController = timeoutMs ? new AbortController() : null;
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      if (timeoutController && timeoutMs) {
        timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
      }

      const finalSignal = mergeSignals([signal, timeoutController?.signal]);

      try {
        const res = await fetch(`${baseUrl}${url}`, {
          method,
          signal: finalSignal,
          credentials: withCredentials ? "include" : "same-origin",
          headers: {
            ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
            ...(headers ?? {}),
          },
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        if (res.status === 401) throw new UnauthorizedError();

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new HttpError(res.status, text);
        }

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return undefined as T;

        return (await res.json()) as T;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          throw new RequestAbortedError();
        }
        throw err;
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    },
  };
}