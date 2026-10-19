"use client";

import { useState } from "react";
import Image from "next/image";
import { Twitter, Linkedin, Target, Zap, Award, Users, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const values = [
  { title: "Ownership", description: "Taking full responsibility for outcomes and treating the business as our own.", icon: Target },
  { title: "Hustle Always", description: "Relentless pursuit of excellence and going the extra mile for our users.", icon: Zap },
  { title: "Innovation", description: "Constantly challenging the status quo to build smarter, better solutions.", icon: Award },
  { title: "Clear Communication", description: "Fostering transparency and radical candor across all teams.", icon: Users },
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
    name: "Brand & Marketing",
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
    role: "Chief Executive Officer",
    image: "/images/ceo-akomolafe-folarin.jpg",
    bio: "Visionary leader spearheading strategic growth, business operations, and tech-driven transformation."
  },
  {
    name: "Oluwadiya Ayobami Bright",
    role: "Chief Technology Officer",
    image: "/images/cto-oluwadiya-ayobami.jpg",
    bio: "Lead Software Architect specializing in scalable backend infrastructures and real-time platforms."
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutClientUI() {
  const [activeTeam, setActiveTeam] = useState(teams[0]);

  return (
    <div className="w-full bg-[#FFF9F9] text-[#1A1A1A] font-sans selection:bg-[#F8C12C] selection:text-[#1A1A1A]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden bg-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          <Image
            src="/img/delivery_man_real_bg.png"
            alt="Delivery Background"
            fill
            style={{ objectFit: "cover", objectPosition: "center right" }}
            priority
          />
        </div>
        {/* Subtle gradient overlay to blend the image and keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-0 pointer-events-none" />

        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#A31621]/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#F8C12C]/15 blur-[120px] pointer-events-none z-0" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-5xl"
        >
          <motion.div variants={fadeIn} className="inline-block mb-6 px-5 py-2 rounded-full border border-[#1A1A1A]/10 bg-white/50 backdrop-blur-md shadow-sm">
            <span className="text-sm font-bold tracking-wider text-[#A31621] uppercase">Eatros Corporate</span>
          </motion.div>
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8 text-[#1A1A1A]">
            Redefining the <br />
            <span className="text-[#A31621]">
              Food Delivery
            </span> Ecosystem.
          </motion.h1>
          <motion.p variants={fadeIn} className="text-lg md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-medium">
            We build scalable, tech-driven solutions that seamlessly connect consumers, restaurants, and agents.
          </motion.p>
        </motion.div>
      </section>

      {/* Founder's Story / Mission Section */}
      <section className="px-6 md:px-12 lg:px-24 py-24 bg-white relative z-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-gray-100">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center"
        >
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1A1A]">
              Driven by <span className="text-[#F8C12C] underline decoration-[#A31621] decoration-4 underline-offset-8">First Principles</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-medium">
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
          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-[#A31621]/15 border-4 border-[#1A1A1A] group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 to-transparent z-10" />
              <Image
                src="/images/ceo-akomolafe-folarin.jpg"
                alt="Eatros Vision"
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 z-20">
                <p className="text-white font-bold text-2xl mb-1">Akomolafe Folarin O.</p>
                <p className="text-[#F8C12C] font-semibold tracking-wide">CEO & Founder</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="px-6 md:px-12 lg:px-24 py-32 relative bg-[#FFF9F9]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#1A1A1A]">Core Values</h2>
              <p className="text-xl text-gray-600 font-medium">The principles that guide every decision we make.</p>
            </div>
            <div className="hidden md:block w-24 h-1 bg-[#A31621] rounded-full mb-4"></div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeIn}
                  className="group relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-[#1A1A1A] transition-all duration-300 hover:shadow-xl hover:shadow-[#A31621]/5 overflow-hidden flex flex-col justify-between aspect-square"
                >
                  {/* Decorative corner */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFF9F9] rounded-full group-hover:bg-[#F8C12C]/20 transition-colors duration-500" />
                  
                  <div className="bg-[#A31621] w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white w-7 h-7" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-[#1A1A1A]">{val.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">{val.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="px-6 md:px-12 lg:px-24 py-32 bg-[#A31621] text-white overflow-hidden relative">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-white/20 pb-12"
          >
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">Our Teams</h2>
            <p className="text-xl text-white/80 max-w-sm font-medium">
              Cross-functional groups working in harmony to deliver excellence.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="lg:w-1/3 flex flex-col gap-4">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setActiveTeam(team)}
                  className={`text-left px-6 py-6 rounded-2xl transition-all duration-300 flex items-center justify-between group ${
                    activeTeam.id === team.id 
                      ? "bg-white text-[#1A1A1A] shadow-xl font-bold" 
                      : "text-white/70 hover:text-white hover:bg-white/10 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm opacity-60 ${activeTeam.id === team.id ? "text-[#A31621]" : ""}`}>{team.id}</span>
                    <span className="text-xl md:text-2xl">{team.name}</span>
                  </div>
                  <ChevronRight className={`w-6 h-6 transition-transform ${activeTeam.id === team.id ? "opacity-100 translate-x-0 text-[#A31621]" : "opacity-0 -translate-x-4 group-hover:opacity-100"}`} />
                </button>
              ))}
            </div>
            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTeam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#FFF9F9] rounded-3xl p-10 md:p-16 h-full flex flex-col justify-center shadow-2xl border border-white/10"
                >
                  <div className="w-12 h-12 text-[#F8C12C] mb-8">
                    {/* Brand aesthetic star/sparkle icon */}
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-extrabold mb-8 text-[#1A1A1A]">
                    {activeTeam.name}
                  </h3>
                  <p className="text-xl md:text-2xl leading-relaxed text-gray-700 font-medium">
                    {activeTeam.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="px-6 md:px-12 lg:px-24 py-32 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-20 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#1A1A1A]">Leadership</h2>
            <p className="text-xl text-gray-600 font-medium">The visionaries steering the ship.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
          >
            {people.map((person, idx) => (
              <motion.div key={idx} variants={fadeIn} className="group flex flex-col">
                <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 border-4 border-[#1A1A1A] shadow-xl shadow-[#A31621]/10">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Social Links on Hover */}
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                    <div className="flex gap-4">
                      <a href="#" className="w-12 h-12 rounded-full bg-[#F8C12C] text-[#1A1A1A] flex items-center justify-center hover:bg-[#A31621] hover:text-white transition-colors shadow-lg">
                        <Twitter size={20} className="fill-current" />
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full bg-[#F8C12C] text-[#1A1A1A] flex items-center justify-center hover:bg-[#A31621] hover:text-white transition-colors shadow-lg">
                        <Linkedin size={20} className="fill-current" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="px-4">
                  <h3 className="text-3xl font-extrabold mb-2 text-[#1A1A1A]">{person.name}</h3>
                  <p className="text-[#A31621] font-bold tracking-widest uppercase text-sm mb-4">{person.role}</p>
                  <p className="text-gray-600 leading-relaxed text-lg font-medium">
                    {person.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
