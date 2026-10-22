export function Footer() {
  return (
    <nav className="celestia-docs-footer" aria-label="About and policies">
      <a href={`${import.meta.env.BASE_URL}about/`}>About Celestia</a>
      <a href={`${import.meta.env.BASE_URL}contact/`}>Contact</a>
      <a href={`${import.meta.env.BASE_URL}privacy/`}>Privacy policy</a>
      <a href="https://celestia.org/tos/">Terms of service</a>
      <a href="https://github.com/celestiaorg/.github/blob/main/SECURITY.md">Security policy</a>
      <a href={`${import.meta.env.BASE_URL}openapi.json`}>OpenAPI specification</a>
      <a href={`${import.meta.env.BASE_URL}build/developers/`}>Developer portal</a>
    </nav>
  )
}
