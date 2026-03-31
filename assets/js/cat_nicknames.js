var FIRST_WORDS = {
    'baby': [],
    'blob': ['by'],
    'butt': [],
    'chancellor ': [],
    'chub': ['by'],
    'chunk': ['y'],
    'chonkapottamus': [],
    'doctor ': [],
    'fluffy': [],
    'friend': ['ly', 'o'],
    'fuzz': [],
    'mister ': [],
    'muffin': [],
    'nugg': ['ie'],
    'pig': ['let', 'gie'],
    'potato': [],
    'president ': [],
    'purr': [],
    'shit': ['tle'],
    'sir ': [],
    'sweet': [],
    'the honorable ': [],
    'tub': ['bie'],
    'turd': ['le'],
    'turtle': [],
    'vom': ['mie'],
    'whisker': []
};

var SECOND_WORDS = [
    'brain', 'bucket', 'bun', 'butt', 'cat', 'cheeks', 'face',
    ' gremlin', 'head', 'hole', 'kin', 'man', 'monster', 'nug',
    'nugget', 'paws', ' rex', ' turkey'
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generate() {
    var keys = Object.keys(FIRST_WORDS);
    var word = pick(keys);
    var suffixes = FIRST_WORDS[word];

    if (suffixes.length > 0 && Math.random() < 0.5) {
        word += pick(suffixes);
    }

    if (Math.random() < 8 / 9) {
        word += pick(SECOND_WORDS);
    }

    document.getElementById('nickname').textContent = word;
    window.location.hash = btoa(word);
}

function loadFromHash() {
    var hash = window.location.hash.slice(1);
    if (!hash) return false;
    try {
        var word = atob(hash);
        document.getElementById('nickname').textContent = word;
        return true;
    } catch (e) {
        return false;
    }
}

if (!loadFromHash()) generate();
