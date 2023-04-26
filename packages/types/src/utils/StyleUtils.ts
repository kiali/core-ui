import { style } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

export const getKialiStyle = (styleProps: NestedCSSProperties) => {
  return style({
    $debugName: process.env.CSS_PREFIX,
    ...styleProps
  });
};
