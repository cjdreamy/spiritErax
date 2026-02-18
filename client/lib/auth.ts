// Authentication utilities and JSON database simulation

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  createdAt: string;
}

// Cookie utilities
export class CookieManager {
  static setCookie(name: string, value: string, hours: number = 24): void {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue};${expires};path=/;SameSite=Lax`;
  }

  static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const rawValue = c.substring(nameEQ.length, c.length);
        try {
          return decodeURIComponent(rawValue);
        } catch {
          return rawValue;
        }
      }
    }
    return null;
  }

  static deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Lax`;
  }
}

const SESSION_COOKIE = 'spiritEraX_session';

type ApiSuccess<T> = { success: true } & T;
type ApiFailure = { success: false; message: string };
type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

async function parseJsonResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) {
    return { success: false, message: data?.message ?? "Request failed" };
  }
  return data as ApiResponse<T>;
}

export class AuthManager {
  static async register(
    username: string,
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: User }> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, fullName, email, password }),
    });

    const data = await parseJsonResponse<{ message: string; user: User }>(res);
    if (!data.success) return data;
    return { success: true, message: data.message, user: data.user };
  }

  static async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonResponse<{ message: string; user: User }>(res);
    if (!data.success) return data;

    // Create session cookie (expires in 24 hours)
    const session = {
      userId: data.user.id,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      username: data.user.username,
      fullName: data.user.fullName,
      email: data.user.email,
    };
    CookieManager.setCookie(SESSION_COOKIE, JSON.stringify(session), 24);

    return { success: true, message: data.message, user: data.user };
  }

  // Logout user
  static logout(): void {
    CookieManager.deleteCookie(SESSION_COOKIE);
  }

  // Get current user
  static getCurrentUser(): { userId: string; username: string; fullName: string; email: string } | null {
    const session = CookieManager.getCookie(SESSION_COOKIE);
    if (!session) return null;

    try {
      const sessionData = JSON.parse(session);
      
      // Check if session is expired
      if (Date.now() > sessionData.expiresAt) {
        this.logout();
        return null;
      }

      return {
        userId: sessionData.userId,
        username: sessionData.username,
        fullName: sessionData.fullName,
        email: sessionData.email
      };
    } catch (error) {
      this.logout();
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    const res = await fetch(`/api/auth/users/${encodeURIComponent(id)}`);
    const data = await parseJsonResponse<{ user: User }>(res);
    if (!data.success) return null;
    return data.user;
  }

  // Update user profile
  static async updateUser(
    id: string,
    updates: Partial<Pick<User, "username" | "fullName" | "email">>
  ): Promise<{ success: boolean; message: string; user?: User }> {
    const res = await fetch(`/api/auth/users/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await parseJsonResponse<{ message: string; user: User }>(res);
    if (!data.success) return data;

    // Update session cookie if username/email/fullName changed
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.userId === id) {
      const session = {
        userId: id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        username: data.user.username,
        fullName: data.user.fullName,
        email: data.user.email,
      };
      CookieManager.setCookie(SESSION_COOKIE, JSON.stringify(session), 24);
    }

    return { success: true, message: data.message, user: data.user };
  }

  // Get user initials for avatar
  static getUserInitials(fullName: string): string {
    if (!fullName || fullName.trim() === '') return 'U';
    
    const words = fullName.trim().split(/\s+/);
    
    if (words.length === 1) {
      // Single name, use first 2 letters
      return words[0].substring(0, 2).toUpperCase();
    }
    
    // Multiple names, use first letter of first two words
    return words
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
}
