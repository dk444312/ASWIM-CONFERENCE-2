/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Topbar } from './components/Topbar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Stats } from './components/Stats';
import { Malawi } from './components/Malawi';
import { Speakers } from './components/Speakers';
import { Programme } from './components/Programme';
import { Cta } from './components/Cta';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <Topbar />
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Malawi />
        <Speakers />
        <Programme />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
