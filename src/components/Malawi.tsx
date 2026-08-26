import { MapPin, Calendar, Globe } from 'lucide-react';

export function Malawi() {
  return (
    <section id="malawi" className="text-white py-[110px] max-[650px]:py-[80px] bg-[linear-gradient(90deg,rgba(5,47,31,.96),rgba(5,47,31,.58)),url('/lake.png')] bg-center bg-cover">
      <div className="container-custom grid grid-cols-2 max-[1000px]:grid-cols-1 gap-[70px] items-center">
        <div>
          <div className="uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px] text-[#f1d36b]">Welcome to Malawi</div>
          <h2 className="text-[clamp(42px,5vw,70px)]">A warm heart for a continental conversation.</h2>
          <p className="text-white/70 max-w-[580px] mt-[22px] text-[17px]">
            Malawi provides a powerful setting for dialogue and unified action.
            Its communities, landscapes and spirit of uMunthu offer a natural
            backdrop for a conference centred on solidarity, dignity and
            collective responsibility.
          </p>

          <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[32px] mt-[32px] bg-brand-gold text-brand-ink p-[24px] sm:px-[32px] rounded-[16px] shadow-xl max-w-fit">
            <div className="flex items-start gap-[12px]">
              <MapPin className="text-brand-ink/80 mt-[2px] flex-none" size={20} />
              <div>
                <strong className="block text-[17px] font-extrabold leading-tight">Lilongwe</strong>
                <span className="text-brand-ink/70 text-[11px] font-bold uppercase tracking-widest block mt-[4px]">Host city</span>
              </div>
            </div>
            
            <div className="w-full sm:w-[2px] h-[2px] sm:h-auto bg-brand-ink/10"></div>
            
            <div className="flex items-start gap-[12px]">
              <Calendar className="text-brand-ink/80 mt-[2px] flex-none" size={20} />
              <div>
                <strong className="block text-[17px] font-extrabold leading-tight">26–31 Oct</strong>
                <span className="text-brand-ink/70 text-[11px] font-bold uppercase tracking-widest block mt-[4px]">2027 conference dates</span>
              </div>
            </div>
            
            <div className="w-full sm:w-[2px] h-[2px] sm:h-auto bg-brand-ink/10"></div>
            
            <div className="flex items-start gap-[12px]">
              <Globe className="text-brand-ink/80 mt-[2px] flex-none" size={20} />
              <div>
                <strong className="block text-[17px] font-extrabold leading-tight">Malawi</strong>
                <span className="text-brand-ink/70 text-[11px] font-bold uppercase tracking-widest block mt-[4px]">Host country</span>
              </div>
            </div>
          </div>
        </div>

        <img className="h-[470px] max-[650px]:h-[340px] w-full object-cover rounded-[24px] border border-white/15"
             src="/lake.png"
             alt="Lake Malawi" />
      </div>
    </section>
  );
}
