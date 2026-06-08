import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Timeline } from "./Timeline";

function renderTimeline(props: { limit?: number; showFilters?: boolean } = {}) {
  return render(
    <MemoryRouter>
      <TooltipProvider>
        <Timeline {...props} />
      </TooltipProvider>
    </MemoryRouter>,
  );
}

describe("Timeline", () => {
  it("renders timeline heading and events", async () => {
    renderTimeline();
    expect(
      screen.getByRole("heading", { name: /timeline of major mosques/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("feed", { name: /timeline showing \d+ events/i }),
    ).toBeInTheDocument();
  });

  it("preview mode shows limited events without filters", () => {
    renderTimeline({ limit: 5, showFilters: false });
    expect(screen.queryByRole("combobox", { name: /sort timeline/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see all \d+ events/i })).toBeInTheDocument();
  });

  it("full mode shows filter controls", async () => {
    renderTimeline({ showFilters: true });
    expect(
      await screen.findByRole("combobox", { name: /sort timeline/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view full islamic history timeline/i })).toBeInTheDocument();
  });
});
