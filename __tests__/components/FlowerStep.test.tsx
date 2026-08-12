import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlowerStep } from "@/components/wizard/FlowerStep";

describe("FlowerStep", () => {
  it("renders all available flowers", () => {
    render(<FlowerStep selected={[]} onToggle={jest.fn()} />);
    expect(screen.getByText("Rose")).toBeInTheDocument();
    expect(screen.getByText("Lavender")).toBeInTheDocument();
  });

  it("marks selected flowers as checked", () => {
    render(<FlowerStep selected={["Rose"]} onToggle={jest.fn()} />);
    expect(screen.getByRole("checkbox", { name: /Rose/ })).toHaveAttribute("aria-checked", "true");
  });

  it("calls onToggle with the flower name when clicked", async () => {
    const onToggle = jest.fn();
    const user = userEvent.setup();
    render(<FlowerStep selected={[]} onToggle={onToggle} />);

    await user.click(screen.getByRole("checkbox", { name: /Sunflower/ }));

    expect(onToggle).toHaveBeenCalledWith("Sunflower");
  });
});
