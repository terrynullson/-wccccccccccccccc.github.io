import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("рендерит layout с брендом WCC и поиском", () => {
    render(<App />);
    expect(screen.getByText("WCC")).toBeInTheDocument();
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("рендерит боковое меню с разделами", () => {
    render(<App />);
    expect(screen.getByRole("navigation", { name: "Разделы" })).toBeInTheDocument();
    expect(screen.getAllByTitle("Корзина").length).toBeGreaterThan(0);
  });

  it("рендерит вкладки клиента", () => {
    render(<App />);
    expect(screen.getByRole("tab", { name: "Осн.инф." })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Парковка" })).toBeInTheDocument();
  });
});
