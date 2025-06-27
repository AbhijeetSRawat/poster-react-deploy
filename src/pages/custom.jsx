import React, { useRef, useState, useEffect } from 'react';
import Heading from '../components/core/heading';

const Custom = ({ mode, setMode }) => {
  const canvasRef = useRef(null);

  const [mainImage, setMainImage] = useState(null);
  const [logo1, setLogo1] = useState(null);
  const [logo2, setLogo2] = useState(null);

  const [logo1Pos, setLogo1Pos] = useState({ x: 20, y: 20, width: 255, height: 255 });
  const [logo2Pos, setLogo2Pos] = useState({ x: 50, y: 980, width: 1800, height: 150 });

  const [gradient, setGradient] = useState({
    color1: '#000000',
    color2: '#ffffff',
    direction: 'to bottom'
  });

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!mainImage) return;

    const bg = new Image();
    bg.src = mainImage;
    bg.onload = () => {
      canvas.width = bg.width;
      canvas.height = bg.height;

      const grad = ctx.createLinearGradient(
        0, 0,
        gradient.direction.includes('right') ? bg.width : 0,
        gradient.direction.includes('bottom') ? bg.height : 0
      );
      grad.addColorStop(0, gradient.color1);
      grad.addColorStop(1, gradient.color2);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, bg.width, bg.height);
      ctx.drawImage(bg, 0, 0);

      if (logo1) {
        const img1 = new Image();
        img1.src = URL.createObjectURL(logo1);
        img1.onload = () => {
          ctx.drawImage(
            img1,
            parseInt(logo1Pos.x || 0),
            parseInt(logo1Pos.y || 0),
            parseInt(logo1Pos.width || 80),
            parseInt(logo1Pos.height || 80)
          );
        };
      }

      if (logo2) {
        const img2 = new Image();
        img2.src = URL.createObjectURL(logo2);
        img2.onload = () => {
          ctx.drawImage(
            img2,
            parseInt(logo2Pos.x || 0),
            parseInt(logo2Pos.y || 0),
            parseInt(logo2Pos.width || 80),
            parseInt(logo2Pos.height || 40)
          );
        };
      }
    };
  };

  useEffect(() => {
    drawCanvas();
  }, [mainImage, logo1, logo2, logo1Pos, logo2Pos]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'customized-poster.jpg';
    link.href = canvasRef.current.toDataURL('image/jpeg');
    link.click();
  };

  return (
    <div className={`min-h-screen pt-16 pb-20 px-4 md:pt-28 ${mode ? 'bg-blue-100 text-black' : 'bg-slate-900 text-white'}`}>
      <Heading mode={mode} setMode={setMode} />
      <h2 className="text-2xl font-bold text-center py-6 md:text-4xl">Poster Customizer</h2>

      {/* Uploads */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <label htmlFor="imageUpload" className="bg-teal-600 px-6 py-2 rounded text-white md:text-2xl cursor-pointer">
          Upload Main Image
        </label>
        <input type="file" id="imageUpload" hidden accept="image/*" onChange={(e) => {
          const file = e.target.files[0];
          if (file) setMainImage(URL.createObjectURL(file));
        }} />

        <label htmlFor="logoUpload1" className="bg-teal-600 px-6 py-2 rounded text-white md:text-2xl cursor-pointer">
          Upload Logo
        </label>
        <input type="file" id="logoUpload1" hidden accept="image/*" onChange={(e) => {
          const file = e.target.files[0];
          if (file) setLogo1(file);
        }} />

        <label htmlFor="logoUpload2" className="bg-teal-600 px-6 py-2 rounded text-white md:text-2xl cursor-pointer">
          Upload Footer
        </label>
        <input type="file" id="logoUpload2" hidden accept="image/*" onChange={(e) => {
          const file = e.target.files[0];
          if (file) setLogo2(file);
        }} />
      </div>

      {/* Canvas */}
      <div className="flex justify-center my-10">
        <canvas ref={canvasRef} className="bg-white rounded shadow border max-w-full md:w-[80vw]" />
      </div>

      {/* Manual Position Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
        {['x', 'y', 'width', 'height'].map((field) => (
          <input
            key={field}
            type="number"
            placeholder={`Logo1 ${field}`}
            value={logo1Pos[field]}
            onChange={(e) => setLogo1Pos({ ...logo1Pos, [field]: e.target.value })}
            className="p-2  rounded border md:h-[5vh] md:text-xl"
          />
        ))}
        {['x', 'y', 'width', 'height'].map((field) => (
          <input
            key={field}
            type="number"
            placeholder={`Footer ${field}`}
            value={logo2Pos[field]}
            onChange={(e) => setLogo2Pos({ ...logo2Pos, [field]: e.target.value })}
            className="p-2  rounded border  md:h-[5vh] md:text-xl"
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button onClick={drawCanvas} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 md:text-3xl rounded">
          Customize
        </button>
        <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 md:text-3xl rounded">
          Download
        </button>
      </div>
    </div>
  );
};

export default Custom;
