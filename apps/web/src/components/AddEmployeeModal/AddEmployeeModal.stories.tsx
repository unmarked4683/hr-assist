import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { AddEmployeeModal } from "./AddEmployeeModal";

const meta: Meta<typeof AddEmployeeModal> = {
  title: "Modals/AddEmployeeModal",
  component: AddEmployeeModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AddEmployeeModal>;

export const Open: Story = {
  args: {
    open: true,
  },
};

export const Closed: Story = {
  args: {
    open: false,
  },
};
