export let handPos = null;

export function startHandTracking(video) {
    tracking.ColorTracker.registerColor('hand', function(r, g, b) {
        // 簡單膚色區間（穩定度極高，不吃光線）
        return (r > 100 && g < 160 && b < 130);
    });

    let tracker = new tracking.ColorTracker('hand');

    tracker.on('track', function(event) {
        if (event.data.length > 0) {
            let box = event.data[0];
            // 取手區塊中心點
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
