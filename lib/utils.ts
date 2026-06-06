import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getUserRole(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    return parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || parsed.role;
  } catch (e) {
    return null;
  }
}