var ROLES = [
    ['unstoppable force', 'immovable object'],
    ['manly muppet', 'muppet man'],
    ['Statler', 'Waldorf'],
    ['push', 'pull'],
    ['putting on more clothes to look sluttier', 'taking off more clothes to look sluttier'],
    ['Pokemon', 'Digimon'],
    ['golden retriever boyfriend', 'goth cat girlfriend'],
    ['email', 'text'],
    ['slightly itchy all the time', 'slightly nauseous all the time'],
    ['under 10 tabs', 'over 200'],
    ['one who throws off the blankets', 'one who steals the blankets'],
    ['overpacker', 'underpacker'],
    ['bouba', 'kiki'],
    ['prone to gum disease', 'prone to cavities'],
    ['washes their face with bar soap', 'monopolizes an entire shelf in the shower'],
    ['will go for a walk for no reason', 'will only go for a walk if there\'s food at the end'],
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generate() {
    var pair = pick(ROLES);
    document.getElementById('role1').textContent = pair[0];
    document.getElementById('role2').textContent = pair[1];
}

generate();
