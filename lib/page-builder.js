var handlebars = require('handlebars'),
    layouts = require('handlebars-layouts'),
    fs = require('fs'),
    path = require('path')
    dir = require('node-dir'),
    util = require("util"),
    events = require("events"),
    frontMatter = require('front-matter');
handlebars.registerHelper(layouts(handlebars));





var options;

function PageBuilder(){
    events.EventEmitter.call(this);
}
util.inherits(PageBuilder, events.EventEmitter);

PageBuilder.prototype.init = function(opts, cb) {
    options = opts;
    this.layouts = {};
    registerHelpers.call(this);
    registerPartials();
    registerUserPartials.call(this, cb);
}

PageBuilder.prototype.build = function(content, pageGraph){
    var hbsContent = this.toHandlebars(content);
    var tpl = handlebars.compile(hbsContent);
    var html = tpl();
    return html;
}

PageBuilder.prototype.toHandlebars = function(str) {
    var front = frontMatter(str),
        attrs = front.attributes,
        body = front.body,
        mainBlock = 'body';

    if(attrs.layout){

        if(this.layouts[attrs.layout]){
            mainBlock = this.layouts[attrs.layout].mainBlock || mainBlock;
        }

        body = `{{#extend "${attrs.layout}"}}\n{{#content "${mainBlock}"}}\n${body}\n{{/content}}\n{{/extend}}`;
    }

    return body;
}


function registerHelpers(){
    var self = this;
    handlebars.registerHelper('link', toPath => {
        var toFile = path.join(options.from, toPath + '.html')
        if(!fs.existsSync(toFile)){
            throw new Error(`Link to "${toPath}" but file ${toFile} doesn’t exist`);
        }
        self.emit('link', toPath);
        return options.base_url + toPath + '.html';
    })
}
function registerPartials(){
    handlebars.registerPartial('html', getFile('../layouts/html.html'));
    handlebars.registerPartial('email_address_form', getFile('../partials/email_address_form.html'));
}

function registerUserPartials(done){
    dir.readFiles(path.join(options.from, '_layouts'), (err, content, filename, cb) => {
        var name = path.basename(filename, '.html');
        var front = frontMatter(content);
        if(front.attributes.mainBlock){
            this.layouts[name] = front.attributes;
        }
        var hbsContent = this.toHandlebars(content);
        handlebars.registerPartial(name, hbsContent);
        cb();
    }, done);
}

function getFile(f){
    return fs.readFileSync(path.join(__dirname, f)).toString();
}


module.exports = new PageBuilder();