import { jsonrepair } from "jsonrepair";

export function getResponseText(
  response: { text(): string },
  context: string
): string {
  let text: string;

  try {
    text = response.text();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown model response error";
    throw new Error(`${context} did not return readable text: ${message}`);
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error(`${context} returned an empty response.`);
  }

  return trimmed;
}

export function parseJsonResponse<T>(value: string, context: string): T {
  const trimmed = value.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(withoutFence) as T;
  } catch {
    try {
      return JSON.parse(jsonrepair(withoutFence)) as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      throw new Error(`${context} returned invalid JSON: ${message}`);
    }
  }
}
