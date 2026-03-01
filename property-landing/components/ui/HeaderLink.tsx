/**
 * HeaderLink
 *
 * Reusable navigation link for Header.
 * Centralises scroll-based color logic and hover styling
 * to avoid duplication across desktop and mobile menus.
 */

interface HeaderLinkProps {
  href: string
  children: React.ReactNode
  scrolled: boolean
  onClick?: () => void
  className?: string
}

export default function HeaderLink({
  href,
  children,
  scrolled,
  onClick,
  className = "",
}: HeaderLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        transition duration-300
        ${
          scrolled
            ? "text-brand-primary hover:text-brand-accent"
            : "text-white/80 hover:text-white"
        }
        ${className}
      `}
    >
      {children}
    </a>
  )
}