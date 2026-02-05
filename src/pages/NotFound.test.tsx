import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("renders 404 heading and message", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText(/oops! page not found/i)).toBeInTheDocument();
  });

  it("has link to return home", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /return to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
