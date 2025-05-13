import requests
import os
import urllib.parse

# List of player names
names = [
    "Jackie Bates",
    "James Butts",
    "Reggie Dixon",
    "TJ Mitchell",
    "Dyrri McCain",
    "Chris Smith",
    "Sam Pope",
    "Jerry Cummings",
    "Pat Preston",
    "Jacobi Fenner",
    "Herbert Bynes",
    "Tyler Bailey",
    "Daniel Brooks",
    "Kevin Teel",
    "Vaughn Mansfield",
    "Devan Jarett",
    "Jeremy Gilchrist",
    "Gerard Griffin",
    "Kevin Beverly",
    "Dennis Mathis",
    "Henti Baird",
    "Jonathan Wade",
    "Rasoul Wilson",
    "Van Morgan",
    "Christopher Cills",
    "Jahmal Blanchard",
    "Tobin Lyon",
    "Darius Mullen",
    "Qutrell Payton",
    "Donnell Babb",
    "Ralph Steward",
    "Carlo Turavani",
    "Kendrick Cooper",
    "Chris Willis",
    "Donell Gaines",
    "Franklin Frazier",
    "Demarco Worthey",
    "Demarius Sapp",
    "Namon Freeman",
    "Darrell Harris",
    "Wakeem Goode",
    "Michael Swett",
    "Maurice Riley",
    "Carson Byrd",
    "Justin Hairston",
    "Jimari Jones",
    "Nicholas Royal",
    "Justin Holland",
    "Glenn Burroughs",
    "Charles Robinson",
    "Darius Johnson",
    "Drefus Lane",
    "Kingsley Wiafe",
    "Michael Ola",
    "Avery Hill",
    "Henry Porche",
    "Dennis Conley",
    "Devan Johnson",
    "Deandre Herrings",
    "Justin Gary",
    "Nathaniel Hood",
    "Akeem Lamar",
    "Jobie Dowling",
    "Troy Clegg",
    "Everett Hopkins",
    "Trey Fowlkes",
    "Adam Herald",
    "Michael Thompson",
    "Ryan Cave",
    "Kyle Lloyd",
    "Justin Brown",
    "Isaiah Thomas",
    "Trey Scales",
    "Steven Cotton",
    "Marcus Wiggs",
    "Ernie Lomax",
    "Bryan Smith",
    "Xavier Warren",
    "Kevin Burke",
    "Andrew Creary",
    "Marcus Dixon",
    "Charles Young",
    "Desmond Stewart",
    "Vernon Bryant",
    "Kendall Langford",
    "Donnell Sands"
]


# Directory to save images
save_dir = "/Users/carlostmayers/whichhucom/public/hampton images"
os.makedirs(save_dir, exist_ok=True)

# Base URLs
base_image_path = "https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/hamptonpirates.com/images/2008/8/26/"
resize_base = "https://images.sidearmdev.com/resize"

# Generate full image URLs
urls = []
for name in names:
    filename_encoded = name.replace(" ", "%20") + ".jpg"
    raw_url = base_image_path + filename_encoded
    encoded_url = urllib.parse.quote(raw_url, safe="")
    full_url = f"{resize_base}?url={encoded_url}&width=800&type=jpeg&quality=100"
    urls.append((full_url, name.replace(" ", "_") + ".jpeg"))

# Download images
for url, filename in urls:
    filepath = os.path.join(save_dir, filename)
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {filename}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
