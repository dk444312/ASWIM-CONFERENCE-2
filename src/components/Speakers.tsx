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
          <article className="min-h-[410px] max-[650px]:min-h-[450px] rounded-[20px] overflow-hidden relative bg-[#c9d3cc] group">
            <img src="https://images.squarespace-cdn.com/content/v1/589237225016e1d643cf56a9/1678706643335-CRRZDTNZGLASVHVUE9HP/TBLON_Cynthia%2BR%2BMatonhodze_85.jpg" 
                 alt="Conference speaker placeholder" 
                 className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105 absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-t from-black/85 to-transparent px-[22px] pb-[22px] pt-[30px] text-white flex flex-col justify-end">
              <span className="text-[#f0ce59] text-[10px] uppercase tracking-[.15em] font-extrabold">Keynote Speaker</span>
              <h3 className="text-[21px] mt-[5px]">Speaker Name</h3>
              <p className="text-[12px] text-white/70">Social Justice & Policy</p>
            </div>
          </article>

          <article className="min-h-[410px] max-[650px]:min-h-[450px] rounded-[20px] overflow-hidden relative bg-[#c9d3cc] group">
            <img src="https://media.licdn.com/dms/image/v2/D4D12AQFxOHpLLw3UTQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1705589115038?e=2147483647&t=-d6MKx54EKlLs4tn98IgwQed_K12gkSWscwrnPqniOQ&v=beta" 
                 alt="Community discussion" 
                 className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105 absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-t from-black/85 to-transparent px-[22px] pb-[22px] pt-[30px] text-white flex flex-col justify-end">
              <span className="text-[#f0ce59] text-[10px] uppercase tracking-[.15em] font-extrabold">Regional Voice</span>
              <h3 className="text-[21px] mt-[5px]">Speaker Name</h3>
              <p className="text-[12px] text-white/70">African Social Work Practice</p>
            </div>
          </article>

          <article className="min-h-[410px] max-[650px]:min-h-[450px] rounded-[20px] overflow-hidden relative bg-[#c9d3cc] group">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Social_worker_in_Katwe_slum.jpg" 
                 alt="Social worker with community" 
                 className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105 absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-t from-black/85 to-transparent px-[22px] pb-[22px] pt-[30px] text-white flex flex-col justify-end">
              <span className="text-[#f0ce59] text-[10px] uppercase tracking-[.15em] font-extrabold">Expert</span>
              <h3 className="text-[21px] mt-[5px]">Speaker Name</h3>
              <p className="text-[12px] text-white/70">Human Rights & Development</p>
            </div>
          </article>

          <article className="min-h-[410px] max-[650px]:min-h-[450px] rounded-[20px] overflow-hidden relative bg-[#c9d3cc] group">
            <img src="https://images.squarespace-cdn.com/content/v1/5571f246e4b0601c9cc7876c/1535799275958-ERHN1YZYRS9709PDKYWE/IMG_7010.jpg" 
                 alt="Community meeting in Africa" 
                 className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105 absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-t from-black/85 to-transparent px-[22px] pb-[22px] pt-[30px] text-white flex flex-col justify-end">
              <span className="text-[#f0ce59] text-[10px] uppercase tracking-[.15em] font-extrabold">Community Leader</span>
              <h3 className="text-[21px] mt-[5px]">Speaker Name</h3>
              <p className="text-[12px] text-white/70">Community Action</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
