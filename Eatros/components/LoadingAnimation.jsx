"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Pacifico } from 'next/font/google'

const pacifico = Pacifico({ weight: '400', subsets: ['latin'], display: 'swap' })

const LoadingAnimation = ({ onComplete }) => {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const iconRef = useRef(null)
  const lettersRef = useRef([])
  const subtitleRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) {
          onComplete()
        }
      }
    })

    // Setup initial state
    gsap.set(iconRef.current, { y: -100, opacity: 0, scale: 0.8 })
    gsap.set(lettersRef.current, { y: -60, opacity: 0 })
    gsap.set(subtitleRef.current, { opacity: 0, y: 20 })

    // Animate Icon
    tl.to(iconRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "bounce.out"
    })
    // Staggered drop down animation for the letters
    .to(lettersRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.5)"
    }, "-=0.3")
    // Fade in subtitle
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.2")
    // Zoom through effect: massive scale up and fade out before transition
    .to(wrapperRef.current, {
      scale: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.in"
    }, "+=0.6")

    return () => {
      tl.kill()
    }
  }, [onComplete])

  const letters = "Eatro".split("")

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 w-full h-[100dvh] flex flex-col items-center justify-center bg-white z-50 overflow-hidden ${pacifico.className}`}
    >
      <div ref={wrapperRef} className="flex flex-col items-center">
        {/* The Cloche & C Icon */}
        <div ref={iconRef} className="mb-2">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            {/* Cloche Knob */}
            <path d="M47 22 C45 16 55 16 53 22" stroke="#FF5722" strokeWidth="5" strokeLinecap="round" />
            {/* Cloche Dome */}
            <path d="M28 45 C28 25 72 25 72 45" stroke="#FF5722" strokeWidth="5" strokeLinecap="round" />
            {/* Cloche Rim */}
            <path d="M22 50 C40 45 60 45 78 50" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
            {/* C Shape / Plate */}
            <path d="M72 65 C40 50 10 70 20 90 C30 105 60 100 72 82" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Eatro wordmark */}
        <h1 className="text-7xl font-bold flex items-center text-[#FF5722]" style={{ lineHeight: '1.2' }}>
          {letters.map((char, index) => {
            if (char === 'o') {
              return (
                <span
                  key={index}
                  ref={(el) => (lettersRef.current[index] = el)}
                  className="inline-flex items-center justify-center relative -ml-1 mt-3 w-[46px] h-[46px] bg-[#FF5722] rounded-full"
                >
                  {/* Fork Cutout for 'o' */}
                  <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[26px]">
                    <path d="M7 2v6c0 1.1.9 2 2 2h2v12h2V10h2c1.1 0 2-.9 2-2V2h-1.5v6c0 .3-.2.5-.5.5s-.5-.2-.5-.5V2h-2v6c0 .3-.2.5-.5.5s-.5-.2-.5-.5V2H10v6c0 .3-.2.5-.5.5s-.5-.2-.5-.5V2H7z"/>
                  </svg>
                </span>
              )
            }
            return (
              <span
                key={index}
                ref={(el) => (lettersRef.current[index] = el)}
                className="inline-block relative"
              >
                {char}
              </span>
            )
          })}
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="mt-4 text-[#4A3B32] text-sm tracking-[0.3em] font-sans font-bold uppercase">
          We Deliver. You Enjoy.
        </p>
      </div>
    </div>
  )
}

export default LoadingAnimation