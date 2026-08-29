import { Topbar } from '../components/Topbar';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { CalloutBanner } from '../components/CalloutBanner';
import { About } from '../components/About';
import { Stats } from '../components/Stats';
import { Malawi } from '../components/Malawi';
import { Sponsors } from '../components/Sponsors';
import { Organizers } from '../components/Organizers';
import { Programme } from '../components/Programme';
import { IfswRegion } from '../components/IfswRegion';
import { Subcommittee } from '../components/Subcommittee';
import { Cta } from '../components/Cta';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <>
      <Topbar />
      <Header />
      <main>
        <Hero />
        <CalloutBanner />
        <About />
        <Stats />
        <Malawi />
        <Sponsors />
        <Organizers />
        <Programme />
        <IfswRegion />
        <Subcommittee />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
