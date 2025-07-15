import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../components/core/heading';

const ArtisticAndAbstract = ({ mode, setMode }) => {
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allLoading, setAllLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [userLogo, setUserLogo] = useState(null);
  const [userFooter, setUserFooter] = useState(null);
  const [user, setUser] = useState({});

  const [logoPos, setLogoPos] = useState({ x: 20, y: 20, width: 150, height: 150 });
  const [footerPos, setFooterPos] = useState({ x: 20, y: 500, width: 1000, height: 100 });

  const [text, setText] = useState('');
  const [textPos, setTextPos] = useState({ x: 100, y: 100, size: 40 });
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');

  const fetchUserMedia = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch("https://poster-react-deploy.onrender.com/getUserDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data.data || {});
      setUserLogo(data?.data?.profile?.logo || null);
      setUserFooter(data?.data?.profile?.footer || null);
    } catch (err) {
      toast.error("Error fetching user");
    }
  };

  const callAllData = async () => {
    try {
      setAllLoading(true);
      const res = await fetch("https://poster-react-deploy.onrender.com/api/get/product");
      const data = await res.json();
      setAllData(data.allProduct || []);
    } catch {
      toast.error("Unable to fetch posters");
    } finally {
      setAllLoading(false);
    }
  };

  useEffect(() => {
    callAllData();
    fetchUserMedia();
  }, []);

  useEffect(() => {
      const savedImage = localStorage.getItem("selectedImage");
      if (savedImage) {
        setSelectedImage(savedImage);
        localStorage.removeItem("selectedImage");
      }
    }, []);

  const reqData = allData.filter((pic) => pic.category === "Artistic & Abstract");

  useEffect(() => {
    if (reqData.length > 0 && !selectedImage) {
      setSelectedImage(reqData[0].path);
    }
  }, [reqData]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImage) return;
    const ctx = canvas.getContext('2d');
    const base = new Image();
    base.crossOrigin = 'anonymous';
    base.src = selectedImage;

    base.onload = () => {
      canvas.width = base.width;
      canvas.height = base.height;
      ctx.clearRect(0, 0, base.width, base.height);
      ctx.drawImage(base, 0, 0);

      const drawLogo = new Promise((resolve) => {
        if (userLogo) {
          const logo = new Image();
          logo.crossOrigin = 'anonymous';
          logo.src = userLogo;
          logo.onload = () => {
            ctx.drawImage(logo, +logoPos.x, +logoPos.y, +logoPos.width, +logoPos.height);
            resolve();
          };
        } else resolve();
      });

      const drawFooter = new Promise((resolve) => {
        if (userFooter) {
          const footer = new Image();
          footer.crossOrigin = 'anonymous';
          footer.src = userFooter;
          footer.onload = () => {
            ctx.drawImage(footer, +footerPos.x, +footerPos.y, +footerPos.width, +footerPos.height);
            resolve();
          };
        } else {
  const footerHeight = Math.floor(canvas.height * 0.10);

  const footerY = canvas.height - footerHeight;

  ctx.fillStyle = '#3B82F6'; // Tailwind's bg-blue-500
  ctx.fillRect(0, footerY, canvas.width, footerHeight);

  const paddingX = 30;
  const paddingY = 10;
  const spacing = 50;

  let cursorX = paddingX;
  const cursorY = footerY + paddingY;

  ctx.font = `bold ${textPos.size}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = textColor;

  if (user.email) {
    const emailText = `Email: ${user.email}`;
    ctx.fillText(emailText, cursorX, cursorY);
    cursorX += ctx.measureText(emailText).width + spacing;
  }

  if (user.number) {
    const phoneText = `Phone: ${user.number}`;
    ctx.fillText(phoneText, cursorX, cursorY);
  }

  resolve();
}
      });

      Promise.all([drawLogo, drawFooter]).then(() => {
        if (text) {
          ctx.fillStyle = textColor;
          ctx.font = `${textPos.size}px ${fontFamily}`;
          ctx.fillText(text, +textPos.x, +textPos.y);
        }
      });
    };
  };

  useEffect(() => {
    drawCanvas();
  }, [selectedImage, userLogo, userFooter, logoPos, footerPos, text, textPos, fontFamily, textColor]);

  const handleDownload = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return toast.error("Please log in first");
    if (!user.subscribed) return toast.error("Subscribe to use this feature");

    drawCanvas();
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = 'business-poster.jpg';
      link.href = canvasRef.current.toDataURL('image/jpeg');
      link.click();
      toast.success("Download Completed!");
    }, 400);
  };

  return (
    <div className={`min-h-screen pt-16 pb-20 px-4 md:pt-28 ${mode ? 'bg-blue-100 text-black' : 'bg-slate-900 text-white'}`}>
      <Heading mode={mode} setMode={setMode} />
      <h2 className="text-2xl font-bold text-center py-6 md:text-4xl">Artistic & Abstract </h2>

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="bg-white rounded shadow border max-w-full md:w-[80vw]" />
      </div>

      {/* Text Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 px-4">
        
        <label htmlFor="text">Text</label>
        <input type="text" name='text' placeholder="Enter text" value={text} onChange={(e) => setText(e.target.value)} className="p-2 rounded border md:text-xl" />
        <label htmlFor="fontfamily"> Font-Family</label>
        <select value={fontFamily} name='fontfamily' onChange={(e) => setFontFamily(e.target.value)} className="p-2 border bg-amber-500 rounded md:text-xl">
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Lobster">Lobster</option>
          <option value="Roboto">Roboto</option>
          <option value="Verdana">Verdana</option>
        </select>

        <label htmlFor="size">Text-Size</label>
        <input type="number" name='size' value={textPos.size} onChange={(e) => setTextPos({ ...textPos, size: e.target.value })} placeholder="Font Size" className="p-2 rounded border md:text-xl" />
        <label htmlFor="color">Text-Color</label>
        <input type="color" name='color' value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-full rounded" />
        <label htmlFor="posx">Pos-X</label>
        <input type="number" name='posx' value={textPos.x} onChange={(e) => setTextPos({ ...textPos, x: e.target.value })} placeholder="Text X" className="p-2 rounded border md:text-xl" />
        <label htmlFor="posy">Pos-Y</label>
        <input type="number" name='posy' value={textPos.y} onChange={(e) => setTextPos({ ...textPos, y: e.target.value })} placeholder="Text Y" className="p-2 rounded border md:text-xl" />
      </div>

      {/* Logo/Footer Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 px-4">
        {['x', 'y', 'width', 'height'].map((field) => (
          <React.Fragment key={`logo-${field}`}>
            <label className="text-xl font-semibold">{`Logo ${field}:`}</label>
            <input
              type="number"
              value={logoPos[field]}
              onChange={(e) => setLogoPos({ ...logoPos, [field]: e.target.value })}
              className="p-2 rounded border md:h-[5vh] md:text-xl"
            />
          </React.Fragment>
        ))}
        {['x', 'y', 'width', 'height'].map((field) => (
          <React.Fragment key={`footer-${field}`}>
            <label className="text-xl font-semibold">{`Footer ${field}:`}</label>
            <input
              type="number"
              value={footerPos[field]}
              onChange={(e) => setFooterPos({ ...footerPos, [field]: e.target.value })}
              className="p-2 rounded border md:h-[5vh] md:text-xl"
            />
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 md:text-3xl rounded">
  Download
        </button>
      </div>

      {/* Image Selector */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">Choose a Design</h3>
        {allLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="flex flex-wrap gap-4 pb-6">
            {reqData.map((pic, index) => (
              <div
                key={pic._id || index}
                className="w-[90px] h-[90px] overflow-hidden rounded shadow cursor-pointer"
              >
                <img
                  src={pic.path}
                  alt={pic.productImage || "Poster"}
                  onClick={() => setSelectedImage(pic.path)}
                  className="w-full h-full object-cover rounded hover:opacity-70 transition"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisticAndAbstract;