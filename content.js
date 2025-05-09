(() => {
    const runScript = async () => {
        // Wait for the terminal to be available
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find the VSCode terminal textarea element
        let terminal = document.querySelector('.xterm-helper-textarea');

        if (terminal) {
            // Focus on the terminal
            terminal.focus();

            const pressKey = (key, code, keyCode) => {
                const event = new KeyboardEvent('keydown', {
                    key: key,
                    code: code,
                    keyCode: keyCode,
                    which: keyCode,
                    bubbles: true
                });
                terminal.dispatchEvent(event);
                console.log(`Pressed: ${key}`);
            };

            // Press "l"
            pressKey('l', 'KeyL', 76);
            await new Promise(resolve => setTimeout(resolve, 500));

            // Press "s"
            pressKey('s', 'KeyS', 83);
            await new Promise(resolve => setTimeout(resolve, 500));

            // Press "Enter"
            pressKey('Enter', 'Enter', 13);
        } else {
            console.error("Terminal not found. Make sure you're in GitHub Codespaces.");
        }
    };

// Run the script every 5 sec
 setInterval(runScript, 5000);
})();
