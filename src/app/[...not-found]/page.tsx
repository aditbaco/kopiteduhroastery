// Next Imports
import { notFound } from 'next/navigation'

/*
 * The Vuexy template rendered its NotFound view directly here, which returned
 * HTTP 200 with "Page Not Found" in the body — a soft 404. Crawlers index those
 * as real pages.
 *
 * Calling notFound() instead hands off to app/not-found.tsx AND sets a genuine
 * 404 status.
 */
const NotFoundCatchAll = () => {
  notFound()
}

export default NotFoundCatchAll
