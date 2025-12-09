// ----------------------------------------------------------
// 手部中心點偵測（tracking-min.js powered）
// ----------------------------------------------------------

export let handPos = null;

export function startHandTracking(video) {
    // 註冊「膚色」追蹤（簡單穩定）
    tracking.ColorTracker.registerColor('hand', function(r, g, b) {
        return (r > 100 && g < 160 && b < 140);
    });

    const tracker = new tracking.ColorTracker(['hand']);

    tracker.on('track', function(event) {
        if (event.data.length > 0) {
            const box = event.data[0];

            // 取手中心點
            handPos = {
                x: box.x + box.width / 2,
                y: box.y + box.height / 2
            };
        } else {
            handPos = null;
        }
    });

    tracking.track(video, tracker, { camera: true });
}
