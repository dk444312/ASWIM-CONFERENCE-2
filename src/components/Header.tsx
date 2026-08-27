import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
          <a href="#about" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>About</a>
          <a href="#programme" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>Programme</a>
          <a href="#sponsors" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>Sponsors</a>
          <a href="#organizers" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>Organizers</a>
          <a href="#malawi" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>Malawi</a>
          <a href="#ifsw-region" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>IFSW Region</a>
          <a href="#subcommittee" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>Subcommittee</a>
          <a href="#register" className="bg-brand-green text-white text-[13px] font-semibold px-[19px] py-[12px] rounded-full text-center hover:bg-brand-green-2 transition-colors" onClick={() => setIsOpen(false)}>Register →</a>
        </nav>
      </div>
    </header>
  );
}
