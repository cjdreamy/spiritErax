// Authentication utilities and JSON database simulation

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  password: string; // In production, this should be hashed
  createdAt: string;
}

// Cookie utilities
export class CookieManager {
  static setCookie(name: string, value: string, hours: number = 24): void {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  static deleteCookie(name: string): void {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
  }
}

// Simulated JSON database (in production, this would be on the server)
const DB_KEY = 'spiritEraX_users_db';
const SESSION_COOKIE = 'spiritEraX_session';

export class AuthManager {
  // Get all users from localStorage
  private static getUsers(): User[] {
    const users = localStorage.getItem(DB_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Save users to localStorage
  private static saveUsers(users: User[]): void {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  }

  // Register new user
  static register(username: string, fullName: string, email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    if (users.some(user => user.username === username)) {
      return { success: false, message: 'Username already taken' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      fullName,
      email,
      password, // In production, hash this password
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return { success: true, message: 'Account created successfully' };
  }

  // Login user
  static login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Create session cookie (expires in 24 hours)
    const session = {
      userId: user.id,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      username: user.username,
      fullName: user.fullName,
      email: user.email
    };
    
    CookieManager.setCookie(SESSION_COOKIE, JSON.stringify(session), 24);
    
    return { success: true, message: 'Login successful', user };
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
  static getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  // Update user profile
  static updateUser(id: string, updates: Partial<Pick<User, 'username' | 'fullName' | 'email'>>): { success: boolean; message: string } {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    // Check if email is being updated and already exists
    if (updates.email && updates.email !== users[userIndex].email) {
      if (users.some(u => u.email === updates.email)) {
        return { success: false, message: 'Email already registered' };
      }
    }

    // Check if username is being updated and already exists
    if (updates.username && updates.username !== users[userIndex].username) {
      if (users.some(u => u.username === updates.username)) {
        return { success: false, message: 'Username already taken' };
      }
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);

    // Update session cookie if username/email/fullName changed
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.userId === id) {
      const session = {
        userId: id,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
        username: updates.username || currentUser.username,
        fullName: updates.fullName || currentUser.fullName,
        email: updates.email || currentUser.email
      };
      CookieManager.setCookie(SESSION_COOKIE, JSON.stringify(session), 24);
    }

    return { success: true, message: 'Profile updated successfully' };
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
