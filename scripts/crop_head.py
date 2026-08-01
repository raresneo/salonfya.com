import sys
import os
from PIL import Image

def main():
    if len(sys.argv) < 3:
        print("Usage: python crop_head.py <input_path> <output_path>")
        sys.exit(1)
        
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    
    if not os.path.exists(in_path):
        print(f"File not found: {in_path}")
        sys.exit(1)
        
    out_dir = os.path.dirname(out_path)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir)
        
    try:
        img = Image.open(in_path)
        width, height = img.size
        # crop top 25%
        top = int(height * 0.25)
        cropped_img = img.crop((0, top, width, height))
        cropped_img.save(out_path)
        print(f"Cropped: {out_path}")
    except Exception as e:
        print(f"Error processing {in_path}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
