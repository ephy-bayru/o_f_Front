import { CanDeactivateFn } from '@angular/router';

export const authCanDeactivateGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
