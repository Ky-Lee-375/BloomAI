import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodStep } from "@/components/wizard/MoodStep";

describe("MoodStep", () => {
  it("renders all available moods", () => {
    render(<MoodStep selected="" onSelect={jest.fn()} />);
    expect(screen.getByText("Romantic")).toBeInTheDocument();
    expect(screen.getByText("Whimsical")).toBeInTheDocument();
  });

  it("marks the selected mood as checked", () => {
    render(<MoodStep selected="Calm" onSelect={jest.fn()} />);
    expect(screen.getByRole("checkbox", { name: /Calm/ })).toHaveAttribute("aria-checked", "true");
  });

  it("calls onSelect with the mood name when clicked", async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();
    render(<MoodStep selected="" onSelect={onSelect} />);

    await user.click(screen.getByRole("checkbox", { name: /Elegant/ }));

    expect(onSelect).toHaveBeenCalledWith("Elegant");
  });
});
