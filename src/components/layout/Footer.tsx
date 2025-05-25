
import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border py-3 px-6 text-sm text-muted-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>
          <span>© 2025 INFINICORE WEB WORKS - ALL RIGHTS RESERVED</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
