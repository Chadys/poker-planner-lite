import type { Meta, StoryObj } from '@storybook/angular';
import { PokerCardComponent } from '../app/room/poker-card/poker-card.component';

const meta: Meta<PokerCardComponent> = {
  title: 'PokerCard',
  component: PokerCardComponent,
  tags: ['autodocs'],
  argTypes: {
    content: { type: 'string' },
    size: { type: { name: 'enum', value: ['S', 'L'] } },
    disabled: { type: 'boolean' },
    private: { type: 'boolean' },
    active: { type: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<PokerCardComponent>;

export const Default: Story = {
  // waiting for https://github.com/storybookjs/storybook/issues/25784 to remove ts annotation
  args: {
    // @ts-expect-error waiting for storybook support of angular input signal
    content: 'Test',
    // @ts-expect-error waiting for storybook support of angular input signal
    size: 'S',
    // @ts-expect-error waiting for storybook support of angular input signal
    disabled: false,
    // @ts-expect-error waiting for storybook support of angular input signal
    private: false,
    // @ts-expect-error waiting for storybook support of angular input signal
    active: false,
  },
};
