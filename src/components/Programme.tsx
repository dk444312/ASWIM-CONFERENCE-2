export function Programme() {
  return (
    <section id="programme" className="bg-brand-cream py-[110px] max-[650px]:py-[80px]">
      <div className="container-custom grid grid-cols-[.7fr_1.3fr] max-[1000px]:grid-cols-1 gap-[70px]">
        <div>
          <div className="text-brand-green uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px]">Conference programme</div>
          <h2 className="text-[clamp(42px,5vw,65px)]">From dialogue to action.</h2>
          <p className="text-brand-muted mt-[20px]">
            Showcase the keynote sessions, plenaries, panels, workshops,
            exhibitions and networking moments that will shape the week.
          </p>
          <a href="#register" className="inline-block mt-[28px] bg-brand-green text-white px-[21px] py-[14px] rounded-full font-bold text-[13px] hover:bg-brand-green-2 transition-all">
            View full programme →
          </a>
        </div>

        <div className="border-t border-brand-line">
          <div className="grid grid-cols-[80px_1fr_auto] max-[650px]:grid-cols-[58px_1fr] gap-[20px] py-[23px] border-b border-brand-line items-center">
            <div className="text-brand-green font-extrabold text-[13px]">DAY 01</div>
            <div><h3 className="text-[18px]">Opening & Welcome</h3><p className="text-brand-muted text-[12px] mt-[3px]">Continental perspectives and the social justice agenda.</p></div>
            <span className="max-[650px]:hidden text-[10px] uppercase tracking-[.1em] px-[10px] py-[7px] border border-[#d9ddd9] rounded-full text-brand-muted">Plenary</span>
          </div>
          
          <div className="grid grid-cols-[80px_1fr_auto] max-[650px]:grid-cols-[58px_1fr] gap-[20px] py-[23px] border-b border-brand-line items-center">
            <div className="text-brand-green font-extrabold text-[13px]">DAY 02</div>
            <div><h3 className="text-[18px]">Keynote Conversations</h3><p className="text-brand-muted text-[12px] mt-[3px]">Leaders examining the future of social justice in Africa.</p></div>
            <span className="max-[650px]:hidden text-[10px] uppercase tracking-[.1em] px-[10px] py-[7px] border border-[#d9ddd9] rounded-full text-brand-muted">Keynote</span>
          </div>
          
          <div className="grid grid-cols-[80px_1fr_auto] max-[650px]:grid-cols-[58px_1fr] gap-[20px] py-[23px] border-b border-brand-line items-center">
            <div className="text-brand-green font-extrabold text-[13px]">DAY 03</div>
            <div><h3 className="text-[18px]">Research & Practice</h3><p className="text-brand-muted text-[12px] mt-[3px]">Evidence, innovation and African knowledge systems.</p></div>
            <span className="max-[650px]:hidden text-[10px] uppercase tracking-[.1em] px-[10px] py-[7px] border border-[#d9ddd9] rounded-full text-brand-muted">Sessions</span>
          </div>
          
          <div className="grid grid-cols-[80px_1fr_auto] max-[650px]:grid-cols-[58px_1fr] gap-[20px] py-[23px] border-b border-brand-line items-center">
            <div className="text-brand-green font-extrabold text-[13px]">DAY 04</div>
            <div><h3 className="text-[18px]">Community & Policy</h3><p className="text-brand-muted text-[12px] mt-[3px]">Bridging lived experience, policy and professional action.</p></div>
            <span className="max-[650px]:hidden text-[10px] uppercase tracking-[.1em] px-[10px] py-[7px] border border-[#d9ddd9] rounded-full text-brand-muted">Panels</span>
          </div>
          
          <div className="grid grid-cols-[80px_1fr_auto] max-[650px]:grid-cols-[58px_1fr] gap-[20px] py-[23px] border-b border-brand-line items-center">
            <div className="text-brand-green font-extrabold text-[13px]">DAY 05</div>
            <div><h3 className="text-[18px]">Partnership & Action</h3><p className="text-brand-muted text-[12px] mt-[3px]">Building networks and practical commitments.</p></div>
            <span className="max-[650px]:hidden text-[10px] uppercase tracking-[.1em] px-[10px] py-[7px] border border-[#d9ddd9] rounded-full text-brand-muted">Labs</span>
          </div>
          
          <div className="grid grid-cols-[80px_1fr_auto] max-[650px]:grid-cols-[58px_1fr] gap-[20px] py-[23px] border-b border-brand-line items-center">
            <div className="text-brand-green font-extrabold text-[13px]">DAY 06</div>
            <div><h3 className="text-[18px]">Closing & Commitments</h3><p className="text-brand-muted text-[12px] mt-[3px]">Collective resolutions and the road ahead.</p></div>
            <span className="max-[650px]:hidden text-[10px] uppercase tracking-[.1em] px-[10px] py-[7px] border border-[#d9ddd9] rounded-full text-brand-muted">Closing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
