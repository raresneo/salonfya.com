import os
import json
from PIL import Image
import math

def generate_sprite():
    # Read catalog or we can just parse the json from higgsfield-elements.json
    with open('data/higgsfield-elements.json', 'r') as f:
        data = json.load(f)
    
    primary_images = []
    for item in data:
        img_url = item['images'][0]
        img_path = img_url.replace('https://salonfya.com', '')
        import urllib.parse
        local_path = os.path.join('public', urllib.parse.unquote(img_path.lstrip('/')))
        primary_images.append((item['dress'], local_path))
    
    # Create sprite sheet
    cols = 8
    rows = math.ceil(len(primary_images) / cols)
    thumb_w, thumb_h = 250, 350
    
    sprite = Image.new('RGB', (cols * thumb_w, rows * thumb_h), (255, 255, 255))
    
    from PIL import ImageDraw, ImageFont
    draw = ImageDraw.Draw(sprite)
    
    for i, (name, path) in enumerate(primary_images):
        row = i // cols
        col = i % cols
        x = col * thumb_w
        y = row * thumb_h
        
        try:
            img = Image.open(path)
            # resize maintaining aspect ratio and crop center
            img.thumbnail((thumb_w, thumb_h))
            # paste
            sprite.paste(img, (x, y))
            # draw name
            draw.text((x + 10, y + 10), name, fill=(255, 0, 0))
        except Exception as e:
            print(f"Error loading {path}: {e}")
            draw.text((x + 10, y + 10), f"{name} ERROR", fill=(255, 0, 0))
            
    sprite.save('primary_sprite.jpg')
    print("Saved primary_sprite.jpg")

generate_sprite()
