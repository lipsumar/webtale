var getUsage = require('command-line-usage');
var sections = [
    {
        header: 'WebTale',
        content: 'Generates web-based interactive stories'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'from',
                typeLabel: '[underline]{dir}',
                description: 'From directory (where the story is located)'
            },
            {
                name: 'to',
                typeLabel: '[underline]{dir}',
                description: 'To directory (where the story website will be created)'
            },
            {
                name: 'base_url',
                typeLabel: '[underline]{url}',
                description: 'Base URL (e.g.: http://example.com/my-story/)'
            },
            {
                name: 'help',
                description: 'Print this usage guide'
            },
        ]
    }
];
var usage = getUsage(sections);
console.log(usage);