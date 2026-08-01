import { notes } from './dress_notes';

for (const [name, data] of Object.entries(notes)) {
    const frontIndex = data.notes.findIndex(n => n.includes('front full view') || n.includes('front half view') || n.includes('front'));
    if (frontIndex > 0) {
        console.log(`Dress ${name} has front view at index ${frontIndex}: ${data.notes[frontIndex]}`);
    } else if (frontIndex === -1) {
        console.log(`Dress ${name} has NO front view!`);
    }
}
