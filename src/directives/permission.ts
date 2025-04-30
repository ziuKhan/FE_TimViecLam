// src/directives/permission.ts

import type { DirectiveBinding } from 'vue';
import { checkPermission } from '../until/permissionCheck';
import { watch, watchEffect } from 'vue';
import { useAuthStore } from '../stores/AuthStore';

export const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const store = useAuthStore();
    
    // Tạo hàm kiểm tra và cập nhật visibility
    const updateVisibility = () => {
      const permission = binding.value;
      if (!checkPermission(permission)) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    };

    // Chạy kiểm tra ban đầu và lấy permissions nếu cần
    store.getPermission(false);  // Chỉ lấy permissions nếu chưa có
    updateVisibility();

    // Watch sự thay đổi của permission trong store
    watch(() => store.permission, () => {
      updateVisibility();
    }, { deep: true });
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const permission = binding.value;
    if (!checkPermission(permission)) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
  }
};

