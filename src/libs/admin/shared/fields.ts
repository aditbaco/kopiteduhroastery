// Third-party Imports
import { z } from 'zod'

// Field primitives shared by the admin form schemas, so "wajib diisi" and the
// slug rule are phrased once rather than drifting per form.

export const optionalText = z
  .string()
  .trim()
  .transform(value => (value === '' ? null : value))
  .nullable()

export const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} wajib diisi`).max(max, `${label} maksimal ${max} karakter`)

export const slugText = () =>
  requiredText('Slug', 191).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung')
