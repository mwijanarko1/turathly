import { describe, expect, it } from "vitest";
import { getResponseText, parseJsonResponse } from "../../convex/lib/ai";

describe("convex ai response helpers", () => {
  it("parses fenced json", () => {
    const parsed = parseJsonResponse<{ value: number }>("```json\n{\"value\":1}\n```", "Test model");

    expect(parsed).toEqual({ value: 1 });
  });

  it("repairs malformed json before parsing", () => {
    const parsed = parseJsonResponse<{ value: string }>('{value: "fixed"}', "Test model");

    expect(parsed).toEqual({ value: "fixed" });
  });

  it("throws a clear error when json is still invalid", () => {
    expect(() => parseJsonResponse("{", "Test model")).toThrow(
      "Test model returned invalid JSON"
    );
  });

  it("throws a clear error on empty text responses", () => {
    expect(() =>
      getResponseText(
        {
          text: () => "   ",
        },
        "Test model"
      )
    ).toThrow("Test model returned an empty response.");
  });

  it("wraps thrown response text errors", () => {
    expect(() =>
      getResponseText(
        {
          text: () => {
            throw new Error("blocked");
          },
        },
        "Test model"
      )
    ).toThrow("Test model did not return readable text: blocked");
  });
});
