from flask import Flask,request,jsonify
import qrcode as qr
import base64
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app) #allows React to talk to Flask

@app.route('/')
def home():
    return "Backend is running!"

@app.route('/api/generate',methods=['POST'])
def generate_qr():
    data = request.json      #getting json sent from React
    link = data.get('url','')
    fillColor = data.get('fill_color','black')
    backColor = data.get('back_color','white')
    boxSize = int(data.get('box_size', 10))
    borderSize = int(data.get('border', 4))
    file_format = data.get('file_format', 'PNG')

    qrObj = qr.QRCode(version=1,error_correction=qr.constants.ERROR_CORRECT_H,
                  box_size=boxSize,border=borderSize)

    qrObj.add_data(link)
    qrObj.make(fit=True)
    img = qrObj.make_image(fill_color=fillColor, back_color=backColor)
    
    buffer = io.BytesIO() #Create virtual file in RAM intstead of saving to disk
    img.save(buffer,format=file_format) #saves the OR image into that memory contatiner
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    #buffer.getvalue() — reads all the image bytes from the buffer
    #base64.b64encode(...) — converts those bytes into a base64 string (text format)
    #.decode('utf-8') — converts bytes to a normal Python string

    return jsonify({'image': f'data:image/{file_format.lower()};base64,{img_base64}'})
    

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=10000)