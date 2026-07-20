// Session cookie shape, shared by proxy.ts and the login action. Kept free of
// Node/Next imports so both sides can pull from one definition.

export const ADMIN_SESSION_COOKIE = 'teduh_admin_session'

// Seven days. There is no sliding refresh — re-login after a week.
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

const MIN_SECRET_LENGTH = 32

// Read lazily rather than at module load: importing this file must never crash
// the build, only using it without configuration should.
export const getSessionSecret = (): string => {
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `ADMIN_SESSION_SECRET is missing or shorter than ${MIN_SECRET_LENGTH} characters. ` +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    )
  }

  return secret
}
