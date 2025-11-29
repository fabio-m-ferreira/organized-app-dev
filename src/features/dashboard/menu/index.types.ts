import React, { ReactElement } from 'react';

export type DashboardMenuProps = {
  icon: ReactElement;
  primaryText: string;
  secondaryText?: string;
  badgeText?: string | ReactElement;
  hoverColor?: string;
  accentHoverColor?: string;
  activeColor?: string;
  onClick?: VoidFunction;
  path?: string;
  actionComponent?: ReactElement;
  height?: string;
  small?: boolean;
  isDisabled?: boolean;
};
