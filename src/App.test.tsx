import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders skip to main content link for accessibility", () => {
    render(<App />);
    const skip = screen.getByText(/skip to main content/i);
    expect(skip).toBeInTheDocument();
    expect(skip).toHaveAttribute("href", "#main-content");
  });
});
