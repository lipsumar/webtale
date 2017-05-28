var commandLineArgs = require('command-line-args'),
    path = require('path'),
    dir = require('node-dir'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    pageBuilder = require('./lib/page-builder'),
    chalk = require('chalk');

var options = commandLineArgs([
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'from', alias: 'f', type: String },
    { name: 'to', alias: 't', type: String },
    { name: 'base_url', alias: 'b', type: String }
]);

if(options.help){
    require('./lib/cli-help');
    process.exit();
}

// enforce options
['from', 'to', 'base_url'].forEach(opt => {
    if(!options[opt]){
        console.log(`--${opt} is required`);
        process.exit(1);
    }
})




pageBuilder.init(options, err => {
    if(err) throw err;

    var pageGraph = {
        nodes: [],
        edges: [],
        currentPage: null
    };

    pageBuilder.on('link', link => {
        pageGraph.edges.push({
            source: pageGraph.currentPage,
            target: link + '.html'
        })
    });

    dir.readFiles(options.from, function withFile(err, content, filename, cb) {

        var relativePath = path.relative(options.from, filename),
            absolutePath = path.relative('/', filename),
            extension = path.extname(relativePath)
        console.log(relativePath);
        pageGraph.currentPage = relativePath;

        if(relativePath.substr(0, 1) === '_'){
            return cb();
        }


        if(extension === '.html'){
            try{
                var html = pageBuilder.build(content, pageGraph);
            }catch(err){
                console.log(chalk.red('Error: ' + err.message));
                return cb(err);
            }

            pageGraph.nodes.push(relativePath);

            putFile(html, relativePath, cb);
        }else{
            cb();
        }



    }, function onDone() {
        // completed iterating

        var storyGraphHtml = fs.readFileSync(path.join(__dirname, 'templates/story-graph.html'))
            .toString()
            .replace(
                'var links = []; // REPLACE_EDGES //',
                'var links = ' + JSON.stringify(pageGraph.edges) + ';'
            );
        fs.writeFileSync(path.join(options.to, '_story-graph.html'), storyGraphHtml);

        console.log('✅  done');
        console.log(pageGraph);




    });
});







function putFile(content, relativePath, cb){
    var toPath = '/' + path.relative('/', path.join(options.to, relativePath)),
        toDir = path.dirname(toPath);
    mkdirp(toDir, err => {
        if(err) return cb(err);
        fs.writeFile(toPath, content, cb);
    })

}