import { apiRequest } from './api'

export interface UserProfile {
  id: number
  username: string
  email: string
  bio: string | null
  created_at: string
}

interface AuthToken {
  access_token: string
  token_type: string
}

export interface RegistrationInput {
  username: string
  email: string
  password: string
}

export interface LoginInput {
  email?: string
  username?: string
  password: string
}

export interface UserUpdateInput {
  username?: string
  email?: string
  bio?: string | null
  password?: string
}

export async function register(input: RegistrationInput): Promise<UserProfile> {
  return apiRequest<UserProfile>('/auth/register', { method: 'POST', body: JSON.stringify(input) })
}

export async function login(input: LoginInput): Promise<UserProfile> {
  const token = await apiRequest<AuthToken>('/auth/login', { method: 'POST', body: JSON.stringify(input) })
  localStorage.setItem('access_token', token.access_token)
  return getCurrentUser()
}

export function getCurrentUser(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me')
}

export function updateCurrentUser(input: UserUpdateInput): Promise<UserProfile> {
  return apiRequest<UserProfile>('/users/me', { method: 'PATCH', body: JSON.stringify(input) })
}

export function logout(): void {
  localStorage.removeItem('access_token')
}
