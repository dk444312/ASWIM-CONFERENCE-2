import { Calendar, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-[40px] max-[650px]:pt-[30px] min-h-[820px] max-[650px]:min-h-[900px] text-white relative overflow-hidden flex flex-col justify-center bg-[linear-gradient(90deg,rgba(4,38,25,.94)_0%,rgba(4,38,25,.78)_43%,rgba(4,38,25,.25)_100%),url('/Hero.png')] bg-center bg-cover">
      <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-t from-[#042619b3] to-transparent z-10"></div>
      
      <div className="container-custom min-h-[700px] max-[650px]:min-h-[790px] flex items-center max-[650px]:items-start relative z-20">
        <div className="max-w-[800px] py-[75px] pb-[110px] max-[650px]:pt-[70px]">
          <div className="inline-flex items-center gap-[10px] uppercase tracking-[.17em] text-[12px] font-bold text-[#f1d36b] mb-6 before:content-[''] before:w-[34px] before:h-[2px] before:bg-brand-gold">
            IFSW Africa Region Conference · 2027
          </div>

          <h1 className="text-[clamp(54px,7.2vw,104px)] max-[650px]:text-[52px] max-w-[900px]">
            Advancing<br/><span className="text-[#e5bb42]">social justice</span><br/>for Africa.
          </h1>

          <p className="mt-[28px] max-w-[690px] text-[19px] max-[650px]:text-[16px] leading-[1.75] text-white/80">
            A continental gathering of social workers, scholars, policymakers,
            communities and partners committed to building a more just,
            inclusive and sustainable Africa.
          </p>

          <div className="flex flex-wrap gap-[20px] mt-[40px] bg-brand-gold text-brand-ink px-[28px] py-[20px] rounded-[16px] max-w-fit items-center shadow-lg">
            <div className="flex items-center gap-[10px] font-extrabold text-[15px]">
              <Calendar size={22} className="text-brand-ink/80" />
              <span>26–31 October 2027</span>
            </div>
            <div className="w-[2px] h-[24px] bg-brand-ink/15 hidden sm:block"></div>
            <div className="flex items-center gap-[10px] font-extrabold text-[15px]">
              <MapPin size={22} className="text-brand-ink/80" />
              <span>Lilongwe, Malawi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
