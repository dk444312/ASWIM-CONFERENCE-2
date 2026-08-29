import { useLandingContent } from '../landing/landingContentStore';

export function Footer() {
  const content = useLandingContent();
  const { brandTitle, brandTagline, copyrightText, locationTagline, contactEmail } = content.footer;

  return (
    <footer className="bg-[#062217] text-white pt-[65px] pb-[25px]">
      <div className="container-custom">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] max-[1000px]:grid-cols-2 max-[650px]:grid-cols-2 max-[650px]:gap-[30px] gap-[50px] pb-[55px]">
          <div>
            <div className="font-heading font-extrabold text-[22px] whitespace-pre-line">
              {brandTitle}
            </div>
            <p className="text-white/50 text-[13px] max-w-[310px] mt-[15px]">
              {brandTagline}
            </p>
          </div>
          <div>
            <h4 className="text-[#e4bd4d] uppercase tracking-[.13em] text-[10px] mb-[17px]">Conference</h4>
            <ul className="space-y-[18px]">
              <li className="text-white/60 text-[13px]"><a href="/#about" className="hover:text-white transition-colors">About</a></li>
              <li className="text-white/60 text-[13px]"><a href="/subthemes" className="hover:text-white transition-colors font-bold text-brand-gold">Sub-themes</a></li>
              <li className="text-white/60 text-[13px]"><a href="/#programme" className="hover:text-white transition-colors">Programme</a></li>
              <li className="text-white/60 text-[13px]"><a href="/#ifsw-region" className="hover:text-white transition-colors">IFSW Region</a></li>
              <li className="text-white/60 text-[13px]"><a href="/#subcommittee" className="hover:text-white transition-colors">Subcommittee</a></li>
              <li className="text-white/60 text-[13px]"><a href="/#sponsors" className="hover:text-white transition-colors">Sponsors</a></li>
              <li className="text-white/60 text-[13px]"><a href="/#organizers" className="hover:text-white transition-colors">Organizers</a></li>
              <li className="text-brand-gold text-[13px] font-bold"><a href="/abstract-submission" className="hover:underline">Abstract Submission</a></li>
              <li className="text-emerald-400 text-[13px] font-bold"><a href="/register" className="hover:underline">Delegate Registration</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#e4bd4d] uppercase tracking-[.13em] text-[10px] mb-[17px]">Information</h4>
            <ul className="space-y-[18px]">
              <li className="text-white/60 text-[13px]"><a href="#malawi" className="hover:text-white transition-colors">Welcome to Malawi</a></li>
              <li className="text-white/60 text-[13px]"><a href="#" className="hover:text-white transition-colors">Venue</a></li>
              <li className="text-white/60 text-[13px]"><a href="#" className="hover:text-white transition-colors">Travel</a></li>
              <li className="text-emerald-400 text-[13px] font-semibold"><a href="/admin/login" className="hover:underline">Admin Console Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#e4bd4d] uppercase tracking-[.13em] text-[10px] mb-[17px]">Connect</h4>
            <ul className="space-y-[18px]">
              <li className="text-white/60 text-[13px]"><a href="#" className="hover:text-white transition-colors">IFSW Africa Region</a></li>
              <li className="text-white/60 text-[13px]"><a href="#" className="hover:text-white transition-colors">ASWiM</a></li>
              <li className="text-white/60 text-[13px]"><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              <li className="text-white/60 text-[13px]"><a href={`mailto:${contactEmail || 'info@example.org'}`} className="hover:text-white transition-colors">{contactEmail || 'Contact Us'}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-[20px] text-white/40 text-[11px] flex justify-between gap-[20px] max-[650px]:flex-col max-[650px]:gap-2">
          <span>{copyrightText}</span>
          <span>{locationTagline}</span>
        </div>
      </div>
    </footer>
  );
}
