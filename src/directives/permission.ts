// src/directives/permission.ts

import type { DirectiveBinding } from 'vue';
import { checkPermission } from '../until/permissionCheck';

export const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const permission = binding.value;
    if (!checkPermission(permission)) {
      el.style.display = 'none';
    }
  }
};

