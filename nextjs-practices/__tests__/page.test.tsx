import Page from "@/app/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

const { getByText } = screen;

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);

    const text = getByText("Save and see your changes instantly.");

    expect(text).toBeInTheDocument();
  });
});
