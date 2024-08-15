import { LinkedAction } from '@solana/actions';

export const actionData = {
  title: 'Buy me a coffee',
  description:
    'If you feel you would like to support me in my endeavours of making learning videos, releasing solana programs and creating content, I would of course be hugely thankful.',
  label: 'Buy me a coffee',
  icon: 'https://ipfs.io/ipfs/QmeBvmLB18sjtFfHNc51qYZGSZBMXSH2eGxfJbhVdEWUSQ',
  links: {
    actions: [
      {
        label: '0.01 SOL', // button text
        href: '/api/actions/buy-me-a-coffee?action=1&amount=0',
        // no `parameters` therefore not a text input field
      } as LinkedAction,
      {
        label: '0.1 SOL', // button text
        href: '/api/actions/buy-me-a-coffee?action=2&amount=0',
        // no `parameters` therefore not a text input field
      } as LinkedAction,
      {
        label: '1 SOL', // button text
        href: '/api/actions/buy-me-a-coffee?action=3&amount=0',
        // no `parameters` therefore not a text input field
      } as LinkedAction,
      {
        label: 'Donate', // button text
        href: '/api/actions/buy-me-a-coffee?action=4&amount={amount}',
        parameters: [
          {
            type: 'number',
            name: 'amount', // field name
            label: 'Enter a custom SOL amount', // text input placeholder
          },
        ],
      } as LinkedAction,
    ] as LinkedAction[],
  },
};
