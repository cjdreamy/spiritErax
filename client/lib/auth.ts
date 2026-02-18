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

type ApiResult<T> =
  | { success: true; message: string; user?: T }
  | { success: false; message: string; user?: undefined };

export class AuthManager {
  // Register new user
  static async register(
    username: string,
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, email, password }),
      });

      const data = (await res.json()) as ApiResult<User>;
      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
  }

  // Login user
  static async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as ApiResult<User>;

      if (!data.success || !data.user) {
        return { success: false, message: data.message };
      }

      const user = data.user;

      // Create session cookie (expires in 24 hours)
      const session = {
        userId: user.id,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
      };
      CookieManager.setCookie(SESSION_COOKIE, JSON.stringify(session), 24);

      return { success: true, message: data.message, user };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
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
    try {
      const res = await fetch(`/api/auth/users/${encodeURIComponent(id)}`);
      const data = (await res.json()) as { success: boolean; user?: User };
      return data.success && data.user ? data.user : null;
    } catch {
      return null;
    }
  }

  // Update user profile
  static async updateUser(
    id: string,
    updates: Partial<Pick<User, "username" | "fullName" | "email">>
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await fetch(`/api/auth/users/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = (await res.json()) as ApiResult<User>;

      if (!data.success || !data.user) {
        return { success: false, message: data.message };
      }

      const user = data.user;

      // Update session cookie if username/email/fullName changed
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.userId === id) {
        const session = {
          userId: id,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
        };
        CookieManager.setCookie(SESSION_COOKIE, JSON.stringify(session), 24);
      }

      return { success: true, message: data.message, user };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
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
