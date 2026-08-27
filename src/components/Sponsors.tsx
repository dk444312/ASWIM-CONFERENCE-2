export function Sponsors() {
  return (
    <section id="sponsors" className="py-[110px] max-[650px]:py-[80px] bg-white">
      <div className="container-custom">
        <div className="text-center max-w-[680px] mx-auto mb-[60px]">
          <h2 className="text-[42px] max-[650px]:text-[34px] font-heading font-extrabold text-brand-ink leading-[1.05] tracking-tight">
            Our Sponsors
          </h2>
          <p className="text-[#3f4943] text-[16px] leading-[1.6] mt-[16px]">
            We are grateful for the support of our generous sponsors.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-[60px]">
          <img 
            src="/sponsors/government of malawi.png" 
            alt="Government of Malawi" 
            className="max-h-[140px] w-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
