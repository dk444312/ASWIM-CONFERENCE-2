import React from 'react';
import { Calendar, Clock, CheckCircle, Flame, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CalloutBanner() {
  const dates = [
    {
      title: "Registration Opens",
      date: "1 October 2026",
      type: "open",
      icon: Calendar,
      accent: "text-gray-900 bg-gray-100 border-gray-300"
    },
    {
      title: "Super Early Bird Registration",
      date: "1st October - 31st December 2026",
      type: "promo",
      icon: Flame,
      accent: "text-gray-900 bg-gray-100 border-gray-300"
    },
    {
      title: "Early Bird Registration",
      date: "1st January - 30th April 2027",
      type: "promo",
      icon: Clock,
      accent: "text-gray-900 bg-gray-100 border-gray-300"
    },
    {
      title: "Standard Registration",
      date: "1st May to September 30th 2027",
      type: "normal",
      icon: Calendar,
      accent: "text-gray-900 bg-gray-100 border-gray-300"
    },
    {
      title: "Late Registration",
      date: "October 2027",
      type: "alert",
      icon: Clock,
      accent: "text-red-700 bg-red-50 border-red-200"
    },
    {
      title: "Call for Abstracts Open",
      date: "1st October 2026",
      type: "open",
      icon: BookOpen,
      accent: "text-gray-900 bg-gray-100 border-gray-300"
    },
    {
      title: "Call for Abstracts Closed",
      date: "31st March, 2027",
      type: "close",
      icon: CheckCircle,
      accent: "text-gray-900 bg-gray-100 border-gray-300"
    }
  ];

  return (
    <section id="conference-callout" className="py-12 sm:py-16 bg-[#f8f9fa] border-b border-gray-200">
      <div className="container-custom space-y-12 sm:space-y-16">
        
        {/* Banner Announcement Image */}
        <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] shadow-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-2xl">
          <img
            id="hero-callout-image"
            src="/callout.jpg"
            alt="IFSW Africa Regional Conference 2027 Callout Announcement"
            className="w-full h-auto object-cover object-center block max-h-[580px]"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </div>

        {/* KEY DATES FOR THE CONFERENCE */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1f1f1f] font-heading">
              Key Dates for the Conference
            </h2>
            <div className="w-16 h-1 bg-[#1f1f1f] mx-auto rounded-full"></div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Plan your attendance and submission timeline for the definitive gathering of social work practitioners, educators, and leaders in Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dates.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-all duration-300 p-6 flex items-start gap-4"
              >
                <div className={`p-3 rounded-xl border shrink-0 ${item.accent}`}>
                  <item.icon size={20} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-black tracking-tight text-[#1f1f1f] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-bold font-mono">
                    {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Call to Actions below dates */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#1f1f1f] text-white font-extrabold text-xs rounded-xl hover:bg-black transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>Register for Conference</span>
              <ArrowRight size={14} />
            </Link>
            
            <Link 
              to="/abstract-submission" 
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-white border border-gray-300 text-gray-800 font-extrabold text-xs rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Abstract Proposal</span>
              <ArrowRight size={14} className="text-gray-900" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
