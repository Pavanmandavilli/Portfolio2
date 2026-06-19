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
import Blogs from './components/Blogs';
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
        <Blogs />
        <Contact />
      </main>
    </>
  );
}

export default App;
