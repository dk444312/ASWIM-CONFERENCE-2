import { useLandingContent } from '../landing/landingContentStore';

export function Organizers() {
  const content = useLandingContent();
  const { heading, description } = content.organizers;

  return (
    <section id="organizers" className="py-[110px] max-[650px]:py-[80px] bg-brand-sand/30 border-t border-brand-line">
      <div className="container-custom">
        <div className="text-center max-w-[720px] mx-auto mb-[50px]">
          <h2 className="text-[32px] max-[650px]:text-[28px] font-heading font-extrabold text-brand-ink leading-[1.05] tracking-tight">
            {heading}
          </h2>
          {description && (
            <p className="text-brand-muted text-sm sm:text-base mt-3 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-[60px] max-[650px]:gap-[30px]">
          <div className="flex flex-col items-center gap-3">
            <img 
              src="/organizing bodies/IFSW LOGO.jpg" 
              alt="IFSW Africa Region Logo" 
              className="max-h-[110px] max-[650px]:max-h-[80px] w-auto object-contain"
            />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider text-center">IFSW Africa Region</span>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <img 
              src="/organizing bodies/asswa.jpg" 
              alt="ASSWA Logo" 
              className="max-h-[110px] max-[650px]:max-h-[80px] w-auto object-contain rounded-md"
            />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider text-center">ASSWA</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <img 
              src="/organizing bodies/ASWIM.png" 
              alt="ASWiM Logo" 
              className="max-h-[110px] max-[650px]:max-h-[80px] w-auto object-contain"
            />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider text-center">ASWiM (Host)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
