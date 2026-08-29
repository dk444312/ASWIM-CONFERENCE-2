import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-line/90">
      <div className="container-custom h-[82px] flex items-center justify-between gap-[30px]">
        <a href="#" className="flex items-center">
          <img src="/IFSW LOGO.jpg" alt="IFSW Africa 2027" className="h-[55px] w-auto object-contain" />
        </a>

        <button 
          className="lg:hidden text-2xl text-brand-ink"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>

        <nav className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-stretch lg:items-center gap-5 lg:gap-[28px] absolute lg:static top-[82px] left-0 right-0 bg-white lg:bg-transparent p-6 lg:p-0 border-b lg:border-none border-brand-line shadow-lg lg:shadow-none`}>
          
          {/* About dropdown container */}
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full lg:w-auto text-[13px] font-semibold text-[#3f4943] hover:text-brand-green py-2 transition-colors gap-1"
            >
              <span>About</span>
              <ChevronDown size={14} className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            <div className={`${isDropdownOpen ? 'block' : 'hidden'} lg:absolute left-0 mt-1 w-full lg:w-[200px] bg-white border border-brand-line lg:shadow-lg rounded-xl overflow-hidden z-50 py-1.5 animate-in fade-in duration-150`}>
              <a 
                href="/#about" 
                className="block px-4 py-2 text-[13px] font-semibold text-[#3f4943] hover:bg-brand-green/5 hover:text-brand-green transition-colors"
                onClick={handleLinkClick}
              >
                About the Conference
              </a>
              <Link 
                to="/subthemes" 
                className="block px-4 py-2 text-[13px] font-semibold text-[#3f4943] hover:bg-brand-green/5 hover:text-brand-green transition-colors"
                onClick={handleLinkClick}
              >
                Sub-themes
              </Link>
              <a 
                href="/#programme" 
                className="block px-4 py-2 text-[13px] font-semibold text-[#3f4943] hover:bg-brand-green/5 hover:text-brand-green transition-colors"
                onClick={handleLinkClick}
              >
                Programme
              </a>
            </div>
          </div>

          <a href="/#sponsors" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={handleLinkClick}>Sponsors</a>
          <a href="/#organizers" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={handleLinkClick}>Organizers</a>
          <a href="/#ifsw-region" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={handleLinkClick}>IFSW Region</a>
          
          <Link to="/abstract-submission" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={handleLinkClick}>
            Abstracts Submission
          </Link>

          <Link to="/register" onClick={handleLinkClick} className="bg-brand-green text-white text-[13px] font-semibold px-[19px] py-[12px] rounded-full text-center hover:bg-brand-green-2 transition-colors">Register →</Link>
        </nav>
      </div>
    </header>
  );
}
