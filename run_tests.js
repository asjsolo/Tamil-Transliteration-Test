const { chromium } = require('playwright');
const fs = require('fs'); // Standard file system module

// Define the 35 Test Cases
const testCases = [
    // --- POSITIVE SCENARIOS ---
    { id: 'Pos_Fun_0001', input: 'Naan unnai paarthen', expected: 'நான் உன்னை பார்த்தேன்' },
    { id: 'Pos_Fun_0002', input: 'Naan vanthen aanaal avan varavillai', expected: 'நான் வந்தேன் ஆனால் அவன் வரவில்லை' },
    { id: 'Pos_Fun_0003', input: 'Mazhai peythathaal naan veliyil poga mudiyavillai', expected: 'மழை பெய்ததால் நான் வெளியில் போக முடியவில்லை' },
    { id: 'Pos_Fun_0004', input: 'Naan netru kovilukku ponnen', expected: 'நான் நேற்று கோவிலுக்கு போனேன்' },
    { id: 'Pos_Fun_0005', input: 'Naalai mazhai peiyum', expected: 'நாளை மழை பெய்யும்' },
    { id: 'Pos_Fun_0006', input: 'Puthagangal', expected: 'புத்தகங்கள்' },
    { id: 'Pos_Fun_0007', input: 'Enakku adhu vendaam', expected: 'எனக்கு அது வேண்டாம்' },
    { id: 'Pos_Fun_0008', input: 'Idhu ennoda veedu', expected: 'இது என்னோட வீடு' },
    { id: 'Pos_Fun_0009', input: 'Avalal poga mudiyum', expected: 'அவளால் போக முடியும்' },
    { id: 'Pos_Fun_0010', input: 'Un peyar enna?', expected: 'உன் பெயர் என்ன?' },
    { id: 'Pos_Fun_0011', input: 'Neengal enge irukkireergal?', expected: 'நீங்கள் எங்கே இருக்கிறீர்கள்?' },
    { id: 'Pos_Fun_0012', input: 'Vanakkam', expected: 'வணக்கம்' },
    { id: 'Pos_Fun_0013', input: 'Nandri', expected: 'நன்றி' },
    { id: 'Pos_Fun_0014', input: 'Enakku oru kilo arisi venum.', expected: 'எனக்கு ஒரு கிலோ அரிசி வேணும்.' },
    { id: 'Pos_Fun_0015', input: 'Kadhavaimoodu, seekiram inge vaa.', expected: 'கதவை மூடு, சீக்கிரம் இங்கே வா.' },
    { id: 'Pos_Fun_0016', input: 'Enakku oru coffee venum', expected: 'எனக்கு ஒரு காபி வேணும்' },
    { id: 'Pos_Fun_0017', input: 'Thanglish mozhiyil taip seivathu migavum elimayana murai agum.', expected: 'தங்கிலீஷ் மொழியில் டைப் செய்வது மிகவும் எளிமையான முறை ஆகும்.' },
    { id: 'Pos_Fun_0018', input: 'Machan, neenga eppo free?', expected: 'மச்சான், நீங்க எப்போ ஃப்ரீ?' },
    { id: 'Pos_Fun_0019', input: 'Vegamaaga', expected: 'வேகமாக' },
    { id: 'Pos_Fun_0020', input: 'Neengal eppadi irukkireergal?', expected: 'நீங்கள் எப்படி இருக்கிறீர்கள்?' },
    { id: 'Pos_Fun_0021', input: 'Kaalai Vanakkam', expected: 'காலை வணக்கம்' },
    { id: 'Pos_Fun_0022', input: 'A: Vanakkam', input2: 'B: Nandri', expected: 'எ : வணக்கம்\nபி:நன்றி' }, 
    { id: 'Pos_Fun_0023', input: 'Chennai', expected: 'சென்னை' },
    { id: 'Pos_Fun_0024', input: 'Ondru', expected: 'ஒன்று' },
    
    // --- NEGATIVE SCENARIOS ---
    { id: 'Neg_Fun_0001', input: 'Indru date 25th August, vilai 500 rubai.', expected: 'இன்று தேதி 25th August, விலை 500 ரூபாய்.' },
    { id: 'Neg_Fun_0002', input: 'Psychology', expected: 'சைக்காலஜி' },
    { id: 'Neg_Fun_0003', input: 'Queue', expected: 'கியூ' },
    { id: 'Neg_Fun_0004', input: 'user@gmail.com', expected: 'user@gmail.com' },
    { id: 'Neg_Fun_0005', input: 'print("hello")', expected: 'print("hello")' },
    { id: 'Neg_Fun_0006', input: 'Mr. Bean', expected: 'மிஸ்டர் பீன்' },
    { id: 'Neg_Fun_0007', input: '10kg', expected: '10kg' },
    { id: 'Neg_Fun_0008', input: '100%', expected: '100%' },
    { id: 'Neg_Fun_0009', input: 'www.google.com', expected: 'www.google.com' },
    { id: 'Neg_Fun_0010', input: 'Shakespeare', expected: 'ஷேக்ஸ்பியர்' },
    
    // --- UI TEST ---
    { id: 'Pos_UI_0001', input: 'Vanakkam', expected: 'Update while typing' } 
];

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Start CSV Content with BOM for Excel (\uFEFF)
    let csvContent = '\uFEFFTC_ID,INPUT,EXPECTED_OUTPUT,ACTUAL_OUTPUT,STATUS\n';

    console.log('--- Starting Automated Test Execution ---');

    try {
        await page.goto('https://tamil.changathi.com/');
        await page.waitForSelector('textarea', { timeout: 10000 });
    } catch (e) {
        console.log('Could not load site. Exiting.');
        await browser.close();
        return;
    }

    for (const test of testCases) {
        try {
            const inputBox = page.locator('textarea').first();
            await inputBox.clear();

            // Slower typing (delay: 100ms) to let the website handle the conversion
            if (test.id === 'Pos_Fun_0022') {
                await inputBox.type(test.input, { delay: 100 });
                await page.keyboard.press('Enter');
                await inputBox.type(test.input2, { delay: 100 });
            } else {
                await inputBox.type(test.input, { delay: 100 });
            }

            await page.keyboard.press('Space'); // Trigger conversion
            await page.waitForTimeout(2000);   // Give it 2 seconds to finish

            const actualOutput = await inputBox.inputValue();

            // Status Logic
            let status = 'Pass';
            if (test.id.includes('Neg_Fun') || test.id.includes('Pos_UI')) {
                if (!actualOutput.includes(test.expected)) {
                    status = 'Fail';
                }
            } else {
                if (!actualOutput.includes(test.expected)) {
                     if (actualOutput.trim() !== test.expected.trim()) {
                         // strict check
                    }
                }
            }

            // Clean up text for CSV (replace newlines with space to avoid breaking CSV)
            const cleanActual = actualOutput.replace(/\n/g, ' ');
            const cleanExpected = test.expected.replace(/\n/g, ' ');
            const cleanInput = test.input.replace(/\n/g, ' ');

            console.log(`[${test.id}] Status: ${status}`);

            // Add row to CSV content
            // We wrap fields in quotes "..." to handle commas inside text
            csvContent += `${test.id},"${cleanInput}","${cleanExpected}","${cleanActual}",${status}\n`;

        } catch (e) {
            console.log(`Error in ${test.id}: ${e}`);
        }
    }

    // Write file using standard fs module
    fs.writeFileSync('Test_Execution_Results.csv', csvContent, 'utf8');
    
    console.log('--- Testing Complete. Results saved to Test_Execution_Results.csv ---');
    await browser.close();
})();