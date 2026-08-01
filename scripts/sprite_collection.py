import os
import json
from PIL import Image
import urllib.parse
import sys

def generate_collection_sprite(collection_name):
    with open('data/higgsfield-elements.json', 'r') as f:
        data = json.load(f)
    
    # filter by collection
    dresses = [d for d in data if d['collection'].lower() == collection_name.lower()]
    
    # rows = number of dresses, cols = max images (usually 4-6)
    rows = len(dresses)
    cols = max(len(d['images']) for d in dresses)
    
    thumb_w, thumb_h = 300, 400
    
    sprite = Image.new('RGB', (cols * thumb_w, rows * thumb_h), (255, 255, 255))
    
    from PIL import ImageDraw, ImageFont
    draw = ImageDraw.Draw(sprite)
    
    for r, dress in enumerate(dresses):
        for c, img_url in enumerate(dress['images']):
            img_path = img_url.replace('https://salonfya.com', '')
            local_path = os.path.join('public', urllib.parse.unquote(img_path.lstrip('/')))
            
            x = c * thumb_w
            y = r * thumb_h
            
            try:
                img = Image.open(local_path)
                img.thumbnail((thumb_w, thumb_h))
                sprite.paste(img, (x, y))
                draw.text((x + 10, y + 10), f"{dress['dress']} [{c}]", fill=(255, 0, 0))
            except Exception as e:
                print(f"Error loading {local_path}: {e}")
                draw.text((x + 10, y + 10), f"ERROR", fill=(255, 0, 0))
                
    out_name = f'sprite_{collection_name}.jpg'
    sprite.save(out_name)
    print(f"Saved {out_name}")

if len(sys.argv) > 1:
    generate_collection_sprite(sys.argv[1])
