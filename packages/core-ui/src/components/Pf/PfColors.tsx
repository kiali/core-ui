// There are two ways in which we use the PF color palette. Either way we want to use the standard
// PF colors, and moreover, use the defined color variables such that any changes made by PF are
// picked up when the PF version is updated.  The preferred, standard way, is in CSS styling.  In
// those cases we can directly let CSS resolve the PF var. So, whenever possible use the PFColors
// enum below.  In certain cases (like in cytoscape), we need the explicit hex value.  In that case
// we must actually get the computed value.  We do this as soon as we get an initial document (in
// StartupInitializer.tsx). In those cases use PFColorVals.  Note that those values are not
// available until they can be computed, so don't use them in constants or before they are
// available.
import { PFColorValues } from '@kiali/types';

export let PFColorVals: PFColorValues;

export const setPFColorVals = (element: Element) => {
  PFColorVals = {
    // color values used by kiali
    Black100: getComputedStyle(element).getPropertyValue('--pf-global--palette--black-100'),
    Black150: getComputedStyle(element).getPropertyValue('--pf-global--palette--black-150'),
    Black200: getComputedStyle(element).getPropertyValue('--pf-global--palette--black-200'),
    Black300: getComputedStyle(element).getPropertyValue('--pf-global--palette--black-300'),
    Black500: getComputedStyle(element).getPropertyValue('--pf-global--palette--black-500'),
    Black600: getComputedStyle(element).getPropertyValue('--pf-global--palette--black-600'),
    Black700: getComputedStyle(element).getPropertyValue('--pf-global--palette--black-700'),
    Black1000: getComputedStyle(element).getPropertyValue('--pf-global--palette--black-1000'),
    Blue50: getComputedStyle(element).getPropertyValue('--pf-global--palette--blue-50'),
    Blue300: getComputedStyle(element).getPropertyValue('--pf-global--palette--blue-300'),
    Blue600: getComputedStyle(element).getPropertyValue('--pf-global--palette--blue-600'),
    Gold400: getComputedStyle(element).getPropertyValue('--pf-global--palette--gold-400'),
    Green400: getComputedStyle(element).getPropertyValue('--pf-global--palette--green-400'),
    Purple200: getComputedStyle(element).getPropertyValue('--pf-global--palette--purple-200'),
    White: getComputedStyle(element).getPropertyValue('--pf-global--palette--white'),

    // status color values used by kiali
    Danger: getComputedStyle(element).getPropertyValue('--pf-global--danger-color--100'),
    Success: '#3E8635', // TODO: PF var is wrong, use var when fixed 'var(--pf-global--success-color--100)',
    Warning: getComputedStyle(element).getPropertyValue('--pf-global--warning-color--100')
  };
};
