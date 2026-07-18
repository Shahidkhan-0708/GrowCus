'use client';
import { useEffect } from 'react';
export function ReticleDev() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    void import('@reticlehq/react').then(({ reticle, install, registerCapabilities }) => {
      install();
      const token = process.env.NEXT_PUBLIC_RETICLE_TOKEN;
      reticle.connect(token ? { token } : {});
      registerCapabilities({
        testids: [
          'email-input',
          'password-input',
          'role-select',
          'login-btn',
          'assign-task-btn',
          'enroll-student-btn',
          'aria-chat-input',
          'aria-send-btn',
          'sidebar-nav',
          'dashboard-welcome',
        ],
        signals: [],
        stores: [],
      });
    });
  }, []);
  return null;
}
