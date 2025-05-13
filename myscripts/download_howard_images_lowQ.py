import requests
import os
import re

# List of original image URLs
original_urls = [
    "http://hubison.com/images/2014/8/8/Tyson_Rodney.JPG",
    "http://hubison.com/images/2014/8/8/Colvin_Matthew.JPG",
    "http://hubison.com/images/2014/8/8/Parker_William.JPG",
    "http://hubison.com/images/2014/8/8/Johnson_Da_Vaun.JPG",
    "http://hubison.com/images/2014/8/8/Aiyegoro_Richard.JPG",
    "http://hubison.com/images/2014/8/8/Brown_Tavius.JPG",
    "http://hubison.com/images/2014/8/8/McGhee_Greg.JPG",
    "http://hubison.com/images/2014/8/8/Alston_Cameron.JPG",
    "http://hubison.com/images/2014/8/8/Blair_Julian.JPG",
    "http://hubison.com/images/2014/8/8/Cunningham_Jamie.JPG",
    "http://hubison.com/images/2014/8/8/Offor_Godspower.JPG",
    "http://hubison.com/images/2014/8/8/Grimes_Odis.JPG",
    "http://hubison.com/images/2014/8/8/Johnson_Kalen.JPG",
    "http://hubison.com/images/2014/8/8/Hartman_Stewart.JPG",
    "http://hubison.com/images/2014/8/8/Matthews_Atavius.JPG",
    "http://hubison.com/images/2014/8/8/Freeman_Aquanius.JPG",
    "http://hubison.com/images/2014/8/8/Dunn_Alonte.JPG",
    "http://hubison.com/images/2014/8/8/Antoine_Tamlin.JPG",
    "http://hubison.com/images/2014/8/8/Thiel_David.JPG",
    "http://hubison.com/images/2014/8/8/David_Julien.JPG",
    "http://hubison.com/images/2014/8/8/Lassiter_LeLand.JPG",
    "http://hubison.com/images/2014/8/8/Ezell_Jabril.JPG",
    "http://hubison.com/images/2014/8/8/Tusan_Terrance.JPG",
    "http://hubison.com/images/2014/8/8/Russ_Kenneth.JPG",
    "http://hubison.com/images/2014/8/8/Banks_Yoseff.JPG",
    "http://hubison.com/images/2014/8/8/Robinson_Alizah.JPG",
    "http://hubison.com/images/2014/8/8/Price_DeAndre.JPG",
    "http://hubison.com/images/2014/8/8/Branton_Casey.JPG",
    "http://hubison.com/images/2014/8/8/Brown_Khari.JPG",
    "http://hubison.com/images/2014/8/8/Robinson_Charles.JPG",
    "http://hubison.com/images/2014/8/8/Fleck_John.JPG",
    "http://hubison.com/images/2014/8/8/Hunt_Travon.JPG",
    "http://hubison.com/images/2014/8/8/Johnson_Craig.JPG",
    "http://hubison.com/images/2014/8/8/Rollins_Devin.JPG",
    "http://hubison.com/images/2014/8/8/Day_Jalen.JPG",
    "http://hubison.com/images/2014/8/8/Stevens_Julio.JPG",
    "http://hubison.com/images/2014/8/8/Kindle_Parrish_Caleb.JPG",
    "http://hubison.com/images/2014/8/8/Boozer_Tommie.JPG",
    "http://hubison.com/images/2014/8/8/Alkins_Chris.JPG",
    "http://hubison.com/images/2014/8/8/Bennett_Jacob.JPG",
    "http://hubison.com/images/2014/8/8/Mills_Zachary.JPG",
    "http://hubison.com/images/2014/8/8/Orr_Austin.JPG",
    "http://hubison.com/images/2014/8/8/Brown_Travis.JPG",
    "http://hubison.com/images/2014/9/12/MB.png",
    "http://hubison.com/images/2014/8/8/Pittman_Eric.JPG",
    "http://hubison.com/images/2014/8/8/Smith_John.JPG",
    "http://hubison.com/images/2014/8/8/Reid_Devyn.JPG",
    "http://hubison.com/images/2014/8/8/Parker_Matthew.JPG",
    "http://hubison.com/images/2014/8/8/Kebe_Ibrahima.JPG",
    "http://hubison.com/images/2014/8/8/Lee_David.JPG",
    "http://hubison.com/images/2014/8/8/Boyd_Toree.JPG",
    "http://hubison.com/images/2014/8/8/Anglin_Elijah.JPG",
    "http://hubison.com/images/2014/8/8/Powers_Gregory.JPG",
    "http://hubison.com/images/2014/8/8/Hogan_Lance.JPG",
    "http://hubison.com/images/2014/8/8/Wright_Gerald.JPG",
    "http://hubison.com/images/2014/8/8/Kendricks_Shaka.JPG",
    "http://hubison.com/images/2014/8/8/Lewis_Nathan.JPG",
    "http://hubison.com/images/2014/8/8/Reyes_Janer.JPG",
    "http://hubison.com/images/2014/8/8/Dunham_Jordan.JPG",
    "http://hubison.com/images/2014/8/8/Shadrach_Tyler.JPG",
    "http://hubison.com/images/2014/8/8/Lebofsky_Dakota.JPG",
    "http://hubison.com/images/2014/8/8/Rutledge_Malcolm.JPG",
    "http://hubison.com/images/2014/8/8/Holman_James.JPG",
    "http://hubison.com/images/2014/8/8/Allen_Wright_Deonta.JPG",
    "http://hubison.com/images/2014/8/8/Mercer_Robert.JPG",
    "http://hubison.com/images/2014/8/8/Iyere_Patrick.JPG",
    "http://hubison.com/images/2014/8/8/Payne_Andre.JPG",
    "http://hubison.com/images/2014/8/8/Hall_Raymond.JPG",
    "http://hubison.com/images/2014/8/8/Harris_Marvin.JPG",
    "http://hubison.com/images/2014/8/8/Chaney_Justin.JPG",
    "http://hubison.com/images/2014/8/8/Williams_Myles.JPG",
    "http://hubison.com/images/2014/8/8/Warren_Howard.JPG",
    "http://hubison.com/images/2014/8/8/Williams_Cody.JPG",
    "http://hubison.com/images/2014/8/8/Iduwe_Ghanfona.JPG",
    "http://hubison.com/images/2014/8/8/Johnson_Richard.JPG",
    "http://hubison.com/images/2014/8/8/Gresham_Chisolm_Damon.JPG",
    "http://hubison.com/images/2014/8/8/Haugabook_Trae.JPG",
    "http://hubison.com/images/2014/8/8/Dillard_Joseph.JPG"
]

# Create new URLs using the new pattern
urls = []
for original_url in original_urls:
    # Extract the filename from the original URL
    filename = os.path.basename(original_url)
    
    # Special case for MB.png which has a different path
    if filename == "MB.png":
        # Keep the original path structure but use the new domain pattern
        new_url = f"https://images.sidearmdev.com/resize?url=https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/howard-bison.com/images/2014/9/12/MB.png&width=200&type=jpeg&quality=100"
    else:
        # Use the new URL pattern for JPG files
        new_url = f"https://images.sidearmdev.com/resize?url=https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/howard-bison.com/images/2014/8/8/{filename}&width=200&type=jpeg&quality=100"
    
    urls.append(new_url)

save_dir = "/Users/carlostmayers/Documents/Help/whichhucom/public/low quality images for howard"


# Create the folder if it doesn't exist
os.makedirs(save_dir, exist_ok=True)

# Download each image
for i, url in enumerate(urls):
    # Extract the filename from the original URL to use as the saved filename
    original_filename = os.path.basename(original_urls[i])
    filepath = os.path.join(save_dir, original_filename)

    try:
        print(f"Downloading from: {url}")
        response = requests.get(url)
        response.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {original_filename}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
