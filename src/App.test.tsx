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
    expect(screen.getByTitle("Раздел 1")).toBeInTheDocument();
  });

  it("рендерит вкладки «Основная информация» и «Корзина сайта»", () => {
    render(<App />);
    expect(screen.getByRole("tab", { name: "Основная информация" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Корзина сайта" })).toBeInTheDocument();
  });
});
