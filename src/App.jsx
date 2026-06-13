import './App.css';
import NeuralBackground from './components/NeuralBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AvailableBanner from './components/AvailableBanner';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';

function App() {
  return (
    <>
      <NeuralBackground />
      <Navbar />
      <main>
        <Hero />
        <AvailableBanner />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container">
          <p>
            <span className="footer-name">Pavan Sekhar</span>
            {' '}— Built with React & Neural Magic
            <span className="footer-heart"> ♥</span>
          </p>
          <p className="footer-copy">© 2025 All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
