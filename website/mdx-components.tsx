import { Link } from '~/components/Link';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Heading, type HeadingProps } from './mdx/components/Heading';
import { Pre } from './mdx/components/Pre';

const generateHeading = (props: ComponentPropsWithoutRef<'h1'>, tag: HeadingProps['tag']) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Heading {...props} tag={tag} />
);

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => generateHeading(props, 'h1'),
    h2: (props) => generateHeading(props, 'h2'),
    h3: (props) => generateHeading(props, 'h3'),
    h4: (props) => generateHeading(props, 'h4'),
    h5: (props) => generateHeading(props, 'h5'),
    h6: (props) => generateHeading(props, 'h6'),
    a: (props) => <Link {...(props as any)} external />,
    pre: Pre,
  };
}
