import React, { useState } from 'react'
import "../Css/QrForm.css";

function QrForm() {
  const [formData, setFormData] = useState({
    link: "",
    borderSize: 4,
    boxSize: 10,
    borderColor: "#000000",
    bgColor: "#ffffff",
    fileFormat: "PNG",
  });

  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formData.link,
          border: formData.borderSize,
          box_size: formData.boxSize,
          fill_color: formData.borderColor,
          back_color: formData.bgColor,
          error_correction: "H",
          file_format : formData.fileFormat,
        }),
      });

      const data = await response.json();
      setQrImage(data.image);
    } catch (error) {
      alert("Could not connect to backend. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='QrForm'>
      <div className='form'>
        <p className='form-title'>QR Generator</p>

         {qrImage && (
          <div className='qr-result'>
            <img src={qrImage} alt="Generated QR Code" />
           <a href={qrImage} download={`qrcode.${formData.fileFormat.toLowerCase()}`}>
                Download QR
            </a>
          </div>
        )}
        <br></br>
        <form onSubmit={handleSubmit}>

          <div className='eachField'>
            <label>Enter Your Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className='eachField'>
            <label>Border Size</label>
            <input
              type="number"
              name="borderSize"
              value={formData.borderSize}
              onChange={handleChange}
              min="0" max="10"
            />
          </div>

          <div className='eachField'>
            <label>Box Size</label>
            <input
              type="number"
              name="boxSize"
              value={formData.boxSize}
              onChange={handleChange}
              min="5" max="20"
            />
          </div>

          <div className='eachField'>
            <label>QR Color</label>
            <input
              type="color"
              name="borderColor"
              value={formData.borderColor}
              onChange={handleChange}
            />
          </div>

          <div className='eachField'>
            <label>Background Color</label>
            <input
              type="color"
              name="bgColor"
              value={formData.bgColor}
              onChange={handleChange}
            />
          </div>

          <div className='eachField'>
            <label>File Format</label>
                <select name="fileFormat" value={formData.fileFormat} onChange={handleChange}>
                    <option value="PNG">PNG</option>
                    <option value="JPEG">JPEG</option>
                    <option value="JPG">JPG</option>
                </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate QR"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default QrForm;