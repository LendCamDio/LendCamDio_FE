const Footer = () => {
  const services = [
    { title: "Wedding Photography", to: "#" },
    { title: "Portrait Sessions", to: "#" },
    { title: "Event Coverage", to: "#" },
    { title: "Commercial Shoots", to: "#" },
  ];

  const quickLinks = [
    { title: "About Us", to: "#" },
    { title: "Portfolio", to: "#" },
    { title: "Blog", to: "#" },
    { title: "Contact", to: "#" },
  ];

  return (
    <footer className="bg-[color:var(--color-surface)] border-t border-[color:var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-[color:var(--color-text-primary)]">
              LendCamDio
            </h3>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Capturing moments with precision and creativity. Your vision, our
              lens.
            </p>
            <div className="flex space-x-4 text-[color:var(--color-text-muted)]">
              <a href="#" className="hover:text-[color:var(--color-accent)]">
                Facebook
              </a>
              <a href="#" className="hover:text-[color:var(--color-accent)]">
                Instagram
              </a>
              <a href="#" className="hover:text-[color:var(--color-accent)]">
                Twitter
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-[color:var(--color-text-primary)] mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service.title}>
                  <a
                    href={service.to}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent)] transition-colors"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-[color:var(--color-text-primary)] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.to}
                    className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent)] transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-[color:var(--color-text-primary)] mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-[color:var(--color-text-secondary)]">
                <span className="studio-indicator warm"></span>
                123 Studio Lane, Creative City
              </li>
              <li>
                <a
                  href="mailto:info@studio.com"
                  className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent)] transition-colors"
                >
                  info@studio.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent)] transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <button className="btn-primary mt-4">Book a Session</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[color:var(--color-border)] pt-6 text-center">
          <p className="text-[color:var(--color-text-muted)] text-sm">
            &copy; {new Date().getFullYear()} LendCamDio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
