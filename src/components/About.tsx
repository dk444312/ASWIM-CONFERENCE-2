export function About() {
  return (
    <section id="about" className="py-[110px] max-[650px]:py-[80px]">
      <div className="container-custom grid grid-cols-[.9fr_1.1fr] max-[1000px]:grid-cols-1 gap-[80px] items-center">
        <div>
          <div className="text-brand-green uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px]">A continental platform</div>
          <h2 className="text-[clamp(42px,5vw,70px)]">Where Africa's social work community meets.</h2>
          <p className="text-brand-muted text-[17px] mt-[24px] max-w-[600px]">
            The IFSW Africa Region Conference 2027 brings together professionals
            and stakeholders from across Africa and beyond for dialogue,
            knowledge exchange, collaboration and collective action around
            social justice.
          </p>
          <div className="border-l-[4px] border-brand-gold mt-[27px] pl-[18px] text-brand-green font-heading text-[20px] font-bold">
            “Advancing social justice for Africa” is a call to move from
            conversation to meaningful action.
          </div>
        </div>

        <div className="relative pr-[40px] max-[650px]:pr-0">
          <img className="h-[490px] w-full object-cover rounded-[24px]"
               src="/Where Africa's social work community meets. section.png"
               alt="Where Africa's social work community meets" />
        </div>
      </div>
    </section>
  );
}
