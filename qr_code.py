import qrcode
import qrcode as qr
from PIL import Image # helps to format generated QR

qrObj = qr.QRCode(version=1,error_correction=qr.constants.ERROR_CORRECT_H,
                  box_size=10,border=5)

qrObj.add_data("https://www.tutedude.com/")
qrObj.make(fit=True)
img = qrObj.make_image(fill_color="red", back_color="yellow")
img.save("newResult.png")

# img = qr.make("https://www.tutedude.com/")
# img.save("result.png")