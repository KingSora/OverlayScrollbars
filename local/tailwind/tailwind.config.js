const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'primary-cyan1': '#33FFFF',
        'primary-cyan2': '#87FED1',
        'primary-green': '#C0FEB1',
        'primary-blue1': '#338EFF',
        'primary-blue2': '#4276FF',
        'primary-violet': '#5D55FF',
        'primary-dark': '#0A376B',
        'primary-gray1': '#475774',
        'primary-gray2': '#697996',
      },
      transitionProperty: {
        transformColor: 'transform, color',
      },
      fontFamily: {
        sans: ['Noto Sans', ...defaultTheme.fontFamily.sans],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            b: {
              fontWeight: theme('fontWeight.medium'),
            },
            strong: {
              fontWeight: theme('fontWeight.medium'),
            },
            h1: {
              borderColor: theme('colors.slate[300]'),
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              paddingBottom: theme('padding[2]'),
            },
            h2: {
              borderColor: theme('colors.slate[300]'),
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              paddingBottom: theme('padding[2]'),
            },
            h3: {},
            h4: {},
            h5: {
              color: theme('colors.primary-dark'),
              fontWeight: theme('fontWeight.medium'),
              fontSize: theme('fontSize.sm'),
            },
            h6: {
              color: theme('colors.primary-dark'),
              fontWeight: theme('fontWeight.medium'),
              fontSize: theme('fontSize.sm'),
            },
            'blockquote > p > strong:first-child': {
              color: theme('colors.primary-blue2'),
            },
            'blockquote p:first-of-type::before': {
              content: '',
            },
            'blockquote p:last-of-type::after': {
              content: '',
            },
            code: {
              background: 'var(--tw-prose-pre-bg)',
              fontWeight: theme('fontWeight.medium'),
              padding: theme('padding[1]'),
              borderRadius: theme('borderRadius.md'),
              overflowWrap: 'break-word',
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            'summary > *:only-child,': {
              display: 'inline',
              margin: 0,
            },
            summary: {
              display: 'list-item',
              cursor: 'pointer',
            },
          },
        },
        primary: {
          css: {
            '--tw-prose-body': theme('colors.primary-gray1'),
            '--tw-prose-headings': theme('colors.primary-dark'),
            '--tw-prose-lead': theme('colors.primary-gray1'),
            '--tw-prose-links': theme('colors.primary-blue2'),
            '--tw-prose-bold': theme('colors.primary-dark'),
            '--tw-prose-counters': theme('colors.primary-gray1'),
            '--tw-prose-bullets': theme('colors.primary-blue2'),
            '--tw-prose-hr': theme('colors.slate[200]'),
            '--tw-prose-quotes': theme('colors.primary-dark'),
            '--tw-prose-quote-borders': theme('colors.slate[200]'),
            '--tw-prose-captions': theme('colors.primary-gray1'),
            '--tw-prose-code': theme('colors.primary-dark'),
            '--tw-prose-pre-code': theme('colors.pink[100]'),
            '--tw-prose-pre-bg': theme('colors.slate[100]'),
            '--tw-prose-th-borders': theme('colors.slate[200]'),
            '--tw-prose-td-borders': theme('colors.slate[200]'),
          },
        },
      }),
    },
    container: {
      center: true,
    },
    fontWeight: {
      normal: 400,
      medium: 600,
      bold: 800,
    },
    screens: {
      xxs: '374px',
      xs: '640px',
      sm: '768px',
      md: '960px',
      lg: '1280px',
      xl: '1440px',
      xxl: '1536px',
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/typography'),
  ],
};
