export function Stats() {
  return (
    <div className="bg-brand-green text-white py-[55px]">
      <div className="container-custom grid grid-cols-4 max-[1000px]:grid-cols-2 gap-[25px]">
        <div className="px-[24px] py-[12px] border-r border-white/20 max-[1000px]:border-r-0">
          <strong className="block font-heading text-[39px] tracking-tight text-[#f1d36b]">2027</strong>
          <span className="text-white/70 text-[12px] uppercase tracking-[.1em]">Conference year</span>
        </div>
        <div className="px-[24px] py-[12px] border-r border-white/20 max-[1000px]:border-r-0">
          <strong className="block font-heading text-[39px] tracking-tight text-[#f1d36b]">5+</strong>
          <span className="text-white/70 text-[12px] uppercase tracking-[.1em]">Days of dialogue</span>
        </div>
        <div className="px-[24px] py-[12px] border-r border-white/20 max-[1000px]:border-r-0">
          <strong className="block font-heading text-[39px] tracking-tight text-[#f1d36b]">Africa</strong>
          <span className="text-white/70 text-[12px] uppercase tracking-[.1em]">Continental focus</span>
        </div>
        <div className="px-[24px] py-[12px]">
          <strong className="block font-heading text-[39px] tracking-tight text-[#f1d36b]">∞</strong>
          <span className="text-white/70 text-[12px] uppercase tracking-[.1em]">Possibilities for action</span>
        </div>
      </div>
    </div>
  );
}
