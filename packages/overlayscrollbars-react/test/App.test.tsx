import React from "react";
import { render, screen } from "@testing-library/react";
import { OverlayScrollbarsComponents } from "../src/overlayscrollbars-react";

test("renders learn react link", () => {
  render(<OverlayScrollbarsComponents msg="hi" />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
