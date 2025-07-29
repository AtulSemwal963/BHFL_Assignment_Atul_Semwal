const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const ATUL_INFO = {
    user_id: 'atul_semwal_06092003',
    email: 'atul1113.be22@chitkarauniversity.edu.in',
    roll_number: '2211981113'
};


function processData(data) {
    const result = {
        is_success: true,
        ...ATUL_INFO,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: '0',
        concat_string: ''
    };

    const alphabetStrings = [];
    let numericSum = 0;

    data.forEach(item => {
        const str = String(item).trim();
        
        if (isNumeric(str)) {
            processNumber(str, result, (num) => {
                numericSum += num;
                return num % 2 === 0 
                    ? result.even_numbers.push(str) 
                    : result.odd_numbers.push(str);
            });
        } 
        else if (isAlphabetic(str)) {
            processAlphabet(str, result, alphabetStrings);
        }
        else if (isSpecialCharacter(str)) {
            result.special_characters.push(str);
        }
    });

    result.sum = numericSum.toString();
    result.concat_string = createConcatString(alphabetStrings);
    
    return result;
}

function isNumeric(str) {

    if (str.length === 0) return false;
    

    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode < 48 || charCode > 57) { // ASCII codes for 0-9
            return false;
        }
    }
    return true;
}

function isAlphabetic(str) {
    if (str.length === 0) return false;
    
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (!(
            (charCode >= 65 && charCode <= 90) ||  // A-Z
            (charCode >= 97 && charCode <= 122)    // a-z
        )) {
            return false;
        }
    }
    return true;
}

function isSpecialCharacter(str) {
   
    if (str.length !== 1) return false;
    
    const charCode = str.charCodeAt(0);
    
    return !(
        (charCode >= 48 && charCode <= 57) ||  // 0-9
        (charCode >= 65 && charCode <= 90) ||  // A-Z
        (charCode >= 97 && charCode <= 122) || // a-z
        charCode === 32                        // space
    );
}

function processNumber(str, result, callback) {
    const num = parseInt(str, 10);
    return callback(num);
}

function processAlphabet(str, result, alphabetStrings) {
    const upperStr = str.toUpperCase();
    result.alphabets.push(upperStr);
    alphabetStrings.push(str);
}

function createConcatString(alphabetStrings) {
    return alphabetStrings
        .join('')
        .split('')
        .reverse()
        .join('')
        .toUpperCase();
}


app.use(bodyParser.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.send("Thanks for considering my application.\nAssigment submitted by- Atul Semwal.")
})

app.post('/bhfl', (req, res) => {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({
            is_success: false,
            error: 'Invalid input: data must be an array'
        });
    }

    try {
        const result = processData(data);
        res.json(result);
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({
            is_success: false,
            error: 'Internal server error'
        });
    }
});


app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});

module.exports = app;