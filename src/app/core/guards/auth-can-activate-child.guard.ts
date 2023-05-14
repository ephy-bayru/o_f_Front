import { CanActivateChildFn } from '@angular/router';

export const authCanActivateChildGuard: CanActivateChildFn = (childRoute, state) => {
  return true;
};
