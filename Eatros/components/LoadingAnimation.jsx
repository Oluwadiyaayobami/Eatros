"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const LoadingAnimation = ({ onComplete }) => {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const lettersRef = useRef([])
  const pinRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) {
          onComplete()
        }
      }
    })

    // Setup initial state: elements are invisible and positioned above
    gsap.set(lettersRef.current, { y: -60, opacity: 0 })
    gsap.set(pinRef.current, { scale: 0, opacity: 0 })

    // Staggered drop down animation for the letters
    tl.to(lettersRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.5)"
    })
    // Pin pops in after the letters finish dropping
    .to(pinRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(2)"
    }, "-=0.2")
    // Add a gentle pulse to the entire wrapper mimicking an app loading heartbeat
    .to(wrapperRef.current, {
      scale: 1.05,
      duration: 0.5,
      yoyo: true,
      repeat: 1, // Pulse down and up once
      ease: "sine.inOut"
    }, "+=0.2")
    // Zoom through effect: massive scale up and fade out before transition
    .to(wrapperRef.current, {
      scale: 60,
      opacity: 0,
      duration: 0.7,
      ease: "power3.in"
    }, "+=0.3")

    return () => {
      tl.kill()
    }
  }, [onComplete])

  const letters = "EATRO".split("")

  return (
    <div
      ref={containerRef}
      // Using a solid yellow background inspired by the visual reference
      className="fixed inset-0 flex items-center justify-center min-h-screen bg-[#FFC244] z-50 overflow-hidden"
    >
      <div ref={wrapperRef} className="flex items-center">
        {/* Italic EATRO wordmark */}
        <h1 className="text-6xl tracking-tight font-extrabold flex items-center italic">
          {letters.map((char, index) => (
            <span
              key={index}
              ref={(el) => (lettersRef.current[index] = el)}
              className={`inline-block ${index < 3 ? 'text-[#A31621]' : 'text-white'}`}
            >
              {char}
            </span>
          ))}
          {/* Location pin acting as an exclamation/accent mark */}
          <span ref={pinRef} className="inline-block ml-1 mt-1">
            <svg className="w-12 h-12 text-[#A31621]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </span>
        </h1>
      </div>
    </div>
  )
}

export default LoadingAnimation