'use client';

import { useAnimationFrame } from 'framer-motion';
import { useRef } from 'react';

const codeSnippets = [
  `function helloWorld() {\n  console.log("Hello, world!");\n}`,
  `const add = (a, b) => a + b;`,
  `for (let i = 0; i < 10; i++) {\n  console.log(i);\n}`,
  `async function fetchData() {\n  const res = await fetch('/api');\n  return await res.json();\n}`,
  `class Developer {\n  constructor(name) {\n    this.name = name;\n  }\n}`,
  `if (user.isAdmin) {\n  showPanel();\n}`,
  `useEffect(() => {\n  loadData();\n}, []);`,
  `try {\n  saveData();\n} catch (e) {\n  alert("Error");\n}`,
  `export default function App() {\n  return <MainPage />;\n}`,
  `let passion = "code";\nconsole.log(passion);`
];

export default function CodeWorldBackground() {
  const rotate = useRef(0);
  const divRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    rotate.current += delta * 0.01;
    if (divRef.current) {
      divRef.current.style.transform = `rotateY(${rotate.current}deg)`;
    }
  });

  return (
    <div className="fixed inset-0 bg-black overflow-hidden -z-10">
      <div className="w-full h-full flex items-end justify-center pb-[2vh] perspective-[1200px]">
        <div
          className="relative w-[400px] h-[400px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            ref={divRef}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {codeSnippets.map((code, i) => {
              const angle = (i / codeSnippets.length) * 360;
              const radius = 700;

              return (
                <pre
                  key={i}
                  className="absolute text-[#00ffff] text-sm sm:text-base font-mono opacity-25"
                  style={{
                    transform: `
                      rotateY(${angle}deg)
                      translateZ(${radius}px)
                    `,
                    whiteSpace: 'pre-wrap',
                    textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
                  }}
                >
                  {code}
                </pre>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
