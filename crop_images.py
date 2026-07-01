import os
from PIL import Image

# Configurazione cartelle
INPUT_FOLDER = "public/cards"
OUTPUT_FOLDER = "public/cards_cropped"

# Quanto tagliare dal basso? 
# 0.18 significa tagliare via il 18% inferiore dell'immagine. 
# Modifica questo valore se il taglio risulta troppo o troppo poco.
CROP_PERCENTAGE = 0.18 

def crop_images():
    # Crea la cartella di output se non esiste
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

    # Cerca tutte le immagini nella cartella
    valid_extensions = ('.png', '.jpg', '.jpeg')
    files = [f for f in os.listdir(INPUT_FOLDER) if f.lower().endswith(valid_extensions)]

    if not files:
        print(f"Nessuna immagine trovata in '{INPUT_FOLDER}'.")
        return

    print(f"Trovate {len(files)} immagini. Inizio il taglio...")

    for filename in files:
        input_path = os.path.join(INPUT_FOLDER, filename)
        output_path = os.path.join(OUTPUT_FOLDER, filename)

        try:
            with Image.open(input_path) as img:
                width, height = img.size
                
                # Calcola i pixel da tagliare dal basso
                pixels_to_cut = int(height * CROP_PERCENTAGE)
                
                # Definizione dell'area da mantenere (left, top, right, bottom)
                crop_box = (0, 0, width, height - pixels_to_cut)
                
                # Ritaglia e salva
                cropped_img = img.crop(crop_box)
                cropped_img.save(output_path)
                
                print(f"✅ Tagliata: {filename}")
                
        except Exception as e:
            print(f"❌ Errore con {filename}: {e}")

    print(f"\nFinito! Le tue {len(files)} carte pulite sono in '{OUTPUT_FOLDER}'.")

if __name__ == "__main__":
    crop_images()