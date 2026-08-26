import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-line/90">
      <div className="container-custom h-[82px] flex items-center justify-between gap-[30px]">
        <a href="#" className="flex items-center gap-[11px] font-heading font-extrabold leading-[1.05] tracking-tight">
          <span className="w-[43px] h-[43px] rounded-[13px] bg-brand-green relative overflow-hidden flex-none">
            <span className="absolute w-[31px] h-[35px] -right-[5px] -bottom-[8px] bg-brand-gold rounded-[48%_52%_48%_52%] rotate-[28deg]"></span>
            <span className="absolute w-[9px] h-[9px] bg-white rounded-full top-[9px] left-[17px]"></span>
          </span>
          <span>IFSW Africa<br/>2027</span>
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
          <a href="#speakers" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>Speakers</a>
          <a href="#malawi" className="text-[13px] font-semibold text-[#3f4943] hover:text-brand-green" onClick={() => setIsOpen(false)}>Malawi</a>
          <a href="#register" className="bg-brand-green text-white text-[13px] font-semibold px-[19px] py-[12px] rounded-full text-center hover:bg-brand-green-2 transition-colors" onClick={() => setIsOpen(false)}>Register →</a>
        </nav>
      </div>
    </header>
  );
}
