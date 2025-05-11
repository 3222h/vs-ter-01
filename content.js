(() => {
    let terminal = null;
    let isSecondRunning = false;
    let isFirstRunning = false;

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    const pressKey = async (key, code, keyCode) => {
        if (!terminal) return;
        const event = new KeyboardEvent('keydown', {
            key,
            code,
            keyCode,
            which: keyCode,
            bubbles: true
        });

        terminal.dispatchEvent(event);
        await wait(1000);
    };

    const runFirstCommand = async () => {
        if (isSecondRunning || isFirstRunning || !terminal) return;

        isFirstRunning = true;
        terminal.focus();

        await pressKey('l', 'KeyL', 76);
        await pressKey('s', 'KeyS', 83);
        await pressKey('Enter', 'Enter', 13);

        isFirstRunning = false;
    };

    const runSecondCommand = async () => {
        if (!terminal) return;

        // Wait until not busy
        while (isFirstRunning || isSecondRunning) {
            await wait(500);
        }

        isSecondRunning = true;
        terminal.focus();

        try {
            await navigator.clipboard.writeText('bash t');

            const pasteEvent = new KeyboardEvent('keydown', {
                key: 'v',
                code: 'KeyV',
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true
            });
            terminal.dispatchEvent(pasteEvent);

            await pressKey('Enter', 'Enter', 13);
        } catch (err) {
            console.error('Clipboard error:', err);
        }

        isSecondRunning = false;
    };

    const init = async () => {
        // Wait for terminal to be ready
        while (!terminal) {
            terminal = document.querySelector('.xterm-helper-textarea');
            if (!terminal) {
                console.log("Waiting for terminal...");
                await wait(1000);
            }
        }

        // First command every 5 seconds
        setInterval(() => {
            runFirstCommand();
        }, 5000);

        // Second command every 30 seconds
        setInterval(() => {
            runSecondCommand();
        }, 30000);
    };

    init();
})();
