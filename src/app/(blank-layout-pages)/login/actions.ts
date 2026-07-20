'use server'

// Next Imports
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Auth Imports
import { ADMIN_SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/libs/admin/auth/config'
import { verifyAdminPassword } from '@/libs/admin/auth/password'
import { createSessionValue } from '@/libs/admin/auth/session'

export type LoginState = { error?: string }

export const loginAction = async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
  const password = formData.get('password')

  if (typeof password !== 'string' || password === '') {
    return { error: 'Kata sandi wajib diisi' }
  }

  if (!verifyAdminPassword(password)) {
    return { error: 'Kata sandi salah' }
  }

  const store = await cookies()

  store.set(ADMIN_SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  })

  // Outside any try/catch — redirect signals by throwing, and swallowing that
  // would silently strand the user on the login page.
  redirect('/admin/products')
}

export const logoutAction = async (): Promise<void> => {
  const store = await cookies()

  store.delete(ADMIN_SESSION_COOKIE)

  redirect('/login')
}
