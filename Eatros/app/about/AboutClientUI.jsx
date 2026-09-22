"use client";

import { useState } from "react";
import Image from "next/image";
import { Twitter, Linkedin } from "lucide-react";

const values = [
  { title: "Ownership", color: "bg-red-100" },
  { title: "Hustle Always", color: "bg-red-200" },
  { title: "Innovation", color: "bg-red-100" },
  { title: "Clear Communication", color: "bg-red-200" },
];

const teams = [
  {
    id: "01",
    name: "Operations",
    description: "The Operations team ensures everything runs smoothly behind the scenes. From managing logistics to improving processes, they keep the business moving efficiently.",
  },
  {
    id: "02",
    name: "Customer Support",
    description: "Our Support team is dedicated to providing swift and effective solutions for our users. They ensure every interaction is handled with care.",
  },
  {
    id: "03",
    name: "Brand and Marketing",
    description: "The Marketing team crafts our story and shares it with the world, driving growth and ensuring our brand resonates with our audience.",
  },
  {
    id: "04",
    name: "Product & Engineering",
    description: "Our technical teams build the robust, scalable architectures that power the Eatros ecosystem. They turn complex problems into elegant solutions.",
  },
];

const people = [
  {
    name: "Akomolafe Folarin O.",
    role: "CEO",
    image: "/images/ceo-akomolafe-folarin.jpg",
  },
  {
    name: "Oluwadiya Ayobami Bright",
    role: "CTO",
    image: "/images/cto-oluwadiya-ayobami.jpg",
  },
];

export default function AboutClientUI() {
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  const [activePerson, setActivePerson] = useState(people[0]);

  return (
    <div className="w-full bg-[#FFF9F9] text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-12 lg:px-24 overflow-hidden">
        <h1 className="text-6xl md:text-8xl lg:text-[140px] font-bold tracking-tight text-center leading-none text-[#1A1A1A]">
          Delivering Innovation
        </h1>
        {/* Decorative bottom element matching the screenshot aesthetic */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between items-end px-12 opacity-80 pointer-events-none">
          <div className="w-48 h-32 bg-[#A31621] rounded-t-full"></div>
          <div className="w-32 h-24 bg-[#ff6b7a] rounded-t-full mx-4"></div>
          <div className="w-64 h-40 bg-[#A31621] rounded-t-full"></div>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="px-4 md:px-12 lg:px-24 py-16 bg-[#FFF9F9]">
        <div className="border-4 border-[#1A1A1A] rounded-2xl overflow-hidden flex flex-col lg:flex-row bg-white">
          <div className="bg-[#A31621] p-6 lg:p-12 lg:w-1/2 flex flex-col justify-between relative text-white">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[#F8C12C] border-2 border-white"></span>
              Our Story
            </h2>
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border-2 border-[#1A1A1A]">
              <Image
                src="/images/ceo-akomolafe-folarin.jpg"
                alt="Akomolafe Folarin O. - CEO"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="p-8 lg:p-16 lg:w-1/2 text-lg lg:text-xl leading-relaxed text-gray-800 space-y-6">
            <p>
              We are dedicated to delivering innovative software solutions that focus on technology, scalability, and exceptional service delivery. 
            </p>
            <p>
              Our platform bridges the gap between consumers, restaurants, and delivery agents, creating a seamless and efficient ecosystem that powers the modern food industry.
            </p>
            <p>
              We went back to first principles to figure this out. We built a robust technical standpoint, realizing that solving operations with tech requires deconstructing the traditional processes.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="px-4 md:px-12 lg:px-24 py-16 bg-white">
        <div className="mb-12 flex items-baseline gap-4">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight">Core Values</h2>
          <span className="text-[#A31621] text-xl">What keeps us grounded</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className={`${val.color} rounded-3xl p-8 aspect-square flex flex-col justify-between relative overflow-hidden group`}
            >
              <h3 className="text-2xl font-bold z-10">{val.title}</h3>
              {/* Abstract decorative shapes inside the value cards */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-black rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute -bottom-4 -left-8 w-32 h-32 bg-white rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500 delay-100"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Teams Section */}
      <section className="px-4 md:px-12 lg:px-24 py-24 bg-[#A31621] text-white">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-7xl md:text-9xl font-bold tracking-tighter">Teams.</h2>
          <h2 className="text-7xl md:text-9xl font-bold tracking-tighter text-white/90">Focus.</h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 flex flex-col gap-6">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setActiveTeam(team)}
                className={`text-left text-3xl md:text-5xl font-bold tracking-tight flex items-start gap-4 transition-colors duration-300 ${
                  activeTeam.id === team.id ? "text-[#F8C12C]" : "text-white/60 hover:text-white"
                }`}
              >
                <span className="text-base font-medium mt-2">{team.id}</span>
                {team.name}
              </button>
            ))}
          </div>
          <div className="lg:w-1/2">
            <div className="bg-[#FFF9F9] rounded-3xl p-8 md:p-12 text-[#1A1A1A] h-full shadow-2xl transition-all duration-500 transform">
              <div className="w-12 h-12 text-[#F8C12C] mb-8">
                {/* Sun/Star icon representation */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                </svg>
              </div>
              <p className="text-xl md:text-3xl leading-relaxed font-medium">
                {activeTeam.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* People Section */}
      <section className="px-4 md:px-12 lg:px-24 py-24 bg-white">
        <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-16">People</h2>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#1A1A1A]">
              <Image
                key={activePerson.name} // Key forces re-render/animation on change
                src={activePerson.image}
                alt={activePerson.name}
                fill
                style={{ objectFit: "cover" }}
                className="animate-fade-in"
              />
            </div>
          </div>
          <div className="lg:w-2/3 flex flex-col">
            {people.map((person) => (
              <div
                key={person.name}
                onClick={() => setActivePerson(person)}
                className={`group cursor-pointer py-8 border-b-2 transition-colors duration-300 flex items-center justify-between ${
                  activePerson.name === person.name
                    ? "border-[#F8C12C]"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-8 w-2/3">
                  <h3
                    className={`text-3xl md:text-4xl font-bold transition-colors ${
                      activePerson.name === person.name ? "text-[#F8C12C]" : "text-[#1A1A1A]"
                    }`}
                  >
                    {person.name.split(" ")[0]} {/* Just showing the first name to match the UI style */}
                  </h3>
                  <span className="uppercase tracking-widest text-sm font-bold text-gray-500">
                    {person.role}
                  </span>
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-[#F8C12C] hover:border-[#F8C12C] transition-colors">
                    <Twitter size={18} />
                  </button>
                  <button className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-[#F8C12C] hover:border-[#F8C12C] transition-colors">
                    <Linkedin size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Small custom CSS for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
}
