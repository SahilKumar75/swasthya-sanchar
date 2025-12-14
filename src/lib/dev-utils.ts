/**
 * Development utility to bypass authentication checks
 * Only works when NEXT_PUBLIC_DEV_BYPASS_AUTH=true in .env.local
 * This file helps developers access protected pages without signing up
 */

export function isDevBypassEnabled(): boolean {
    return process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true';
}

export function shouldBypassAuth(status: string): boolean {
    if (isDevBypassEnabled()) {
        console.log('[DEV BYPASS] 🔓 Authentication bypass enabled for development');
        return true;
    }
    return false;
}
