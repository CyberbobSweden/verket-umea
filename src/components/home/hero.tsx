'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaveformDivider } from '@/components/shared/waveform-divider';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="h-full w-1/3 animate-scan bg-gradient-to-r from-transparent via-volt to-transparent" />
      </div>

      <div className="container relative flex flex-col items-start py-24 lg:py-32">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow mb-5"
        >
          Ideell förening · Umeå sedan grunden
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          Volym upp.
          <br />
          <span className="text-gradient">Filter av.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 max-w-xl text-lg text-mist"
        >
          Verket Umeå är scenen, LAN-hallen och replokalen som medlemmarna bygger tillsammans. Konserter, gaming,
          workshops och en community som inte stänger av när musiken tystnar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Button size="lg" asChild>
            <Link href="/event">
              Se kommande event <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/medlemskap">
              <CalendarDays className="h-4 w-4" /> Bli medlem
            </Link>
          </Button>
        </motion.div>
      </div>

      <WaveformDivider active className="h-10 px-6 pb-2 opacity-80" />
    </section>
  );
}
