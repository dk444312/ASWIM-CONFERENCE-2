export function Subcommittee() {
  const members = [
    { name: "Jacqueline Nambala", role: "Publicity Subcommittee", image: "/subcommittee/Jacqueline Nambala.jpg" },
    { name: "Joseph Kalelo", role: "Finance Subcommittee", image: "/subcommittee/Joseph Kalelo.jpg" },
    { name: "Magret Mwale", role: "Registration Subcommittee", image: "/subcommittee/Magret Mwale.jpg" },
    { name: "Itaye Tsogolo", role: "Scientific Subcommittee", image: "/subcommittee/MS Tsogolo.jpg" },
    { name: "Hard Chatsika", role: "Local Organizing Subcommittee", image: "/subcommittee/MR HARD.jpg" },
    { name: "Felix Kakowa", role: "Chairperson", image: "/subcommittee/Felix Kakowa.jpg" }
  ];

  return (
    <section id="subcommittee" className="py-[110px] max-[650px]:py-[80px] bg-brand-sand relative">
      <div className="container-custom">
        <div className="text-center max-w-[680px] mx-auto mb-[60px]">
          <h2 className="text-[42px] max-[650px]:text-[34px] font-heading font-extrabold text-brand-ink leading-[1.05] tracking-tight">
            Organizing Subcommittee
          </h2>
          <p className="text-[#3f4943] text-[16px] leading-[1.6] mt-[16px]">
            Meet the dedicated team working to bring IFSW Africa 2027 to life.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[24px]">
          {members.map((member, index) => (
            <article key={index} className="flex flex-col items-center group">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-[20px] bg-[#c9d3cc] shadow-sm">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <h3 className="text-[18px] font-bold text-brand-ink text-center leading-tight">{member.name}</h3>
              {member.role && (
                <p className="text-[13px] text-[#3f4943] text-center mt-[4px]">{member.role}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
