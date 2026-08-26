export function Topbar() {
  return (
    <div className="bg-brand-deep text-white/75 text-xs">
      <div className="container-custom min-h-[38px] flex justify-between items-center gap-5 max-[650px]:justify-center">
        <div><strong className="text-white">IFSW AFRICA 2027</strong> · Regional Conference</div>
        <div className="flex gap-[18px] max-[650px]:hidden">
          <span>26–31 October 2027</span>
          <span>Lilongwe, Malawi</span>
        </div>
      </div>
    </div>
  );
}
