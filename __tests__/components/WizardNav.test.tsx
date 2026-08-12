import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WizardNav } from "@/components/wizard/WizardNav";

function setup(overrides = {}) {
  const props = {
    step: 0,
    isFirstStep: true,
    isLastStep: false,
    isStepValid: true,
    onBack: jest.fn(),
    onNext: jest.fn(),
    onGenerate: jest.fn(),
    ...overrides,
  };
  render(<WizardNav {...props} />);
  return props;
}

describe("WizardNav", () => {
  it("disables the back button on the first step", () => {
    setup({ isFirstStep: true });
    expect(screen.getByRole("button", { name: /back/i })).toBeDisabled();
  });

  it("enables the back button after the first step", () => {
    setup({ isFirstStep: false });
    expect(screen.getByRole("button", { name: /back/i })).toBeEnabled();
  });

  it("shows Continue on non-final steps", () => {
    setup({ isLastStep: false });
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("shows Generate bouquet on the final step", () => {
    setup({ isLastStep: true });
    expect(screen.getByRole("button", { name: /generate bouquet/i })).toBeInTheDocument();
  });

  it("disables Continue when the step is invalid", () => {
    setup({ isLastStep: false, isStepValid: false });
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("calls onNext when Continue is clicked", async () => {
    const user = userEvent.setup();
    const props = setup({ isLastStep: false, isStepValid: true });
    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(props.onNext).toHaveBeenCalled();
  });

  it("calls onGenerate when Generate bouquet is clicked", async () => {
    const user = userEvent.setup();
    const props = setup({ isLastStep: true, isStepValid: true });
    await user.click(screen.getByRole("button", { name: /generate bouquet/i }));
    expect(props.onGenerate).toHaveBeenCalled();
  });

  it("shows a submitting label while generating", () => {
    setup({ isLastStep: true, isSubmitting: true });
    expect(screen.getByRole("button", { name: /painting your bouquet/i })).toBeDisabled();
  });
});
