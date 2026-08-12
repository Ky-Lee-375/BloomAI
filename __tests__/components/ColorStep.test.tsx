import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColorStep } from "@/components/wizard/ColorStep";

describe("ColorStep", () => {
  it("renders all available palettes", () => {
    render(<ColorStep selected="" onSelect={jest.fn()} />);
    expect(screen.getByText("Pastel")).toBeInTheDocument();
    expect(screen.getByText("Monochrome")).toBeInTheDocument();
  });

  it("marks the selected palette as checked", () => {
    render(<ColorStep selected="Vibrant" onSelect={jest.fn()} />);
    expect(screen.getByRole("checkbox", { name: /Vibrant/ })).toHaveAttribute("aria-checked", "true");
  });

  it("calls onSelect with the palette name when clicked", async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();
    render(<ColorStep selected="" onSelect={onSelect} />);

    await user.click(screen.getByRole("checkbox", { name: /Neutral/ }));

    expect(onSelect).toHaveBeenCalledWith("Neutral");
  });
});
