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

# Base URL and query parameters with updated specs (width=800, quality=100, jpeg format)
base_image_path = "https://d33mrnwqfel57x.cloudfront.net/images/2008/9/11/"
query_string = "?width=800&quality=100&type=jpeg"

# Generate full image URLs
urls = []
for name in names:
    filename = urllib.parse.quote(name + ".jpg")  # spaces -> %20
    full_url = f"{base_image_path}{filename}{query_string}"
    urls.append((full_url, name.replace(" ", "_") + ".jpeg"))

# Download images
for url, filename in urls:
    filepath = os.path.join(save_dir, filename)
    try:
        response = requests.get(url)
        response.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded SUCCESS: {filename}")
        print(f"URL: {url}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
