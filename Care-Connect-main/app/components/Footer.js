
export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-300 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-300 rounded-full blur-lg"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Platform Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl">🤝</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                CareConnect
              </h2>
            </div>
            <p className="text-purple-100 leading-relaxed mb-6 max-w-md">
              A platform bridging the gap between orphanages, old-age homes, and kind-hearted donors. 
              Together, we build a better future filled with hope and compassion.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-purple-200">
                <span className="mr-2">🌟</span>
                <span>Making a difference</span>
              </div>
              <div className="flex items-center text-sm text-purple-200">
                <span className="mr-2">❤️</span>
                <span>Building connections</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🔗</span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", icon: "ℹ️" },
                { name: "Contact", icon: "📧" },
                { name: "Privacy Policy", icon: "🔒" },
                { name: "Terms of Service", icon: "📋" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="flex items-center text-sm text-purple-100 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                  >
                    <span className="mr-2 group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">👥</span>
              Developed By
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors duration-300">
                <span className="mr-3 text-xl">👨‍💻</span>
                <div>
                  <p className="font-medium">Hemang Dubey</p>
                  {/* <p className="text-xs text-purple-200">Lead Developer</p> */}
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Stats or Impact Section */}
        <div className="mt-12 pt-8 border-t border-purple-400/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-pink-300">1000+</div>
              <div className="text-sm text-purple-200">Lives Touched</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-pink-300">50+</div>
              <div className="text-sm text-purple-200">Partner Organizations</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-pink-300">24/7</div>
              <div className="text-sm text-purple-200">Support Available</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-purple-400/30 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-purple-200">
              © {new Date().getFullYear()} CareConnect. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-purple-200">
              <span className="flex items-center">
                <span className="mr-1">🌍</span>
                Making the world better, one connection at a time
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}