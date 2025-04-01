import Link from "next/link";

const headerLinks = [
  { href: "/admin/tickets/create", label: "Sell Tickets", onAuth: true },
  { href: "/tickets", label: "My Tickets", onAuth: true },
  { href: "/orders", label: "My Orders", onAuth: true },
  { href: "/auth/signout", label: "Sign Out", onAuth: true },
  { href: "/auth/signin", label: "Sign In", onAuth: false },
  { href: "/auth/signup", label: "Sign Up", onAuth: false },
];

export default ({ currentUser }) => {
  const links = headerLinks.filter((link) => link.onAuth === !!currentUser);
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="nav-link">
          GitTix
        </Link>

        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">
            {links.map((link, i) => (
              <li key={i} className="nav-item">
                <Link href={link.href} className="nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
