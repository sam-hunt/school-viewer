import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router';
import type { LinkProps as RouterLinkProps } from 'react-router';

export const LinkBehavior = forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }>((props, ref) => {
  const { href, ...other } = props;
  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});
