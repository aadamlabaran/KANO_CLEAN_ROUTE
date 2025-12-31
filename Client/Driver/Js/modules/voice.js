export function initVoice(callbacks) {
    if (!('webkitSpeechRecognition' in window)) {
        console.log("Voice not supported");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Voice Command:', command);
        
        if (command.includes('complete') || command.includes('done')) {
            callbacks.onComplete();
        } else if (command.includes('navigate') || command.includes('map')) {
            callbacks.onNavigate();
        }
    };

    return recognition;
}