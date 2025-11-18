# Script to download gallery photos from Unsplash and save them locally
# This is a backup in case you want to switch from using Unsplash URLs to local files

import urllib.request
import os

# Create the gallery folder if it doesn't exist
os.makedirs('images/gallery', exist_ok=True)

# List of photo URLs from gallery2.js
photos = [
    "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1647806422508-0322f33e270b?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1557246565-8a3d3ab5d7f6?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=800&fit=crop"
]

# Download each photo
for i, url in enumerate(photos, 1):
    filename = f'images/gallery/photo_{i}.jpg'
    print(f'Downloading photo {i}/8...')
    urllib.request.urlretrieve(url, filename)
    print(f'Saved: {filename}')

print('\n✓ All photos downloaded successfully!')
print('To use local photos, update the src paths in js/gallery2.js')
