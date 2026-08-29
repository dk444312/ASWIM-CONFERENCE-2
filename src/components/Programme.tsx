import { useLandingContent } from '../landing/landingContentStore';

export function Programme() {
  const content = useLandingContent();
  const { eyebrow, heading, description, buttonText, statusBanner } = content.programme;

  return (
    <section id="programme" className="bg-brand-cream py-[110px] max-[650px]:py-[80px]">
      <div className="container-custom grid grid-cols-[.7fr_1.3fr] max-[1000px]:grid-cols-1 gap-[70px]">
        <div>
          <div className="text-brand-green uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px]">
            {eyebrow}
          </div>
          <h2 className="text-[clamp(42px,5vw,65px)]">
            {heading}
          </h2>
          <p className="text-brand-muted mt-[20px]">
            {description}
          </p>
          <a href="#register" className="inline-block mt-[28px] bg-brand-green text-white px-[21px] py-[14px] rounded-full font-bold text-[13px] hover:bg-brand-green-2 transition-all">
            {buttonText}
          </a>
        </div>

        <div className="border-t border-brand-line flex items-center justify-center min-h-[300px]">
          <span className="text-brand-muted font-bold text-[18px] tracking-widest uppercase">
            {statusBanner}
          </span>
        </div>
      </div>
    </section>
  );
}
