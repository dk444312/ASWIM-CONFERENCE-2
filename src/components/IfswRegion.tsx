import { useLandingContent } from '../landing/landingContentStore';

export function IfswRegion() {
  const content = useLandingContent();
  const { heading, members } = content.ifswRegion;

  return (
    <section id="ifsw-region" className="py-[110px] max-[650px]:py-[80px] bg-white border-t border-brand-line/50">
      <div className="container-custom">
        <div className="text-center max-w-[680px] mx-auto mb-[60px]">
          <h2 className="text-[42px] max-[650px]:text-[34px] font-heading font-extrabold text-brand-ink leading-[1.05] tracking-tight">
            {heading}
          </h2>
        </div>

        <div className="flex justify-center gap-[40px] max-[650px]:flex-col max-[650px]:items-center">
          {members.map((member, index) => (
            <article key={member.id || index} className="flex flex-col items-center group w-full max-w-[300px]">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-[20px] bg-[#c9d3cc] shadow-sm">
                <img 
                  src={member.image || "/ifsw/Oluwatoni Adeleke.jpg"} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <h3 className="text-[20px] font-bold text-brand-ink text-center leading-tight">{member.name}</h3>
              <p className="text-[14px] text-[#3f4943] text-center mt-[6px]">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
