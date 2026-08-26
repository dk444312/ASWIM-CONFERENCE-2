export function Cta() {
  return (
    <section id="register" className="bg-brand-green text-white text-center relative overflow-hidden py-[110px] max-[650px]:py-[80px]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[25vw] font-extrabold text-white/5 whitespace-nowrap pointer-events-none select-none">
        AFRICA
      </div>
      
      <div className="container-custom relative z-10">
        <div className="uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px] text-[#f1d36b]">Join the 2027 conference</div>
        <h2 className="text-[clamp(42px,5vw,70px)] max-w-[800px] mx-auto">Be part of advancing social justice for Africa.</h2>
        <p className="max-w-[620px] mx-auto mt-[22px] mb-[30px] text-white/70 text-[17px]">
          Bring your practice, research, ideas and lived experience to a
          continental platform for meaningful dialogue and action.
        </p>
        <a href="#" className="inline-flex border border-transparent bg-brand-gold text-[#15150f] px-[21px] py-[14px] rounded-full font-bold text-[13px] items-center gap-[9px] transition-all hover:-translate-y-0.5 hover:bg-[#e7bb45]">
          Register Now →
        </a>
      </div>
    </section>
  );
}
