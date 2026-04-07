from PIL import Image, ImageStat
import os

img = Image.open('src/assets/Gemini_Generated_Image_f1h650f1h650f1h6.png').convert('RGB')
W, H = img.size

# Detect horizontal boundaries (rows)
row_boundaries = [0]
for y in range(1, H-1):
    # Calculate variance between rows to find horizontal lines
    # (Simplified: check if there's a significant change in average color)
    pass 

# Actually, looking at the image provided by user, the rows seem equal height.
# The issue is the COLUMN widths. 
# Let's try to detect column boundaries for each row.

def find_boundaries(img_row, num_expected):
    # Detect sharp vertical changes in the middle region of the row
    w, h = img_row.size
    boundaries = [0]
    # We could do complex edge detection, but let's try to refine the math 
    # and maybe the count was slightly off or there's a small border.
    for i in range(1, num_expected):
        boundaries.append(int(i * w / num_expected))
    boundaries.append(w)
    return boundaries

# Wait, if 4, 7, 6, 4 is split, maybe it's 4, 6, 7, 4? Or something else.
# Let's count by looking at the image content.
# Row 1: 4
# Row 2: 7 (Swat, Naran, Kumrat, Badshahi, Minar, Murree, Salt Mine) - YES.
# Row 3: 6 (Mohenjo, Gorakh, Karachi, Gwadar, Hingol, Quetta) - YES.
# Row 4: 4 (Neelum, Arang Kel, Faisal, Margalla) - YES.

# THE SPLIT IS IN ROW 2.
# Badshahi Mosque (index 3 of Row 2) shows [forest] | [mosque].
# This means the boundary between Kumrat (index 2) and Badshahi (index 3) 
# is actually to the RIGHT of where I put it.
# This implies index 0, 1, 2 took more than 3/7th of the width?
# No, if I see the forest on the left of Badshahi card, it means MyBadshahiCropStart < RealBadshahiStart.
# So RealBadshahiStart is further right.
# This happens if the first 3 images (Swat, Naran, Kumrat) are WIDER than avg?
# Or maybe there's a 1-pixel border?

# Actually, I'll try to divide Row 2 and Row 3 with a small offset or detect edges.

import numpy as np

def detect_vertical_edges(image_row, count):
    # Convert to grayscale
    gray = image_row.convert('L')
    data = np.array(gray)
    h, w = data.shape
    # Calculate vertical gradient
    diff = np.abs(data[:, 1:] - data[:, :-1])
    col_diff = np.mean(diff, axis=0) # Average change per column
    
    # We expect 'count-1' major spikes around i * w / count
    # Let's find the maximum spike in a window around the expected boundary
    boundaries = [0]
    segment_w = w / count
    for i in range(1, count):
        expected = int(i * segment_w)
        window = 20 # Search +/- 20 pixels
        local_max_idx = np.argmax(col_diff[expected-window : expected+window]) + (expected-window)
        boundaries.append(local_max_idx)
    boundaries.append(w)
    return boundaries

# Re-run cropping with edge detection
os.makedirs('src/assets/generated', exist_ok=True)
row_h = H // 4

counts = [4, 7, 6, 4]
slugs = [
    'hunza-valley', 'skardu', 'attabad-lake', 'deosai-plains',
    'swat-valley', 'naran-kaghan', 'kumrat-valley', 'badshahi-mosque', 'minar-e-pakistan', 'murree-hills', 'khewra-salt-mine',
    'mohenjo-daro', 'gorakh-hill', 'karachi-beach', 'gwadar-port', 'hingol-park', 'quuetta-ziarat',
    'neelum-valley', 'arang-kel', 'faisal-mosque', 'margalla-hills'
]

idx = 0
for r, count in enumerate(counts):
    top = r * row_h
    bottom = (r + 1) * row_h
    row_img = img.crop((0, top, W, bottom))
    
    # Detect edges for this row
    try:
        boundaries = detect_vertical_edges(row_img, count)
    except:
        # Fallback to equal math if failure
        boundaries = [int(i * W / count) for i in range(count + 1)]
    
    for c in range(count):
        left = boundaries[c]
        right = boundaries[c+1]
        img.crop((left, top, right, bottom)).save(f'src/assets/generated/{slugs[idx]}.jpg', 'JPEG', quality=95)
        idx += 1

print("ACCURATE_CROPPING_DONE")
