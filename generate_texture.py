from PIL import Image, ImageDraw

def create_grass_texture(size=256):
    # Crear imagen
    image = Image.new('RGB', (size, size), color='green')
    draw = ImageDraw.Draw(image)
    
    # Dibujar líneas de tierra
    for y in range(size-50, size, 10):
        draw.line([(0, y), (size, y)], fill='darkgreen', width=2)
    
    # Guardar imagen
    image.save('/home/daniel/minecraft_clone-web/assets/textures/grass.png')
    print("Textura de césped generada")

if __name__ == '__main__':
    create_grass_texture()
