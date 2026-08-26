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

          <div className="grid grid-cols-2 max-[650px]:grid-cols-1 gap-[12px] mt-[28px]">
            <div className="p-[18px] border border-white/20 rounded-[15px] bg-white/5">
              <strong className="block text-[16px]">Lilongwe</strong>
              <span className="text-white/60 text-[12px]">Host city</span>
            </div>
            <div className="p-[18px] border border-white/20 rounded-[15px] bg-white/5">
              <strong className="block text-[16px]">26–31 Oct</strong>
              <span className="text-white/60 text-[12px]">2027 conference dates</span>
            </div>
            <div className="p-[18px] border border-white/20 rounded-[15px] bg-white/5">
              <strong className="block text-[16px]">Malawi</strong>
              <span className="text-white/60 text-[12px]">Host country</span>
            </div>
            <div className="p-[18px] border border-white/20 rounded-[15px] bg-white/5">
              <strong className="block text-[16px]">uMunthu</strong>
              <span className="text-white/60 text-[12px]">Community & solidarity</span>
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
