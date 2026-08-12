import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GalleryGrid } from "@/components/GalleryGrid";
import type { Bouquet } from "@/lib/types";

const bouquet: Bouquet = {
  id: "1",
  user_id: "user-1",
  image_url: "https://replicate.delivery/one.webp",
  prompt: "A romantic bouquet",
  flowers: ["Rose", "Peony"],
  mood: "Romantic",
  color_palette: "Pastel",
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("GalleryGrid", () => {
  it("shows the empty state when there are no bouquets", () => {
    render(<GalleryGrid bouquets={[]} onDelete={jest.fn()} />);
    expect(screen.getByTestId("gallery-empty")).toBeInTheDocument();
  });

  it("renders a card for each saved bouquet", () => {
    render(<GalleryGrid bouquets={[bouquet]} onDelete={jest.fn()} />);
    expect(screen.getByText("Rose")).toBeInTheDocument();
    expect(screen.getByText("Peony")).toBeInTheDocument();
    expect(screen.getByText(/Romantic · Pastel/)).toBeInTheDocument();
  });

  it("calls onDelete with the bouquet id when Delete is clicked", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<GalleryGrid bouquets={[bouquet]} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("removes the bouquet from the grid after a successful delete", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<GalleryGrid bouquets={[bouquet]} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(await screen.findByTestId("gallery-empty")).toBeInTheDocument();
  });
});
