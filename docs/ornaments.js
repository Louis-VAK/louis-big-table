// ornaments.js
export async function createOrnaments(canvas) {
    const ctx = canvas.getContext("2d");

    const imgPaths = [
        "./assets/img1.png",
        "./assets/img2.png",
        "./assets/img3.png",
        "./assets/img4.png",
        "./assets/img5.png",
        "./assets/img6.png"
    ];

    const images = await Promise.all(
        imgPaths.map(src => loadImage(src))
    );

    const ornaments = images.map((img, i) => {
        return {
            img,
            x: canvas.width / 2 + Math.cos(i) * 200,
            y: canvas.height / 2 + Math.sin(i) * 200,
            size: 120,
            baseSize: 120
        };
    });

    return ornaments;
}

export function updateOrnaments(ctx, ornaments, handPos) {
    ornaments.forEach(o => {
        let scale = 1;

        if (handPos) {
            const dx = o.x - handPos.x;
            const dy = o.y - handPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) scale = 1.5;
        }

        const finalSize = o.baseSize * scale;
        ctx.drawImage(o.img, o.x - finalSize / 2, o.y - finalSize / 2, finalSize, finalSize);
    });
}

function loadImage(src) {
    return new Promise(res => {
        const img = new Image();
        img.onload = () => res(img);
        img.src = src;
    });
}
