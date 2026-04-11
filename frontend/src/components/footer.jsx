import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">FixitNow</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your one-stop solution for all home maintenance needs. Quality
              guaranteed.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#" className="hover:text-white">
                  Plumbing
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-white">
                  Cleaning
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-white">
                  Electrical
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/#" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} FixitNow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
