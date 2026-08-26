export function Speakers() {
  return (
    <section id="speakers" className="py-[110px] max-[650px]:py-[80px]">
      <div className="container-custom">
        <div className="flex justify-between items-end gap-[40px] mb-[50px] max-[650px]:block">
          <div>
            <div className="text-brand-green uppercase tracking-[.16em] text-[11px] font-extrabold mb-[18px]">Voices of Africa</div>
            <h2 className="text-[clamp(42px,5vw,70px)]">People shaping the conversation.</h2>
          </div>
          <p className="max-w-[420px] text-brand-muted max-[650px]:mt-[17px]">
            Highlight keynote speakers, regional leaders, researchers,
            practitioners and community voices as they are confirmed.
          </p>
        </div>

        <div className="grid grid-cols-4 max-[1000px]:grid-cols-2 max-[650px]:grid-cols-1 gap-[16px]">
          {[1, 2, 3, 4].map((i) => (
            <article key={i} className="min-h-[410px] max-[650px]:min-h-[450px] rounded-[20px] bg-[#c9d3cc] flex items-center justify-center">
              <span className="text-brand-deep/50 font-extrabold text-[18px] tracking-widest uppercase">TBA</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
